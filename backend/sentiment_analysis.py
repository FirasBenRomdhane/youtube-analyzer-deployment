
from joblib import dump,load
import nltk
from nltk.tokenize import sent_tokenize
from transformers import BertTokenizer, TFBertForSequenceClassification
import numpy as np
import tensorflow as tf
import pandas as pd
from transformers import BertModel , BertTokenizer
import os
from settings import *

# import bert base model 
from transformers import BertTokenizer, BertModel



def load_sa_model():

    tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')
    model = TFBertForSequenceClassification.from_pretrained(os.path.join(MODELS_DIR,"sentiment_analysis_bert_model_trained"))

    return model, tokenizer



def get_sentiment(paragraph,model,tokenizer):

    sentences = sent_tokenize(paragraph)

    tf_batch = tokenizer(sentences, max_length=128, padding=True, truncation=True, return_tensors='tf')
    tf_outputs = model(tf_batch)
    tf_predictions = tf.nn.softmax(tf_outputs[0], axis=-1)
    labels = ['Negative','Positive']
    label = tf.argmax(tf_predictions, axis=1)
    label = label.numpy()
    unique_vals = np.arange(np.max(label) + 1)
    counts = np.bincount(label, minlength=len(unique_vals))
    if counts[1] > counts[0] :
        return 'Positive'
    elif  counts[1] < counts[0] :
        return 'Negative'
    else:
        return 'Neutre'
    


    