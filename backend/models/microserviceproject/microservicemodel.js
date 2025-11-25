import mongoose from "mongoose";


const microserviceschema = new mongoose.Schema({
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "Auth", required: true},
    projectName: { type: String, required: true },
    services:[
        {
            serviceName:{ type: String, required:true },
            serviceDescription:{ type: String, required:true },
            serviceApiOrigin:{ type: String, required:true },
            apis:[
                { type: mongoose.Schema.Types.ObjectId, ref: "Api" }
            ],
            
        }
    ]
}, { timestamps: true })

export default mongoose.model("MicroserviceProject", microserviceschema);