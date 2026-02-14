import mongoose from 'mongoose'

const portfolioSchema = new mongoose.Schema(
    {
        profile: {
            name: String,
            email: String,
            phone: String,
            description: String,
            profileImage: String
        },

        websiteType: {
            type: String,
            enum: ["software_dev", "graphic_designer"]
        },

        skills: [{ name: String }],

        clicks: { type: Number },


        education:[{description:String}],

        projects: [
            {
                name: String,
                description: String,
                image: String,
                liveUrl: String,
                githubUrl: String
            }
        ],

        socialLinks: [
            {
                platform: String,
                url: String
            }
        ],

        slug: {
            type: String,
            unique: true
        },

        isPublished: {
            type: Boolean,
            default: true
        }
    },
    { timestamps: true }
);

export default mongoose.model("Portfolio", portfolioSchema);
