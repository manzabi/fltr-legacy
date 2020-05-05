#!/bin/bash

_now=$(date +"%m_%d_%Y")
_file="react_website_$_now.zip"
zip -r $_file build/
