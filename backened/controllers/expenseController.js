const expense= require('./../models/expenseModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const Group = require('./../models/groupModel');
const User = require('./../models/userModel');
exports.groupAddExpense= catchAsync(async (req, res, next) => {
    const group=await Group.findById(req.params.id);
    if(!group) return next(new AppError('Group not found', 404));
     if(!group.members.includes(req.user.id)) {
        return next(new AppError('You are not a member of this group', 403))}
    const newExpense=await expense.create({group: req.params.id,createdBy: req.user.id,amount,category});   
      res.status(201).json({
       status: 'success',
       expense: newExpense
    });
})
exports.groupDeleteExpense=catchAsync(async(req,res,next)=>{
    const exp= await expense.findById(req.params.id);
    if(!exp) return next(new AppError('Expense not found', 404));
    const group = await Group.findById(exp.group);
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
   const group= await Group.findById(req.params.id);
   if(!group) return next(new AppError('Group not found', 404));
   const expenses=await expense.find({group: req.params.id});
    if(!expenses || expenses.length===0) {
    return next(new AppError('No expenses found for this group', 404));
    }
    res.status(200).json({
         status: 'success',
         results: expenses.length,
        expenses      
})
});
exports.getGroupBalances=catchAsync(async(req,res,next)=>{
    const group= await Group.findById(req.params.id);
    if(!group) return next(new AppError('Group not found', 404));
    if(!group.members.includes(req.user.id)) {
    return next(new AppError('You are not a member of this group', 403))}
    const members=group.members.map(m => m.toString());
    const expenses= await expense.find({group:req.params.id})
    const users= await User.find({ _id: { $in: members } }).select('name');
    const userMap={};
    users.forEach(user=>{
    userMap[user._id.toString()]=user.name;
   });
   // intial balances
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
     if (net>0)youOwe.push({ to:userMap[otherId], amount: Math.round(net) });
    else if (net<0)youAreOwed.push({from:userMap[otherId],amount: Math.round(-net)})}
    res.status(200).json({
        status: 'success',
        balances: {
            youOwe,
            youAreOwed
        }
    });
})
