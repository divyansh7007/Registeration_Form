import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const UserSchema = new Schema({
  userName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  img: { type: String, default: 'https://e7.pngegg.com/pngimages/178/595/png-clipart-user-profile-computer-icons-login-user-avatars-monochrome-black.png'},
  createdOn: { type: Date, default: Date.now },
});

const User = await model('User', UserSchema);

export default User;