from flask import Blueprint, render_template

# Blueprint 생성
chatbot_blueprint = Blueprint("chatbot", __name__, template_folder="templates", static_folder="static")

# 챗봇 페이지 라우트
@chatbot_blueprint.route("/")
def chatbot():
    return render_template("chatbot.html")  # hojun/chatbot/templates/chatbot.html 렌더링
