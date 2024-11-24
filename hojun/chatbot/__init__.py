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
        # LLM 응답 생성
        qa_response = llm_chain.invoke({"question": user_message})
        bot_reply = qa_response.strip() if qa_response else "챗봇 응답 생성 실패."

        # 유사 데이터 검색
        search_results = search_similar_data(user_message)

        # 검색 결과 포맷팅
        formatted_recommendations = [
            {
                "id": match.get("id", "Unknown ID"),
                "score": float(match.get("score", 0)),
                "description": match.get("metadata", {}).get("description", "No description")
            }
            for match in (search_results or [])
        ]

        # 반환 데이터 출력 (디버깅용)
        print("Bot Reply:", bot_reply)
        print("Formatted Recommendations:", formatted_recommendations)

    except Exception as e:
        error_details = traceback.format_exc()
        print("Error occurred:", error_details)  # 디버깅 로그
        return jsonify({"error": f"오류가 발생했습니다: {str(e)}", "details": error_details}), 500

    return jsonify({
        "reply": bot_reply,
        "recommendations": formatted_recommendations
    })