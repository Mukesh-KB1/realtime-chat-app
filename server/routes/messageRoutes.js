import express from 'express';
import { getMessages, getUsersForChat, markMessageAsSeen } from '../controllers/messageController.js';
import { protectRoute } from '../middlewares/authMiddleware.js';

const messageRouter = express.Router();

messageRouter.get('/users', protectRoute, getUsersForChat);
messageRouter.get('/:id', protectRoute, getMessages);
messageRouter.put('/mark/:id', protectRoute, markMessageAsSeen);

export default messageRouter;