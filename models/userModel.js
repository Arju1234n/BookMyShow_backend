const mongoose = require('mongoose');
const { User } = require('./collections');
const { normalizeDoc } = require('./utils');

const UserModel = {
    create: async (userData, callback) => {
        try {
            const doc = await User.create({
                name: userData.name,
                email: userData.email,
                password: userData.password
            });
            callback(null, { insertId: doc._id.toString() });
        } catch (err) {
            callback(err);
        }
    },
    findByEmail: async (email, callback) => {
        try {
            const doc = await User.findOne({ email: email.toLowerCase() }).lean();
            if (!doc) return callback(null, []);
            const normalized = normalizeDoc(doc, 'user_id');
            callback(null, [normalized]);
        } catch (err) {
            callback(err);
        }
    },
    findById: async (userId, callback) => {
        try {
            if (!mongoose.Types.ObjectId.isValid(userId)) return callback(null, []);
            const doc = await User.findById(userId).select('name email created_at').lean();
            if (!doc) return callback(null, []);
            const normalized = normalizeDoc(doc, 'user_id');
            callback(null, [normalized]);
        } catch (err) {
            callback(err);
        }
    },
    updateProfile: async (userId, data, callback) => {
        try {
            if (!mongoose.Types.ObjectId.isValid(userId)) return callback(null, { affectedRows: 0 });
            const { name, email } = data;
            const updated = await User.findByIdAndUpdate(
                userId,
                { name, email },
                { new: true, runValidators: true }
            ).lean();
            callback(null, { affectedRows: updated ? 1 : 0 });
        } catch (err) {
            callback(err);
        }
    }
};

module.exports = UserModel;
