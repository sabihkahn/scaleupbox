import mongoose from 'mongoose';

const connectDB = async () =>{
    try {
        await mongoose.connect(process.env.mongo_db_uri,{
            dbName:'scaleupbox',
        }).then((res)=>{
            console.log("Database connected successfully");
        }).catch((err)=>{
            console.log("Database connection failed");
        })
    } catch (error) {
        console.log(error);
        
    }
}

export default connectDB;