import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "Auth", required: true },

    name: { type: String, required: true },

    architecture: {
        type: String,
        enum: ["Monolithic", "Microservices"],
        required: true
    },

    base_api_origin: { type: String },

    
    apis: [
        { type: mongoose.Schema.Types.ObjectId, ref: "Api" }
    ],

}, { timestamps: true });

export default mongoose.model("Project", projectSchema);
