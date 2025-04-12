#!/bin/bash

# Set API URL
export REACT_APP_API_URL="https://smother-server-35b3f9ca479c.herokuapp.com"

echo "Building production version..."
yarn build
echo "Build completed!"

echo "Committing build files..."
git config advice.addIgnoredFile false
git add build
git commit -m "Update build files for Netlify deployment" || true

echo "Pushing to GitHub..."
git push origin main
