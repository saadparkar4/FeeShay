#!/bin/bash

# FeeShay Backend Test Runner
# This script runs the comprehensive API endpoint tests

echo "🚀 Starting FeeShay Backend API Tests..."
echo "=========================================="

# Set test environment variables
export NODE_ENV=test
export MONGODB_URI_TEST=${MONGODB_URI_TEST:-"mongodb://localhost:27017/feeshay_test"}
export JWT_SECRET=${JWT_SECRET:-"test-secret-key"}

# Check if MongoDB is running
echo "📊 Checking MongoDB connection..."
if ! nc -z localhost 27017 2>/dev/null; then
    echo "❌ MongoDB is not running on localhost:27017"
    echo "Please start MongoDB or set MONGODB_URI_TEST environment variable"
    exit 1
fi

echo "✅ MongoDB is running"

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Build the project
echo "🔨 Building TypeScript..."
npm run build

# Run the tests
echo "🧪 Running API endpoint tests..."
echo "=========================================="

# Run tests with coverage
npm run test:coverage

# Check if tests passed
if [ $? -eq 0 ]; then
    echo "=========================================="
    echo "✅ All tests passed successfully!"
    echo "📊 Coverage report generated in coverage/"
    echo "🎉 FeeShay Backend API is working correctly!"
else
    echo "=========================================="
    echo "❌ Some tests failed!"
    echo "🔍 Check the output above for details"
    exit 1
fi 