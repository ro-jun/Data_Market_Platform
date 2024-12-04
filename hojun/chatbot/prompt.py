from langchain_core.prompts import ChatPromptTemplate

# 프롬프트 설정
prompt = ChatPromptTemplate.from_messages([
    "사용자가 찾는 데이터의 내용 또는 사용 목적에 따라 데이터를 추천해 주고, 제공된 데이터셋 정보를 활용하여 추가적인 조언을 해주세요.\n",
    "추천 데이터셋 정보:\n{data_info}\n",
    "사용자 요청:\n{question}\n",
    "- 추천 데이터셋이 사용자의 요구를 얼마나 충족할 수 있는지 분석하세요.\n",
    "- 사용자가 데이터를 활용할 수 있는 구체적인 방법을 제안하세요.\n",
    "- 필요 시 추가적인 조언을 제공하세요.\n"
])
