from flask import Blueprint, render_template, request, jsonify, send_file
from pymongo import MongoClient
from bson import Binary, ObjectId
import io

# Blueprint 생성
datainsert_blueprint = Blueprint("datainsert", __name__, template_folder="templates", static_folder="static")

# MongoDB 연결 설정
client = MongoClient("mongodb://localhost:27017/")
db = client.dataMarket
data_collection = db.data

# 데이터 등록 페이지
@datainsert_blueprint.route("/", methods=["GET"])
def datainsert():
    return render_template("datainsert.html")

# 데이터 저장 API
@datainsert_blueprint.route("/submit-data", methods=["POST"])
def submit_data():
    # 요청 데이터 가져오기
    title = request.form.get("title")
    price = request.form.get("price")
    main_category = request.form.get("main-category")
    sub_category = request.form.get("sub-category")
    description = request.form.get("description")
    files = request.files.getlist("files[]")  # 여러 파일 업로드

    # 데이터 유효성 확인
    if not title or not price or not main_category or not sub_category or not description:
        return jsonify({"success": False, "message": "모든 필드를 입력해주세요!"}), 400

    # 파일을 BSON(Binary) 형태로 저장
    file_data = []
    for file in files:
        binary_file = Binary(file.read())  # 파일 데이터를 바이너리로 변환
        file_data.append({
            "filename": file.filename,
            "content": binary_file,
            "content_type": file.content_type
        })

    # MongoDB에 데이터 저장
    new_data = {
        "title": title,
        "price": price,
        "main_category": main_category,
        "sub_category": sub_category,
        "description": description,
        "files": file_data,  # BSON 파일 데이터
    }
    data_collection.insert_one(new_data)

    return jsonify({"success": True, "message": "등록이 완료되었습니다!"})
# 1234
# 파일 다운로드 API
@datainsert_blueprint.route("/download/<file_id>/<filename>", methods=["GET"])
def download_file(file_id, filename):
    try:
        # MongoDB에서 해당 데이터 찾기
        data = data_collection.find_one({"_id": ObjectId(file_id)})
        if not data:
            return jsonify({"success": False, "message": "파일을 찾을 수 없습니다!"}), 404

        # 파일 데이터 추출
        for file in data["files"]:
            if file["filename"] == filename:
                return send_file(
                    io.BytesIO(file["content"]),
                    download_name=file["filename"],
                    mimetype=file["content_type"]
                )
        return jsonify({"success": False, "message": "파일을 찾을 수 없습니다!"}), 404
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500
