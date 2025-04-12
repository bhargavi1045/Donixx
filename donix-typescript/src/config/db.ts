import mongoose from "mongoose";
const connectDatabase=():void =>{
    mongoose.connect(process.env.MONGO_URI as string).then(()=>{
        console.log("MongoDB connected with server :",mongoose.connection.host);
    }).catch((error)=>{
        console.error("Error connecting to MongoDB:",error);
    })
}

export default connectDatabase;
