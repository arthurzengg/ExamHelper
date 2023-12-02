from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import subprocess
import tempfile
import os

app = Flask(__name__)
CORS(app)

@app.route('/')
def hello_world():
    return 'Home Page'

# exams_path = '/Users/arthurzeng/desktop/arthur_zeng_github/ExamHelper/backend/exam_questions'  # exams 本地文件夹的路径
exams_path = '/srv/mineeditor/backend/exam_questions' # exams 云文件夹的路径

@app.route('/api/exams/<year>')
def get_exams(year):
    year_path = os.path.join(exams_path, year)
    if os.path.exists(year_path) and os.path.isdir(year_path):
        exams = [exam for exam in os.listdir(year_path) if os.path.isdir(os.path.join(year_path, exam))]
        return jsonify(exams)
    else:
        return jsonify([])

@app.route('/api/questions/<year>/<exam>')
def get_questions(year, exam):
    exam_path = os.path.join(exams_path, year, exam)
    if os.path.exists(exam_path) and os.path.isdir(exam_path):
        questions = [q.split('.')[0] for q in os.listdir(exam_path) if os.path.isfile(os.path.join(exam_path, q))]
        return jsonify(questions)
    else:
        return jsonify([])

@app.route('/api/run', methods=['POST'])
def run_code():
    code = request.form['code']
    with tempfile.NamedTemporaryFile(mode='w+', delete=False, suffix='.py') as temp:
        temp.write(code)
        temp_path = temp.name

    result = subprocess.run(['python', temp_path], capture_output=True, text=True)
    # print('result is: ')
    # print(result)
    os.unlink(temp_path)
    return result.stdout or result.stderr

@app.route('/api/get_code/<year>/<exam>/<question>')
def get_code(year, examType, question):
    # Loading skeleton code
    # skeleton_code_path = f'/Users/arthurzeng/desktop/arthur_zeng_github/ExamHelper/backend/exam_questions/structure/structure.txt' # 本地文件夹的路径
    skeleton_code_path = f'/srv/mineeditor/backend/exam_questions/structure/structure.txt'  # 云文件夹的路径
    with open(skeleton_code_path, 'r', encoding='utf-8') as file:
        skeleton_code = file.read()

    # Loading question's code
    # year = request.args.get('year')
    # examType = request.args.get('examType')
    # question = request.args.get('question')
    # file_path = f'/Users/arthurzeng/desktop/arthur_zeng_github/ExamHelper/backend/exam_questions/{year}/{examType}/{question}.txt' # 本地文件夹的路径
    file_path = f'/srv/mineeditor/backend/exam_questions/{year}/{examType}/{question}.txt'  # 云文件夹的路径
    print(file_path)

    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            code = file.read()
    except FileNotFoundError:
        return jsonify(error="File not found"), 404
    except IOError:
        return jsonify(error="Error reading the file"), 500

    return jsonify(code=skeleton_code+code)


if __name__ == '__main__':
    app.run(host='0.0.0.0')
    # app.run(debug=True)
