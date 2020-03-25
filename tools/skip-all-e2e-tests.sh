#!/usr/bin/env bash
set -e

sed -i '' 's/describe/describe.skip/g' test/cypress/integration/*
