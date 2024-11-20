from flask import Blueprint, render_template

# Blueprint 생성
homepage_blueprint = Blueprint(
    "homepage", 
    __name__, 
    template_folder="templates", 
    static_folder="static",
    static_url_path='/static/homepage'
    )

# 홈페이지 라우트
@homepage_blueprint.route("/")
def homepage():
    return render_template("homepage.html")  # hojun/homepage/templates/homepage.html 렌더링
