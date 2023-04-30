FROM tiangolo/uvicorn-gunicorn-fastapi:python3.9

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

# RUN python -c "import whisper;from transformers import pipeline; whisper.load_model('small');pipeline('question-answering', model='etalab-ia/camembert-base-squadFR-fquad-piaf', tokenizer='etalab-ia/camembert-base-squadFR-fquad-piaf')"

RUN python -c "from transformers import PegasusForConditionalGeneration, PegasusTokenizer;PegasusForConditionalGeneration.from_pretrained('google/pegasus-xsum');PegasusTokenizer.from_pretrained('google/pegasus-xsum')"

COPY . .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
