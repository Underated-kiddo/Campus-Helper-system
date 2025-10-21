const mongoose = require('mongoose');

//connection to mongo db
const connectDB = async ( ) => {
    try {
        await mongoose.connect(process.env.MONGO_URI , {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("MongoDB connected successfully ✔️👍");
    } catch (error) {
        console.error("MongoDB connection failed 🙊❌", error.message);
        process.exit(1);
    }
};

module.exports = connectDB ;