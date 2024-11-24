import pinecone
from langchain_openai.embeddings import OpenAIEmbeddings
from langchain_community.vectorstores import Pinecone
from hojun.chatbot.llm_setup import embeddings
from dotenv import load_dotenv
import os

# 환경 변수 로드
load_dotenv()
PINECONE_API = os.getenv('PINECONE_API_KEY')
openai_api = os.getenv("OPENAI_hojun_api")

# Pinecone 설정 및 연결
pinecone_client = pinecone.Pinecone()
indexes = pinecone_client.list_indexes()
# print(indexes)
index_name = indexes[0].name
# Pinecone 인덱스 객체 생성
index = pinecone_client.Index(index_name)   
# print(index)
print("Pinecone 설정 완료.")

# VectorStore 초기화
vectorstore = Pinecone.from_existing_index(index_name, embeddings)
# print(vectorstore)
print("벡터 데이터베이스 설정 완료.")