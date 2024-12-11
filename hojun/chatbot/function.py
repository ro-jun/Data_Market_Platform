from hojun.chatbot.vector_db_setup import index
from hojun.chatbot.llm_setup import client, EMBEDDING_MODEL, LLM_MODEL

# 유사도 검색 함수
def search_similar_data(collected_data, similarity_threshold=0.5, fallback_threshold=0.4):
    # 데이터 통합
    query_text = f"{collected_data['data_type']} {collected_data['purpose']} {collected_data['details']}"
    
    embedding_response = client.embeddings.create(
            input=query_text,
            model=EMBEDDING_MODEL
        )
        
    user_embedding = embedding_response.data[0].embedding

    # 벡터 DB 검색
    query_results = index.query(
        vector=user_embedding,
        top_k=3,
        include_metadata=True
        )

    # 유사도 필터링
    primary_recommendations = []
    for match in query_results['matches']:
        if match['score'] >= similarity_threshold:
            primary_recommendations.append(match)

    if primary_recommendations:
        recommendations = primary_recommendations
    else:
        recommendations = []
        for match in query_results['matches']:
            if match['score'] >= fallback_threshold:
                recommendations.append(match)

     # JSON 직렬화 가능한 형태로 변환
    recommendations_dict = []
    for match in recommendations:
        recommendations_dict.append({
            "id": match.get("id"),
            "score": match.get("score"),
            "metadata": match.get("metadata", {})
        })

    return recommendations_dict

# LLM을 사용하여 comprehensive_description 생성 함수
def generate_comprehensive_description(title, price, main_category, sub_category, detailed_category, description, upload_time):
    prompt = (
        f"### 데이터 설명 생성\n"
        f"title: {title}\n"
        f"price: {price}\n"
        f"main_category: {main_category}\n"
        f"sub_category: {sub_category}\n"
        f"detailed_category: {detailed_category}\n"
        f"description: {description}\n"
        f"upload_time: {upload_time}\n\n"
        f"Instructions:\n"
        f"1. You are an AI assistant tasked with generating comprehensive metadata descriptions for datasets."
        f"2. Write a detailed metadata description\n"
        f"3. Focus on the main purpose and key features of the dataset.\n"
        f"4. If necessary, expand on how the dataset can be applied in various use cases.\n"
        f"5. allow flexibility based on the dataset's complexity.\n"
        f"6. Do not restrict the description to three sentences; allow flexibility based on the dataset's complexity.\n"
        f"7. Please write the descriptions in Korean."
    )
    
    comprehensive_description = client.chat.completions.create(
        model=LLM_MODEL,  # 적합한 LLM 모델 선택
        messages=[
            {"role": "system", "content": "당신은 데이터 설명 전문가입니다."},
            {"role": "user", "content": prompt},
        ]
    )
    return comprehensive_description.choices[0].message.content