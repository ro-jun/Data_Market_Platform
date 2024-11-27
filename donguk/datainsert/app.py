from flask import Flask, render_template, request
import os

app = Flask(__name__)
UPLOAD_FOLDER = 'static/uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/upload', methods=['GET', 'POST'])
def upload():
    if request.method == 'POST':
        title = request.form['title']
        price = request.form['price']
        category = request.form['category']
        description = request.form['description']
        files = request.files.getlist('files[]')

        # 파일 저장
        file_names = []
        for file in files:
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], file.filename))
            file_names.append(file.filename)

        return f"등록 성공! 제목: {title}, 가격: {price}, 분류: {category}, 설명: {description}, 파일: {file_names}"

    return render_template('upload.html')

if __name__ == '__main__':
    app.run(debug=True)
