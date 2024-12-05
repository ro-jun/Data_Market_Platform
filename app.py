from flask import Flask
from hojun.homepage import homepage_blueprint
from hojun.chatbot import chatbot_blueprint
from jinwoo.category import categorySearch_blueprint
from donguk.mypage import mypage_blueprint
from donguk.datainsert import datainsert_blueprint
import logging
import os

# Flask 애플리케이션 생성
app = Flask(__name__)
app.secret_key = os.getenv("SECRET_KEY")


# Blueprint 등록
app.register_blueprint(homepage_blueprint, url_prefix="/")  # 홈페이지 경로
app.register_blueprint(chatbot_blueprint, url_prefix="/chatbot")  # 챗봇 경로
app.register_blueprint(categorySearch_blueprint, url_prefix="/category")  # 카테고리 검색 경로
app.register_blueprint(mypage_blueprint, url_prefix="/mypage")  # 마이 페이지 경로
app.register_blueprint(datainsert_blueprint, url_prefix="/datainsert")  # 데이터 등록 경로

# Flask 애플리케이션 실행
if __name__ == "__main__":
    app.run(debug=True, port=5000)

logging.basicConfig(level=logging.DEBUG)