const User= require('./../modals/userSchema');
const catchAsync = require('./../utils/catchAsynch');
const AppError = require('./../utils/appError');

exports.searchUsers=catchAsync(async (req, res, next) => {
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
            { _id: { $ne: req.user.id } } // Exclude current user
        ]
    }).select('name email photo');
    
    res.status(200).json({
        status: 'success',
        results: users.length,
        data: {
            users
        }
    });
})

exports.addFriend= catchAsync(async(req,res,next)=>{
    const user=await User.findById(req.user.id); 
    const friend= await User.findById(req.params.id);
    if(!friend) return next(new AppError('No user found with that ID', 404));
    if(user.friends.includes(friend._id)){
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
})

exports.removeFriend= catchAsync(async(req,res,next)=>{
    const user=await User.findById(req.user.id); 
    const friend=await User.findById(req.params.id);
    if(!friend) return next(new AppError('No user found with that ID', 404));
    if(!user.friends.includes(friend._id)){
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
})

exports.getFriends = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user.id).populate('friends', 'name email photo');
    res.status(200).json({
        status: 'success',
        data: {
            friends: user.friends
        }
    });
});