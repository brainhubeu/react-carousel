#!/usr/bin/env bash
set -e

failure() {
  local lineno=$1
  echo "Failed at $lineno"
}
trap 'failure ${LINENO}' ERR

remote=https://$GIT_TOKEN@github.com/brainhubeu/react-carousel-3.git

yarn install --non-interactive

cd docs-www
yarn install --non-interactive
PATH_PREFIX=react-carousel-3 yarn build
cd ..

mkdir -p gh-pages-branch
cd gh-pages-branch

git config --global user.email "devops@brainhub.eu" > /dev/null 2>&1
git config --global user.name "DevOps Brainhub" > /dev/null 2>&1
git init
git remote add origin $remote
git remote -v

if git rev-parse --verify origin/gh-pages > /dev/null 2>&1
then
  echo 'rev-parse true'
  git checkout gh-pages
  git rm -rf .
  cp -r ../docs-www/public/* .
else
  echo 'rev-parse false'
  cp -r ../docs-www/public/* .
  git checkout --orphan gh-pages
fi

git status
git add -A
git status
git commit --allow-empty -m "Deploy to GitHub pages [ci skip]"
git push --force --quiet origin gh-pages

cd ..
rm -rf gh-pages-branch

echo "Finished Deployment of gh pages!"
