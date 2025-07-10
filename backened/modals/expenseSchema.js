const mongoose = require('mongoose');
const expenseSchema = new mongoose.Schema({
    category:{
        type: String,
        required: [true, 'Expense category is required'],
    },
    amount: {
        type: Number,
        required: [true, 'Expense amount is required'],
    },
    group:{
        type: mongoose.Schema.ObjectId,
        ref: 'Group',
        required:true,
    },
    createdBy:{
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required:true,
    },
    createdAt:{
        type: Date,
        default: Date.now
    },
});

const Expense = mongoose.model('Expense', expenseSchema);
module.exports = Expense;