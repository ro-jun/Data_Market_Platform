from flask import Blueprint, request, jsonify, render_template
from hojun.chatbot.interactive_query import handle_user_message

# Blueprint 생성
chatbot_blueprint = Blueprint(
    "chatbot", 
    __name__, 
    template_folder="templates", 
    static_folder="static"
)

# 기본 페이지
@chatbot_blueprint.route("/", methods=["GET"])
def chatbot():
    return render_template("chatbot.html")

# 기본 초기 메시지
@chatbot_blueprint.route("/init", methods=["GET"])
def init_chat():
    initial_message = "안녕하세요! 데이터를 쉽게 검색해주는 DS_AI입니다. \n 어떤 종류의 데이터를 찾으시나요? (예: 게임 데이터, 금융 데이터 등)"
    return jsonify({"message": initial_message})

# 새로운 채팅 추가
@chatbot_blueprint.route("/new_chat", methods=["POST"])
def new_chat():
    return jsonify({"message": "새 채팅이 생성되었습니다."})

# 메시지 처리
@chatbot_blueprint.route("/send", methods=["POST"])
def send_message_route():
    # 요청 데이터 가져오기
    user_id = request.json.get("user_id", "default_user")
    user_message = request.json.get("message")

    # 요청 데이터 유효성 검사
    if not user_message:
        return jsonify({"reply": "메시지를 입력해주세요."}), 400

    # 메시지 처리 로직 호출
    return handle_user_message(user_id, user_message)