const Expense = require('./../modals/expenseSchema');
const catchAsync = require('./../utils/catchAsynch');
const AppError = require('./../utils/appError');
const Group = require('./../modals/groupSchema');
const User = require('./../modals/userschema');

exports.addExpense = catchAsync(async (req, res, next) => {
    const { description, category, amount } = req.body;
    const groupId = req.params.groupId;
    
    // Validate input
    if (!description || !category || !amount) {
        return next(new AppError('Please provide description, category, and amount', 400));
    }
    
    // Check if group exists and user is a member
    const group = await Group.findById(groupId).populate('members');
    if (!group) {
        return next(new AppError('Group not found', 404));
    }
    
    const isMember = group.members.some(member => member._id.toString() === req.user.id);
    if (!isMember) {
        return next(new AppError('You are not a member of this group', 403));
    }
    
    // Calculate split amount for each member
    const splitAmount = amount / group.members.length;
    const splitAmong = group.members.map(member => ({
        user: member._id,
        amount: Math.round(splitAmount * 100) / 100 // Round to 2 decimal places
    }));
    
    // Create expense
    const newExpense = await Expense.create({
        description,
        category,
        amount,
        group: groupId,
        createdBy: req.user.id,
        splitAmong
    });
    
    await newExpense.populate('createdBy', 'name email profilePicture');
    await newExpense.populate('splitAmong.user', 'name email profilePicture');
    
    res.status(201).json({
        status: 'success',
        data: {
            expense: newExpense
        }
    });
});

exports.getExpenses = catchAsync(async (req, res, next) => {
    const groupId = req.params.groupId;
    
    // Check if group exists and user is a member
    const group = await Group.findById(groupId);
    if (!group) {
        return next(new AppError('Group not found', 404));
    }
    
    const isMember = group.members.some(member => member._id.toString() === req.user.id);
    if (!isMember) {
        return next(new AppError('You are not a member of this group', 403));
    }
    
    const expenses = await Expense.find({ group: groupId })
        .populate('createdBy', 'name email profilePicture')
        .populate('splitAmong.user', 'name email profilePicture')
        .sort('-createdAt');
    
    res.status(200).json({
        status: 'success',
        results: expenses.length,
        data: {
            expenses
        }
    });
});

exports.deleteExpense = catchAsync(async (req, res, next) => {
    const expense = await Expense.findById(req.params.expenseId);
    
    if (!expense) {
        return next(new AppError('Expense not found', 404));
    }
    
    // Check if the user created this expense
    if (!expense.createdBy.equals(req.user.id)) {
        return next(new AppError('You can only delete your own expenses', 403));
    }
    
    await Expense.findByIdAndDelete(req.params.expenseId);
    
    res.status(204).json({
        status: 'success',
        data: null
    });
});

exports.getGroupBalances = catchAsync(async (req, res, next) => {
    const groupId = req.params.groupId;
    
    // Check if group exists and user is a member
    const group = await Group.findById(groupId).populate('members', 'name email profilePicture');
    if (!group) {
        return next(new AppError('Group not found', 404));
    }
    
    const isMember = group.members.some(member => member._id.toString() === req.user.id);
    if (!isMember) {
        return next(new AppError('You are not a member of this group', 403));
    }
    
    // Get all expenses for this group
    const expenses = await Expense.find({ group: groupId }).populate('createdBy', 'name');
    
    // Initialize balances object
    const balances = {};
    group.members.forEach(member => {
        balances[member._id.toString()] = {
            name: member.name,
            totalPaid: 0,
            totalOwed: 0,
            netBalance: 0
        };
    });
    
    // Calculate totals
    expenses.forEach(expense => {
        const paidBy = expense.createdBy._id.toString();
        const splitAmount = expense.amount / group.members.length;
        
        // Add to total paid by the payer
        balances[paidBy].totalPaid += expense.amount;
        
        // Add split amount to everyone's owed amount
        group.members.forEach(member => {
            const memberId = member._id.toString();
            balances[memberId].totalOwed += splitAmount;
        });
    });
    
    // Calculate net balances
    Object.keys(balances).forEach(memberId => {
        balances[memberId].netBalance = balances[memberId].totalPaid - balances[memberId].totalOwed;
    });
    
    // Calculate what current user owes and is owed
    const currentUserId = req.user.id;
    const youOwe = [];
    const youAreOwed = [];
    
    Object.keys(balances).forEach(memberId => {
        if (memberId !== currentUserId) {
            const currentUserBalance = balances[currentUserId].netBalance;
            const otherUserBalance = balances[memberId].netBalance;
            
            if (currentUserBalance < 0 && otherUserBalance > 0) {
                const amountOwed = Math.min(Math.abs(currentUserBalance), otherUserBalance);
                if (amountOwed > 0.01) { // Only show if more than 1 cent
                    youOwe.push({
                        to: balances[memberId].name,
                        toId: memberId,
                        amount: Math.round(amountOwed * 100) / 100
                    });
                }
            } else if (currentUserBalance > 0 && otherUserBalance < 0) {
                const amountOwed = Math.min(currentUserBalance, Math.abs(otherUserBalance));
                if (amountOwed > 0.01) { // Only show if more than 1 cent
                    youAreOwed.push({
                        from: balances[memberId].name,
                        fromId: memberId,
                        amount: Math.round(amountOwed * 100) / 100
                    });
                }
            }
        }
    });
    
    res.status(200).json({
        status: 'success',
        data: {
            balances: Object.values(balances),
            youOwe,
            youAreOwed
        }
    });
});

exports.getCategoryStats = catchAsync(async (req, res, next) => {
    const groupId = req.params.groupId;
    
    // Check if group exists and user is a member
    const group = await Group.findById(groupId);
    if (!group) {
        return next(new AppError('Group not found', 404));
    }
    
    const isMember = group.members.some(member => member._id.toString() === req.user.id);
    if (!isMember) {
        return next(new AppError('You are not a member of this group', 403));
    }
    
    // Aggregate expenses by category
    const categoryStats = await Expense.aggregate([
        { $match: { group: group._id } },
        {
            $group: {
                _id: '$category',
                totalAmount: { $sum: '$amount' },
                count: { $sum: 1 }
            }
        },
        { $sort: { totalAmount: -1 } }
    ]);
    
    const totalExpenses = await Expense.aggregate([
        { $match: { group: group._id } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    
    const total = totalExpenses[0]?.total || 0;
    
    // Calculate percentages
    const categoryData = categoryStats.map(stat => ({
        category: stat._id,
        amount: stat.totalAmount,
        count: stat.count,
        percentage: total > 0 ? Math.round((stat.totalAmount / total) * 100) : 0
    }));
    
    res.status(200).json({
        status: 'success',
        data: {
            categoryStats: categoryData,
            totalAmount: total,
            totalExpenses: categoryStats.reduce((sum, stat) => sum + stat.count, 0)
        }
    });
});
