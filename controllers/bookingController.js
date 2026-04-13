const Booking = require('../models/bookingModel');

const getAllBookings = (req, res) => {
    Booking.getAll((err, result) => {
        if (err) return res.status(500).json({ error: "Failed to fetch bookings" });
        res.status(200).json(result);
    });
};

const getBookingsByUser = (req, res) => {
    const userId = req.params.userId;
    Booking.getByUser(userId, (err, result) => {
        if (err) return res.status(500).json({ error: "Failed to fetch bookings for this user" });
        res.status(200).json(result);
    });
};

const createBooking = (req, res) => {
    const { user_id, show_id, total_amount } = req.body;

    if (!user_id || !show_id || !total_amount) {
        return res.status(400).json({ error: "user_id, show_id and total_amount are required" });
    }

    Booking.create(req.body, (err, result) => {
        if (err) return res.status(500).json({ error: "Failed to create booking" });
        res.status(201).json({ message: "Booking created successfully", bookingId: result.insertId });
    });
};

const cancelBooking = (req, res) => {
    const bookingId = req.params.bookingId;

    Booking.cancelBooking(bookingId, (err, result) => {
        if (err) return res.status(500).json({ error: "Failed to cancel booking" });
        res.status(200).json({ message: "Booking cancelled and seats freed successfully" });
    });
};

module.exports = {
    getAllBookings,
    getBookingsByUser,
    createBooking,
    cancelBooking
};
