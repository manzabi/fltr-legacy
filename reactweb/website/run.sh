#!/bin/bash

. ~/.nvm/nvm.sh 
nvm i
nvm use

pwd=`pwd`
echo "Current folder is $pwd"

npm ci
STATUS=$?
if [ $STATUS -eq 0 ]; then
echo "Npm install Successful"
else
echo "Npm install Failed"
exit 1
fi

npm run dev
