const User = require('./../modals/userSchema');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.searchUsers = catchAsync(async (req, res, next) => {
    const { name } = req.query;
    if (!name) {
        return next(new AppError('Please provide a search term', 400));
    }
    
    const currentUser = await User.findById(req.user.id).select('friends');
    const users = await User.find({
        name: { $regex: name, $options: 'i' },
        _id: { $ne: req.user.id }
    }).select('name email _id');
    
    // Add status field to indicate friendship status
    const usersWithStatus = users.map(user => {
        const isFriend = currentUser.friends.some(friendId => friendId.toString() === user._id.toString());
        return {
            ...user.toObject(),
            status: isFriend ? 'friend' : 'not_friend'
        };
    });
    
    res.status(200).json({
        status: 'success',
        results: usersWithStatus.length,
        data: {
            users: usersWithStatus
        }
    });
});

exports.addFriend = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user.id);
    const friend = await User.findById(req.params.id);
    if (!friend) return next(new AppError('No user found with that ID', 404));
    if (user.friends.includes(friend._id)) {
        return next(new AppError('You are already friends with this user', 400));
    }
    user.friends.push(friend._id);
    friend.friends.push(user._id);
    await user.save();
    await friend.save();
    res.status(200).json({
        status: 'success',
        message: 'Friend added successfully',
        data: {
            user,
            friend
        }
    });
});

exports.removeFriend = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user.id);
    const friend = await User.findById(req.params.id);
    if (!friend) return next(new AppError('No user found with that ID', 404));
    if (!user.friends.includes(friend._id)) {
        return next(new AppError('You are not friends with this user', 400));
    }
    user.friends.pull(friend._id);
    friend.friends.pull(user._id);
    await user.save();
    await friend.save();
    res.status(200).json({
        status: 'success',
        message: 'Friend removed successfully',
        data: {
            user,
            friend
        }
    });
});