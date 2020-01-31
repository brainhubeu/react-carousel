#!/usr/bin/env bash
set -e

failure() {
  local lineno=$1
  echo "Failed at $lineno"
}
trap 'failure ${LINENO}' ERR

env
for page_number in {1..12}
do
  echo "page_number=$page_number"
  pr_number=`curl -s "https://beghp.github.io/gh-pages-rc-$page_number/" | grep -o '★☂☀[0-9]\+♞♜♖' | grep -o '[0-9]\+' | head -1 || echo nothing`
  echo "pr_number=$pr_number"
  if [[ "$pr_number" == '' ]]
  then
    echo "no PR exists for page no $page_number"
    break
  elif [[ "https://github.com/brainhubeu/react-carousel/pull/$pr_number" == "$CIRCLE_PULL_REQUEST" ]]
  then
    echo "this PR is already deployed to the page no $page_number"
    break
  else
    echo "a PR (no $pr_number) exists for page no $page_number"
    pr_state=`curl -s "https://api.github.com/repos/brainhubeu/react-carousel/pulls/$pr_number" | grep -o '"state": .*'`
    echo "PR state: $pr_state"
    if [[ "$pr_state" == '"state": "open",' ]]
    then
      echo 'the PR is open, continue searching an empty page'
    else
      echo 'the PR is not open'
      break
    fi
  fi
done
echo "final page_number=$page_number"
if [[ "$page_number" == '' ]]
then
  echo 'no free page'
  exit
fi

export RC_ENV=development
export NODE_ENV=development
sed -i 's/__RC_ENV__/development/g' docs-www/src/globalReferences.js
cat docs-www/src/globalReferences.js
remote=https://$GIT_TOKEN@github.com/beghp/gh-pages-rc-$page_number.git

yarn install --non-interactive

cd docs-www
yarn install --non-interactive
PATH_PREFIX=gh-pages-rc-$page_number yarn build
cd ..

mkdir -p gh-pages-branch
cd gh-pages-branch

git config --global user.email "devops@brainhub.eu" > /dev/null 2>&1
git config --global user.name "DevOps Brainhub" > /dev/null 2>&1
git init
git remote add origin $remote
git remote -v
git fetch origin

if git rev-parse --verify origin/gh-pages > /dev/null 2>&1
then
  echo 'rev-parse true'
  git checkout gh-pages
  git rm -rf . || echo 'nothing to remove'
  cp -r ../docs-www/public/* .
else
  echo 'rev-parse false'
  git checkout --orphan gh-pages
  git rm -rf . || echo 'nothing to remove'
  cp -r ../docs-www/public/* .
fi

git status
git add -A
git status
git commit --allow-empty -m "Deploy to GitHub pages [ci skip]"
git push --force --quiet origin gh-pages

cd ..
rm -rf gh-pages-branch

echo "Finished Deployment of gh pages to https://beghp.github.io/gh-pages-rc-$page_number!"
