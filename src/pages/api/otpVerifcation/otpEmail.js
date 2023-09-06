import NodeMailer from 'nodemailer';
import { randomInt } from 'crypto';


const Transporter = NodeMailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.USER_EMAIL,
    pass: process.env.USER_EMAIL_PASS_KEY
  }
});

let otp = 0;

const otpVerify = async (req, res) => {
  if (req.method === "POST") {
    const OtpCode = randomInt(111111, 999999);
    otp = OtpCode;
    const { email } = req.body
    try {
      const info = await Transporter.sendMail({
        from: process.env.USER_EMAIL,
        to: email,
        subject: `OTP VERIFICATIONj!`,
        text: `Your OTP code is ${OtpCode}`,
        html: `<h1>Here is your Otp</h1><br><span>Your Otp is: <b>${OtpCode}</b></span>`
      });
      return res.status(200).json({ msg: "Otp Sent Successfully!" })
    } catch (error) {
      if (error.message === "No recipients defined") {
        return res.status(400).json({ error: 'Please provide email!' })
      }
      console.error(error);
      res.status(500).json({ error: "error occur" })
    }
    res.send();
  } else if (req.method === "PATCH") {
    const { otpCode } = req.body;
    if (parseInt(otpCode) === otp) {
      return res.json({ auth: true, msg: "Verification is done!" });
    } else {
      return res.status(400).json({ auth: false, msg: "OTP is incorrect!" });
    }
  } else {
    return res.status(400).json({ error: "No such Method is Allow!" })
  }
}

export default otpVerify;