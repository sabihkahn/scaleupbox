import mongoose from "mongoose";

const projectmodel = new mongoose.Schema({
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Auth" },
    name: { type: String, required: true },
    url: { type: String, required: true },
    views:{type:Number,default:0}
    
    

}, { timestamps: true });

const Projectmodel =  mongoose.model("Projects", projectmodel);
export default Projectmodel