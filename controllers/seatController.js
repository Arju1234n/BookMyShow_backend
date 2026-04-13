const Seat = require('../models/seatModel');

const getSeatsForShow = (req, res) => {
    const showId = req.params.showId;
    Seat.getByShow(showId, (err, result) => {
        if (err) return res.status(500).json({ error: "Failed to fetch seats" });
        res.status(200).json(result);
    });
};

const addSeat = (req, res) => {
    const { show_id, seat_number } = req.body;

    if (!show_id || !seat_number) {
        return res.status(400).json({ error: "show_id and seat_number are required" });
    }

    Seat.create(req.body, (err, result) => {
        if (err) return res.status(500).json({ error: "Failed to add seat" });
        res.status(201).json({ message: "Seat added successfully", seatId: result.insertId });
    });
};

const updateSeatStatus = (req, res) => {
    const seatId = req.params.seatId;
    const { status } = req.body;

    if (!status) {
        return res.status(400).json({ error: "Status is required" });
    }

    const validStatuses = ['available', 'booked', 'reserved'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: "Status must be one of: available, booked, reserved" });
    }

    Seat.updateStatus(seatId, status, (err, result) => {
        if (err) return res.status(500).json({ error: "Failed to update seat status" });
        res.status(200).json({ message: "Seat status updated successfully" });
    });
};

module.exports = {
    getSeatsForShow,
    addSeat,
    updateSeatStatus
};
