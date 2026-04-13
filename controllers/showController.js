const Show = require('../models/showModel');
const Seat = require('../models/seatModel');

const getAllShows = (req, res) => {
    Show.getAll((err, result) => {
        if (err) return res.status(500).json({ error: "Failed to fetch shows" });
        res.status(200).json(result);
    });
};

const getShowsByMovie = (req, res) => {
    const movieId = req.params.movieId;
    Show.getByMovieRow(movieId, (err, result) => {
        if (err) return res.status(500).json({ error: "Failed to fetch shows for this movie" });
        res.status(200).json(result);
    });
};

const createShow = (req, res) => {
    const { movie_id, theatre_id, show_time, price } = req.body;

    if (!movie_id || !theatre_id || !show_time || !price) {
        return res.status(400).json({ error: "movie_id, theatre_id, show_time and price are required" });
    }

    Show.create(req.body, (err, result) => {
        if (err) return res.status(500).json({ error: "Failed to add show" });
        
        const showId = result.insertId;
        
        // Auto-generate 50 default seats (A-E, 1-10)
        const rows = ['A', 'B', 'C', 'D', 'E'];
        const seatsToInsert = [];
        
        rows.forEach(row => {
            for(let i=1; i<=10; i++) {
                seatsToInsert.push([showId, `${row}${i}`, 'available']);
            }
        });

        const seats = seatsToInsert.map(([show_id, seat_number, status]) => ({
            show_id,
            seat_number,
            status
        }));

        Seat.createMany(seats, (seatErr) => {
            if (seatErr) return res.status(500).json({ error: "Show created but failed to generate seats" });
            res.status(201).json({ message: "Show and 50 seats added successfully", showId });
        });
    });
};

const deleteShow = (req, res) => {
    const { showId } = req.params;
    Show.deleteById(showId, (err, result) => {
        if (err) return res.status(500).json({ error: "Failed to delete show" });
        res.status(200).json({ message: "Show and all related seats deleted successfully" });
    });
};

module.exports = {
    getAllShows,
    getShowsByMovie,
    createShow,
    deleteShow
};
