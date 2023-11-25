from flask import Flask, request, jsonify
from flask_cors import CORS
import subprocess
import tempfile
import os

app = Flask(__name__)
CORS(app)


@app.route('/run', methods=['POST'])
def run_code():
    print('run')
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
    # 假设这里是从数据库获取代码的逻辑
    code = "print('Hello from database!')" # 示例代码
    print("here")
    return jsonify(code=code)

if __name__ == '__main__':
    app.run(debug=True)
