#!/bin/bash
set -e

case $ENV in
  "TEST")
    echo "Running Unit Tests"
    exec npm test ;;
  "LINT")
    echo "Running Linter"
    exec npm run lint ;;
esac
