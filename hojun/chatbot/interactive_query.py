from flask import jsonify
from hojun.chatbot.similar_search import search_similar_data
from hojun.chatbot.llm_chain_setup import llm_chain

# 사용자 상태 저장 (session 대체 가능)
user_state = {}

# 질문 리스트
questions = [
    "어떤 종류의 데이터를 찾으시나요? (예: 게임 데이터, 금융 데이터 등)",
    "이 데이터를 어떤 목적으로 사용하려고 하시나요?",
    "특별히 필요한 데이터의 세부 사항이 있다면 알려주세요."
]

def handle_user_message(user_id, user_message):
    """
    사용자의 메시지를 처리하고 다음 질문을 반환하거나, 데이터를 기반으로 추천합니다.
    """
    if user_id not in user_state:
        user_state[user_id] = {"data_type": None, "purpose": None, "details": None, "is_completed": False}

    user_status = user_state[user_id]

    # 상태 업데이트 및 다음 질문 처리
    if not user_status["data_type"]:
        user_status["data_type"] = user_message
        next_question = questions[1]
        reply = f"알겠습니다! '{user_message}'에 대한 데이터를 찾으시군요. 다음 질문에 답해주세요: {next_question}"
        return jsonify({"reply": reply})

    elif not user_status["purpose"]:
        user_status["purpose"] = user_message
        next_question = questions[2]
        reply = f"좋아요! '{user_message}'를 위해 데이터를 사용하시려는군요. 추가로 {next_question}"
        return jsonify({"reply": reply})

    elif not user_status["details"]:
        user_status["details"] = user_message
        user_status["is_completed"] = True

    # 유사도 검색 및 추천 처리
    if user_status["is_completed"]:
        collected_data = {
            "data_type": user_status["data_type"],
            "purpose": user_status["purpose"],
            "details": user_status["details"]
        }

        try:
            search_results = search_similar_data(collected_data)
            recommendations_text = "\n".join([
                f"{idx+1}. {result['id']}: {result['metadata']['description']}" 
                for idx, result in enumerate(search_results)
            ])
            prompt_input = {
                "question": user_status["purpose"],
                "data_info": recommendations_text
            }
            llm_response = llm_chain.invoke(prompt_input)
            final_reply = (
                f"추천 데이터셋:\n{recommendations_text}\n\n"
                f"추가적인 제안:\n{llm_response}"
            )
            return jsonify({"reply": final_reply})

        except Exception as e:
            print("Error during recommendation:", e)  # 디버깅 로그
            return jsonify({"reply": f"오류 발생: {str(e)}"}), 500