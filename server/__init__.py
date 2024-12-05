from flask_pymongo import PyMongo
from flask import Flask
from dotenv import load_dotenv
import os
from pymongo import MongoClient #파이몽고 라이브러리
import datetime #시간 라이브러리

# .env 파일에서 환경 변수 로드
load_dotenv()

mongo = PyMongo()

client = MongoClient('mongodb://localhost', 27017)   # 로컬환경에서 mongo db 연결
# client = MongoClient('mongodb://test:test@localhost', 27017)    # db 인증 계정 생성 후 연결 방법