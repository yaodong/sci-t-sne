from flask import Flask, jsonify, request
from flask_cors import CORS
from time import time
import shlex
import subprocess
import math


app = Flask(__name__)
CORS(app)


@app.route("/")
def hello():
    return "200 OK"


@app.route("/ripser", methods=["POST"])
def compute():
    input_file_name = '/tmp/ripser-input-' + str(time())
    with open(input_file_name, 'w') as input_file:
        for row in request.data.split(b'\n'):
            input_file.write(row.decode('ascii') + '\n')

    cmd = 'ripser --format point-cloud --dim 1 ' + input_file_name
    print(input_file_name)

    process = subprocess.Popen(shlex.split(cmd), stdout=subprocess.PIPE)
    try:
        outs, errs = process.communicate(timeout=180)
    except subprocess.TimeoutExpired:
        process.kill()
    else:
        if b'persistence intervals in dim 1:' not in outs:
            return jsonify({'error': True})

        try:
            lines = outs.split(b'persistence intervals in dim 1:')[-1].strip()
            if len(lines) == 0:
                return jsonify([])
        except TypeError:
            return jsonify([])

        rows = []
        for line in lines.split(b'\n'):
            point = []
            for item in line.decode('ascii').strip()[1:-1].split(','):
                point.append(float(item.strip()))
            rows.append(point)

        return jsonify(rows)


if __name__ == "__main__":
    app.run()
