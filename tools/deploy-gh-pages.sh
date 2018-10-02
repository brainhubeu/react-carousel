#!/usr/bin/env bash
set -e

failure() {
  local lineno=$1
  echo "Failed at $lineno"
}
trap 'failure ${LINENO}' ERR

remote=https://$GIT_TOKEN@github.com/brainhubeu/react-carousel.git

yarn install --non-interactive

cd docs-www
yarn install --non-interactive
npm run build
cd ..

mkdir -p gh-pages-branch
cd gh-pages-branch

git config --global user.email "devops@brainhub.eu" > /dev/null 2>&1
git config --global user.name "DevOps Brainhub" > /dev/null 2>&1
git init
git remote add --fetch origin $remote

if git rev-parse --verify origin/gh-pages > /dev/null 2>&1
then
    git checkout gh-pages
    git rm -rf .
    cp -r ../docs-www/public/* .
else
    git checkout --orphan gh-pages
fi

git add -A
git commit --allow-empty -m "Deploy to GitHub pages [ci skip]"
git push --force --quiet origin gh-pages

cd ..
rm -rf gh-pages-branch

echo "Finished Deployment of gh pages!"
