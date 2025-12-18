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
  Projects: [
    {
      type:mongoose.Schema.Types.ObjectId,
       ref :"Projects"
    }
  ],

  totalWebsites:{
    type:Number,
    default:0
  },
  publishedwebsites:{
    type:Number,
    default:0
  },
  availableTokens:{
    type:Number,
    default:5
  },
  subscription:{
    type:String,
   enum:["free","Base","Master"]
  },
  Totalviews:{
    type:Number,
    default:0
  }

}, { timestamps: true })

const Auth = mongoose.model("Auth", authSchema);

export default Auth;