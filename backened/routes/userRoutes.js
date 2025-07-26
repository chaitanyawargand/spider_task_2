const express = require('express');
const authController = require('./../controllers/authController');
const userController = require('./../controllers/userController');
const friendController = require('./../controllers/friendsController');
const router = express.Router();

router.post('/signup', authController.signUp);
router.post('/login', authController.login);
router.patch('/resetPassword/:token', authController.resetPassword);

// Protect all routes after this middleware
router.use(authController.protect);

router.patch('/updateMyPassword', authController.updatePassword);
router.get('/me', userController.getme);
router.patch('/updateMe', userController.uploadUserPhoto, userController.updateMe);
router.delete('/deleteMe', userController.deleteMe);

// Friends routes
router.get('/search', friendController.searchUsers);
router.get('/friends', friendController.getFriends);
router.get('/friend-requests', friendController.getFriendRequests);
router.post('/friend-request/:id', friendController.sendFriendRequest);
router.patch('/friend-request/:requestId', friendController.respondToFriendRequest);
router.delete('/friends/:id', friendController.removeFriend);
