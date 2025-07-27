const mongoose = require('mongoose');
const Expense = require('./expenseSchema');
const groupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Group name is required'],
        unique: true
    },
    type:{
    type: String,
    enum: ['Travel','Home','Couple','Other']
    },
    createdBy:{
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    members:[{
        type: mongoose.Schema.ObjectId,
        ref: 'User',
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    expenses: [{
    type:mongoose.Schema.Types.ObjectId,
    ref: 'Expense',
  }]
});

const Group = mongoose.model('Group', groupSchema);
module.exports = Group;