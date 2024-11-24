from vector_db_setup import vectorstore  # 벡터 DB 설정 가져오기
from llm_setup import llm  # 이미 설정된 LLM 가져오기
from langchain.chains import ConversationalRetrievalChain

# Retriever 설정
retriever = vectorstore.as_retriever(
    search_type="similarity",
    search_kwargs={"k": 3}  # 상위 3개의 유사한 결과 반환
)
print("Retriever 설정 완료.")

# Q&A 체인 설정
qa_chain = ConversationalRetrievalChain.from_llm(
    llm=llm,  # llm_setup.py에서 가져온 LLM
    retriever=retriever
)
print("Q&A 체인 설정 완료.")