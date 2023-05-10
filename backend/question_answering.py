import torch
from torch import nn
from torch.optim import AdamW
from torch.utils.data import DataLoader, Dataset
import torch.nn.functional as F

from transformers import DistilBertTokenizer
from transformers import DistilBertModel, DistilBertForSequenceClassification
from transformers import DistilBertTokenizerFast
from tqdm import tqdm

import json
from settings import *

import pandas as pd
from sklearn.preprocessing import OneHotEncoder

from transformers import logging

logging.set_verbosity_warning()
logging.set_verbosity_error()


device = torch.device('cuda') if torch.cuda.is_available() else torch.device('cpu')



class QAModel(nn.Module):
    def __init__(self):
        super(QAModel, self).__init__()
        self.bert = DistilBertModel.from_pretrained(os.path.join(MODELS_DIR,'intent_classification_model'))
        self.fc = nn.Linear(self.bert.config.hidden_size, 2) 

    def forward(self, input_ids, attention_mask):
        outputs = self.bert(input_ids=input_ids, attention_mask=attention_mask)
        sequence_output = outputs.last_hidden_state  # Last-layer hidden states of the input sequence

        logits = self.fc(sequence_output)
        start_logits, end_logits = logits.split(1, dim=-1)
        start_logits = start_logits.squeeze(-1)
        end_logits = end_logits.squeeze(-1)
        return start_logits, end_logits
    

def load_qa_model():
    model = QAModel().to(device)
    model.load_state_dict(torch.load(os.path.join(MODELS_DIR,'custom_model_fquad_distilbert.pth')))
    path = '../models/fquad_distilbert_qa'
    #tokenizer = DistilBertTokenizerFast.from_pretrained(path, local_files_only=True)
    tokenizer = DistilBertTokenizerFast.from_pretrained('distilbert-base-uncased')
    return model, tokenizer


def get_answer(question, context, model, tokenizer=False):
    if tokenizer !=False:
        inputs = tokenizer(question, context, return_tensors="pt").to(device)

        with torch.no_grad():
            start_logits, end_logits = model(**inputs)

        answer_start_index = start_logits.argmax()
        answer_end_index = end_logits.argmax()

        print(answer_start_index, answer_end_index)

        predict_answer_tokens = inputs.input_ids[0, answer_start_index : answer_end_index + 1]

        return tokenizer.decode(predict_answer_tokens)
    else:
        result = model({
        'question': question,
        'context': context
        })

    return result['answer']