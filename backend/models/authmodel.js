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
  projectsmonolithic:[
    {
    type:mongoose.Schema.Types.ObjectId,
    ref:"Project"
    }
],
  projectMicroservices:[
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:"MicroserviceProject"
    }
  ]

}, { timestamps: true })

const Auth = mongoose.model("Auth", authSchema);

export default Auth;