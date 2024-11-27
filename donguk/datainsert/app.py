from flask import Flask, render_template, redirect, url_for

app = Flask(__name__)

# 사용자 정의 필터 생성
@app.template_filter('number')
def format_number(value):
    try:
        return "{:,}".format(value)
    except ValueError:
        return value

# @app.route('/datainsert')

@app.route('/')
def profile():
    # 추후 DB랑 연결 할 것.
    user_data = {
        "name": "홍길동",
        "email": "honggildong@syuin.ac.kr",
        "phone": "010-1234-5678",
        "points": 100000,  # 숫자 그대로 전달
    }
    return render_template('profile.html', user=user_data)

#
if __name__ == '__main__':
    app.run(debug=True)
