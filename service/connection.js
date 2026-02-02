const mongoose = require("mongoose");

const url = process.env.Mongo_url || "mongodb://127.0.0.1:27017/Blogify";

let isConnected = false;

const connectToDatabase = async () => {
    mongoose.set('strictQuery', true);

    if (isConnected) {
        console.log("=> using existing database connection");
        return;
    }

    console.log("=> using new database connection");
    try {
        const db = await mongoose.connect(url);
        isConnected = db.connections[0].readyState;
        console.log("MongoDB Connected Successfully");
    } catch (error) {
        console.log("Database connection failed:", error);
        throw error;
    }
};

module.exports = connectToDatabase;
