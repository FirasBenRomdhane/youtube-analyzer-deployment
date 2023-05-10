from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Request
import os
import logging
from logging.handlers import RotatingFileHandler
import asyncio
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import whisper
import json
from transformers import pipeline

from settings import *
from transcribe import download, transcribe
from summarization import summarize, load_sum_model
from question_answering import load_qa_model, get_answer 
from sentiment_analysis import load_sa_model, get_sentiment


from faster_whisper import WhisperModel

from transformers import logging

logging.set_verbosity_warning()
logging.set_verbosity_error()


app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


#### LOADING MODELS

# Transription
whisper_model = whisper.load_model("small")
#whisper_model = WhisperModel("small", device="cuda", compute_type="int8")

# Question Answering
camembert = pipeline('question-answering', model='etalab-ia/camembert-base-squadFR-fquad-piaf', tokenizer='etalab-ia/camembert-base-squadFR-fquad-piaf')
qa_model, qa_tokenizer = load_qa_model()

# Summarization
t5_model = load_sum_model('t5')
#pegasus_model, pegasus_tokenizer = load_sum_model('pegasus')

# Sentiment Analysis
sa_model, sa_tokenizer = load_sa_model()



@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc):
    return JSONResponse(
        status_code=400,
        content={"message": "Invalid request body"},
    )



@app.websocket("/qa")
async def question_answering(websocket: WebSocket):
    with open(os.path.join('resources','transcriptions','output.json'), mode='r') as f:
                document = json.load(f)['transcription']
    await websocket.accept()
    try:
        while True:
            query = await websocket.receive_text()            
            #answer = get_answer(query, document, qa_model, qa_tokenizer)
            answer = get_answer(query,document,camembert)
            await websocket.send_text(answer) 
    except WebSocketDisconnect:
        print('Websocket connection closed.')



@app.websocket("/transcribe")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        url = await websocket.receive_text()
        await websocket.send_text("Downloading Video")
        audio = download(url, 360, AUDIO_DIR)
        if audio is not None:
            audio_path = os.path.join(AUDIO_DIR, audio["filename"])
            await websocket.send_text("Transcribing Audio")
            transcript = transcribe(whisper_model, audio_path,save=False)

            data = {
                "title":audio["title"],
                "url":url,
                "transcription":transcript,
                "summary": summarize(transcript, model_name='t5', model=t5_model),
                "senitment": get_sentiment(transcript,sa_model,sa_tokenizer)
            }


            with open(os.path.join(TRANSCRIPTIONS_DIR,'output.json'), 'w+', encoding='UTF-8') as f:
                json.dump(data, f, indent=2, ensure_ascii=False)

            await websocket.send_text(data['summary'][0])
            await websocket.send_text("done")

        else:
            await websocket.send_text("Not a valid url")

    except WebSocketDisconnect:
        print('Websocket connection closed.')
        

