const express = require('express');
const groupController = require('./../controllers/groupController');
const authController = require('./../controllers/authController');

const router = express.Router();

// Protect all routes after this middleware
router.use(authController.protect);

router.route('/')
    .get(groupController.getMyGroups)
    .post(groupController.createGroup);

router.route('/:id')
    .delete(groupController.deleteGroup);

router.route('/:id/members')
    .get(groupController.getGroupMembers)
    .post(groupController.addMember)
    .delete(groupController.removeMember);

module.exports = router;