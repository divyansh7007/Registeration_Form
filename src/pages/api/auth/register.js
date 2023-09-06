import db from '../dbConnection';
import User from '@/models/UserModel';

db();

const register = async (req, res) => {
  if (req.method === "POST") {
    const { userName, email, password, img } = req.body;

    if ( !userName || !email || !password ) {
      return res.status(400).json({ message: "Please Enter All Detils!" });
    }

    const findUser = await User.findOne({ email });
    if ( findUser ) {
      return res.status(401).json({ message: "User Already Exists!" })
    }

    
  }else {
    res.status(405).json({ message: "Sorry! This Method Is Not Valid..." })
  }
}

export default register;