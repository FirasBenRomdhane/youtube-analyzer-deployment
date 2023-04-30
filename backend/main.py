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
from qa import get_answer

from settings import *
from transcribe import download, transcribe
from summarization import summarize


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


model_name = "small"
model = whisper.load_model(model_name)
nlp = pipeline('question-answering', model='etalab-ia/camembert-base-squadFR-fquad-piaf', tokenizer='etalab-ia/camembert-base-squadFR-fquad-piaf')




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
            answer = get_answer(query,document)
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
            transcript = transcribe(model, audio_path,save=False)

            data = {
                "title":audio["title"],
                "url":url,
                "transcription":transcript,
                "summary": summarize(transcript) 
            }


            with open(os.path.join(TRANSCRIPTIONS_DIR,'output.json'), 'w+', encoding='UTF-8') as f:
                json.dump(data, f, indent=2, ensure_ascii=False)

            await websocket.send_text(data['summary'][0])
            await websocket.send_text("done")

        else:
            await websocket.send_text("Not a valid url")

    except WebSocketDisconnect:
        print('Websocket connection closed.')
        

