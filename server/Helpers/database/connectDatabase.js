import mongoose from "mongoose";

const connectDatabase = async () => {

    await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })

}

export default connectDatabase;
