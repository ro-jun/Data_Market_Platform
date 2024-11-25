from hojun.chatbot.vector_db_setup import index  # 벡터 DB 관련 설정 가져오기
from hojun.chatbot.llm_setup import embeddings
def search_similar_data(user_query, similarity_threshold=0.5, fallback_threshold=0.3):
    user_embedding = embeddings.embed_query(user_query)
    results = index.query(vector=user_embedding, top_k=3, include_metadata=True)
    
    # 기본 임계값으로 필터링
    primary_recommendations = [match for match in results['matches'] if match['score'] >= similarity_threshold]
    
    # 임계값에 해당하는 결과가 없을 경우 낮은 임계값으로 필터링
    if primary_recommendations:
        recommendations = primary_recommendations
    else:
        recommendations = [match for match in results['matches'] if match['score'] >= fallback_threshold]
    
    # 결과 출력
    if recommendations:
        print("Recommendations:")
        for match in recommendations:
            print(f"File Title: {match['id']}, Score: {match['score']}")
            print(f"Metadata Description: {match['metadata']['description']}\n")
    else:
        print("No relevant data found based on your query.")

    return recommendations