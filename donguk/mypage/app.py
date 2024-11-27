from flask import Flask, render_template

app = Flask(__name__)

# 사용자 정의 필터
@app.template_filter('number')
def format_number(value):
    try:
        return "{:,}".format(value)
    except ValueError:
        return value

# 기본 라우트
@app.route('/mypage')
def profile():
    user_data = {
        "name": "홍길동",
        "email": "honggildong@syuin.ac.kr",
        "phone": "010-1234-5678",
        "points": 100000,
    }

    return render_template('profile.html', user=user_data)

if __name__ == '__main__':
    app.run(debug=True, port=5001)

