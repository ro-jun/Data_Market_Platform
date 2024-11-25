from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from dotenv import load_dotenv
import os

# 환경 변수 로드
load_dotenv()
openai_api_key=os.getenv("OPENAI_api_key")  # API 키

# OpenAI Embeddings 설정
embeddings = OpenAIEmbeddings(
    model="text-embedding-3-small",
    openai_api_key = openai_api_key
    )

# LLM 초기화
llm = ChatOpenAI(
    model="gpt-4o-mini",  # GPT 모델 이름
    temperature=0,  # 결정론적 답변을 위한 설정
    openai_api_key = openai_api_key
)

print("LLM 설정 완료:", llm)