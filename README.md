# Data Market Platform

데이터를 거래할 수 있는 **데이터 마켓 플랫폼**입니다. Flask와 MongoDB를 기반으로 개발되며, 데이터를 효율적으로 관리하고 거래를 간소화하는 플랫폼입니다.

---

## 주요 기능
1. **데이터 거래**  
   데이터를 등록, 검색, 구매 및 판매할 수 있는 기능 제공.
2. **챗봇 기능**  
   사용자가 데이터를 쉽게 검색하고 관리할 수 있도록 지원.
3. **RESTful API**  
   외부 서비스와 연동할 수 있는 API 제공.

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

---

```
Data_Market_Platform/
├── app.py               # Flask 애플리케이션 엔트리포인트
├── requirements.txt     # 프로젝트 의존성 리스트
├── .env                 # 환경 변수 파일
├── .gitignore           # Git에서 제외할 파일 정의
├── README.md            # 프로젝트 설명 파일
├── server/              # 서버 관련 코드
│   ├── routes/          # Flask 라우트 관리
│   │   ├── __init__.py  # 라우트 초기화
│   │   ├── data.py      # 데이터 관련 라우트
│   │   └── user.py      # 사용자 관련 라우트
│   ├── models/          # 데이터베이스 모델 관리
│   │   ├── __init__.py  # 모델 초기화
│   │   ├── user.py      # 사용자 모델
│   │   └── data.py      # 데이터 모델
│   ├── services/        # 비즈니스 로직
│   │   ├── __init__.py  # 서비스 초기화
│   │   ├── data_service.py  # 데이터 처리 로직
│   │   └── user_service.py  # 사용자 처리 로직
│   └── utils/           # 유틸리티 함수
│       ├── __init__.py  # 유틸 초기화
│       ├── database.py  # MongoDB 연결 관리
│       └── security.py  # 보안 관련 함수 (JWT 등)
├── chatbot/             # 챗봇 관련 코드
│   ├── __init__.py      # 챗봇 초기화
│   ├── chatbot_service.py # 챗봇 동작 로직
│   └── intents/         # 챗봇 대화 의도 파일
│       └── base_intents.json
├── frontend/            # 프런트엔드 관련 코드
│   ├── index.html       # 메인 홈페이지
│   ├── styles/          # CSS 스타일 파일
│   │   ├── main.css     # 공통 스타일
│   │   ├── homepage.css # 홈페이지 스타일
│   │   └── chatbot.css  # 챗봇 관련 스타일
│   ├── scripts/         # 자바스크립트 파일
│   │   ├── main.js      # 공통 스크립트
│   │   ├── homepage.js  # 홈페이지 전용 스크립트
│   │   └── chatbot.js   # 챗봇 관련 스크립트
│   └── assets/          # 이미지 및 아이콘
│       ├── images/      # 이미지 파일
│       │   ├── homepage-banner.jpg # 홈페이지 배너 이미지
│       │   └── logo.png            # 로고 이미지
│       └── icons/       # 아이콘 파일
│           └── chatbot-icon.svg    # 챗봇 아이콘
├── tests/               # 테스트 코드
│   ├── test_app.py      # 전체 애플리케이션 테스트
│   ├── test_routes.py   # 라우트 테스트
│   ├── test_models.py   # 데이터베이스 모델 테스트
│   └── test_chatbot.py  # 챗봇 테스트
└── mypage/              # 사용자 정의 페이지
    ├── templates/       # HTML 템플릿 파일
    │   └── profile.html # 사용자 프로필 페이지
    ├── static/          # 정적 파일 (CSS, JS, 이미지)
        ├── css/
        │   └── styles.css # 프로필 페이지 전용 CSS
        ├── js/
        │   └── scripts.js # 프로필 페이지 전용 JS
        └── images/
            └── profile.jpg # 사용자 프로필 이미지
```
