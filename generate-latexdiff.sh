#!/bin/bash

set -e

if [ -z "$1" ]
  then
    echo "No argument 1: old version zip"
fi

if [ -z "$1" ]
  then
    echo "No argument 2: new version zip"
fi
# relative path to old version1
VERSION1=$1
# relative path to new version2
VERSION2=$2
MAIN_FILE=$3
OTHER_OPTS=$4 # use double quotes to pass space

OPTS=()
if [ ! -z "$MAIN_FILE" ]
  then
    OPTS+=("--main" "$MAIN_FILE")
fi


GIT_DIR=`dirname "$VERSION1"`/git

rm -rf "$GIT_DIR"
unzip -q "$VERSION1" -d "$GIT_DIR"
pushd "$GIT_DIR"
git init
git config user.name "git-latexdiff-wjk"
git config user.email "git-latexdiff-wjk@nowhere.no"
git add --all
git commit -m "old version"
popd

unzip -q -o "$VERSION2" -d "$GIT_DIR"
pushd "$GIT_DIR"
git add --all
git commit -m "new version"
echo "========== begin git latex-diff =========="
echo git latexdiff HEAD^ $OTHER_OPTS "${OPTS[@]}" --output "../diff.pdf"
timeout --kill-after=10s 30m git latexdiff HEAD^ $OTHER_OPTS "${OPTS[@]}" --output "../diff.pdf"
popd

echo git latex-diff runs successfully
