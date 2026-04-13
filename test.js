require('dotenv').config();
const mongoose = require('./db');
const bcrypt = require('bcryptjs');
const { Admin } = require('./models/collections');

const run = async () => {
    try {
        await mongoose.connection.asPromise();
        await Admin.deleteMany({});

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash("password123", salt);

        await Admin.create({ name: 'Admin', email: 'admin@bookmyshow.com', password: hash });
        console.log("Admin reset successfully. Email: admin@bookmyshow.com, Password: password123");
    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.connection.close();
        process.exit(0);
    }
};

run();
