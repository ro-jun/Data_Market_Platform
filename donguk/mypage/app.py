from flask import Flask, render_template
from pymongo import MongoClient

app = Flask(__name__)

# MongoDB 연결 설정
client = MongoClient('mongodb://localhost:27017/')  # MongoDB URI
db = client.profileDB  # 데이터베이스 선택
users_collection = db.users  # 컬렉션 선택

@app.route('/')
def profile():
    # MongoDB에서 첫 번째 사용자 데이터 가져오기
    user_data = users_collection.find_one({}, {"_id": 0})  # _id 필드 제외
    return render_template('index.html', user=user_data)

if __name__ == '__main__':
    app.run(debug=True)
