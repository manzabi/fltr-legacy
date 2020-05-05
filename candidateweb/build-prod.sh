#!/bin/sh
echo "Use version v8.11.4"
. ~/.nvm/nvm.sh 
nvm use v8.11.4

echo "Cleaning build directory"
rm -rf build
echo "Building new app"
npm run build

sh zip.sh
STATUS=$?
if [ $STATUS -eq 0 ]; then
echo "zip : OK"
else
echo "zip : ERROR"
exit 1
fi
