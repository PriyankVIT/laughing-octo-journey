import pandas as pd
import numpy as np
from nltk import sent_tokenize,word_tokenize
from nltk.corpus import stopwords
from nltk.stem import PorterStemmer
from nltk.stem import LancasterStemmer
from sklearn.metrics.pairwise import cosine_similarity
import networkx as nx
stop = set(stopwords.words("english"))
path="terms.txt"
parsedata=[]
count=0
with open(path) as fp:

    while True:
        messages=[]
        line=fp.readline()
        line=line.lower()
        if not line:
            print("False")
            break
        else:
            sent=sent_tokenize(line)
            for y in sent:
                count+=1
                print(y)
                messages=[count,y]
                parsedata.append(messages)
        
        print(messages)
        
data= pd.DataFrame(parsedata,columns=['index','article'])
data.to_csv("terms.csv")
print(count)
terms=pd.read_csv("terms.csv")
terms=terms[['index','article']]
def stopwords_removal(line):
    line=" ".join(x for x in line.split() if x not in stop)
    return line
porter = PorterStemmer()
lancaster=LancasterStemmer()
def stemSentence(sentence):
    token_words=word_tokenize(sentence)
    token_words
    stem_sentence=[]
    for word in token_words:
        stem_sentence.append(lancaster.stem(word))
        stem_sentence.append(" ")
    return "".join(stem_sentence)
terms['article']=terms['article'].apply(stopwords_removal)
sentences = []
for s in terms['article']:
      sentences.append(sent_tokenize(s))

sentences = [y for x in sentences for y in x] # flatten list
word_embeddings = {}
f = open('./glove/glove.6B.100d.txt', encoding='utf-8')
for line in f:
    values = line.split()
    word = values[0]
    coefs = np.asarray(values[1:], dtype='float32')
    word_embeddings[word] = coefs
f.close()
sentence_vectors = []
for i in sentences:
    
    if len(i) != 0:
        v = sum([word_embeddings.get(w, np.zeros((100,))) for w in i.split()])/(len(i.split())+0.001)
    else:
        v = np.zeros((100,))
    sentence_vectors.append(v)
sim_mat = np.zeros([len(sentences), len(sentences)])
for i in range(len(sentences)):
      for j in range(len(sentences)):
        if i != j:  
            sim_mat[i][j] = cosine_similarity(sentence_vectors[i].reshape(1,100), sentence_vectors[j].reshape(1,100))[0,0]
nx_graph = nx.from_numpy_array(sim_mat)
scores = nx.pagerank(nx_graph)
ranked_sentences = sorted(((scores[i],s) for i,s in enumerate(sentences)), reverse=True)
for i in range(10):  
    print(ranked_sentences[i][1])