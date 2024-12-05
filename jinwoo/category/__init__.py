from flask import Blueprint, render_template

# Blueprint 생성
categorySearch_blueprint = Blueprint(
    "categorySearch", 
    __name__, 
    template_folder="templates", 
    static_folder="static",
    static_url_path='/static/category'
)

# 카테고리 검색 페이지 라우트
@categorySearch_blueprint.route("/", methods=['GET'])
def categorySearch():
    categories = [
        {"id": "sneakers", "name": "Sneakers", "image_url": "homepage-banner.jpg"},
        {"id": "sofa", "name": "Sofa", "image_url": "homepage-banner.jpg"},
        {"id": "toy_train", "name": "Toy Train", "image_url": "homepage-banner.jpg"},
        {"id": "party_decors", "name": "Party Decors", "image_url": "homepage-banner.jpg"},
        {"id": "diamond_ring", "name": "Diamond Ring", "image_url": "homepage-banner.jpg"},
        {"id": "sofa", "name": "Sofa", "image_url": "homepage-banner.jpg"},
        {"id": "toy_train", "name": "Toy Train", "image_url": "homepage-banner.jpg"},
        {"id": "party_decors", "name": "Party Decors", "image_url": "homepage-banner.jpg"},
        {"id": "diamond_ring", "name": "Diamond Ring", "image_url": "homepage-banner.jpg"},
        {"id": "sofa", "name": "Sofa", "image_url": "homepage-banner.jpg"},
        {"id": "toy_train", "name": "Toy Train", "image_url": "homepage-banner.jpg"},
        {"id": "party_decors", "name": "Party Decors", "image_url": "homepage-banner.jpg"},
        {"id": "diamond_ring", "name": "Diamond Ring", "image_url": "homepage-banner.jpg"},
        {"id": "sofa", "name": "Sofa", "image_url": "homepage-banner.jpg"},
        {"id": "sofa", "name": "Sofa", "image_url": "homepage-banner.jpg"},
    ]

    # 서버 로그에 데이터를 출력하여 확인
    print("전달될 카테고리 데이터:", categories)

    return render_template('categorySearch.html', categories=categories)

@categorySearch_blueprint.route('/detail/<category_id>', methods=['GET'])
def category_detail(category_id):
    # 상세 페이지에 필요한 데이터 정의
    category_data = {
        "sneakers": {"name": "Sneakers", "description": "편안하고 멋진 스니커즈.", "products": [
            {"brand": "Nike", "event": "2024 나이키 서울 캠페인", "price": "₩120,000"},
            {"brand": "Adidas", "event": "2024 아디다스 서울 캠페인", "price": "₩110,000"},
            {"brand": "New Balance", "event": "2024 뉴발란스 서울 캠페인", "price": "₩100,000"}
        ]},
        "sofa": {"name": "Sofa", "description": "편안한 거실 소파."},
        "toy_train": {"name": "Toy Train", "description": "아이들을 위한 재미있는 장난감 기차."},
        "party_decors": {"name": "Party Decors", "description": "파티를 위한 멋진 장식품들."},
        "diamond_ring": {"name": "Diamond Ring", "description": "아름다운 다이아몬드 반지."},
    }

    # category_id에 해당하는 데이터를 가져옴
    data = category_data.get(category_id, {"name": "Unknown", "description": "해당 카테고리의 정보를 찾을 수 없습니다."})
    
    # category_detail.html 템플릿을 렌더링하고 데이터 전달
    return render_template('categoryDetail.html', data=data)
