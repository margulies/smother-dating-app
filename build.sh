#!/bin/bash

echo "Building production version..."
REACT_APP_API_URL=https://smother-backend.herokuapp.com/api yarn build
echo "Build completed!"
