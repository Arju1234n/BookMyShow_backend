const { Movie, Theatre, Booking, Show, User } = require('../models/collections');

const getStats = async (req, res) => {
    try {
        const [
            totalMovies,
            totalTheatres,
            totalBookings,
            totalShows,
            totalUsers,
            revenueAgg
        ] = await Promise.all([
            Movie.countDocuments(),
            Theatre.countDocuments(),
            Booking.countDocuments(),
            Show.countDocuments(),
            User.countDocuments(),
            Booking.aggregate([{ $group: { _id: null, total_revenue: { $sum: '$total_amount' } } }])
        ]);

        const totalRevenue = revenueAgg[0]?.total_revenue || 0;

        res.status(200).json({
            total_movies: totalMovies,
            total_theatres: totalTheatres,
            total_bookings: totalBookings,
            total_shows: totalShows,
            total_users: totalUsers,
            total_revenue: totalRevenue
        });
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch stats" });
    }
};

module.exports = { getStats };
