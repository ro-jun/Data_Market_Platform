# hojun/chatbot/similar_search.py
from hojun.chatbot.vector_db_setup import index
from hojun.chatbot.llm_setup import embeddings

def search_similar_data(collected_data, similarity_threshold=0.5, fallback_threshold=0.3):
    # 데이터 통합
    query = f"{collected_data['data_type']} {collected_data['purpose']} {collected_data['details']}"
    user_embedding = embeddings.embed_query(query)

    # 벡터 DB 검색
    results = index.query(vector=user_embedding, top_k=3, include_metadata=True)

    # 유사도 필터링
    primary_recommendations = [match for match in results['matches'] if match['score'] >= similarity_threshold]
    recommendations = (
        primary_recommendations if primary_recommendations
        else [match for match in results['matches'] if match['score'] >= fallback_threshold]
    )

    # JSON 직렬화 가능한 형태로 변환
    recommendations_dict = []
    for match in recommendations:
        # match는 {'id': ..., 'score': ..., 'metadata': ...} 형태의 dict일 가능성이 높음
        # 만약 값 중 JSON 직렬화 불가능한 것이 있다면 적절히 변환/삭제 필요
        recommendations_dict.append({
            "id": match.get("id"),
            "score": match.get("score"),
            "metadata": match.get("metadata")  # 보통 metadata는 dict 형태이므로 직렬화 가능
        })

    return recommendations_dict
