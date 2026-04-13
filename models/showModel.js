const mongoose = require('mongoose');
const { Show, Movie, Theatre, Seat } = require('./collections');
const { toIdString } = require('./utils');

const ShowModel = {
    getAll: async (callback) => {
        try {
            const docs = await Show.aggregate([
                {
                    $lookup: {
                        from: Movie.collection.name,
                        localField: 'movie_id',
                        foreignField: '_id',
                        as: 'movie'
                    }
                },
                { $unwind: '$movie' },
                {
                    $lookup: {
                        from: Theatre.collection.name,
                        localField: 'theatre_id',
                        foreignField: '_id',
                        as: 'theatre'
                    }
                },
                { $unwind: '$theatre' }
            ]);

            const result = docs.map((doc) => ({
                show_id: toIdString(doc._id),
                movie_id: toIdString(doc.movie_id),
                theatre_id: toIdString(doc.theatre_id),
                show_time: doc.show_time,
                price: doc.price,
                title: doc.movie?.title,
                language: doc.movie?.language,
                theatre_name: doc.theatre?.name,
                location: doc.theatre?.location
            }));
            callback(null, result);
        } catch (err) {
            callback(err);
        }
    },
    getByMovieRow: async (movieId, callback) => {
        try {
            if (!mongoose.Types.ObjectId.isValid(movieId)) return callback(null, []);
            const docs = await Show.aggregate([
                { $match: { movie_id: new mongoose.Types.ObjectId(movieId) } },
                {
                    $lookup: {
                        from: Theatre.collection.name,
                        localField: 'theatre_id',
                        foreignField: '_id',
                        as: 'theatre'
                    }
                },
                { $unwind: '$theatre' }
            ]);

            const result = docs.map((doc) => ({
                show_id: toIdString(doc._id),
                movie_id: toIdString(doc.movie_id),
                theatre_id: toIdString(doc.theatre_id),
                show_time: doc.show_time,
                price: doc.price,
                theatre_name: doc.theatre?.name,
                location: doc.theatre?.location
            }));
            callback(null, result);
        } catch (err) {
            callback(err);
        }
    },
    create: async (showData, callback) => {
        try {
            const { movie_id, theatre_id, show_time, price } = showData;
            const doc = await Show.create({ movie_id, theatre_id, show_time, price });
            callback(null, { insertId: doc._id.toString() });
        } catch (err) {
            callback(err);
        }
    },
    deleteById: async (showId, callback) => {
        try {
            if (!mongoose.Types.ObjectId.isValid(showId)) return callback(null, { affectedRows: 0 });
            await Seat.deleteMany({ show_id: showId });
            await Show.findByIdAndDelete(showId);
            callback(null, { affectedRows: 1 });
        } catch (err) {
            callback(err);
        }
    }
};

module.exports = ShowModel;
