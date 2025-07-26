const mongoose = require('mongoose');
const expenseSchema = new mongoose.Schema({
    description: {
        type: String,
        required: [true, 'Expense description is required'],
    },
    category:{
        type: String,
        required: [true, 'Expense category is required'],
        enum: ['Food', 'Transportation', 'Accommodation', 'Entertainment', 'Shopping', 'Bills', 'Other']
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
    splitAmong: [{
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: true
        },
        amount: {
            type: Number,
            required: true
        }
    }],
    createdAt:{
        type: Date,
        default: Date.now
    },
});

const Expense = mongoose.model('Expense', expenseSchema);
module.exports = Expense;