const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const cors = require('cors');
const userroutes=require('./routes/userRoutes');
const grouproutes=require('./routes/groupRoutes');
const expenseroutes=require('./routes/expenseRoutes');
const AppError= require('./utils/appError')
const globalErrorHandler=require('./controllers/errorcontroller')
const app = express();

// Enable CORS
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

// Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json({ limit: '10kb' }));

// Data sanitization
app.use(mongoSanitize());
app.use(xss());

// routes
app.use('/api/v1/users', userroutes);
app.use('/api/v1/groups', grouproutes);
app.use('/api/v1/expenses', expenseroutes);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;