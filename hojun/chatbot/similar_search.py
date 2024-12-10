# hojun/chatbot/similar_search.py
from hojun.chatbot.vector_db_setup import index
from hojun.chatbot.llm_setup import embeddings

def search_similar_data(collected_data, similarity_threshold=0.5, fallback_threshold=0.4):
    # 데이터 통합
    query_text = f"{collected_data['data_type']} {collected_data['purpose']} {collected_data['details']}"
    user_embedding = embeddings.embed_query(query_text)

    # 벡터 DB 검색
    results = index.query(
        vector=user_embedding,
        top_k=3,
        include_metadata=True
        )

    # 유사도 필터링
    primary_recommendations = [match for match in results['matches'] if match['score'] >= similarity_threshold]
    recommendations = (
        primary_recommendations if primary_recommendations
        else [match for match in results['matches'] if match['score'] >= fallback_threshold]
    )

     # JSON 직렬화 가능한 형태로 변환
    recommendations_dict = []
    for match in recommendations:
        recommendations_dict.append({
            "id": match.get("id"),
            "score": match.get("score"),
            "metadata": match.get("metadata", {})
        })

    return recommendations_dict
