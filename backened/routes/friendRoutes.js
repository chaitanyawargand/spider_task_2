const express = require('express');
const friendsController = require('./../controllers/friendsController');
const authController= require('./../controllers/authController');
const router= express.Router();
router.use(authController.protect);

router.post('/send-request/:id',friendsController.sendFriendRequest);
router.post('/accept-request/:id',friendsController.acceptFriendRequest);
router.post('/reject-request/:id',friendsController.rejectFriendRequest);
router.get('/search',friendsController.searchUsers);
router.delete('/remove-friend/:id',friendsController.removeFriend);
router.get('/Myfriends',friendsController.getMyFriends)
module.exports=router;