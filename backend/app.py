from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import subprocess
import tempfile
import os

app = Flask(__name__)
CORS(app)


@app.route('/run', methods=['POST'])
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

@app.route('/get_code')
def get_code():
    file_path = '/Users/arthurzeng/desktop/arthur_zeng_github/ExamHelper/backend/exam_questions/test.txt'

    try:
        with open(file_path, 'r', encoding='utf-8') as file:  # 确保使用正确的编码
            code = file.read()
    except FileNotFoundError:
        return jsonify(error="File not found"), 404
    except IOError:
        return jsonify(error="Error reading the file"), 500

    # code = "print('Hello from database!')" # 示例代码
    return jsonify(code=code)


if __name__ == '__main__':
    app.run(debug=True)
