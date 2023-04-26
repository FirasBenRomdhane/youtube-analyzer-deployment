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

from settings import *
from transcribe import download, transcribe

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

class ConnectionManager:
    def __init__(self):
        self.active_connections = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def send_message(self, message: str):
        for connection in self.active_connections:
            await connection.send_text(message)


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc):
    return JSONResponse(
        status_code=400,
        content={"message": "Invalid request body"},
    )

manager = ConnectionManager()

@app.websocket("/transcribe")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:


        url = await websocket.receive_text()

        await manager.send_message("Downloading Video")
        video = download(url, 360, VIDEOS_DIR)

        video_path = os.path.join(VIDEOS_DIR, video["filename"])
            
        await manager.send_message("Transcribing Audio")
        transcript = transcribe(model, video_path, True)

        data = {"title":video["title"], "url":url,"transcription":transcript}

        with open(os.path.join(TRANSCRIPTIONS_DIR,'output.json'), 'w+') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)

        await manager.send_message("Ready for your questions!")

    except WebSocketDisconnect:
        manager.disconnect(websocket)

