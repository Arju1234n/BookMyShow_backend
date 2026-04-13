const mongoose = require('mongoose');
const { Booking, User, Show, Movie, Theatre, Ticket, Seat, Payment } = require('./collections');
const { toIdString } = require('./utils');

const buildBookingResponse = (doc) => ({
    booking_id: toIdString(doc._id),
    user_id: toIdString(doc.user_id),
    show_id: toIdString(doc.show_id),
    booking_date: doc.booking_date,
    total_amount: doc.total_amount,
    user_name: doc.user?.name,
    email: doc.user?.email,
    show_time: doc.show?.show_time,
    movie_title: doc.movie?.title,
    theatre_name: doc.theatre?.name,
    seat_numbers: (doc.tickets || [])
        .map((ticket) => ticket.seat_number)
        .sort()
        .join(', '),
    ticket_count: (doc.tickets || []).length
});

const BookingModel = {
    getAll: async (callback) => {
        try {
            const docs = await Booking.aggregate([
                {
                    $lookup: {
                        from: User.collection.name,
                        localField: 'user_id',
                        foreignField: '_id',
                        as: 'user'
                    }
                },
                { $unwind: '$user' },
                {
                    $lookup: {
                        from: Show.collection.name,
                        localField: 'show_id',
                        foreignField: '_id',
                        as: 'show'
                    }
                },
                { $unwind: '$show' },
                {
                    $lookup: {
                        from: Movie.collection.name,
                        localField: 'show.movie_id',
                        foreignField: '_id',
                        as: 'movie'
                    }
                },
                { $unwind: '$movie' },
                {
                    $lookup: {
                        from: Theatre.collection.name,
                        localField: 'show.theatre_id',
                        foreignField: '_id',
                        as: 'theatre'
                    }
                },
                { $unwind: '$theatre' },
                {
                    $lookup: {
                        from: Ticket.collection.name,
                        localField: '_id',
                        foreignField: 'booking_id',
                        as: 'tickets'
                    }
                },
                { $sort: { booking_date: -1 } }
            ]);

            const result = docs.map((doc) => buildBookingResponse(doc));
            callback(null, result);
        } catch (err) {
            callback(err);
        }
    },
    getByUser: async (userId, callback) => {
        try {
            if (!mongoose.Types.ObjectId.isValid(userId)) return callback(null, []);
            const docs = await Booking.aggregate([
                { $match: { user_id: new mongoose.Types.ObjectId(userId) } },
                {
                    $lookup: {
                        from: User.collection.name,
                        localField: 'user_id',
                        foreignField: '_id',
                        as: 'user'
                    }
                },
                { $unwind: '$user' },
                {
                    $lookup: {
                        from: Show.collection.name,
                        localField: 'show_id',
                        foreignField: '_id',
                        as: 'show'
                    }
                },
                { $unwind: '$show' },
                {
                    $lookup: {
                        from: Movie.collection.name,
                        localField: 'show.movie_id',
                        foreignField: '_id',
                        as: 'movie'
                    }
                },
                { $unwind: '$movie' },
                {
                    $lookup: {
                        from: Theatre.collection.name,
                        localField: 'show.theatre_id',
                        foreignField: '_id',
                        as: 'theatre'
                    }
                },
                { $unwind: '$theatre' },
                {
                    $lookup: {
                        from: Ticket.collection.name,
                        localField: '_id',
                        foreignField: 'booking_id',
                        as: 'tickets'
                    }
                },
                { $sort: { booking_date: -1 } }
            ]);

            const result = docs.map((doc) => buildBookingResponse(doc));
            callback(null, result);
        } catch (err) {
            callback(err);
        }
    },
    create: async (bookingData, callback) => {
        try {
            const { user_id, show_id, total_amount } = bookingData;
            const doc = await Booking.create({ user_id, show_id, total_amount });
            callback(null, { insertId: doc._id.toString() });
        } catch (err) {
            callback(err);
        }
    },
    cancelBooking: async (bookingId, callback) => {
        try {
            if (!mongoose.Types.ObjectId.isValid(bookingId)) {
                return callback(new Error('Booking not found'));
            }

            const tickets = await Ticket.find({ booking_id: bookingId }).lean();
            const booking = await Booking.findById(bookingId).lean();
            if (!booking) return callback(new Error('Booking not found'));

            const seatNumbers = tickets.map((ticket) => ticket.seat_number);
            if (seatNumbers.length > 0) {
                await Seat.updateMany(
                    { show_id: booking.show_id, seat_number: { $in: seatNumbers } },
                    { $set: { status: 'available' } }
                );
            }

            await Ticket.deleteMany({ booking_id: bookingId });
            await Payment.deleteMany({ booking_id: bookingId });
            await Booking.findByIdAndDelete(bookingId);

            callback(null, { affectedRows: 1 });
        } catch (err) {
            callback(err);
        }
    }
};

module.exports = BookingModel;
