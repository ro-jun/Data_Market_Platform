# donguk/datainsert/__init__.py
from flask import Blueprint, render_template, request, jsonify, send_file, current_app
from bson import Binary, ObjectId
import io
import os
from werkzeug.utils import secure_filename
import uuid
from datetime import datetime

# Blueprint 생성
datainsert_blueprint = Blueprint("datainsert", __name__, template_folder="templates", static_folder="static")

# 데이터 저장 API에 접근할 수 있도록 current_app을 사용
def get_data_collection():
    return current_app.config['MONGO_DB'].datasets

# donguk/datafile 폴더를 업로드 폴더로 지정
# 현재 파일(__init__.py)의 위치: donguk/datainsert/
# 상위 디렉토리(donguk)로 올라간 뒤 datafile 폴더 지정
UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), '..','..', 'datafile')
THUMBNAIL_FOLDER = os.path.join(os.path.dirname(__file__),'..','..','jinwoo/category/static/images/dataset-thumbnail')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(THUMBNAIL_FOLDER, exist_ok=True)

# 데이터 등록 페이지
@datainsert_blueprint.route("/", methods=["GET"])
def datainsert():
    return render_template("datainsert.html")

# 데이터 저장 API
@datainsert_blueprint.route("/submit-data", methods=["POST"])
def submit_data():
    data_collection = get_data_collection()
    
    # 요청 데이터 가져오기
    title = request.form.get("title")
    price = request.form.get("price")
    main_category = request.form.get("main-category")
    sub_category = request.form.get("sub-category")
    description = request.form.get("description")
    file = request.files['file']  # 여러 파일 업로드
    thumbnail = request.files['thumbnail']

    # 데이터 유효성 확인
    if not title or not price or not main_category or not sub_category or not description or not thumbnail:
        return jsonify({"success": False, "message": "모든 필드를 입력해주세요!"}), 400

    # 파일 이름에 UUID 추가
    dataset_unique_filename = f"{uuid.uuid4()}_{file.filename}"
    dataset_file_path = os.path.join(UPLOAD_FOLDER, dataset_unique_filename)
    
    # 파일 이름에 UUID 추가
    thumbnail_unique_filename = f"{uuid.uuid4()}_{thumbnail.filename}"
    thumbnail_file_path = os.path.join(THUMBNAIL_FOLDER, thumbnail_unique_filename)
    
    # MongoDB에 파일 경로 저장
    dataset_file_data = {
        "original_name": file.filename,
        "stored_name": dataset_unique_filename,
    }
    
    # MongoDB에 썸네일 경로 저장
    thumbnail_file_data = {
        "original_name": thumbnail.filename,
        "stored_name": thumbnail_unique_filename,
    }

    # 파일 저장
    file.save(dataset_file_path)
    thumbnail.save(thumbnail_file_path)
    
    # 시간 저장
    upload_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    # MongoDB에 데이터 저장
    new_data = {
        "title": title,
        "price": price,
        "main_category": main_category,
        "sub_category": sub_category,
        "description": description,
        "file_info": dataset_file_data,
        "thumbnail_info": thumbnail_file_data,
        "upload_time": upload_time
    }
    data_collection.insert_one(new_data)

    return jsonify({"success": True, "message": "등록이 완료되었습니다!"})

# 파일 다운로드 API
@datainsert_blueprint.route("/download/<file_id>/<filename>", methods=["GET"])
def download_file(file_id, filename):
    data_collection = get_data_collection()
    
    try:
        # MongoDB에서 해당 데이터 찾기
        data = data_collection.find_one({"_id": ObjectId(file_id)})
        if not data:
            return jsonify({"success": False, "message": "파일을 찾을 수 없습니다!"}), 404

        # 파일 데이터 추출
        for file in data.get("files", []):
            if file["filename"] == filename:
                return send_file(
                    io.BytesIO(file["content"]),
                    download_name=file["filename"],
                    mimetype=file["content_type"]
                )
        return jsonify({"success": False, "message": "파일을 찾을 수 없습니다!"}), 404
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500