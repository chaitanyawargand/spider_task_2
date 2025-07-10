const User= require('./../modals/userschema');
const catchAsync = require('./../utils/catchAsynch');
const AppError = require('./../utils/appError');

exports.searchUsers=catchAsync(async (req, res, next) => {
    const features = new APIFeatures(User.find(), req.query).search();
    const users= await features.query.select('-__v -password -passwordConfirm -active');
    if(!users||users.length===0){
        return next(new AppError('No users found with that search term', 404));
    }
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