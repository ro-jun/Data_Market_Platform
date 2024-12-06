from flask import Blueprint, render_template, jsonify, request
from pymongo import MongoClient

# Blueprint 생성
categorySearch_blueprint = Blueprint(
    "categorySearch", 
    __name__, 
    template_folder="templates", 
    static_folder="static",
    static_url_path='/static/category'
)

# MongoDB 연결
client = MongoClient("mongodb://localhost:27017/")
db = client.dataMarket  # 데이터베이스 이름이 'dataMarket'이라고 가정

# 카테고리 검색 페이지 라우트
@categorySearch_blueprint.route("/", methods=['GET'])
def categorySearch():
    categories = list(db.categories.find({}, {"_id": 0}))
    return render_template('categorySearch.html', categories=categories)

# 카테고리 상세 페이지 라우트
@categorySearch_blueprint.route('/detail/<category_id>', methods=['GET'])
def category_detail(category_id):
    # category_id를 기반으로 카테고리 정보 가져오기
    category = db.categories.find_one({"id": category_id}, {"_id": 0})
    if not category:
        return render_template('categoryDetail.html', data={
            "name": "Unknown", 
            "description": "해당 카테고리의 정보를 찾을 수 없습니다."
        })
    
    # 해당 카테고리에 속한 데이터셋 가져오기
    datasets = list(db.datasets.find({"category_id": category_id}, {"_id": 0}))
    
    # 데이터셋 정보를 카테고리 데이터에 추가
    category['datasets'] = datasets
    
    return render_template('categoryDetail.html', data=category)

# 카테고리 목록 API (페이지네이션 지원)
@categorySearch_blueprint.route('/api/categories', methods=['GET'])
def api_get_categories_paginated():
    try:
        page = int(request.args.get('page', 1))
        items_per_page = int(request.args.get('items_per_page', 15))
    except ValueError:
        return jsonify({"error": "page and items_per_page must be integers"}), 400

    # MongoDB에서 모든 카테고리 가져오기
    categories = list(db.categories.find({}, {"_id": 0}))
    total_items = len(categories)
    total_pages = (total_items + items_per_page - 1) // items_per_page  # 올림 처리

    # 페이지 범위 조정
    if page < 1:
        page = 1
    elif page > total_pages:
        page = total_pages if total_pages > 0 else 1

    start_index = (page - 1) * items_per_page
    end_index = start_index + items_per_page
    paginated_categories = categories[start_index:end_index]

    return jsonify(paginated_categories)

# 특정 카테고리의 데이터셋 목록 API (페이지네이션 적용)
@categorySearch_blueprint.route('/api/datasets', methods=['GET'])
def api_get_datasets():
    category_id = request.args.get('category_id')
    if not category_id:
        return jsonify({"error": "category_id is required"}), 400

    try:
        page = int(request.args.get('page', 1))
        items_per_page = int(request.args.get('items_per_page', 6))
    except ValueError:
        return jsonify({"error": "page and items_per_page must be integers"}), 400

    # MongoDB에서 해당 카테고리의 데이터셋 가져오기
    datasets = list(db.datasets.find({"category_id": category_id}, {"_id": 0}))
    total_items = len(datasets)

    # 페이지 범위 조정
    if page < 1:
        page = 1

    start_index = (page - 1) * items_per_page
    end_index = start_index + items_per_page
    paginated_datasets = datasets[start_index:end_index]

    return jsonify({
        "datasets": paginated_datasets
    })

# 특정 카테고리의 선택 및 확장 API
@categorySearch_blueprint.route('/api/categories/<category_id>/expand', methods=['GET'])
def get_expanded_categories(category_id):
    categories = list(db.categories.find({}, {"_id": 0}))
    
    # 선택된 카테고리의 인덱스 찾기
    selected_index = next((index for (index, d) in enumerate(categories) if d["id"] == category_id), None)
    if selected_index is None:
        return jsonify({"error": "Category not found"}), 404

    # 선택된 카테고리와 그 다음 3개의 카테고리 선택
    cards_to_show = [categories[selected_index]]
    for i in range(1, 4):  # 선택된 카테고리 이후 3개의 카테고리
        next_index = (selected_index + i) % len(categories)
        cards_to_show.append(categories[next_index])

    return jsonify({"categories": cards_to_show})