#!/usr/bin/python3
import os, subprocess, shutil, tempfile

script_path = os.path.dirname(os.path.realpath(__file__))

DEBUG = (__name__ == '__main__')
TIMEOUT_LIMIT = 600.0

from flask import Flask, request, redirect, jsonify, send_from_directory
from flask_cors import CORS, cross_origin
from werkzeug.utils import secure_filename
from werkzeug.datastructures import FileStorage
app = Flask(__name__, template_folder='template')
# comment below line to disable CORS
CORS(app, origins=["http://latexdiff.cn", "https://latexdiff.cn"] if not DEBUG else "*")
UID=os.geteuid()

def gen_redir():
    if request.scheme == "http":
        url = 'http://latexdiff.cn'
    else:
        url = 'https://latexdiff.cn'
    return redirect(url)

@app.route('/')
def send_index():
    if not os.path.exists('static'):
        return gen_redir()
    return send_from_directory('static', 'index.html')

@app.route('/<path:path>')
def send_web(path):
    if not os.path.exists('static'):
        return gen_redir()
    return send_from_directory('static', path)

@app.route('/latexdiff', methods = ['GET', 'POST'])
def upload_file():
    if request.method == 'GET':
        return gen_redir()
    if request.method == 'POST':
        old_proj_zip = request.files.get('old_zip')
        new_proj_zip = request.files.get('new_zip')
        config = request.form.get('config', None)
        download_diff_proj = request.form.get('download_diff_proj', "false")
        if download_diff_proj not in ['true', 'false']:
            return "download_diff_proj field is not valid", 400
        download_diff_proj = download_diff_proj == 'true'
        if None in [old_proj_zip, new_proj_zip]:
            return "project zip fields are not complete", 400
        if type(config) is not str:
            return "config field is missing", 400
        timeout = request.form.get('timeout', TIMEOUT_LIMIT, type=float)
        if timeout < 0.1  or timeout > (TIMEOUT_LIMIT + 1.0):
            return "timeout out of range", 400
        json_resp = do_latex_diff(old_proj_zip, new_proj_zip, config, download_diff_proj=download_diff_proj, timeout=timeout)
        if type(json_resp) is dict:
            return jsonify(json_resp)
        else:
            return {"diff_pdf": None, "diff_proj": None, "docker_output": json_resp}
    return "unknown request method", 400

count = 0
def get_unique_container_name():
    global count
    count += 1
    return f'latediff-runner-{count}'

def file2b64(path):
    import base64
    file= open(path,"rb")
    binary = file.read()
    return base64.b64encode(binary).decode('ascii')

def do_latex_diff(old_proj_zip: FileStorage, new_proj_zip: FileStorage, config: str, download_diff_proj=False, timeout=600.0):
    with tempfile.TemporaryDirectory(dir='/tmp', prefix='latexdiff', ignore_cleanup_errors=not DEBUG) as tempdir:
        print("tempdir:", tempdir)
        # save two zip file
        old_proj_path = os.path.join(tempdir, "old.zip")
        new_proj_path = os.path.join(tempdir, "new.zip")
        config_path = os.path.join(tempdir, "config.json")
        old_proj_zip.save(old_proj_path)
        new_proj_zip.save(new_proj_path)
        with open(config_path, "w") as f:
            f.write(config)

        container_name = get_unique_container_name()
        docker_output = ''
        # launch the script
        cmd_str = 'docker run ' + ('' if not DEBUG or UID == 0 else f'-e USER={UID} ') + \
        '--network none --cpus 2 --memory 6g --security-opt=no-new-privileges ' + \
        f'--name {container_name} ' + \
        f'--rm -i -v {tempdir}:/work am009/latexdiff-web-worker'
        cmd = cmd_str.split(' ')
        try:
            proc = subprocess.run(
                cmd,
                shell=False,
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                timeout=timeout)
            docker_output = proc.stdout.decode(errors="ignore")
        except subprocess.TimeoutExpired as e:
            docker_output = e.stdout.decode(errors="ignore")
        finally:
            subprocess.run(f"docker stop -t 5 {container_name}".split(' '), stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        diff_pdf = None
        diff_pdf_path = os.path.join(tempdir, "diff.pdf")
        if os.path.exists(diff_pdf_path) and os.path.isfile(diff_pdf_path) and not os.path.islink(diff_pdf_path):
            diff_pdf = os.path.join(tempdir, "diff.pdf")
            diff_pdf = file2b64(diff_pdf)
        if download_diff_proj:
            diff_proj = shutil.make_archive(os.path.join(tempdir, "diff_proj"), 'tar', os.path.join(tempdir, "git-latexdiff"), "new")
            diff_proj = file2b64(diff_proj)
        else:
            diff_proj = None
        return {"diff_pdf": diff_pdf, "diff_proj": diff_proj, "docker_output": docker_output, "docker_cmd": cmd_str}


if __name__ == '__main__':
    DEBUG = True
    TIMEOUT_LIMIT=30.0
    app.run(host="0.0.0.0", port=8000)
