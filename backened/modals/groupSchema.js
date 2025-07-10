const mongoose = require('mongoose');
const groupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Group name is required'],
        unique: true
    },
    description: {
        type: String,},
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
    }
});

const Group = mongoose.model('Group', groupSchema);
module.exports = Group;