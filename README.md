# Data Market Platform

데이터를 거래할 수 있는 **데이터 마켓 플랫폼**입니다. Flask와 MongoDB를 기반으로 개발되며, 데이터를 효율적으로 관리하고 거래를 간소화하는 플랫폼입니다.

---

## 주요 기능
1. **데이터 거래**  
   데이터를 등록, 검색, 구매 및 판매할 수 있는 기능 제공.
2. **챗봇 기능**  
   사용자가 데이터를 쉽게 검색하고 관리할 수 있도록 지원.

---

## 설치 및 실행

### 1. **환경 설정**
```bash
conda create -n data_market_platform python=3.11.9 -y
conda activate data_market_platform
```

### 2. **필수 패키지 설치**
```bash
pip install -r requirements.txt
```

### 3. **MongoDB 설정**
```bash
MONGO_URI=mongodb://localhost:27017/data_market_db
```

```
D:\Project\SYU\Data_Market_Platform
├── .env                       # 환경 변수 파일
├── .gitignore                 # Git 제외 파일 목록
├── README.md                  # 프로젝트 설명 파일
├── app.py                     # Flask 애플리케이션 엔트리포인트
├── requirements.txt           # 프로젝트 의존성 리스트
├── hojun/                     # 사용자 정의 기능
│   ├── homepage/              # 홈페이지 관련 코드
│   │   ├── __init__.py      # 홈페이지 관련 Blueprint
│   │   ├── templates/         # HTML 템플릿 폴더
│   │   │   └── homepage.html  # 홈페이지 템플릿
│   │   └── static/            # 정적 파일 폴더
│   │       ├── css/
│   │       │   └── homepage.css   # 홈페이지 스타일
│   │       ├── js/
│   │       │   └── homepage.js    # 홈페이지 스크립트
│   │       └── images/
│   │           └── homepage-banner.jpg # 홈페이지 배너 이미지
│   └── chatbot/               # 챗봇 관련 코드
│       ├── __init__.py      # 챗봇 관련 Blueprint
│       ├── templates/         # HTML 템플릿 폴더
│       │   └── chatbot.html   # 챗봇 템플릿
│       └── static/            # 정적 파일 폴더
│           ├── css/
│           │   └── chatbot.css    # 챗봇 스타일
│           ├── js/
│           │   └── chatbot.js     # 챗봇 스크립트
│           └── images/
│               ├── chatbot-icon.png    # 챗봇 아이콘
│               └── chatbot-background.jpg # 챗봇 배경 이미지
├── mypage/                    # 다른 팀원이 관리하는 기능
│   ├── templates/
│   │   └── profile.html       # 사용자 프로필 페이지
│   └── static/
│       ├── css/
│       │   └── styles.css     # 프로필 전용 스타일
│       ├── js/
│       │   └── scripts.js     # 프로필 전용 스크립트
│       └── images/
│           └── profile.jpg    # 프로필 이미지
├── server/                    # 서버 관련 코드
│   ├── models/                # 데이터베이스 모델 관리
│   │   ├── __init__.py        # 모델 초기화
│   │   ├── data.py            # 데이터 모델
│   │   └── user.py            # 사용자 모델
│   ├── routes/                # 라우트 관리
│   │   ├── __init__.py        # 라우트 초기화
│   │   ├── data.py            # 데이터 관련 라우트
│   │   └── user.py            # 사용자 관련 라우트
│   ├── services/              # 비즈니스 로직
│   │   ├── __init__.py        # 서비스 초기화
│   │   ├── data_service.py    # 데이터 서비스
│   │   └── user_service.py    # 사용자 서비스
│   └── utils/                 # 유틸리티 함수
│       ├── __init__.py        # 유틸 초기화
│       ├── database.py        # MongoDB 연결 관리
│       └── security.py        # 보안 관련 함수 (JWT 등)

```
