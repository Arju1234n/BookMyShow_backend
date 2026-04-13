const mongoose = require('mongoose');
const { Payment } = require('./collections');
const { normalizeDoc } = require('./utils');

const PaymentModel = {
    // Get payment by booking ID
    getByBooking: async (bookingId, callback) => {
        try {
            if (!mongoose.Types.ObjectId.isValid(bookingId)) return callback(null, []);
            const docs = await Payment.find({ booking_id: bookingId }).lean();
            const normalized = docs.map((doc) => normalizeDoc(doc, 'payment_id'));
            callback(null, normalized);
        } catch (err) {
            callback(err);
        }
    },

    // Add a new payment
    create: async (paymentData, callback) => {
        try {
            const { booking_id, amount, payment_method, payment_status } = paymentData;
            const status = payment_status || 'pending';
            const doc = await Payment.create({
                booking_id,
                amount,
                payment_method,
                payment_status: status
            });
            callback(null, { insertId: doc._id.toString() });
        } catch (err) {
            callback(err);
        }
    },

    // Update payment status (e.g., from 'pending' to 'completed')
    updateStatus: async (paymentId, status, callback) => {
        try {
            if (!mongoose.Types.ObjectId.isValid(paymentId)) return callback(null, { affectedRows: 0 });
            const updated = await Payment.findByIdAndUpdate(
                paymentId,
                { payment_status: status },
                { new: true, runValidators: true }
            ).lean();
            callback(null, { affectedRows: updated ? 1 : 0 });
        } catch (err) {
            callback(err);
        }
    }
};

module.exports = PaymentModel;
