#!/bin/bash
set -e
set -a
. ./run-dev.env
set +a
export environment=development
# yarn typeorm "$@"
yarn ts-node -T ./node_modules/typeorm/cli.js "$@"