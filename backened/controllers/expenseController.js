const expense= require('./../modals/expenseSchema');
const catchAsync = require('./../utils/catchAsynch');
const AppError = require('./../utils/appError');
const Group = require('./../modals/groupSchema');
const User = require('./../modals/userschema');

exports.groupAddExpense = catchAsync(async (req, res, next) => {
    const { amount, category } = req.body;
    const group = await Group.findById(req.params.groupId);
    if (!group) return next(new AppError('Group not found', 404));
    if (!group.members.includes(req.user.id)) {
        return next(new AppError('You are not a member of this group', 403));
    }
    const newExpense = await expense.create({
        group: req.params.groupId, 
        createdBy: req.user.id,
        amount,
        category,
    })
    await Group.findByIdAndUpdate(req.params.groupId, {
        $push: { expenses: newExpense._id },
    });
    res.status(201).json({
        status: 'success',
        data: {
            expense: newExpense,
        },
    });
});

exports.groupDeleteExpense=catchAsync(async(req,res,next)=>{
    const exp= await expense.findById(req.params.id);
    if(!exp) return next(new AppError('Expense not found', 404));
    const group = await Group.findById(req.params.groupId);
    if(!group.members.includes(req.user.id)) {
        return next(new AppError('You are not a member of this group', 403))}
    if(!exp.createdBy.equals(req.user.id)) {
        return next(new AppError('You can only delete your own expenses', 403))}
    await expense.findByIdAndDelete(req.params.id);
    res.status(204).json({
        status: 'success',
        data: null
    });
})
exports.getGroupExpenses= catchAsync(async (req, res, next)=>{
   const group= await Group.findById(req.params.groupId);
   if(!group) return next(new AppError('Group not found', 404));
   const expenses=await expense.find({group: req.params.groupId});
    if(!expenses || expenses.length===0) {
    return next(new AppError('No expenses found for this group', 404));
    }
    res.status(200).json({
        status: 'success',
         results: expenses.length,
        expenses      
})

});
exports.getGroupBalances = catchAsync(async (req, res, next) => {
  const group = await Group.findById(req.params.groupId);
  if (!group) return next(new AppError('Group not found', 404));
  if (!group.members.includes(req.user.id)) {
    return next(new AppError('You are not a member of this group', 403));
  }
  const memberIds = group.members.map(id => id.toString());
  const expenses = await expense.find({ group: req.params.groupId });
  const users = await User.find({ _id: { $in: memberIds } }).select('name');
  const userMap = {};
  users.forEach(user => {
    userMap[user._id.toString()] = user.name;
  });
  const balances = {};
  memberIds.forEach(a => {
    balances[a] = {};
    memberIds.forEach(b => {
      if (a !== b) balances[a][b] = 0;
    });
  });
  for (const exp of expenses) {
    const payer = exp.createdBy.toString();
    const split = exp.amount / memberIds.length;

    memberIds.forEach(member => {
      if (member !== payer) {
        balances[member][payer] += split;
      }
    });
  }
  const netBalances = {};
  memberIds.forEach(a => {
    netBalances[a] = {};
    memberIds.forEach(b => {
      if (a !== b) {
        const owe = balances[a][b] || 0;
        const owed = balances[b][a] || 0;
        const net = owe - owed;
        if (net > 0) {
          netBalances[a][b] = net;
        } else {
          netBalances[a][b] = 0;
        }
      }
    });
  });
  const youOwe = [];
  const youAreOwed = [];
  for (const otherId of memberIds) {
    if (otherId === req.user.id) continue;
    const owe = netBalances[req.user.id][otherId] || 0;
    const owed = netBalances[otherId][req.user.id] || 0;
    if (owe > 0) {
      youOwe.push({
        to: userMap[otherId],
        amount: Math.round(owe),
      });
    }
    if (owed > 0) {
      youAreOwed.push({
        from: userMap[otherId],
        amount: Math.round(owed),
      });
    }
  }
  res.status(200).json({
    status: 'success',
    data: {
      balances: {
        youOwe,
        youAreOwed,
      },
    },
  });
});


