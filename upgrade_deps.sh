#!/bin/bash
set -e

pause() { 
    read -r -n 1 -s -p 'Press any key to continue. . .';
    echo
}

pushd api
yarn ncu -u
pause
yarn install
yarn upgrade
popd

pushd web
yarn ncu -u
pause
yarn install
yarn upgrade
popd