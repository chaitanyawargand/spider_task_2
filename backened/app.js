const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const cors = require('cors');
const userroutes = require('./routes/userRoutes');
const grouproutes = require('./routes/groupRoutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorcontroller');
const app = express();

// Enable CORS
app.use(cors());

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

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;