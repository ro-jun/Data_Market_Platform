from langchain_core.output_parsers import StrOutputParser
from hojun.chatbot.llm_setup import llm
from langchain_core.prompts import ChatPromptTemplate, HumanMessagePromptTemplate, SystemMessagePromptTemplate

# 프롬프트 설정
prompt = ChatPromptTemplate.from_messages([
    "사용자가 찾는 데이터의 내용 혹은 사용 목적에 따라서 데이터를 추천해주세요.{question}"
])

# LangChain 표현식 언어 체인 사용
llm_chain = prompt | llm | StrOutputParser()

print("LLM 체인 설정 완료.")
