#!/usr/bin/env bash
set -e

sed -i '' 's/describe.skip/describe/g' test/cypress/integration/*
