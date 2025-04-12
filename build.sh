#!/bin/bash

echo "Building production version..."
REACT_APP_API_URL=https://smother-server.herokuapp.com/api npm run build
echo "Build completed!"
