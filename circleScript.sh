#!/bin/bash

trap 'kill $!' EXIT

npm run example &
while ! echo exit | nc localhost 4444; do sleep 1; done
npm run test-regression
