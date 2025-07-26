#!/bin/bash

# BillSplit Application Startup Script

echo "🚀 Starting BillSplit Application..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js and try again."
    exit 1
fi

# Check if MongoDB is running
echo "🔍 Checking MongoDB connection..."
if ! pgrep -x "mongod" > /dev/null; then
    echo "⚠️  MongoDB is not running. Please start MongoDB and try again."
    echo "   For local MongoDB: sudo service mongod start"
    echo "   Or use MongoDB Atlas for cloud database"
fi

# Install backend dependencies if node_modules doesn't exist
if [ ! -d "backened/node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    cd backened && npm install && cd ..
fi

# Install frontend dependencies if node_modules doesn't exist
if [ ! -d "frontened/node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    cd frontened && npm install && cd ..
fi

# Create necessary directories
mkdir -p backened/public/img/users

echo "🎯 Starting Backend Server..."
cd backened && npm run dev &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

echo "🌐 Starting Frontend Development Server..."
cd ../frontened && npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ BillSplit Application is starting!"
echo ""
echo "🔧 Backend API: http://localhost:3000"
echo "🌐 Frontend: http://localhost:5173"
echo ""
echo "📖 Check the README.md for complete setup instructions"
echo ""
echo "Press Ctrl+C to stop both servers"

# Function to cleanup processes
cleanup() {
    echo ""
    echo "🛑 Stopping servers..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID