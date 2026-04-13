const Payment = require('../models/paymentModel');

const getPaymentByBooking = (req, res) => {
    const bookingId = req.params.bookingId;
    Payment.getByBooking(bookingId, (err, result) => {
        if (err) return res.status(500).json({ error: "Failed to fetch payment" });
        res.status(200).json(result);
    });
};

const processPayment = (req, res) => {
    const { booking_id, amount, payment_method } = req.body;

    if (!booking_id || !amount || !payment_method) {
        return res.status(400).json({ error: "booking_id, amount and payment_method are required" });
    }

    const validMethods = ['Credit Card', 'Debit Card', 'UPI', 'Net Banking', 'Cash'];
    if (!validMethods.includes(payment_method)) {
        return res.status(400).json({ error: "Invalid payment method. Valid methods: Credit Card, Debit Card, UPI, Net Banking, Cash" });
    }

    Payment.create(req.body, (err, result) => {
        if (err) return res.status(500).json({ error: "Failed to process payment" });
        res.status(201).json({ message: "Payment recorded successfully", paymentId: result.insertId });
    });
};

const updatePaymentStatus = (req, res) => {
    const paymentId = req.params.paymentId;
    const { status } = req.body;

    if (!status) {
        return res.status(400).json({ error: "Status is required" });
    }

    const validStatuses = ['pending', 'completed', 'failed', 'refunded'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: "Status must be one of: pending, completed, failed, refunded" });
    }

    Payment.updateStatus(paymentId, status, (err, result) => {
        if (err) return res.status(500).json({ error: "Failed to update payment status" });
        res.status(200).json({ message: "Payment status updated successfully" });
    });
};

module.exports = {
    getPaymentByBooking,
    processPayment,
    updatePaymentStatus
};
