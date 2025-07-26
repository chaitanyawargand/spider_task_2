const express = require('express');
const authController = require('./../controllers/authController');
const userController = require('./../controllers/userController');
const friendController = require('./../controllers/friendsController');
const router = express.Router();

router.post('/signup', authController.signUp);
router.post('/login', authController.login);
router.patch('/resetPassword/:token', authController.resetPassword);

// router.post('/forgotPassword', authController.forgotPassword);

// Protect all routes after this middleware
router.use(authController.protect);

router.patch('/updateMyPassword', authController.updatePassword);
router.get('/me', userController.getme);
router.patch('/updateMe', userController.updateMe);
router.delete('/deleteMe', userController.deleteMe);

// Friend routes
router.get('/friend/search', friendController.searchUsers);
router.post('/friend/:id', friendController.addFriend);
router.delete('/friend/:id', friendController.removeFriend);

module.exports = router;
