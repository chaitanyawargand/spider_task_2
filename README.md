# 💰 SplitBill - Bill Splitting Application

A modern, full-stack bill splitting application that helps friends easily split expenses and track balances. Built with React.js frontend and Node.js/Express backend with MongoDB database.

## ✨ Features

### Level 1 Features (Core Functionality)
- ✅ **Secure Authentication** - JWT-based login/logout system
- ✅ **Friend Management** - Search, add, and remove friends
- ✅ **Group Management** - Create groups and add only friends to groups
- ✅ **Expense Tracking** - Add expenses with categories, split equally among members
- ✅ **Balance Calculation** - Track who owes whom and by how much
- ✅ **Expense Management** - Delete expenses (only by creator)
- ✅ **Group Administration** - Group creators can delete groups

### Level 2 Features (Enhanced Functionality)
- ✅ **Profile Management** - View and update user profile information
- ✅ **Password Management** - Secure password change functionality
- ✅ **Visual Analytics** - Pie charts showing category-wise expenses
- ✅ **Responsive Design** - Works perfectly on desktop and mobile devices

## 🚀 Tech Stack

### Frontend
- **React 19** - Modern UI library with hooks
- **React Router** - Client-side routing
- **Chart.js** - Interactive charts and visualizations
- **Axios** - HTTP client for API calls
- **React Toastify** - Beautiful notifications

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

## 📦 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- Git

### 1. Clone the Repository
```bash
git clone <repository-url>
cd bill-split-app
```

### 2. Backend Setup
```bash
cd backened
npm install

# Create environment file
cp .env.example .env
# Edit .env with your configuration
```

### 3. Frontend Setup
```bash
cd frontened
npm install
```

### 4. Environment Configuration

Update `backened/.env`:
```env
NODE_ENV=development
PORT=3000
DATABASE=mongodb://localhost:27017/billsplit
DATABASE_PASSWORD=

JWT_SECRET=your-super-long-jwt-secret-key-here-should-be-at-least-32-characters
JWT_EXPIRES_IN=90d
JWT_COOKIE_EXPIRES_IN=90
```

### 5. Start the Application

**Terminal 1 - Backend:**
```bash
cd backened
npm start
```

**Terminal 2 - Frontend:**
```bash
cd frontened
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000

## 🔧 API Endpoints

### Authentication
- `POST /api/v1/users/signup` - User registration
- `POST /api/v1/users/login` - User login
- `PATCH /api/v1/users/updateMyPassword` - Change password
- `PATCH /api/v1/users/resetPassword/:token` - Reset password

### User Management
- `GET /api/v1/users/me` - Get current user
- `PATCH /api/v1/users/updateMe` - Update profile
- `DELETE /api/v1/users/deleteMe` - Deactivate account

### Friend Management
- `GET /api/v1/users/search` - Search users
- `GET /api/v1/users/friends` - Get friends list
- `POST /api/v1/users/friends/:id` - Add friend
- `DELETE /api/v1/users/friends/:id` - Remove friend

### Group Management
- `GET /api/v1/groups` - Get user's groups
- `POST /api/v1/groups` - Create new group
- `DELETE /api/v1/groups/:id` - Delete group
- `GET /api/v1/groups/:id/members` - Get group members
- `POST /api/v1/groups/:id/members` - Add member to group
- `DELETE /api/v1/groups/:id/members` - Remove member from group

### Expense Management
- `GET /api/v1/expenses/group/:id` - Get group expenses
- `POST /api/v1/expenses/group/:id` - Add expense to group
- `DELETE /api/v1/expenses/:id` - Delete expense
- `GET /api/v1/expenses/group/:id/balances` - Get group balances
- `GET /api/v1/expenses/group/:id/categories` - Get category-wise expenses

## 📱 Usage Guide

### 1. Getting Started
1. Register a new account or login with existing credentials
2. Complete your profile setup
3. Add friends by searching their name or email

### 2. Creating Groups
1. Navigate to the Groups page
2. Click "Create New Group"
3. Enter group name and description
4. Add friends to the group

### 3. Managing Expenses
1. Go to a group's detail page
2. Click "Add Expense"
3. Enter amount and select category
4. The expense will be split equally among all members

### 4. Tracking Balances
- View your overall balance on the dashboard
- Check individual group balances in group details
- See who owes you money and whom you owe

### 5. Analytics
- View pie charts showing expense breakdown by category
- Track spending patterns within each group

## 🔒 Security Features

- **Password Hashing** - All passwords are securely hashed using bcryptjs
- **JWT Authentication** - Secure token-based authentication
- **Input Validation** - Server-side validation for all inputs
- **CORS Protection** - Configured for secure cross-origin requests
- **XSS Protection** - Input sanitization to prevent XSS attacks
- **Rate Limiting** - Protection against brute force attacks

## 🎨 UI/UX Features

- **Modern Design** - Clean, intuitive interface
- **Responsive Layout** - Works on all device sizes
- **Interactive Charts** - Visual representation of expenses
- **Real-time Feedback** - Toast notifications for user actions
- **Loading States** - Smooth loading indicators
- **Error Handling** - Graceful error messages

## 🛠️ Development

### Project Structure
```
├── backened/
│   ├── controllers/     # Route handlers
│   ├── models/          # Database schemas
│   ├── routes/          # API routes
│   ├── utils/           # Utility functions
│   ├── app.js           # Express app setup
│   └── server.js        # Server entry point
├── frontened/
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── services/    # API services
│   │   ├── context/     # React context
│   │   └── utils/       # Utility functions
│   └── public/          # Static assets
└── README.md
```

### Available Scripts

**Backend:**
- `npm start` - Start development server with nodemon
- `npm run prod` - Start production server

**Frontend:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🐛 Known Issues

- Group names must be unique across the entire platform
- Profile picture upload feature is prepared but not fully implemented
- Email notifications for password reset are prepared but not implemented

## 🔮 Future Enhancements

- [ ] Profile picture upload functionality
- [ ] Email notifications
- [ ] Multi-currency support
- [ ] Expense splitting by custom amounts (not just equal splits)
- [ ] Expense receipts upload
- [ ] Export expenses to CSV/PDF
- [ ] Mobile app (React Native)
- [ ] Real-time notifications using WebSockets

## 📞 Support

For support, please create an issue in the repository or contact the development team.

---

Built with ❤️ for making bill splitting easier and friendships stronger! 🎉