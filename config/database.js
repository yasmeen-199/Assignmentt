
const { MongoClient } = require("mongodb");
require("dotenv").config();

const client = new MongoClient(process.env.MONGO_URI);

let db;

const connectDB = async () => {
    try {
        await client.connect();

        db = client.db(process.env.DB_NAME);

        console.log("MongoDB Connected Successfully");

        return db;
    } catch (error) {
        console.error("MongoDB Connection Error:", error.message);
        process.exit(1);
    }
};

const getDB = () => {
    if (!db) {
        throw new Error("Database is not connected");
    }

    return db;
};

module.exports = {
    connectDB,
    getDB
};
