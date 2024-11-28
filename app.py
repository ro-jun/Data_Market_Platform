from flask import Flask
from hojun.homepage import homepage_blueprint
from hojun.chatbot import chatbot_blueprint
from jinwoo.category import categorySearch_blueprint
import logging

# Flask 애플리케이션 생성
app = Flask(__name__)


# Blueprint 등록
app.register_blueprint(homepage_blueprint, url_prefix="/")  # 홈페이지 경로
app.register_blueprint(chatbot_blueprint, url_prefix="/chatbot")  # 챗봇 경로
app.register_blueprint(categorySearch_blueprint, url_prefix="/category")  # 카테고리 검색 경로

# Flask 애플리케이션 실행
if __name__ == "__main__":
    app.run(debug=True)

logging.basicConfig(level=logging.DEBUG)