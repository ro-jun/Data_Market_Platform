from langchain_core.output_parsers import StrOutputParser
from hojun.chatbot.llm_setup import llm
from langchain_core.prompts import ChatPromptTemplate

# 프롬프트 설정
prompt = ChatPromptTemplate.from_messages([
    "사용자가 찾는 데이터의 내용 또는 사용 목적에 따라 데이터를 추천해주고, 제공된 데이터셋 정보를 활용하여 추가적인 조언을 해주세요.\n",
    "추천 데이터셋 정보:\n{data_info}\n",
    "사용자 질문: {question}"
])

# LangChain 표현식 언어 체인 사용
llm_chain = prompt | llm | StrOutputParser()

print("LLM 체인 설정 완료.")
