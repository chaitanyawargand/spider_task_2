# 🚀 SplitBill Setup Guide

This guide will help you get the SplitBill application running on your local machine.

## Prerequisites

- **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **MongoDB** (see options below)

## Quick Start Options

### Option 1: Using MongoDB Atlas (Recommended for quick setup)

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get your connection string
4. Update `backened/.env`:
   ```env
   DATABASE=mongodb+srv://username:password@cluster.mongodb.net/billsplit?retryWrites=true&w=majority
   ```

### Option 2: Using Docker (Easiest local setup)

```bash
# Start MongoDB in Docker
docker run -d --name splitbill-mongo -p 27017:27017 mongo:latest

# The app will connect automatically to localhost:27017
```

### Option 3: Install MongoDB Locally

#### On Ubuntu/Debian:
```bash
sudo apt update
sudo apt install -y mongodb
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

#### On macOS:
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb/brew/mongodb-community
```

#### On Windows:
Download and install from [MongoDB Download Center](https://www.mongodb.com/try/download/community)

## Installation Steps

### 1. Clone and Setup
```bash
git clone <repository-url>
cd bill-split-app
chmod +x setup.sh
./setup.sh
```

### 2. Manual Installation (if setup.sh doesn't work)

#### Backend Setup:
```bash
cd backened
npm install
```

#### Frontend Setup:
```bash
cd frontened
npm install
```

### 3. Configure Environment

Update `backened/.env` with your MongoDB connection:
```env
NODE_ENV=development
PORT=3000

# Choose one of the following:

# Local MongoDB
DATABASE=mongodb://localhost:27017/billsplit

# MongoDB Atlas
# DATABASE=mongodb+srv://username:password@cluster.mongodb.net/billsplit?retryWrites=true&w=majority

# Docker MongoDB
# DATABASE=mongodb://localhost:27017/billsplit

DATABASE_PASSWORD=
JWT_SECRET=your-super-long-jwt-secret-key-here-should-be-at-least-32-characters
JWT_EXPIRES_IN=90d
JWT_COOKIE_EXPIRES_IN=90
```

### 4. Start the Application

#### Option A: Using convenience scripts
```bash
# Start both frontend and backend
./start-both.sh

# Or start them separately
./start-backend.sh    # Terminal 1
./start-frontend.sh   # Terminal 2
```

#### Option B: Manual start
```bash
# Terminal 1 - Backend
cd backened
npm start

# Terminal 2 - Frontend  
cd frontened
npm run dev
```

### 5. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000

## Docker Setup (Alternative)

If you have Docker installed:

```bash
# Start with Docker Compose
docker-compose up -d

# Or build and run manually
docker build -t splitbill-backend ./backened
docker build -t splitbill-frontend ./frontened
docker run -d --name splitbill-mongo -p 27017:27017 mongo:latest
docker run -d --name splitbill-backend -p 3000:3000 splitbill-backend
docker run -d --name splitbill-frontend -p 5173:5173 splitbill-frontend
```

## Troubleshooting

### MongoDB Connection Issues

1. **Check if MongoDB is running**:
   ```bash
   # For local installation
   sudo systemctl status mongod
   
   # For Docker
   docker ps | grep mongo
   ```

2. **Test MongoDB connection**:
   ```bash
   # Install MongoDB tools if needed
   npm install -g mongodb
   
   # Test connection
   mongosh mongodb://localhost:27017/billsplit
   ```

### Port Conflicts

If ports 3000 or 5173 are in use:

1. **Change backend port** in `backened/.env`:
   ```env
   PORT=3001
   ```

2. **Change frontend port** in `frontened/package.json`:
   ```json
   {
     "scripts": {
       "dev": "vite --port 5174"
     }
   }
   ```

### Permission Issues

```bash
# Fix npm permissions
sudo chown -R $(whoami) ~/.npm

# Make scripts executable
chmod +x setup.sh start-*.sh
```

## Environment Variables

### Backend (.env)
```env
NODE_ENV=development          # Environment mode
PORT=3000                    # Backend port
DATABASE=mongodb://...       # MongoDB connection string
DATABASE_PASSWORD=           # MongoDB password (if using Atlas)
JWT_SECRET=your-secret       # JWT secret key (min 32 chars)
JWT_EXPIRES_IN=90d          # JWT expiration time
JWT_COOKIE_EXPIRES_IN=90    # Cookie expiration (days)
```

### Frontend (automatic)
The frontend automatically connects to `http://localhost:3000` for the backend API.

## Development

### Available Scripts

**Backend:**
- `npm start` - Start with nodemon (auto-reload)
- `npm run prod` - Start in production mode

**Frontend:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Project Structure
```
├── backened/
│   ├── controllers/    # Route handlers
│   ├── modals/        # Database schemas
│   ├── routes/        # API routes
│   ├── utils/         # Utility functions
│   ├── app.js         # Express app
│   └── server.js      # Server entry
├── frontened/
│   ├── src/
│   │   ├── components/ # Reusable components
│   │   ├── pages/     # Page components
│   │   ├── services/  # API services
│   │   ├── context/   # React context
│   │   └── utils/     # Utility functions
│   └── public/        # Static files
└── README.md
```

## Production Deployment

### Environment Setup
1. Set `NODE_ENV=production` in backend
2. Use a production MongoDB instance
3. Use strong JWT secrets
4. Enable HTTPS
5. Set up proper CORS origins

### Build Commands
```bash
# Build frontend
cd frontened
npm run build

# Start backend in production
cd backened
npm run prod
```

## Getting Help

1. Check the [README.md](./README.md) for feature documentation
2. Look at the API endpoints documentation in README
3. Check browser console for frontend errors
4. Check backend logs for API errors
5. Create an issue in the repository

## Next Steps

After successful setup:
1. Register a new account
2. Add some friends
3. Create your first group
4. Start adding expenses
5. Explore the charts and balance features

Happy bill splitting! 🎉