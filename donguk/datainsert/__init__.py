from flask import Blueprint, render_template, request, jsonify, send_file
from pymongo import MongoClient
from bson import Binary, ObjectId
import io
import os
from werkzeug.utils import secure_filename

# Blueprint 생성
datainsert_blueprint = Blueprint("datainsert", __name__, template_folder="templates", static_folder="static")

# MongoDB 연결 설정
client = MongoClient("mongodb://localhost:27017/")
db = client.dataMarket
data_collection = db.data

# donguk/datafile 폴더를 업로드 폴더로 지정
# 현재 파일(__init__.py)의 위치: donguk/datainsert/
# 상위 디렉토리(donguk)로 올라간 뒤 datafile 폴더 지정
UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), '..', 'datafile')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

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

    file_data = []
    for file in files:
        # 파일명 안전하게 처리
        filename = file.filename  # secure_filename 사용 X
        # donguk/datafile 경로에 파일 저장
        save_path = os.path.join(UPLOAD_FOLDER, filename)
        file.save(save_path)

        # DB 저장용 바이너리 변환 전, 스트림 위치를 다시 앞으로
        file.stream.seek(0)
        binary_file = Binary(file.read())

        file_data.append({
            "filename": filename,
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
        "files": file_data,
    }
    data_collection.insert_one(new_data)

    return jsonify({"success": True, "message": "등록이 완료되었습니다!"})

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
