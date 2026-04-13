const mongoose = require('mongoose');
const { Theatre } = require('./collections');
const { normalizeDoc } = require('./utils');

const TheatreModel = {
    getAll: async (callback) => {
        try {
            const docs = await Theatre.find().lean();
            const normalized = docs.map((doc) => normalizeDoc(doc, 'theatre_id'));
            callback(null, normalized);
        } catch (err) {
            callback(err);
        }
    },
    create: async (theatreData, callback) => {
        try {
            const { name, location } = theatreData;
            const doc = await Theatre.create({ name, location });
            callback(null, { insertId: doc._id.toString() });
        } catch (err) {
            callback(err);
        }
    },
    update: async (theatreId, theatreData, callback) => {
        try {
            if (!mongoose.Types.ObjectId.isValid(theatreId)) return callback(null, { affectedRows: 0 });
            const { name, location } = theatreData;
            const updated = await Theatre.findByIdAndUpdate(
                theatreId,
                { name, location },
                { new: true, runValidators: true }
            ).lean();
            callback(null, { affectedRows: updated ? 1 : 0 });
        } catch (err) {
            callback(err);
        }
    }
};

module.exports = TheatreModel;
