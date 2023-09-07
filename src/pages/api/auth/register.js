// Imports from the directory exists in projects
import db from '../dbConnection';
import User from '@/models/UserModel';

// Imports from the downloaded packages
import webToken from 'jsonwebtoken';
import bcrypt from 'bcrypt';



db();

const register = async (req, res) => {
  if (req.method === "POST") {
    const { userName, email, password, img } = JSON.parse(req.body);

    if (!userName) {
      return res.status(400).json({ message: "You Have not entered Email Id. Please Reload Your Page And do Verifications!" });
    }

    if (!userName || !password) {
      return res.status(400).json({ message: "Please Enter All Detils!" });
    }

    try {
      const findUser = await User.findOne({ email });
      if (findUser) {
        return res.status(401).json({ message: "User Already Exists!", status: 401 })
      } else {

        const salt = await bcrypt.genSalt(10);
        const pass = await bcrypt.hash(password, salt);

        const newUser = await User({ userName, email, password: pass, img });
        newUser.save();

        const tokenData = {
          _id: newUser._id,
        }

        const token = webToken.sign(tokenData, process.env.PRIVATE_KEY);
        return res.status(201).json({ message: "User Created Successfully", token });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error Occur!" });
    }

  } else {
    res.status(405).json({ message: "Sorry! This Method Is Not Valid..." })
  }
}

export default register;