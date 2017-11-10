from flask import Flask, jsonify, request
from flask_cors import CORS
import shlex
import subprocess as sp
import uuid

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

    process = sp.Popen(shlex.split(cmd), stdout=sp.PIPE)
    try:
        outs, errs = process.communicate(timeout=180)
    except sp.TimeoutExpired:
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
    diagram_id = [i.decode('ascii') for i in request.data.split(b'\n')]

    results = {}

    # TODO use multiple processes

    cmd = shlex.split('bottleneck_dist /tmp/diagram-{0} /tmp/diagram-{1}'.format(*diagram_id))
    process = sp.Popen(cmd, stderr=sp.PIPE, stdout=sp.PIPE)
    outs, errs = process.communicate(timeout=180)
    results['bottleneck'] = float(outs.decode('ascii'))

    cmd = shlex.split('wasserstein_dist /tmp/diagram-{0} /tmp/diagram-{1}'.format(*diagram_id))
    process = sp.Popen(cmd, stderr=sp.PIPE, stdout=sp.PIPE)
    outs, errs = process.communicate(timeout=180)
    results['wasserstein'] = float(outs.decode('ascii'))

    return jsonify(results)


if __name__ == "__main__":
    app.run(host='0.0.0.0')
