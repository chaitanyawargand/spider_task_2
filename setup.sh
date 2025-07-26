#!/bin/bash

echo "🚀 Setting up SplitBill Application"
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Check Node.js
echo "Checking prerequisites..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    print_status "Node.js found: $NODE_VERSION"
else
    print_error "Node.js is not installed. Please install Node.js v14 or higher."
    exit 1
fi

# Check npm
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    print_status "npm found: $NPM_VERSION"
else
    print_error "npm is not installed. Please install npm."
    exit 1
fi

# Install backend dependencies
echo ""
echo "Installing backend dependencies..."
cd backened
if npm install; then
    print_status "Backend dependencies installed successfully"
else
    print_error "Failed to install backend dependencies"
    exit 1
fi

# Install frontend dependencies
echo ""
echo "Installing frontend dependencies..."
cd ../frontened
if npm install; then
    print_status "Frontend dependencies installed successfully"
else
    print_error "Failed to install frontend dependencies"
    exit 1
fi

cd ..

# Check MongoDB
echo ""
echo "Checking MongoDB..."
if command -v mongod &> /dev/null; then
    print_status "MongoDB found locally"
    echo "DATABASE=mongodb://localhost:27017/billsplit" > backened/.env.local
else
    print_warning "MongoDB not found locally"
    echo "For local development, you have several options:"
    echo "1. Install MongoDB locally"
    echo "2. Use Docker: docker run -d -p 27017:27017 --name mongodb mongo"
    echo "3. Use MongoDB Atlas (cloud) - update DATABASE in backened/.env"
    echo ""
    echo "For now, the app is configured to use a demo MongoDB Atlas connection."
    echo "You may need to update the DATABASE URL in backened/.env for production use."
fi

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "To start the application:"
echo "1. Start the backend:"
echo "   cd backened && npm start"
echo ""
echo "2. In another terminal, start the frontend:"
echo "   cd frontened && npm run dev"
echo ""
echo "3. Open your browser to http://localhost:5173"
echo ""
echo "For more information, check the README.md file."

# Create start scripts
echo "Creating convenient start scripts..."

cat > start-backend.sh << 'EOF'
#!/bin/bash
echo "🔧 Starting SplitBill Backend..."
cd backened
npm start
EOF

cat > start-frontend.sh << 'EOF'
#!/bin/bash
echo "🎨 Starting SplitBill Frontend..."
cd frontened
npm run dev
EOF

cat > start-both.sh << 'EOF'
#!/bin/bash
echo "🚀 Starting SplitBill Application (both frontend and backend)..."

# Function to kill background processes on exit
cleanup() {
    echo "Stopping services..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit
}

trap cleanup SIGINT SIGTERM

# Start backend in background
echo "Starting backend..."
cd backened
npm start &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Start frontend in background
echo "Starting frontend..."
cd ../frontened
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ Both services are starting..."
echo "📱 Frontend will be available at: http://localhost:5173"
echo "🔧 Backend will be available at: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop both services"

# Wait for background processes
wait $BACKEND_PID $FRONTEND_PID
EOF

chmod +x start-backend.sh start-frontend.sh start-both.sh

print_status "Created convenience scripts: start-backend.sh, start-frontend.sh, start-both.sh"
print_status "You can now run ./start-both.sh to start both services at once!"