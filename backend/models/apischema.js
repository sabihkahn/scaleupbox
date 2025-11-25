import mongoose from "mongoose";

const apiSchema = new mongoose.Schema({
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },

    name: { type: String, required: true },

    origin: { type: String },
    endpoint: { type: String, required: true },
    whole_api: { type: String },

    method: {
        type: String,
        enum: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        required: true
    },

    use_any_token: { type: Boolean, default: false },
    latency: { type: Number, default: 0 },
    apikey: { type: String },

    set_headers: [
        { key: String, value: String }
    ],
    airesponse:[{
        score:{type:Number},
        response:{type:String}
    }],
    description: { type: String },

}, { timestamps: true });

export default mongoose.model("Api", apiSchema);
