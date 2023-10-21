from flask import Flask, request
from flask_cors import CORS
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
    os.unlink(temp_path)
    return result.stdout or result.stderr


if __name__ == '__main__':
    app.run(debug=True)
