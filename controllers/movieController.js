const Movie = require('../models/movieModel');

const getAllMovies = (req, res) => {
    Movie.getAll((err, result) => {
        if (err) return res.status(500).json({ error: "Failed to fetch movies" });
        res.status(200).json(result);
    });
};

const createMovie = (req, res) => {
    const { title, genre, language, duration, release_date, poster_url } = req.body;

    // Validate required fields
    if (!title || !genre || !language || !duration) {
        return res.status(400).json({ error: "Title, genre, language and duration are required" });
    }

    Movie.create(req.body, (err, result) => {
        if (err) return res.status(500).json({ error: "Failed to add movie" });
        res.status(201).json({ message: "Movie added successfully", movieId: result.insertId });
    });
};

const deleteMovie = (req, res) => {
    const { movieId } = req.params;
    Movie.deleteById(movieId, (err, result) => {
        if (err) return res.status(500).json({ error: "Failed to delete movie" });
        res.status(200).json({ message: "Movie and all related shows/seats deleted successfully" });
    });
};

const updateMovie = (req, res) => {
    const { movieId } = req.params;
    Movie.update(movieId, req.body, (err, result) => {
        if (err) return res.status(500).json({ error: "Failed to update movie" });
        res.status(200).json({ message: "Movie updated successfully" });
    });
};

module.exports = {
    getAllMovies,
    createMovie,
    deleteMovie,
    updateMovie
};
