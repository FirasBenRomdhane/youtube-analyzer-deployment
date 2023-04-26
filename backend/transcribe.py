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
    with open(filename, 'r') as f:
        urls = json.load(f)
    return urls


def download(url, resolution, videos_path):
    resolution = str(resolution) + "p"
    file_name = extract_video_id(url)
    if file_name:
        file_name = file_name + ".mp4"
        file_path = os.path.join(videos_path, file_name)
        print("Downloading", url)
        yt = YouTube(url)
        yt.streams.filter(res = resolution, progressive= True).first().download(videos_path, file_name)
        print("Downloaded to", file_path)
        return {
            "filename": file_name,
            "title": yt.title
        }


def transcribe(model, video_path, save):
    print("Transcribing", video_path)
    result = model.transcribe(video_path)    
    text = [item["text"] for item in result["segments"]]
    text = "".join(text)
    if not save:
        os.remove(video_path)
    return text




