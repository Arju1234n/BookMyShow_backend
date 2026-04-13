const mongoose = require('../db');

const { Schema } = mongoose;

const adminSchema = new Schema(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        password: { type: String, required: true }
    },
    { timestamps: { createdAt: 'created_at', updatedAt: false } }
);

const userSchema = new Schema(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        password: { type: String, required: true }
    },
    { timestamps: { createdAt: 'created_at', updatedAt: false } }
);

const movieSchema = new Schema(
    {
        title: { type: String, required: true, trim: true },
        genre: { type: String, required: true, trim: true },
        language: { type: String, required: true, trim: true },
        duration: { type: Number, required: true },
        release_date: { type: Date, required: true },
        poster_url: { type: String, default: '' }
    },
    { timestamps: false }
);

const theatreSchema = new Schema(
    {
        name: { type: String, required: true, trim: true },
        location: { type: String, required: true, trim: true }
    },
    { timestamps: false }
);

const showSchema = new Schema(
    {
        movie_id: { type: Schema.Types.ObjectId, ref: 'Movie', required: true },
        theatre_id: { type: Schema.Types.ObjectId, ref: 'Theatre', required: true },
        show_time: { type: Date, required: true },
        price: { type: Number, required: true }
    },
    { timestamps: false }
);

const seatSchema = new Schema(
    {
        show_id: { type: Schema.Types.ObjectId, ref: 'Show', required: true },
        seat_number: { type: String, required: true, trim: true },
        status: { type: String, required: true, default: 'available' }
    },
    { timestamps: false }
);
seatSchema.index({ show_id: 1, seat_number: 1 }, { unique: true });

const bookingSchema = new Schema(
    {
        user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        show_id: { type: Schema.Types.ObjectId, ref: 'Show', required: true },
        booking_date: { type: Date, default: Date.now },
        total_amount: { type: Number, required: true }
    },
    { timestamps: false }
);

const paymentSchema = new Schema(
    {
        booking_id: { type: Schema.Types.ObjectId, ref: 'Booking', required: true },
        amount: { type: Number, required: true },
        payment_method: { type: String, required: true },
        payment_status: { type: String, required: true, default: 'pending' }
    },
    { timestamps: false }
);

const ticketSchema = new Schema(
    {
        booking_id: { type: Schema.Types.ObjectId, ref: 'Booking', required: true },
        seat_number: { type: String, required: true, trim: true },
        qr_code: { type: String, default: '' }
    },
    { timestamps: false }
);

module.exports = {
    Admin: mongoose.models.Admin || mongoose.model('Admin', adminSchema),
    User: mongoose.models.User || mongoose.model('User', userSchema),
    Movie: mongoose.models.Movie || mongoose.model('Movie', movieSchema),
    Theatre: mongoose.models.Theatre || mongoose.model('Theatre', theatreSchema),
    Show: mongoose.models.Show || mongoose.model('Show', showSchema),
    Seat: mongoose.models.Seat || mongoose.model('Seat', seatSchema),
    Booking: mongoose.models.Booking || mongoose.model('Booking', bookingSchema),
    Payment: mongoose.models.Payment || mongoose.model('Payment', paymentSchema),
    Ticket: mongoose.models.Ticket || mongoose.model('Ticket', ticketSchema)
};
