#!/bin/sh
echo "Cleaning build directory"
rm -rf build
echo "Building new app"
npm run build-qa