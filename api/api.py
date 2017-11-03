from flask import Flask, jsonify, request
from flask_cors import CORS
import shlex
import subprocess
import uuid
import csv


app = Flask(__name__)
CORS(app)


@app.route("/")
def hello():
    return "200 OK"


@app.route("/ripser", methods=["POST"])
def compute():
    run_id = uuid.uuid1().hex
    input_file_name = '/tmp/ripser-input-' + run_id
    with open(input_file_name, 'w') as input_file:
        for row in request.data.split(b'\n'):
            input_file.write(row.decode('ascii') + '\n')

    cmd = 'ripser --format point-cloud --dim 1 ' + input_file_name

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

        with open('/tmp/diagram-{0}'.format(run_id), 'w') as f:
            for l in rows:
                f.write('{0}\n'.format(','.join([str(i) for i in l])))

        return jsonify({
            'id': run_id,
            'diagram': rows
        })


@app.route("/distance", methods=["POST"])
def distance():
    diagrams = [i.decode('ascii') for i in request.data.split(b'\n')]
    result_id = uuid.uuid1().hex

    result = {}
    cmd = 'Rscript distance.r {0} {1} {2}'.format(*diagrams, result_id)
    process = subprocess.Popen(shlex.split(cmd), stdout=subprocess.PIPE)
    try:
        outs, errs = process.communicate(timeout=180)
    except subprocess.TimeoutExpired:
        process.kill()
    else:
        with open('/tmp/result-{0}'.format(result_id)) as f:
            reader = csv.DictReader(f)
            row = dict(next(reader))
            result = {
                'bottleneck': float(row['bottleneck']),
                'wasserstein': float(row['wasserstein']),
            }

    return jsonify(result)


if __name__ == "__main__":
    app.run(host='0.0.0.0')
