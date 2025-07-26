const express = require('express');
const groupController = require('./../controllers/groupController');
const authController = require('./../controllers/authController');
const router = express.Router();

// Protect all routes
router.use(authController.protect);

router.route('/')
    .get(groupController.getMyGroups)
    .post(groupController.createGroup);

router.route('/:id')
    .get(groupController.getGroup)
    .delete(groupController.deleteGroup);

router.patch('/:id/add-member', groupController.addMember);
router.patch('/:id/remove-member', groupController.removeMember);
router.get('/:id/members', groupController.getGroupMembers);
router.get('/:id/expenses', groupController.getGroupExpenses);

module.exports = router;