import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstName : String,
    lastName: String,
    businessName:String,
    email: String,
    password: String,
  });
  
  const UserModel = mongoose.model('users', userSchema);

  export default UserModel;