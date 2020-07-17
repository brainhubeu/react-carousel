#!/usr/bin/env bash
set -e

failure() {
  local lineno=$1
  echo "Failed at $lineno"
}
trap 'failure ${LINENO}' ERR

for page_number in {1..20}
do
  echo "page_number=$page_number"
  pr_number=`curl -s "https://beghp.github.io/gh-pages-rc-$page_number/" | grep -o '★☂☀[0-9]\+♞♜♖' | grep -o '[0-9]\+' | head -1 || echo ''`
  echo "pr_number=$pr_number"
  if [[ "$pr_number" == '' ]]
  then
    echo "no PR exists for page no $page_number"
    if [[ "$first_free_page_number" == '' ]]
    then
      first_free_page_number=$page_number
    fi
  elif [[ "https://github.com/brainhubeu/react-carousel/pull/$pr_number" == "$CIRCLE_PULL_REQUEST" ]]
  then
    echo "this PR is already deployed to the page no $page_number"
    already_deployed_page_number=$page_number
    break
  else
    echo "a PR (no $pr_number) exists for page no $page_number"
    pr_state=`curl -s "https://api.github.com/repos/brainhubeu/react-carousel/pulls/$pr_number" | python -c 'import json,sys;obj=json.load(sys.stdin);print obj["state"]'`
    echo "PR state: $pr_state"
    if [[ "$pr_state" == 'open' ]]
    then
      echo 'the PR is open, continue searching an empty page'
    else
      echo 'the PR is not open'
      if [[ "$first_free_page_number" == '' ]]
      then
        first_free_page_number=$page_number
      fi
    fi
  fi
done
if [[ "$page_number" == '20' ]]
then
  if [[ "$first_free_page_number" == '' || "$first_free_page_number" == '20' ]]
  then
    echo 'no free page'
    exit 1
  fi
  echo "deploying to $first_free_page_number as it's the first free place"
  final_page_number=$first_free_page_number
else
  echo "the PR was deployed to the page no $page_number so keeping the same place"
  final_page_number=$already_deployed_page_number
fi
echo "final_page_number=$final_page_number"

page_url="https://beghp.github.io/gh-pages-rc-$final_page_number"
echo "page_url=$page_url"


sed -i 's/__RC_ENV__/development/g' docs-www/src/globalReferences.js
sed -i 's/__RC_ENV__/development/g' docs-www/package.json
sed -i "s/__BUILD_INFO__/ (PR #$pr_number, built on `date +'%Y-%m-%d %H:%M:%S'`)/g" docs-www/gatsby-docs-kit.yml
cat docs-www/src/globalReferences.js
cat docs-www/package.json
remote=https://$GIT_TOKEN@github.com/beghp/gh-pages-rc-$final_page_number.git

yarn install --non-interactive

PATH_PREFIX=gh-pages-rc-$final_page_number yarn workspace react-carousel-docs build

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

git add -A
git commit --allow-empty -m "Deploy to GitHub pages [ci skip]"
git push --force --quiet origin gh-pages

cd ..
rm -rf gh-pages-branch

api_pr_url=`echo "$CIRCLE_PULL_REQUEST" | sed 's@https://github.com/brainhubeu/react-carousel/pull/@https://api.github.com/repos/brainhubeu/react-carousel/pulls/@g'`
echo api_pr_url=$api_pr_url
pr_body=`curl -s $api_pr_url | python -c 'import json,sys;obj=json.load(sys.stdin);print obj["body"]' | perl -pe 's/\r?\n/<br>/' | sed 's@<br/>@<br>@g'`
echo "pr_body=$pr_body"
deployed_match=`echo $pr_body | grep 'Deployed to https://beghp.github.io' || echo ''`
if [[ "$deployed_match" != '' ]]
then
  echo 'page URL already added to the PR description'
else
  curl -i -H "Authorization: token $GIT_TOKEN" -X PATCH -d "{\"body\":\"Deployed to $page_url<br>$pr_body\"}" $api_pr_url
fi

echo "Finished Deployment of gh pages to $page_url"
