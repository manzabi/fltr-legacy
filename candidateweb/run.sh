#!/bin/bash
echo "This site builder it's optimized to use nodejs version v8.11.4 and npm v5.6.0"

echo "Use version v8.11.4"
. ~/.nvm/nvm.sh 
nvm use

npm ci
STATUS=$?
if [ $STATUS -eq 0 ]; then
echo "Npm install Successful"
else
echo "Npm install Failed"
exit 1
fi

echo "Cleaning dist directory"
rm -rf dist
echo "Building new app"
npm run dev