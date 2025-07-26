const Group = require('../modals/groupSchema');
const User = require('../modals/userschema');
const Expense = require('../modals/expenseSchema');
const catchAsync = require('../utils/catchAsynch');
const AppError = require('../utils/appError');

exports.createGroup = catchAsync(async (req, res, next) => {
    const groupData = {
        name: req.body.name,
        description: req.body.description,
        members: [req.user.id],
        createdBy: req.user.id
    };
    
    const newGroup = await Group.create(groupData);
    await newGroup.populate('members', 'name email profilePicture');
    await newGroup.populate('createdBy', 'name email profilePicture');
    
    res.status(201).json({
        status: 'success',
        data: {
            group: newGroup
        }
    });
});

exports.addMember = catchAsync(async (req, res, next) => {
    const groupId = req.params.id;
    const friendId = req.body.friendId;
    
    if (!friendId) {
        return next(new AppError('Please provide a friend ID', 400));
    }
    
    const group = await Group.findById(groupId);
    if (!group) {
        return next(new AppError('Group not found', 404));
    }
    
    if (!group.createdBy.equals(req.user.id)) {
        return next(new AppError('Only the group creator can add members', 403));
    }
    
    const currentUser = await User.findById(req.user.id).select('friends');
    const isFriend = currentUser.friends.some(friend => friend.toString() === friendId);
    
    if (!isFriend) {
        return next(new AppError('This user is not your friend', 403));
    }
    
    const alreadyMember = group.members.includes(friendId);
    if (alreadyMember) {
        return next(new AppError('User is already a member of the group', 400));
    }
    
    group.members.push(friendId);
    await group.save();
    await group.populate('members', 'name email profilePicture');
    
    res.status(200).json({
        status: 'success',
        message: 'Friend added to group',
        data: {
            group
        }
    });
});

exports.removeMember = catchAsync(async (req, res, next) => {
    const groupId = req.params.id;
    const memberId = req.body.memberId;
    
    if (!memberId) {
        return next(new AppError('Please provide a member ID', 400));
    }
    
    const group = await Group.findById(groupId);
    if (!group) {
        return next(new AppError('Group not found', 404));
    }
    
    if (!group.createdBy.equals(req.user.id)) {
        return next(new AppError('Only the group creator can remove members', 403));
    }
    
    const isMember = group.members.includes(memberId);
    if (!isMember) {
        return next(new AppError('User is not a member of the group', 400));
    }
    
    group.members = group.members.filter(member => member.toString() !== memberId);
    await group.save();
    await group.populate('members', 'name email profilePicture');
    
    res.status(200).json({
        status: 'success',
        message: 'Member removed from group',
        data: {
            group
        }
    });
});

exports.getGroupMembers = catchAsync(async (req, res, next) => {
    const group = await Group.findById(req.params.id).populate('members', 'name email profilePicture');
    
    if (!group) {
        return next(new AppError('Group not found', 404));
    }
    
    // Check if user is a member of the group
    const isMember = group.members.some(member => member._id.toString() === req.user.id);
    if (!isMember) {
        return next(new AppError('You are not a member of this group', 403));
    }
    
    res.status(200).json({
        status: 'success',
        data: {
            members: group.members
        }
    });
});

exports.getMyGroups = catchAsync(async (req, res, next) => {
    const groups = await Group.find({ members: req.user.id })
        .populate('members', 'name email profilePicture')
        .populate('createdBy', 'name email profilePicture')
        .sort('-createdAt');
    
    res.status(200).json({
        status: 'success',
        results: groups.length,
        data: {
            groups
        }
    });
});

exports.getGroup = catchAsync(async (req, res, next) => {
    const group = await Group.findById(req.params.id)
        .populate('members', 'name email profilePicture')
        .populate('createdBy', 'name email profilePicture');
    
    if (!group) {
        return next(new AppError('Group not found', 404));
    }
    
    // Check if user is a member of the group
    const isMember = group.members.some(member => member._id.toString() === req.user.id);
    if (!isMember) {
        return next(new AppError('You are not a member of this group', 403));
    }
    
    res.status(200).json({
        status: 'success',
        data: {
            group
        }
    });
});

exports.deleteGroup = catchAsync(async (req, res, next) => {
    const group = await Group.findById(req.params.id);
    
    if (!group) {
        return next(new AppError('Group not found', 404));
    }
    
    if (!group.createdBy.equals(req.user.id)) {
        return next(new AppError('Only the group creator can delete the group', 403));
    }
    
    // Delete all expenses related to this group
    await Expense.deleteMany({ group: req.params.id });
    
    // Delete the group
    await Group.findByIdAndDelete(req.params.id);
    
    res.status(204).json({
        status: 'success',
        data: null
    });
});

exports.getGroupExpenses = catchAsync(async (req, res, next) => {
    const group = await Group.findById(req.params.id);
    
    if (!group) {
        return next(new AppError('Group not found', 404));
    }
    
    // Check if user is a member of the group
    const isMember = group.members.some(member => member._id.toString() === req.user.id);
    if (!isMember) {
        return next(new AppError('You are not a member of this group', 403));
    }
    
    const expenses = await Expense.find({ group: req.params.id })
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

