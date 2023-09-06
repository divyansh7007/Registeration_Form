import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const UserSchema = new Schema({
  userName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  img: { type: String, default: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7wYBfBOGi5_fobHrIBn9huM6pPXWQzFIGgrL-p6Ek&s'},
  createdOn: { type: Date, default: Date.now },
});

const User = await model('User', UserSchema);

export default User;