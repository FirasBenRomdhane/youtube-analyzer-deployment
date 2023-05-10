
import torch
import os

from transformers import PegasusForConditionalGeneration, PegasusTokenizer
from simplet5 import SimpleT5



def load_sum_model(model_name):
    if model_name=='pegasus':
        pegasus_model = PegasusForConditionalGeneration.from_pretrained("google/pegasus-xsum").to('cuda')
        pegasus_tokenizer = PegasusTokenizer.from_pretrained("google/pegasus-xsum")
        return pegasus_model, pegasus_tokenizer
    
    elif model_name=='t5':
        model = SimpleT5()  
        model.from_pretrained(model_type="t5", model_name="t5-base")    
        model.load_model("./simplet5", use_gpu=True)
        return model



def summarize(text, model_name, model, tokenizer=None):
    if model_name == 'pegasus':
        input_text = ' '.join(text.split())
        batch = tokenizer.prepare_seq2seq_batch(input_text, truncation=True, padding='longest', return_tensors="pt").to('cuda')                
        summary_ids = model.generate(**batch,
                                            num_beams=6,
                                            num_return_sequences=1,
                                            no_repeat_ngram_size = 2,
                                            length_penalty = 1,
                                            min_length = 30,
                                            max_length = 128,
                                            early_stopping = True)
                        
        output = [tokenizer.batch_decode(summary_ids, skip_special_tokens=True, clean_up_tokenization_spaces=False)]

        return output
    elif model_name == 't5':
        return model.predict(text)

