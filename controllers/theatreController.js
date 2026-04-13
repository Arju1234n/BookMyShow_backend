const Theatre = require('../models/theatreModel');

const getAllTheatres = (req, res) => {
    Theatre.getAll((err, result) => {
        if (err) return res.status(500).json({ error: "Failed to fetch theatres" });
        res.status(200).json(result);
    });
};

const createTheatre = (req, res) => {
    const { name, location } = req.body;

    if (!name || !location) {
        return res.status(400).json({ error: "Name and location are required" });
    }

    Theatre.create(req.body, (err, result) => {
        if (err) return res.status(500).json({ error: "Failed to add theatre" });
        res.status(201).json({ message: "Theatre added successfully", theatreId: result.insertId });
    });
};

const updateTheatre = (req, res) => {
    const { theatreId } = req.params;
    Theatre.update(theatreId, req.body, (err, result) => {
        if (err) return res.status(500).json({ error: "Failed to update theatre" });
        res.status(200).json({ message: "Theatre updated successfully" });
    });
};

module.exports = {
    getAllTheatres,
    createTheatre,
    updateTheatre
};
