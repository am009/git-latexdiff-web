#!/bin/bash

set -e

if [ -z "$1" ]
  then
    echo "No 1st argument, config file path, default to /work/new.zip"
fi

if [ -z "$2" ]
  then
    echo "No 2nd argument, old project zip path, default to /work/old.zip"
fi

if [ -z "$3" ]
  then
    echo "No 3rd argument, new project zip path, default to /work/config.json"
fi

CONFIG_PATH="${1:-/work/config.json}"
# relative path to old version1
VERSION1="${2:-/work/old.zip}"
# relative path to new version2
VERSION2="${3:-/work/new.zip}"

if [ ! -f "$VERSION1" ]
  then
    echo "File not found: $VERSION1"
    exit 1
fi

if [ ! -f "$VERSION2" ]
  then
    echo "File not found: $VERSION2"
    exit 1
fi

# use jq to get the field value
MAIN_FILE=$(jq -r '.main_tex' "$CONFIG_PATH")
OTHER_OPTS=$(jq -r '.other_cmdlines' "$CONFIG_PATH")
BASE_DIR=`dirname "$VERSION1"`

OPTS=()
if [ ! -z "$MAIN_FILE" ]
  then
    OPTS+=("--main" "$MAIN_FILE")
fi

# check the "style" field in config.json
STYLE_TYPE=$(jq -r '.style | type' "$CONFIG_PATH")
# check if STYLE_TYPE is string
if [ "$STYLE_TYPE" == "string" ]
  then
    STYLE=$(jq -r '.style' "$CONFIG_PATH")
    OPTS+=("--type" "$STYLE")
  # else pipe the json to the python script to get the style
  else
    jq -c '.style' "$CONFIG_PATH" | python3 /root/preamble_gen.py > /work/preamble.tex
    OPTS+=("--preamble" "/work/preamble.tex")
fi

# check the bib field in config.json
BIB=$(jq -r '.bib' "$CONFIG_PATH")
# check if BIB_TYPE is string
if [ "$BIB" == "bibtex" ]; then
  OPTS+=("--bibtex")
elif [ "$BIB" == "biber" ]; then
  OPTS+=("--biber")
fi

GIT_DIR=$BASE_DIR/git

# create the git repo and run the latexdiff

rm -rf "$GIT_DIR"
unzip -q "$VERSION1" -d "$GIT_DIR"
pushd "$GIT_DIR" > /dev/null
git init
git config user.name "latexdiff-web"
git config user.email "latexdiff-web@nowhere.no"
git add --all
git commit -m "old version"
popd > /dev/null

unzip -q -o "$VERSION2" -d "$GIT_DIR"
pushd "$GIT_DIR" > /dev/null
git add --all
git commit -m "new version" || (echo "error: git commit failed. no changes in new version?" && exit 1)
echo "========== begin git latex-diff =========="

OPTS+=("--no-cleanup" "--no-view")

echo git latexdiff -v --tmpdirprefix $BASE_DIR HEAD^ $OTHER_OPTS "${OPTS[@]}"
set +e
timeout --kill-after=10s 30m \
  git latexdiff -v --tmpdirprefix $BASE_DIR HEAD^ $OTHER_OPTS "${OPTS[@]}"
mv $BASE_DIR/git-latexdiff* $BASE_DIR/git-latexdiff || echo "move git-latexdiff temporary dir failed"
mv $BASE_DIR/git-latexdiff/*.pdf $BASE_DIR/diff.pdf
echo "========== end git latex-diff =========="
popd > /dev/null

if [ ! -z "$USER" ]; then
  chown -R "$USER" "$BASE_DIR"
fi
