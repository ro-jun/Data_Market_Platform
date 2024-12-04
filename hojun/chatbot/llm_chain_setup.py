from langchain_core.output_parsers import StrOutputParser
from hojun.chatbot.llm_setup import llm
from hojun.chatbot.prompt import prompt

# LangChain 표현식 언어 체인 사용
llm_chain = prompt | llm | StrOutputParser()

print("LLM 체인 설정 완료.")
