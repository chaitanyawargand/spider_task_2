const Expense = require('./../modals/expenseSchema');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const Group = require('./../modals/groupSchema');
const User = require('./../modals/userSchema');

exports.groupAddExpense = catchAsync(async (req, res, next) => {
    const { amount, category, title } = req.body;
    const group = await Group.findById(req.params.id);
    if (!group) return next(new AppError('Group not found', 404));
    if (!group.members.includes(req.user.id)) {
        return next(new AppError('You are not a member of this group', 403));
    }
    const newExpense = await Expense.create({
        group: req.params.id,
        createdBy: req.user.id,
        amount,
        category: title || category
    });
    res.status(201).json({
        status: 'success',
        data: {
            expense: newExpense
        }
    });
});

exports.groupDeleteExpense = catchAsync(async (req, res, next) => {
    const exp = await Expense.findById(req.params.expenseId);
    if (!exp) return next(new AppError('Expense not found', 404));
    const group = await Group.findById(exp.group);
    if (!group.members.includes(req.user.id)) {
        return next(new AppError('You are not a member of this group', 403));
    }
    if (!exp.createdBy.equals(req.user.id)) {
        return next(new AppError('You can only delete your own expenses', 403));
    }
    await Expense.findByIdAndDelete(req.params.expenseId);
    res.status(204).json({
        status: 'success',
        data: null
    });
});

exports.getGroupExpenses = catchAsync(async (req, res, next) => {
    const group = await Group.findById(req.params.id);
    if (!group) return next(new AppError('Group not found', 404));
    const expenses = await Expense.find({ group: req.params.id }).populate('createdBy', 'name email');
    
    res.status(200).json({
        status: 'success',
        results: expenses.length,
        data: {
            expenses
        }
    });
});

exports.getGroupBalances = catchAsync(async (req, res, next) => {
    const group = await Group.findById(req.params.id);
    if (!group) return next(new AppError('Group not found', 404));
    if (!group.members.includes(req.user.id)) {
        return next(new AppError('You are not a member of this group', 403));
    }
    const members = group.members.map(m => m.toString());
    const expenses = await Expense.find({ group: req.params.id }).populate('createdBy', 'name');
    const users = await User.find({ _id: { $in: members } }).select('name');
    const userMap = {};
    users.forEach(user => {
        userMap[user._id.toString()] = user.name;
    });
    
    // initial balances
    const balances = {};
    members.forEach(payer => {
        balances[payer] = {};
        members.forEach(receiver => {
            if (payer !== receiver) balances[payer][receiver] = 0;
        });
    });
    
    // split expenses
    for (const exp of expenses) {
        const splitAmount = exp.amount / group.members.length;
        members.forEach(member => {
            if (member !== exp.createdBy.toString()) {
                balances[member][exp.createdBy] += splitAmount;
            }
        });
    }
    
    // calculate simplified balances for display
    const simplifiedBalances = [];
    for (let i = 0; i < members.length; i++) {
        for (let j = i + 1; j < members.length; j++) {
            const member1 = members[i];
            const member2 = members[j];
            const amount1to2 = balances[member1][member2] || 0;
            const amount2to1 = balances[member2][member1] || 0;
            const netAmount = amount1to2 - amount2to1;
            
            if (Math.abs(netAmount) > 0.01) { // Only show if meaningful amount
                if (netAmount > 0) {
                    simplifiedBalances.push({
                        from: userMap[member1],
                        to: userMap[member2],
                        amount: Math.abs(netAmount)
                    });
                } else {
                    simplifiedBalances.push({
                        from: userMap[member2],
                        to: userMap[member1],
                        amount: Math.abs(netAmount)
                    });
                }
            }
        }
    }
    
    res.status(200).json({
        status: 'success',
        data: {
            balances: simplifiedBalances,
            currentUserId: req.user.id
        }
    });
});
