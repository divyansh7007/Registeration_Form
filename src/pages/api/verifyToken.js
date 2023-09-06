import User from '@/models/UserModel';
import bcrypt from 'bcrypt';
import db from './dbConnection'
import jwt from 'jsonwebtoken'

// Assuming db() establishes the database connection. It should be done once in your application, not per request.
// Example usage: import db from "../dbConnection"; and then call db() to establish the connection.

db();

const verifyToken = async (req, res) => {
    if (req.method === "POST") {
        const { token } = req.headers;

        if (!token) {
            return res.status(404).json({ message: "Token Not Found!" });
        } else {
            try {
                const verification = jwt.verify(token, process.env.PRIVATE_KEY);
                console.log(verification);
                const user = await User.findById(verification._id);
                console.log(user);
                if (user) {
                    return res.json({ message: "User exists!" })
                } else {
                    return res.status(400).json({ message: "Token was Incorrect" })
                }
            } catch (error) {
                console.log(error);
                res.status(400).json({ message: "Invalid Token!" })
            }
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
};

export default verifyToken;
