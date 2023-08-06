# Git-latexdiff web

git latexdiff latex diff web interface based on flask

An extremely simple web interface for git-latexdiff. by uploading two overleaf template, you can upload a old version of zip project downloaded from Overleaf, and a new version zip project, and get the git-latexdiff pdf output.

论文的修改展示：上传overleaf项目的新版和旧版zip文件，自动运行[git-latexdiff](https://gitlab.com/git-latexdiff/git-latexdiff)，同时返回一个pdf

## run

On Ubuntu, install tex environment: `sudo apt install texlive-full`.

```
gunicorn --bind 0.0.0.0:5000 wsgi:app
```
