const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const AppError= require('./utils/appError')
const app = express();

const userroutes= require('./routes/userRoutes')
const grouproutes= require('./routes/grouprouter')
const expenseRoutes= require('./routes/expenseRoutes')
const globalErrorHandler= require('./controllers/errorController')
const friendroutes= require('./routes/friendRoutes')
// Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
const cors = require('cors');
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3001'],
  credentials: true
}));
app.use(express.json({ limit: '10kb' }));

// Data sanitization
app.use(mongoSanitize());
app.use(xss());

// routes
app.use('/users', userroutes);
app.use('/groups', grouproutes);
app.use('/friend',friendroutes);
app.use('/expenses',expenseRoutes);
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;