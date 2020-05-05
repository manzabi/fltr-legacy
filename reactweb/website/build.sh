#!/bin/bash

. ~/.nvm/nvm.sh 
nvm i
nvm use

pwd=`pwd`
echo "Current folder is $pwd"

rm -rf $pwd/build/*
echo "Cleaned last build"

npm install
STATUS=$?
if [ $STATUS -eq 0 ]; then
echo "Npm install Successful"
else
echo "Npm install Failed"
exit 1
fi

npm run dist
STATUS=$?
if [ $STATUS -eq 0 ]; then
echo "run dist -s : OK"
else
echo "run dist -s : ERROR"
exit 1
fi

sh zip.sh
STATUS=$?
if [ $STATUS -eq 0 ]; then
echo "zip : OK"
else
echo "zip : ERROR"
exit 1
fi
