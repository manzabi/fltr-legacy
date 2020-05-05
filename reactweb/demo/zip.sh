#!/bin/bash

_now=$(date +"%m_%d_%Y")
_file="react_recruiter_$_now.zip"
zip -r $_file dist/
