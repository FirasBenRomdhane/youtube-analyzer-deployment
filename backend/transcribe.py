from pytube import YouTube, Playlist
import os
import argparse
import json
import re
import whisper
from settings import *

def extract_video_id(url):
    pattern = r'(?:https?:\/\/)?(?:www\.)?youtu(?:\.be|be\.com)\/(?:.*v(?:\/|=)|(?:.*\/)?)([\w\-]+)'
    match = re.match(pattern, url)
    if match:
        return match.group(1)
    return None


def load_urls(filename):
    with open(filename, 'r', encoding='UTF-8') as f:
        urls = json.load(f)
    return urls


def download(url, resolution, output_path):
    resolution = str(resolution) + "p"
    file_name = extract_video_id(url)
    if file_name:
        file_name = file_name + ".mp3"
        file_path = os.path.join(output_path, file_name)
        print("Downloading", url)
        yt = YouTube(url,use_oauth=True)

    
        yt.streams.filter(only_audio=True).first().download(output_path, file_name)
        print("Downloaded to", file_path)
        return {
            "filename": file_name,
            "title": yt.title
        }


def transcribe(model, input_path, save):
    print("Transcribing", input_path)

    """segments,_ = model.transcribe(input_path, beam_size=5, vad_filter=True)
    text = {}
    for i,segment in enumerate(segments):
        text[i] = {"start": segment.start, "end": segment.end, "text": segment.text}


    return text"""

    result = model.transcribe(input_path)    
    text = [item["text"] for item in result["segments"]]
    text = "".join(text)
    if not save:
        os.remove(input_path)
    return text




