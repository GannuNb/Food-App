const mongoose = require('mongoose');

const MONGO_URI = "mongodb+srv://nbyaswanth1818:kingkohli18@cluster0.jbazzfo.mongodb.net/gofood?retryWrites=true&w=majority&appName=Cluster0";

const mongoDB = async () => {
    try {
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("Connected successfully");
    } catch (error) {
        console.error("Connection error:", error.message);
    }
}

module.exports = mongoDB;
