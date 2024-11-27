# categorySearch/__init__.py (Flask Blueprint)
from flask import Blueprint, render_template, request

# Blueprint 생성
categorySearch_blueprint = Blueprint(
    "categorySearch", 
    __name__, 
    template_folder="templates", 
    static_folder="static",
    static_url_path='/static/category'
)

# 샘플 데이터
items = [
    {"category": "Clothing & Shoes", "name": "Sneakers"},
    {"category": "Home & Living", "name": "Sofa"},
    {"category": "Toys & Entertainment", "name": "Toy Train"},
    {"category": "Toys & Entertainment", "name": "Party Decors"},
    {"category": "Jewelry & Accessories", "name": "Diamond Ring"}
] * 3  # 데이터 반복

# 홈페이지 라우트
@categorySearch_blueprint.route("/")
def categorySearch():
    return render_template('categorySearch.html', items=items)

@categorySearch_blueprint.route('/search', methods=['GET'])
def search():
    query = request.args.get('query')
    if query:
        filtered_items = [item for item in items if query.lower() in item['name'].lower() or query.lower() in item['category'].lower()]
    else:
        filtered_items = items
    return render_template('categorySearch.html', items=filtered_items)