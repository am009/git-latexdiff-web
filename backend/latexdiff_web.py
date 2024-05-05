#!/usr/bin/python3
import os, subprocess, shutil
from datetime import datetime

script_path = os.path.dirname(os.path.realpath(__file__))
data_dir = os.path.join(script_path, "data")

from flask import Flask, render_template, request, redirect, url_for, send_file
from werkzeug.utils import secure_filename
from werkzeug.datastructures import FileStorage
app = Flask(__name__, template_folder='template')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/latexdiff', methods = ['GET', 'POST'])
def upload_file():
    if request.method == 'GET':
        return redirect('/')
    if request.method == 'POST':
        old_proj_zip = request.files.get('old_project_zip')
        new_proj_zip = request.files.get('new_project_zip')
        username = request.form.get('main_tex', "unknown")
        main_tex = request.form.get('main_tex', "")
        other_options = request.form.get('other_options', '--latexopt -shell-escape')
        if None in [old_proj_zip, new_proj_zip]:
            return "form data is not complete"
        timeout = request.form.get('timeout', 10.0, type=float)
        returncode, output, result_diff, cmd_str = do_latex_diff(old_proj_zip, new_proj_zip, username, main_tex, other_options, timeout)
        if result_diff is not None:
            return send_file(result_diff, download_name=f'diff-{secure_filename(old_proj_zip.filename)}-{secure_filename(new_proj_zip.filename)}-{datetime.now().strftime("%Y-%m-%d-%H-%M-%S")}.pdf')
        else:
            return render_template("error.html", return_code=returncode, output=output, cmd_str=cmd_str)
    return "unknown request method"

def do_latex_diff(old_proj_zip: FileStorage, new_proj_zip: FileStorage, username: str, main_tex: str="", other_options="", timeout=10.0):
    # make temporary dir
    old_proj_fname = secure_filename(old_proj_zip.filename)
    new_proj_fname = secure_filename(new_proj_zip.filename)
    dirname = f'{datetime.now().strftime("%Y-%m-%d-%H-%M-%S")}-{username}-{old_proj_fname}-{new_proj_fname}'
    proj_dpath = os.path.join(data_dir, dirname)
    os.mkdir(proj_dpath)

    # save two zip file
    old_proj_path = os.path.join(proj_dpath, old_proj_fname)
    new_proj_path = os.path.join(proj_dpath, new_proj_fname)
    old_proj_zip.save(old_proj_path)
    new_proj_zip.save(new_proj_path)

    # launch the script
    cmd = [os.path.join(script_path, "generate-latexdiff.sh"), old_proj_path, new_proj_path, main_tex, other_options]
    cmd_str = ' '.join(cmd)
    try:
        proc = subprocess.run(
            cmd,
            shell=False,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            timeout=timeout)
    except subprocess.TimeoutExpired as e:
        return -1, f"latexdiff timeout: {e.stdout}", None, cmd_str
    result_diff = os.path.join(proj_dpath, "diff.pdf")
    with open(os.path.join(proj_dpath, "log.txt"), "wb") as f:
        f.write(proc.stdout)
    if not os.path.exists(result_diff):
        result_diff = None
    return proc.returncode, proc.stdout.decode(), result_diff, cmd_str


if __name__ == '__main__':
    if not os.path.exists(data_dir):
        os.mkdir(data_dir)
    app.run()
