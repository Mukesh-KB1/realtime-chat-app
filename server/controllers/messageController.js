import User from "../models/User.js";
import Message from "../models/Message.js";
import cloudinary from 'cloudinary.js';

// Get all Users except the current loggedin user

export const getUsersForChat = async (req, res) => {
    try {
        
        const userId = req.user._id;

        const users = await User.find({_id: {$ne: userId}}).select("-password");

        //Count number of unread messages for each user
        const unseenMessages = {}
        const promises = users.map( async (user) => {
            const messages = await Message.find({senderId: user._id, receiverId: userId, seen: false})
            if(messages.length > 0){
                unseenMessages[user._id] = messages.length;
            }
        } )
        await Promise.all(promises);

        res.json({success: true, users, unseenMessages});
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message});
    }
}


// Get all messages for selected user

export const getMessages = async (req, res) => {
    try {
        const { id: selectedUserId } = req.params;
        const myUserId = req.user._id;
        
        const messages = await Message.find({
            $or: [
                {senderId: myUserId, receiverId: selectedUserId},
                {senderId: selectedUserId, receiverId: myUserId}
            ]
        })
        await Message.updateMany({senderId: selectedUserId, receiverId: myUserId}, {seen: true});
        res.json({success: true, messages});
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message});
    }
}

//api to mark messages as seen using message id

export const markMessageAsSeen = async (req, res) => {
    try {
        const { id } = req.params;
        await Message.findByIdAndUpdate(id, {seen: true});
        res.json({success: true, message: "Message marked as seen"});
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message});
    }
}


//Send messages to selected user

export const sendMessage = async (req,res)=> {
    try {
        const { text, image } = req.body;
        const receiverId = req.params.id;
        const senderId = req.user._id;

        let imageUrl;
        if(image){
            const uploadResponse = await cloudinary.uploader.upload(image)
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = await Message.create({
            senderId,
            receiverId,
            text,
            image: imageUrl
        });

        res.json({success: true, message: "Message sent successfully", newMessage});
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message});
    }
}