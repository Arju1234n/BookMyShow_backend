const mongoose = require('mongoose');
const { Ticket, Booking, User, Show, Movie, Theatre } = require('./collections');
const { toIdString } = require('./utils');

const TicketModel = {
    // Get ticket by booking ID
    getByBooking: async (bookingId, callback) => {
        try {
            if (!mongoose.Types.ObjectId.isValid(bookingId)) return callback(null, []);
            const docs = await Ticket.aggregate([
                { $match: { booking_id: new mongoose.Types.ObjectId(bookingId) } },
                {
                    $lookup: {
                        from: Booking.collection.name,
                        localField: 'booking_id',
                        foreignField: '_id',
                        as: 'booking'
                    }
                },
                { $unwind: '$booking' },
                {
                    $lookup: {
                        from: User.collection.name,
                        localField: 'booking.user_id',
                        foreignField: '_id',
                        as: 'user'
                    }
                },
                { $unwind: '$user' },
                {
                    $lookup: {
                        from: Show.collection.name,
                        localField: 'booking.show_id',
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
                { $unwind: '$theatre' }
            ]);

            const result = docs.map((doc) => ({
                ticket_id: toIdString(doc._id),
                booking_id: toIdString(doc.booking_id),
                seat_number: doc.seat_number,
                qr_code: doc.qr_code,
                booking_date: doc.booking?.booking_date,
                total_amount: doc.booking?.total_amount,
                user_name: doc.user?.name,
                show_time: doc.show?.show_time,
                movie_title: doc.movie?.title,
                theatre_name: doc.theatre?.name,
                location: doc.theatre?.location
            }));
            callback(null, result);
        } catch (err) {
            callback(err);
        }
    },

    // Create a new ticket (usually generated after successful payment)
    create: async (ticketData, callback) => {
        try {
            const { booking_id, seat_number, qr_code } = ticketData;
            const doc = await Ticket.create({ booking_id, seat_number, qr_code });
            callback(null, { insertId: doc._id.toString() });
        } catch (err) {
            callback(err);
        }
    }
};

module.exports = TicketModel;
