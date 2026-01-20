import mongoose from "mongoose";


const authSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: false,
  },
  picture:{
    type: String,
    required: true,
  },
  forgetpasswordtoken:{
    type: String,
    required: false,
    
  },

  bgremoveimgs:{
    type:Array,
    default:[]
  },

  availableTokens:{
    type:Number,
    default:20
  },
  subscription:{
    type:String,
   enum:["free","Base","Master"]
  },
 

}, { timestamps: true })

const Auth = mongoose.model("Auth", authSchema);

export default Auth;