import pinecone
from langchain_openai.embeddings import OpenAIEmbeddings
from langchain_community.vectorstores import Pinecone
from dotenv import load_dotenv
import os

# 환경 변수 로드
load_dotenv()
PINECONE_API = os.getenv('PINECONE_API_KEY')
openai_api = os.getenv("OPENAI_API_KEY")

# Pinecone 설정 및 연결
pinecone_client = pinecone.Pinecone()
indexes = pinecone_client.list_indexes()
# print(indexes)
index = indexes[1].name
# print(index)
print("Pinecone 설정 완료.")

# OpenAI Embeddings 설정
embeddings = OpenAIEmbeddings(
    openai_api_key=openai_api
    )
print("embeddings 설정 완료.")

# VectorStore 초기화
vectorstore = Pinecone.from_existing_index(index, embeddings)
# print(vectorstore)
print("벡터 데이터베이스 설정 완료.")