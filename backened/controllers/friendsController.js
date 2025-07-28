const User= require('./../modals/userschema');
const catchAsync = require('./../utils/catchAsynch');
const AppError = require('./../utils/appError');

exports.searchUsers = catchAsync(async (req, res, next) => {
  const keyword = req.query.name || "";
  const users = await User.find({
    name: { $regex: keyword, $options: "i" },
    _id: { $ne: req.user.id },
  });
  const currentUser = await User.findById(req.user.id);
  const processed = users.map((user) => {
    let status = "not_friend";

    if (currentUser.friends.includes(user._id)) {
      status = "friend";
    } else if (currentUser.friendRequestsReceived.includes(user._id)) {
      status = "request_received";
    } else if (currentUser.friendRequestsSent.includes(user._id)) {
      status = "request_sent";
    }
    return {
      _id: user._id,
      name: user.name,
      status,
    };
  });
  res.status(200).json({
    status: "success",
    data: {
      users: processed,
    },
  });
});

exports.removeFriend= catchAsync(async(req,res,next)=>{
    const user=await User.findById(req.user.id); 
    const friend=await User.findById(req.params.id);
    if(!friend) return next(new AppError('No user found with that ID', 404));
    if(!user.friends.includes(friend._id)){
     return next(new AppError('You are not friends with this user', 400));
}
    user.friends.pull(friend._id);
    friend.friends.pull(user._id);
    await user.save({ validateBeforeSave: false });
    await friend.save({ validateBeforeSave: false });
    res.status(200).json({
        status: 'success',
        message: 'Friend removed successfully',
        data: {
            user,
            friend
        }
    });
})
exports.sendFriendRequest=catchAsync(async(req,res,next)=>{
    const user= await User.findById(req.user.id);
    const friend= await User.findById(req.params.id);
    if(!friend) return next(new AppError('No user found', 404));
    if(friend.friendRequestsReceived.includes(user._id)) return (new AppError('already request sent',400));
    if(friend.friends.includes(user._id)) return next(new AppError('Already friends', 400));
     user.friendRequestsSent.push(friend._id);
     friend.friendRequestsReceived.push(user._id);
    await friend.save({ validateBeforeSave: false });
    await user.save({ validateBeforeSave: false });
    res.status(200).json({ 
        status: 'success', 
        message: 'Request sent' 
    });
})
exports.acceptFriendRequest=catchAsync(async (req,res,next)=>{
  const user=await User.findById(req.user.id);
  const requester=await User.findById(req.params.id);
  if(!user.friendRequestsReceived.includes(requester._id)) {
    return next(new AppError('No such request', 400));}
  user.friendRequestsReceived.pull(requester._id);
  requester.friendRequestsSent.pull(user._id);
  user.friends.push(requester._id);
  requester.friends.push(user._id);
  await user.save({ validateBeforeSave: false });
  await requester.save({ validateBeforeSave: false });
  res.status(200).json({ 
    status: 'success', 
    message: 'Friend request accepted' 
});
});
exports.rejectFriendRequest=catchAsync(async(req,res,next)=>{
  const user = await User.findById(req.user.id); 
  const requester = await User.findById(req.params.id);
  if (!user.friendRequestsReceived.includes(requester._id))
    return next(new AppError('No such request', 400));
  user.friendRequestsReceived.pull(requester._id);
  requester.friendRequestsSent.pull(user._id);
  await user.save({ validateBeforeSave: false });
  await requester.save({ validateBeforeSave: false });
  res.status(200).json({
    status: 'success',
    message: 'Friend request rejected',
  });
})

exports.getMyFriends = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).populate('friends', 'name _id');
  if (!user) {
    return next(new AppError("user not found",404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      friends: user.friends,
    },
  });
});
