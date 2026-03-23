import express from 'express';
import "dotenv/config";
import cors from 'cors';
import http from 'http';
import { connectDB } from './lib/db.js';
import userRouter from './routes/userRoutes.js';
import messageRouter from './routes/messageRoutes.js';
import { Server } from 'socket.io';


//Create express app and HTTP server

const app = express();
const server = http.createServer(app);

// Initialize Socket.io server
export const io = new Server(server, {
    cors: {origin: "*"}
})

//Store online users
export const onlineUsers = {}; //{userId: socketId}

// Handle Socket.io connections
io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId;
    console.log("User Connected", userId);

    if(userId){
        onlineUsers[userId] = socket.id;
    }

    // Emmit online users to all clients
    io.emit('onlineUsers', Object.keys(onlineUsers));

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log("user disconnected", userId);
        delete onlineUsers[userId];
        io.emit('onlineUsers', Object.keys(onlineUsers));
    })
    
});

//Middleware setup
app.use(cors());
app.use(express.json({limit: '4mb'}));


//Routes
app.use('/api/status',(req,res)=> res.send("Server is Active"));
app.use('/api/users', userRouter)
app.use('/api/messages', messageRouter)

// Connect to MongoDB
connectDB();

const port = process.env.PORT || 5000;

server.listen(port, ()=> console.log(`Server is running on port ${port}`));