#!/bin/bash

GITHUB_REPO_NAME=$(basename -s .git `git config --get remote.origin.url`);

PATH_PREFIX="/$GITHUB_REPO_NAME" npm run build

# deploy to github pags
node ./node_modules/.bin/gh-pages -d public
