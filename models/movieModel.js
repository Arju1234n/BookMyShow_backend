const mongoose = require('mongoose');
const { Movie, Show, Seat } = require('./collections');
const { normalizeDoc, toIdString } = require('./utils');

const MovieModel = {
    getAll: async (callback) => {
        try {
            const docs = await Movie.find().lean();
            const normalized = docs.map((doc) => normalizeDoc(doc, 'movie_id'));
            callback(null, normalized);
        } catch (err) {
            callback(err);
        }
    },
    create: async (movieData, callback) => {
        try {
            const { title, genre, language, duration, release_date, poster_url } = movieData;
            const doc = await Movie.create({
                title,
                genre,
                language,
                duration,
                release_date,
                poster_url
            });
            callback(null, { insertId: doc._id.toString() });
        } catch (err) {
            callback(err);
        }
    },
    update: async (movieId, movieData, callback) => {
        try {
            if (!mongoose.Types.ObjectId.isValid(movieId)) return callback(null, { affectedRows: 0 });
            const { title, genre, language, duration, release_date, poster_url } = movieData;
            const updated = await Movie.findByIdAndUpdate(
                movieId,
                { title, genre, language, duration, release_date, poster_url },
                { new: true, runValidators: true }
            ).lean();
            callback(null, { affectedRows: updated ? 1 : 0 });
        } catch (err) {
            callback(err);
        }
    },
    deleteById: async (movieId, callback) => {
        try {
            if (!mongoose.Types.ObjectId.isValid(movieId)) return callback(null, { affectedRows: 0 });
            const shows = await Show.find({ movie_id: movieId }).select('_id').lean();
            const showIds = shows.map((show) => toIdString(show._id));
            if (showIds.length > 0) {
                await Seat.deleteMany({ show_id: { $in: showIds } });
                await Show.deleteMany({ _id: { $in: showIds } });
            }
            await Movie.findByIdAndDelete(movieId);
            callback(null, { affectedRows: 1 });
        } catch (err) {
            callback(err);
        }
    }
};

module.exports = MovieModel;
