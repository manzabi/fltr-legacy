#!/bin/bash

pwd=`pwd`
echo "Current folder is $pwd"

rm -rf $pwd/dist/*
echo "clean dist directory : OK"

npm install
STATUS=$?
if [ $STATUS -eq 0 ]; then
echo "npm install : OK"
else
echo "npm install : ERROR"
exit 1
fi

npm run dist -s
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
