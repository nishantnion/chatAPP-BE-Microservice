const express = require('express');
const router = express.Router();
const groupController = require('../controllers/groupController');




router.put('/:groupId', groupController.updateGroup);
router.get('/:groupId/messages', groupController.getGroupMessages);
router.post('/create/:id', groupController.createGroup);
router.put('/profile/:groupId' , groupController.updateGroupProfilePicture);
router.get('/user/:userId/', groupController.getGroupsForUser);

module.exports = router;
