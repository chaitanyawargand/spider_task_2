const Expense= require('./../modals/expenseSchema');
const catchAsync = require('./../utils/catchAsynch');
const AppError = require('./../utils/appError');
const Group = require('./../modals/groupSchema');
const User = require('./../modals/userSchema');

exports.groupAddExpense= catchAsync(async (req, res, next) => {
    const {amount, category} = req.body;
    const group=await Group.findById(req.params.id);
    if(!group) return next(new AppError('Group not found', 404));
     if(!group.members.includes(req.user.id)) {
        return next(new AppError('You are not a member of this group', 403));}
    const newExpense=await Expense.create({
        group: req.params.id,
        createdBy: req.user.id,
        amount,
        category
    });   
      res.status(201).json({
       status: 'success',
       data: {
           expense: newExpense
       }
    });
})

exports.groupDeleteExpense=catchAsync(async(req,res,next)=>{
    const exp= await Expense.findById(req.params.id);
    if(!exp) return next(new AppError('Expense not found', 404));
    const group = await Group.findById(exp.group);
    if(!group.members.includes(req.user.id)) {
        return next(new AppError('You are not a member of this group', 403));}
    if(!exp.createdBy.equals(req.user.id)) {
        return next(new AppError('You can only delete your own expenses', 403));}
    await Expense.findByIdAndDelete(req.params.id);
    res.status(204).json({
        status: 'success',
        data: null
    });
})

exports.getGroupExpenses= catchAsync(async (req, res, next)=>{
   const group= await Group.findById(req.params.id);
   if(!group) return next(new AppError('Group not found', 404));
   if(!group.members.includes(req.user.id)) {
       return next(new AppError('You are not a member of this group', 403));}
   const expenses=await Expense.find({group: req.params.id}).populate('createdBy', 'name');
    res.status(200).json({
         status: 'success',
         results: expenses.length,
         data: {
             expenses
         }      
    });
});

exports.getGroupBalances=catchAsync(async(req,res,next)=>{
    const group= await Group.findById(req.params.id);
    if(!group) return next(new AppError('Group not found', 404));
    if(!group.members.includes(req.user.id)) {
    return next(new AppError('You are not a member of this group', 403));}
    const members=group.members.map(m => m.toString());
    const expenses= await Expense.find({group:req.params.id});
    const users= await User.find({ _id: { $in: members } }).select('name');
    const userMap={};
    users.forEach(user=>{
    userMap[user._id.toString()]=user.name;
   });
   // initial balances
    const balances={};
    members.forEach(payer => {
        balances[payer] = {};
        members.forEach(receiver =>{
        if(payer !== receiver) balances[payer][receiver] = 0;
        })
    });
    // split expenses
    for(const exp of expenses) {
     const splitAmount = exp.amount / group.members.length;
     members.forEach(member=>{
      if(member!==exp.createdBy.toString()) balances[member][exp.createdBy] += splitAmount;
     })
    }
    // calculate net for current user
    const youOwe=[];
    const youAreOwed=[];
    for(const otherId of members){
        if(otherId===req.user.id) continue;
     const owe=balances[req.user.id][otherId]||0;
     const owed= balances[otherId][req.user.id]||0;
     const net=owe-owed;
     if (net>0)youOwe.push({ to:userMap[otherId], amount: Math.round(net * 100) / 100 });
    else if (net<0)youAreOwed.push({from:userMap[otherId],amount: Math.round(-net * 100) / 100});}
    res.status(200).json({
        status: 'success',
        data: {
            balances: {
                youOwe,
                youAreOwed
            }
        }
    });
})

exports.getExpensesByCategory = catchAsync(async (req, res, next) => {
    const group = await Group.findById(req.params.id);
    if (!group) return next(new AppError('Group not found', 404));
    if (!group.members.includes(req.user.id)) {
        return next(new AppError('You are not a member of this group', 403));
    }
    
    const expenses = await Expense.find({ group: req.params.id });
    const categoryData = {};
    
    expenses.forEach(expense => {
        if (categoryData[expense.category]) {
            categoryData[expense.category] += expense.amount;
        } else {
            categoryData[expense.category] = expense.amount;
        }
    });
    
    res.status(200).json({
        status: 'success',
        data: {
            categoryData
        }
    });
});
