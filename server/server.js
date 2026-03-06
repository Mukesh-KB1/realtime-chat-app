import express from 'express';
import "dotenv/config";
import cors from 'cors';
import http from 'http';
import { connect } from 'http2';
import { connectDB } from './lib/db.js';


//Create express app and HTTP server

const app = express();
const server = http.createServer(app);

//Middleware setup
app.use(cors());
app.use(express.json({limit: '4mb'}));


//Routes
app.use('/api/status',(req,res)=> res.send("Server is Active"));

// Connect to MongoDB
connectDB();

const port = process.env.PORT || 5000;

server.listen(port, ()=> console.log(`Server is running on port ${port}`));