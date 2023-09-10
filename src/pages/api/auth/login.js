import User from "@/models/UserModel";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import db from '../dbConnection';


db();

const login = async (req, res) => {
    if (req.method === "POST"){
    try {
        const { email, password } = req.body;
    if ( !email || !password ) {
        return res.status(400).json({ msg: "Please Provide Authentication Details!" });
    }

    const user = await User.findOne({ email });

    if (!user) {
        return res.status(404).json({ msg: "Not Any User Found!" })
    }

    const auth = await bcrypt.compare(password, user.password);

    if (!auth) {
        return res.status(400).json({msg: "Invalid Password"});
    }

    const data = {
        _id: user._id,
    }

    const token = jwt.sign(data, process.env.PRIVATE_KEY);

    return res.status(200).json({ token });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal Server Error!" })
    }
}else {
    return res.status(401).json({msg: 'This Method Is Not Allowed!'})
}
}

export default login;