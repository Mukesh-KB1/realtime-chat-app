import { generateToken } from "../lib/util.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";


//Signup a new User
export const signUp = async (req, res) => {
    const {email, fullName, password, bio} = req.body;

    try {
        if(!email || !fullName || !password || !bio) {
            return res.json({success: false, message: "Missing required fields"});
        }

        const user = await User.findOne({email});

        if(user){
            return res.json({success: false, message: "User already exists"});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User.create({
            email,
            fullName,
            password: hashedPassword,
            bio
        })

        const token = generateToken(newUser._id);

        res.json({success: true, userData: newUser, message: "User created successfully", token});

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: "Error creating user", error: error.message});
    }
}

//Login an existing user
export const login = async (req, res) => {
    try {
    const { email, password } = req.body;

    const userData = await User.findOne({email})

    const isPasswordCorrect = await bcrypt.compare(password, userData.password);

    if(!isPasswordCorrect) {
        return res.json({success: false, message: "Invalid credentials"});
    }

    const token = generateToken(userData._id);

    res.json({success: true, userData, message: "Login successful", token});
        
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: "Error logging in user", error: error.message});
    }
}


//to check if the user is authenticated and get user data
export const checkAuth = async (req, res) => {
    res.json({success: true, userData: req.user});
}



//Controller to update user profile details

export const updateProfile = async (req, res) => {
    try {

        const { profilePic, bio, fullName } = req.body;

        const userId = req.user._id;

        let updatedUser;

        if(!profilePic){
            updatedUser = await User.findByIdAndUpdate(userId, {bio, fullName}, {new: true});
        }

        else{
            const upload = await cloudinary.uploader.upload(profilePic);

            updatedUser = await User.findByIdAndUpdate(userId, {bio, fullName, profilePic: upload.secure_url}, {new: true});
        }

        res.json({success: true, user: updatedUser, message: "Profile updated successfully"});

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: "Error updating profile", error: error.message});
    }
}