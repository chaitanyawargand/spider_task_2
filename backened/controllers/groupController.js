const Group = require('./../modals/groupSchema');
const catchAsync = require('./../utils/catchAsynch');
const User = require('./../modals/userschema');
const AppError = require('../utils/appError');

exports.createGroup =catchAsync(async (req, res, next) => {
    const groupData = {
        name: req.body.name,
        type: req.body.type,
        members: [req.user.id],
        createdBy: req.user.id
    };
    console.log('group:',groupData)
    const newGroup = await Group.create(groupData);
    res.status(201).json({
        status: 'success',
        data: {
        group: newGroup
        }
    });
})
exports.getGroupById = catchAsync(async (req, res, next) => {
const group = await Group.findById(req.params.id) .populate('members', 'name email')
  .populate({ path: 'expenses', populate: {path: 'createdBy', select: 'name email' }
  });
  if (!group) {
    return next(new AppError('Group not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      group
    }
  });
});
exports.addMember= catchAsync(async(req,res,next)=>{
    const groupId= req.params.id;
    const friendId=req.body.friendId;
     if(!friendId) {return next(new AppError('Please provide a friend ID', 400));}
    const group = await Group.findById(groupId);
   if (!group) return next(new AppError('Group not found', 404));
   if(!group.createdBy.equals(req.user.id)) {
    return next(new AppError('Only the group creator can add members', 403));} 
    const currentUser= await User.findById(req.user.id).select('friends');
  const isFriend= currentUser.friends.some(friend=>friend.toString()===friendId);
  if (!isFriend) {return next(new AppError('This user is not your friend', 403));}
  const alreadyMember = group.members.includes(friendId);
  if (alreadyMember) {return next(new AppError('User is already a member of the group', 400));}
  group.members.push(friendId);
  await group.save();
  res.status(200).json({
    status: 'success',
    message: 'Friend added to group',
    data: {group}
  });
})
 exports.removeMember= catchAsync(async(req,res,next)=>{
    const groupId= req.params.id;
    const memberId=req.body.memberId;
     if(!memberId) {return next(new AppError('Please provide a member ID', 400));}
    const group = await Group.findById(groupId);
   if (!group) return next(new AppError('Group not found', 404));
   if(!group.createdBy.equals(req.user.id)) {
    return next(new AppError('Only the group creator can remove members', 403));} 
  const isMember = group.members.includes(memberId);
    if (!isMember) {return next(new AppError('User is not a member of the group', 400));}
    group.members = group.members.filter(member => member.toString() !== memberId);
    await group.save();
    res.status(200).json({
        status: 'success',
        message: 'Member removed from group',
        data: {group}
    });
 });
exports.getGroupMembers = catchAsync(async (req, res, next) => {
    const group=await Group.findById(req.params.id).populate('members','name email');
    if (!group) return next(new AppError('Group not found', 404));
    res.status(200).json({
        status: 'success',
        data: {
            members: group.members
        }
    });
})
exports.getMyGroups = catchAsync(async (req, res, next) => {
    console.log("User from request:", req.user);
    const groups = await Group.find({ members: req.user.id }).populate('members', 'name email');
    if (!groups || groups.length === 0){
        return next(new AppError('No groups found for this user', 404));
    }
    res.status(200).json({
        status: 'success',
        data: {
            groups
        }
    });
});
