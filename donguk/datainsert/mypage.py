from pymongo import MongoClient

# MongoDB 연결 설정
client = MongoClient("mongodb://localhost:27017/")
db = client.dataMarket
data_collection = db.datasets


# 저장된 파일 복원 함수
def restore_file_from_db(filename, output_path):
    # MongoDB에서 파일 검색
    file_data = data_collection.find_one({"files.filename": filename})

    if file_data:
        # 파일 리스트에서 해당 파일 찾기
        for file in file_data["files"]:
            if file["filename"] == filename:
                with open(output_path, "wb") as f:
                    f.write(file["content"])  # 파일 내용 쓰기
                print(f"파일이 {output_path}에 저장되었습니다!")
                return
        print("해당 파일이 데이터베이스에 존재하지 않습니다.")
    else:
        print("데이터베이스에서 해당 파일 정보를 찾을 수 없습니다.")


# 파일 복원 실행
restore_file_from_db("online_sales_dataset.csv", "restored_online_sales_dataset.csv")
