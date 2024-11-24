from flask import Blueprint, request, jsonify, render_template, session
from langchain.schema import HumanMessage, SystemMessage
from hojun.chatbot.llm_setup import llm

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
    # 이곳에서 추가적인 로직이 필요하면 작성 (예: DB에 저장)
    return jsonify({"message": "새 채팅이 생성되었습니다."})

# /chatbot/send 메시지 처리
@chatbot_blueprint.route("/send", methods=["POST"])
def send_message():
    user_message = request.json.get("message")
    if not user_message:
        return jsonify({"reply": "메시지를 입력해주세요."})

    try:
        # 메시지를 생성하고 LLM 호출
        messages = [
            SystemMessage(content="You are a helpful assistant."),
            HumanMessage(content=user_message)
        ]
        response = llm(messages)
        bot_reply = response.content.strip()
    except Exception as e:
        bot_reply = f"오류가 발생했습니다: {str(e)}"

    return jsonify({"reply": bot_reply})
