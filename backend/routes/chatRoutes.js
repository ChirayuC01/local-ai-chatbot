const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

router.post('/chat', chatController.createChat);
router.get('/chats', chatController.getChats);
router.post('/chat/:chatId/message', chatController.sendMessage);
router.post('/chat/:chatId/stop', chatController.stopMessage);
router.get('/chat/:chatId', chatController.getChatHistory);
router.patch('/chat/:chatId/title', chatController.updateChatTitle);

module.exports = router;
