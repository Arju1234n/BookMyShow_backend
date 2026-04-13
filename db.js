const mongoose = require('mongoose');
require('dotenv').config();

const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;

if (!mongoUri) {
    console.error('❌ MONGO_URI is not set. Please configure your MongoDB connection string.');
    process.exit(1);
}

mongoose.set('strictQuery', true);

// Cache the connection for serverless environments (Vercel)
let isConnected = false;

const connectDB = async () => {
    if (isConnected) return;

    try {
        const db = await mongoose.connect(mongoUri, {
            autoIndex: true,
            serverSelectionTimeoutMS: 10000,
            socketTimeoutMS: 45000,
        });
        isConnected = db.connections[0].readyState === 1;
        console.log('✅ MongoDB connected successfully.');
    } catch (err) {
        console.error('❌ MongoDB connection failed:', err.message);
        throw err;
    }
};

// Connect immediately for local dev
connectDB();

module.exports = mongoose;
module.exports.connectDB = connectDB;
