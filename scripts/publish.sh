#!/bin/bash

# Verify npm identity
echo "Verifying npm identity..."
npm whoami

# Clean and prepare the package
echo "Cleaning and preparing the package..."
npm run clean:all
npm run prepare

# Run tests and check coverage
echo "Running tests and checking coverage..."
npm run cover:check

# Build the package
echo "Building the package..."
npm run build

# Update changelog
echo "Updating changelog..."
npm run changelog:update

# Bump version
echo "Bumping version..."
npm run version

# Publish the package
echo "Publishing the package..."
npm run publish

# Push changes to GitHub
echo "Pushing changes to GitHub..."
# npm run push

echo "Package published and pushed to GitHub successfully!"
