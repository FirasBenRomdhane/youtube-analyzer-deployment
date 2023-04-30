
import torch
import os

from transformers import PegasusForConditionalGeneration, PegasusTokenizer



def summarize(text):
    pegasus_model = PegasusForConditionalGeneration.from_pretrained("google/pegasus-xsum").to('cuda')
    pegasus_tokenizer = PegasusTokenizer.from_pretrained("google/pegasus-xsum")
    input_text = ' '.join(text.split())
    batch = pegasus_tokenizer.prepare_seq2seq_batch(input_text, truncation=True, padding='longest', return_tensors="pt").to('cuda')                
    summary_ids = pegasus_model.generate(**batch,
                                        num_beams=6,
                                        num_return_sequences=1,
                                        no_repeat_ngram_size = 2,
                                        length_penalty = 1,
                                        min_length = 30,
                                        max_length = 128,
                                        early_stopping = True)
                    
    output = [pegasus_tokenizer.batch_decode(summary_ids, skip_special_tokens=True, clean_up_tokenization_spaces=False)]

    return output    

