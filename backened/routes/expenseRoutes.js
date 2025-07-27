const express=require('express');
const expenseController=require('./../controllers/expenseController');
const authController=require('./../controllers/authController');

const router = express.Router({ mergeParams: true });

router.use(authController.protect);
router
  .route('/')
  .post(expenseController.groupAddExpense)
  .get(expenseController.getGroupExpenses);

router.get('/balances', expenseController.getGroupBalances);
router.delete('/:id', expenseController.groupDeleteExpense);

module.exports = router;

