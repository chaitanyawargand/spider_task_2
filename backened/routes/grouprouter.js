const express = require('express');
const groupController = require('../controllers/groupController');
const authController = require('../controllers/authController');
const router = express.Router();
const expenseRoutes = require('./expenseRoutes');


router.use(authController.protect);

router.use('/:groupId/expenses', expenseRoutes); 
router.get('/my-groups', groupController.getMyGroups); 
router.get('/:id', groupController.getGroupById);    
router.post('/create', groupController.createGroup);
router.post('/:id/add-member', groupController.addMember);
router.post('/:id/remove-member', groupController.removeMember);
router.get('/:id/members', groupController.getGroupMembers);

module.exports = router;
