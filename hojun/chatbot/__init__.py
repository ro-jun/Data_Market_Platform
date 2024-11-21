from flask import Blueprint, request, jsonify, render_template

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

# /chatbot/send 메시지 처리
@chatbot_blueprint.route("/send", methods=["POST"])
def send_message():
    user_message = request.json.get("message")
    if not user_message:
        return jsonify({"reply": "메시지를 입력해주세요."})
    
    if "안녕" in user_message:
        bot_reply = "안녕하세요! 무엇을 도와드릴까요?"
    else:
        bot_reply = f"'{user_message}'에 대한 답변을 준비 중입니다."
    
    return jsonify({"reply": bot_reply})
