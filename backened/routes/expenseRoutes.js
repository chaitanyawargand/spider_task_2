const express = require('express');
const expenseController = require('./../controllers/expenseController');
const authController = require('./../controllers/authController');

const router = express.Router();

// Protect all routes after this middleware
router.use(authController.protect);

router.route('/group/:id')
    .get(expenseController.getGroupExpenses)
    .post(expenseController.groupAddExpense);

router.route('/group/:id/balances')
    .get(expenseController.getGroupBalances);

router.route('/group/:id/categories')
    .get(expenseController.getExpensesByCategory);

router.route('/:id')
    .delete(expenseController.groupDeleteExpense);

module.exports = router;
