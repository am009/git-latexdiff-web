# Git-latexdiff web

git latexdiff latex diff web interface based on flask

An extremely simple web interface for git-latexdiff. by uploading two overleaf template, you can upload a old version of zip project downloaded from Overleaf, and a new version zip project, and get the git-latexdiff pdf output.

论文的修改展示：上传overleaf项目的新版和旧版zip文件，自动运行[git-latexdiff](https://gitlab.com/git-latexdiff/git-latexdiff)，同时返回一个pdf

## setup & run

On Ubuntu, install tex environment: `sudo apt install texlive-full inkscape`.
- `inkscape` for svg processing

```
gunicorn --bind 0.0.0.0:5000 wsgi:app
```

### have the same env as overleaf

https://www.overleaf.com/learn/how-to/How_does_Overleaf_compile_my_project%3F

```
mkdir /usr/local/share/latexmk
sudo nano /usr/local/share/latexmk/LatexMk
```

`latexmk -cd -f -shell-escape main.tex`


## 2023-09-09 debug latex build

try to use `--latexmk`, the result contains no graph, not ideal. simply add `--ignore-latex-errors` to the default git-latexdiff options. 

`git latexdiff HEAD^ --main main.tex --latexmk --ignore-latex-errors --latexopt "-shell-escape -cd" --latexopt -f --output "./diff.pdf"`
