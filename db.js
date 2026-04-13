const mongoose = require('mongoose');
require('dotenv').config();

const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;

if (!mongoUri) {
    console.error('❌ MONGO_URI is not set. Please configure your MongoDB connection string.');
    process.exit(1);
}

mongoose.set('strictQuery', true);

mongoose
    .connect(mongoUri, {
        autoIndex: true
    })
    .then(() => {
        console.log('✅ MongoDB connected successfully.');
    })
    .catch((err) => {
        console.error('❌ MongoDB connection failed:', err.message);
        process.exit(1);
    });

module.exports = mongoose;
