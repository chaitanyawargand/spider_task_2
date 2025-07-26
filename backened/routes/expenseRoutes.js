const express = require('express');
const expenseController = require('./../controllers/expenseController');
const authController = require('./../controllers/authController');
const router = express.Router();

// Protect all routes
router.use(authController.protect);

// Group expense routes
router.post('/group/:groupId', expenseController.addExpense);
router.get('/group/:groupId', expenseController.getExpenses);
router.get('/group/:groupId/balances', expenseController.getGroupBalances);
router.get('/group/:groupId/category-stats', expenseController.getCategoryStats);
router.delete('/:expenseId', expenseController.deleteExpense);

module.exports = router;
