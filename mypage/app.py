from flask import Flask, render_template

app = Flask(__name__)

# 사용자 정의 필터 생성
@app.template_filter('number')
def format_number(value):
    try:
        return "{:,}".format(value)
    except ValueError:
        return value

@app.route('/')
def profile():
    user_data = {
        "name": "홍길동",
        "email": "honggildong@syuin.ac.kr",
        "phone": "010-1234-5678",
        "points": 100000,  # 숫자 그대로 전달
    }
    return render_template('profile.html', user=user_data)
#hihi
if __name__ == '__main__':
    app.run(debug=True)
