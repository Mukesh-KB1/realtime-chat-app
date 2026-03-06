import jwt from 'jsonwebtoken'

//Function to generate JWT token
export const generateToken = (userId) => {
    return jwt.sign({userId}, process.env.JWT_SECRET, {expiresIn: "7d"});
}