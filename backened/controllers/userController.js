const User = require('./../modals/userSchema');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');
const APIFeatures = require('./../utils/apiFeatures');
const filterObj =(obj, ...allowedFields)=>{
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};
exports.getme = (User,options={select: '-__v -password -passwordConfirm -active'}, popOptions) =>
  catchAsync(async (req, res, next) => {
   let query=Model.findById(req.user.id);
    if (options.populate) {
      query=query.populate(options.populate);
    }
    if (options.select) {
      query=query.select(options.select);
   }
    const features=new APIFeatures(query, req.query).search();
    const doc=await features.query;
    res.status(200).json({
      status: 'success',
      data: {
        data: doc
      }
    });
  });
exports.updateMe =catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError('This route is not for password updates. Please use /updateMyPassword.',400));
  }
  const filteredBody = filterObj(req.body, 'name', 'email');
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




