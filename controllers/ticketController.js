const Ticket = require('../models/ticketModel');

const getTicketByBooking = (req, res) => {
    const bookingId = req.params.bookingId;
    Ticket.getByBooking(bookingId, (err, result) => {
        if (err) return res.status(500).json({ error: "Failed to fetch ticket" });
        if (result.length === 0) return res.status(404).json({ error: "No ticket found for this booking" });
        res.status(200).json(result[0]);
    });
};

const generateTicket = (req, res) => {
    const { booking_id, seat_number, qr_code } = req.body;

    if (!booking_id || !seat_number) {
        return res.status(400).json({ error: "booking_id and seat_number are required" });
    }

    Ticket.create(req.body, (err, result) => {
        if (err) return res.status(500).json({ error: "Failed to generate ticket" });
        res.status(201).json({ message: "Ticket generated successfully", ticketId: result.insertId });
    });
};

module.exports = {
    getTicketByBooking,
    generateTicket
};
