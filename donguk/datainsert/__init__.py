from flask import Blueprint, render_template, request, jsonify
from pymongo import MongoClient
from bson import Binary

# Blueprint 생성
datainsert_blueprint = Blueprint(
    "datainsert",
    __name__,
    template_folder="templates",
    static_folder="static"
)

# MongoDB 연결 설정
client = MongoClient('mongodb://localhost:27017/')
db = client.dataMarket
data_collection = db.data

# 데이터 등록 페이지
@datainsert_blueprint.route('/', methods=["GET"])
def datainsert():
    return render_template('datainsert.html')

# 데이터 저장 API
@datainsert_blueprint.route('/submit-data', methods=['POST'])
def submit_data():
    # POST 요청으로부터 데이터를 받아옴
    data = request.form
    title = data.get('title')
    price = data.get('price')
    category = data.get('category')
    description = data.get('description')

    # 파일 처리
    uploaded_files = request.files.getlist('files[]')
    if not uploaded_files:
        return jsonify({"success": False, "message": "파일이 업로드되지 않았습니다."}), 400

    files = []
    for uploaded_file in uploaded_files:
        files.append({
            "filename": uploaded_file.filename,
            "content_type": uploaded_file.content_type,
            "file_data": Binary(uploaded_file.read())
        })

    # 데이터 유효성 확인
    if not title or not price or not category or not description:
        return jsonify({"success": False, "message": "모든 필드를 입력해주세요!"}), 400

    # MongoDB에 저장
    new_data = {
        "title": title,
        "price": price,
        "category": category,
        "description": description,
        "files": files
    }
    data_collection.insert_one(new_data)

    return jsonify({"success": True, "message": "등록이 완료되었습니다!"})
