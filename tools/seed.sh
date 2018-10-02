#!/bin/bash

CONFIG_FILE="gatsby-docs-kit.yml"
DIR_NAME="docs"

# Create docs directory
if [ -d "../${DIR_NAME}" ]; then
  echo '"docs" directory already exists. Can not seed it. Remove it and try again.'
  exit 1;
fi

mkdir -p "../${DIR_NAME}"

# Create gastsby docs kit config file if do not exists
if [ ! -f "./${CONFIG_FILE}" ]; then
  echo "" > $CONFIG_FILE;
fi

# Create example Mk
cp ./tools/seed/example.md ../${DIR_NAME}/example.md

# Seeding gastsby docs kit config file
echo "- title: Home
  dir: ../docs
  url: docs
  file: example.md" >> $CONFIG_FILE;

# Done
echo "Done!"