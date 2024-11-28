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

# 홈페이지 라우트
@categorySearch_blueprint.route("/")
def categorySearch():
    return render_template('categorySearch.html')