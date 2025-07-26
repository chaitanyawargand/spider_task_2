const express = require('express');
const groupController = require('./../controllers/groupController');
const expenseController = require('./../controllers/expenseController');
const authController = require('./../controllers/authController');

const router = express.Router();

// Protect all routes
router.use(authController.protect);

// Group routes
router.post('/create', groupController.createGroup);
router.get('/my-groups', groupController.getMyGroups);
router.get('/:id', groupController.getGroup);
router.delete('/:id', groupController.deleteGroup);

// Group member routes
router.get('/:id/members', groupController.getGroupMembers);
router.post('/:id/add-member', groupController.addMember);
router.post('/:id/remove-member', groupController.removeMember);

// Group expense routes
router.get('/:id/expenses', expenseController.getGroupExpenses);
router.post('/:id/expenses', expenseController.groupAddExpense);
router.delete('/:id/expenses/:expenseId', expenseController.groupDeleteExpense);
router.get('/:id/expenses/balances', expenseController.getGroupBalances);

module.exports = router;