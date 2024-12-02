from flask import Blueprint, render_template
from pymongo import MongoClient

# Blueprint 생성
mypage_blueprint = Blueprint(
    "mypage",
    __name__,
    template_folder="templates",
    static_folder='static'
    )

# 홈페이지 라우트
@mypage_blueprint.route("/", methods=["GET"])
def mypage():
    return render_template("mypage.html")

# MongoDB 연결 설정
client = MongoClient('mongodb://localhost:27017/')
db = client.dataMarket
data_collection = db.data

# # 사용자 정의 필터
# @app.template_filter('number')
# def format_number(value):
#     """숫자를 3자리마다 쉼표로 구분하는 필터"""
#     try:
#         return "{:,}".format(value)
#     except ValueError:
#         return value

# # 마이페이지 라우트
# @app.route('/mypage')
# def profile():
#     """사용자 프로필 및 판매 데이터"""
#     user_data = {
#         "name": "홍길동",
#         "email": "honggildong@syuin.ac.kr",
#         "phone": "010-1234-5678",
#         "points": 100000,
#     }

#     # MongoDB에서 판매 데이터 가져오기
#     sell_data = list(data_collection.find({}, {"_id": 0}))  # "_id" 제외

#     return render_template('mypage.html', user=user_data, sell_data=sell_data)