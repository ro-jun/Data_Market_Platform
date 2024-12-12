from pinecone import Pinecone
from dotenv import load_dotenv
import os

# 환경 변수 로드
load_dotenv()
pc_api = os.getenv('PINECONE_API_KEY')

# Pinecone API 초기화
pc = Pinecone(api_key=pc_api)

# index 설정
# index_name = "test-db"
index_name = "data-search-chatbot"


index = pc.Index(index_name)
print("Pinecone 설정 완료.")