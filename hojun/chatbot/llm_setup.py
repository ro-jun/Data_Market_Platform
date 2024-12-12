from dotenv import load_dotenv
import os
from openai import OpenAI

# 환경 변수 로드
load_dotenv()
openai_api_key=os.getenv("OPENAI_api_key")  # API 키

# client 설정
client = OpenAI(
  api_key=openai_api_key,  
)

# 임베딩 모델 설정
EMBEDDING_MODEL = "text-embedding-3-large" # 3072

# LLM 모델 설정
LLM_MODEL = "gpt-4o-mini"