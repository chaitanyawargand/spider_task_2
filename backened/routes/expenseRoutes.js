const express = require('express');
const expenseController = require('./../controllers/expenseController');
const authController = require('./../controllers/authController');

const router = express.Router();

// Protect all routes
router.use(authController.protect);

// These routes are typically handled through group routes
// but can be included for direct expense management if needed

module.exports = router;
