#!/bin/bash

# Get the operating system name
os=$(uname -s)
LOCAL_IP=""

# Check the operating system and execute the appropriate command
if [[ "$os" == "Darwin" ]]; then
    # Mac OS X
    echo "Running on macOS..."
    LOCAL_IP=$(ipconfig getifaddr en0)
elif [[ "$os" == "Linux" ]]; then
    # Linux
    echo "Running on Linux..."
    # TODO implement command to get local ipv4 for linux
elif [[ "$os" == "MINGW"* ]]; then
    # Windows (Git Bash, MSYS2, Cygwin)
    echo "Running on Windows..."
    # TODO implement command to get local ipv4 for linux
else
    echo "Unsupported operating system: $os"

fi

mkcert -cert-file proxy/localhost.pem -key-file proxy/localhost-key.pem localhost '127.0.0.1' $LOCAL_IP 