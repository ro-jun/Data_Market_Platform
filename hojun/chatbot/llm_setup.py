from langchain_openai.chat_models import ChatOpenAI
from dotenv import load_dotenv
import os

# 환경 변수 로드
load_dotenv()

# LLM 초기화
llm = ChatOpenAI(
    model="gpt-4o-mini",  # GPT 모델 이름
    temperature=0,  # 결정론적 답변을 위한 설정
    openai_api_key=os.getenv("OPENAI_hojun_api")  # API 키
)
print("LLM 설정 완료:", llm)