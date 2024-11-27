import os


def list_files_from_current():
    # 현재 파일의 디렉토리 경로
    current_dir = os.path.dirname(os.path.abspath(__file__))
    print(f"현재 파일 디렉토리: {current_dir}")

    # 하위 디렉토리와 파일 탐색
    for root, dirs, files in os.walk(current_dir):
        print(f"현재 디렉토리: {root}")
        print(f"하위 디렉토리: {dirs}")
        print(f"파일: {files}")
        print("-" * 40)


# 실행
list_files_from_current()
