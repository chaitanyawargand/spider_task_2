const User = require('./../modals/userSchema');
const catchAsync = require('./../utils/catchAsynch');
const AppError = require('./../utils/appError');

const filterObj =(obj, ...allowedFields)=>{
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getme = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user.id).select('-password -active');
    res.status(200).json({
      status: 'success',
      data: {
        user
      }
    });
});

exports.updateMe =catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError('This route is not for password updates. Please use /updateMyPassword.',400));
  }
  const filteredBody = filterObj(req.body, 'name', 'email', 'photo');
  const updatedUser = await User.findByIdAndUpdate(req.user.id,filteredBody,{
    new: true,
    runValidators: true
  });
  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id,{active: false });
  res.status(204).json({
    status: 'success',
    data: null
  });
});

exports.uploadUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) {
    return next(new AppError('Please upload a photo', 400));
  }
  
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    { photo: req.file.filename },
    { new: true, runValidators: true }
  ).select('-password -active');
  
  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });
});




