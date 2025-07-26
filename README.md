# BillSplit - Expense Sharing Application

A comprehensive bill splitting and expense tracking application built with React (frontend) and Node.js/Express (backend). This application allows users to create groups, add friends, track expenses, and settle bills easily.

## Features

### Level 1 Features ✅
- **Authentication**: Secure JWT-based login/logout functionality
- **User Management**: Search for users and manage friend relationships
- **Group Management**: Create groups and add friends as members
- **Expense Tracking**: Add expenses with categories and automatic equal splitting
- **Balance Calculation**: See who owes whom and how much
- **Expense Management**: Delete expenses (only by the person who added them)
- **Group Admin**: Group creators can delete groups

### Level 2 Features ✅
- **Profile Management**: View and update user profiles
- **Profile Pictures**: Upload and update profile pictures
- **Password Management**: Change passwords securely
- **Visual Analytics**: Pie charts for category-wise expense breakdown
- **Friend Requests**: Send and respond to friend requests

## Technology Stack

### Backend
- Node.js with Express.js
- MongoDB with Mongoose
- JWT for authentication
- Multer for file uploads
- bcryptjs for password hashing
- CORS enabled for frontend communication

### Frontend
- React 19 with Vite
- React Router for navigation
- Chart.js for expense visualization
- React Toastify for notifications
- Axios for API communication
- Modern CSS with responsive design

## Project Structure

```
billsplit/
├── backened/                 # Backend API server
│   ├── controllers/          # Route handlers
│   ├── modals/              # Database schemas
│   ├── routes/              # API routes
│   ├── utils/               # Utility functions
│   ├── public/img/users/    # Uploaded profile pictures
│   ├── app.js               # Express app configuration
│   ├── server.js            # Server entry point
│   └── .env                 # Environment variables
├── frontened/               # React frontend
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── context/         # React contexts
│   │   ├── utils/           # Utility functions
│   │   └── main.jsx         # React entry point
│   └── public/              # Static assets
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backened
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Update .env file with your configurations
NODE_ENV=development
PORT=3000
DATABASE=mongodb://localhost:27017/billsplit
DATABASE_PASSWORD=
JWT_SECRET=your-super-long-jwt-secret-string-that-should-be-at-least-32-chars
JWT_EXPIRES_IN=90d
JWT_COOKIE_EXPIRES_IN=90
```

4. Start MongoDB service (if running locally)

5. Start the backend server:
```bash
npm run dev
```

The backend server will start on `http://localhost:3000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontened
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will start on `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/v1/users/signup` - User registration
- `POST /api/v1/users/login` - User login
- `PATCH /api/v1/users/updateMyPassword` - Update password

### User Management
- `GET /api/v1/users/me` - Get current user
- `PATCH /api/v1/users/updateMe` - Update user profile
- `GET /api/v1/users/search` - Search users
- `GET /api/v1/users/friends` - Get friends list
- `POST /api/v1/users/friend-request/:id` - Send friend request
- `PATCH /api/v1/users/friend-request/:requestId` - Respond to friend request

### Groups
- `GET /api/v1/groups` - Get user's groups
- `POST /api/v1/groups` - Create new group
- `GET /api/v1/groups/:id` - Get group details
- `DELETE /api/v1/groups/:id` - Delete group
- `PATCH /api/v1/groups/:id/add-member` - Add member to group
- `PATCH /api/v1/groups/:id/remove-member` - Remove member from group

### Expenses
- `POST /api/v1/expenses/group/:groupId` - Add expense to group
- `GET /api/v1/expenses/group/:groupId` - Get group expenses
- `DELETE /api/v1/expenses/:expenseId` - Delete expense
- `GET /api/v1/expenses/group/:groupId/balances` - Get group balances
- `GET /api/v1/expenses/group/:groupId/category-stats` - Get category statistics

## Usage Guide

### Getting Started
1. Register a new account or login with existing credentials
2. Complete your profile setup
3. Search for friends and send friend requests
4. Create your first group and add friends
5. Start adding expenses and track your spending!

### Adding Expenses
1. Navigate to a group
2. Click "Add Expense"
3. Enter description, select category, and amount
4. The expense will be automatically split equally among all group members

### Managing Friends
1. Go to Friends page
2. Search for users by name or email
3. Send friend requests
4. Accept/decline incoming requests

### Group Management
- Only group creators can add/remove members and delete groups
- All group members can add expenses
- Users can only delete their own expenses

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Security Features

- JWT-based authentication
- Password hashing with bcryptjs
- Input validation and sanitization
- CORS protection
- Rate limiting ready (can be enabled)
- XSS protection
- MongoDB injection prevention

## Future Enhancements

- Mobile app development
- Real-time notifications
- Multiple currency support
- Receipt image uploads
- Advanced expense categorization
- Settlement suggestions
- Payment integration
- Email notifications

## License

MIT License - feel free to use this project for learning and development purposes.

## Support

For issues and questions, please create an issue in the repository or contact the development team.

---

**Note**: This application is designed for educational and personal use. For production deployment, additional security measures and optimizations should be implemented.