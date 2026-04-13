const mongoose = require('mongoose');
const { Seat } = require('./collections');
const { normalizeDoc } = require('./utils');

const SeatModel = {
    // Get all seats for a specific show
    getByShow: async (showId, callback) => {
        try {
            if (!mongoose.Types.ObjectId.isValid(showId)) return callback(null, []);
            const docs = await Seat.find({ show_id: showId }).lean();
            const normalized = docs.map((doc) => normalizeDoc(doc, 'seat_id'));
            callback(null, normalized);
        } catch (err) {
            callback(err);
        }
    },

    // Add a seat (admin function typically)
    create: async (seatData, callback) => {
        try {
            const { show_id, seat_number, status } = seatData;
            const seatStatus = status || 'available';
            const doc = await Seat.create({ show_id, seat_number, status: seatStatus });
            callback(null, { insertId: doc._id.toString() });
        } catch (err) {
            callback(err);
        }
    },

    // Bulk insert seats (used when creating a show)
    createMany: async (seats, callback) => {
        try {
            const docs = await Seat.insertMany(seats);
            callback(null, { insertedCount: docs.length });
        } catch (err) {
            callback(err);
        }
    },

    // Update seat status (e.g., from 'available' to 'booked')
    updateStatus: async (seatId, status, callback) => {
        try {
            if (!mongoose.Types.ObjectId.isValid(seatId)) return callback(null, { affectedRows: 0 });
            const updated = await Seat.findByIdAndUpdate(
                seatId,
                { status },
                { new: true, runValidators: true }
            ).lean();
            callback(null, { affectedRows: updated ? 1 : 0 });
        } catch (err) {
            callback(err);
        }
    }
};

module.exports = SeatModel;
