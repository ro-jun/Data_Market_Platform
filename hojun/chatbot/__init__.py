from flask import Blueprint, request, jsonify, render_template
from hojun.chatbot.llm_chain_setup import llm_chain  # Q&A 체인 가져오기
from hojun.chatbot.similar_search import search_similar_data  # 유사도 검색 함수 가져오기
import traceback

# Blueprint 생성
chatbot_blueprint = Blueprint(
    "chatbot", 
    __name__, 
    template_folder="templates", 
    static_folder="static"
)

# /chatbot/ 기본 페이지 처리
@chatbot_blueprint.route("/", methods=["GET"])
def chatbot():
    return render_template("chatbot.html")


@chatbot_blueprint.route("/new_chat", methods=["POST"])
def new_chat():
    return jsonify({"message": "새 채팅이 생성되었습니다."})


@chatbot_blueprint.route("/send", methods=["POST"])
def send_message():
    user_message = request.json.get("message")
    if not user_message:
        return jsonify({"reply": "메시지를 입력해주세요."})

    try:
        # 1. 유사 데이터 검색
        search_results = search_similar_data(user_message)

        if search_results:
            # 검색 결과 포매팅
            formatted_recommendations = [
                {
                    "id": match.get("id", "Unknown ID"),
                    "score": float(match.get("score", 0)),
                    "description": match.get("metadata", {}).get("description", "No description")
                }
                for match in search_results
            ]

            # 추천 결과 텍스트 생성
            recommendations_text = "\n\n추천 데이터셋:\n"
            for idx, rec in enumerate(formatted_recommendations, 1):
                recommendations_text += (
                    f"{idx}. 데이터셋 이름: {rec['id']}\n"
                    f"   설명: {rec['description']}\n"
                    f"   점수: {rec['score']:.2f}\n"
                )

            # 2. LLM에게 데이터 전달하여 응답 생성
            prompt_input = {
                "question": user_message,
                "data_info": recommendations_text
            }
            qa_response = llm_chain.invoke(prompt_input)
            bot_reply = qa_response.strip() if qa_response else "챗봇 응답 생성 실패."

            # 3. 최종 응답 구성
            full_reply = recommendations_text + "\n" + bot_reply

            return jsonify({"reply": full_reply})

        else:
            # 유사한 데이터가 없을 경우
            return jsonify({"reply": "관련된 추천 데이터를 찾지 못했습니다."})

    except Exception as e:
        error_details = traceback.format_exc()
        print("Error occurred:", error_details)  # 디버깅 로그
        return jsonify({"error": f"오류가 발생했습니다: {str(e)}", "details": error_details}), 500