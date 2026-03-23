import express from 'express';
import { getMessages, getUsersForChat, markMessageAsSeen, sendMessage } from '../controllers/messageController.js';
import { protectRoute } from '../middleware/auth.js';

const messageRouter = express.Router();

messageRouter.get('/users', protectRoute, getUsersForChat);
messageRouter.get('/:id', protectRoute, getMessages);
messageRouter.put('/mark/:id', protectRoute, markMessageAsSeen);
messageRouter.post('/send/:id', protectRoute, sendMessage);

export default messageRouter;