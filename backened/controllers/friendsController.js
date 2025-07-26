const User = require('./../modals/userschema');
const catchAsync = require('./../utils/catchAsynch');
const AppError = require('./../utils/appError');
const APIFeatures = require('./../utils/apiFeatures');

exports.searchUsers = catchAsync(async (req, res, next) => {
    const { search } = req.query;
    
    if (!search) {
        return next(new AppError('Please provide a search term', 400));
    }

    const users = await User.find({
        $and: [
            {
                $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } }
                ]
            },
            { _id: { $ne: req.user.id } }, // Exclude current user
            { active: { $ne: false } }
        ]
    }).select('name email profilePicture');

    res.status(200).json({
        status: 'success',
        results: users.length,
        data: {
            users
        }
    });
});

exports.sendFriendRequest = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user.id);
    const targetUser = await User.findById(req.params.id);
    
    if (!targetUser) {
        return next(new AppError('No user found with that ID', 404));
    }
    
    if (user.friends.includes(targetUser._id)) {
        return next(new AppError('You are already friends with this user', 400));
    }
    
    // Check if friend request already exists
    const existingRequest = targetUser.friendRequests.find(
        request => request.from.toString() === req.user.id && request.status === 'pending'
    );
    
    if (existingRequest) {
        return next(new AppError('Friend request already sent', 400));
    }
    
    targetUser.friendRequests.push({
        from: req.user.id,
        status: 'pending'
    });
    
    await targetUser.save();
    
    res.status(200).json({
        status: 'success',
        message: 'Friend request sent successfully'
    });
});

exports.respondToFriendRequest = catchAsync(async (req, res, next) => {
    const { response } = req.body; // 'accepted' or 'rejected'
    const requestId = req.params.requestId;
    
    const user = await User.findById(req.user.id);
    const friendRequest = user.friendRequests.id(requestId);
    
    if (!friendRequest) {
        return next(new AppError('Friend request not found', 404));
    }
    
    friendRequest.status = response;
    
    if (response === 'accepted') {
        const friendUser = await User.findById(friendRequest.from);
        
        // Add each other as friends
        user.friends.push(friendRequest.from);
        friendUser.friends.push(user._id);
        
        await friendUser.save();
    }
    
    // Remove the friend request after processing
    user.friendRequests.pull(requestId);
    await user.save();
    
    res.status(200).json({
        status: 'success',
        message: `Friend request ${response}`,
        data: {
            user
        }
    });
});

exports.getFriendRequests = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user.id)
        .populate('friendRequests.from', 'name email profilePicture');
    
    const pendingRequests = user.friendRequests.filter(req => req.status === 'pending');
    
    res.status(200).json({
        status: 'success',
        results: pendingRequests.length,
        data: {
            friendRequests: pendingRequests
        }
    });
});

exports.getFriends = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user.id)
        .populate('friends', 'name email profilePicture');
    
    res.status(200).json({
        status: 'success',
        results: user.friends.length,
        data: {
            friends: user.friends
        }
    });
});

exports.removeFriend = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user.id);
    const friend = await User.findById(req.params.id);
    
    if (!friend) {
        return next(new AppError('No user found with that ID', 404));
    }
    
    if (!user.friends.includes(friend._id)) {
        return next(new AppError('You are not friends with this user', 400));
    }
    
    user.friends.pull(friend._id);
    friend.friends.pull(user._id);
    
    await user.save();
    await friend.save();
    
    res.status(200).json({
        status: 'success',
        message: 'Friend removed successfully'
    });
});