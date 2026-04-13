require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const morgan = require('morgan');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');
const db = require('./db');
const { connectDB } = require('./db');

// ─── Route Imports ───────────────────────────────────────────────
const authRoutes = require('./Routes/authRoutes');
const adminRoutes = require('./Routes/adminRoutes');
const movieRoutes = require('./Routes/movieRoutes');
const theatreRoutes = require('./Routes/theatreRoutes');
const showRoutes = require('./Routes/showRoutes');
const seatRoutes = require('./Routes/seatRoutes');
const bookingRoutes = require('./Routes/bookingRoutes');
const paymentRoutes = require('./Routes/paymentRoutes');
const ticketRoutes = require('./Routes/ticketRoutes');
const uploadRoutes = require('./Routes/uploadRoutes');
const statsRoutes = require('./Routes/statsRoutes');

// ─── App Initialization ─────────────────────────────────────────
const app = express();
const PORT = process.env.PORT || 5000;

// ─── Global Middlewares ──────────────────────────────────────────
app.use(helmet());                              // Security headers
app.use(morgan('dev'));                          // Request logging
app.use(cors());                                // Cross-origin access
app.use(bodyParser.json({ limit: '10kb' }));    // Parse JSON, limit body size
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" })); // Allow images to be viewed cross-origin
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // serve static images

// ─── Ensure DB is connected (for serverless environments) ────────
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (err) {
        res.status(500).json({ error: 'Database connection failed' });
    }
});

// ─── Health Check ────────────────────────────────────────────────
app.get('/', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Book My Show Backend is running.',
        version: '1.0.0'
    });
});

// ─── API Routes ──────────────────────────────────────────────────
app.use('/auth', authRoutes);           // User register & login
app.use('/admin', adminRoutes);         // Admin register & login
app.use('/movies', movieRoutes);        // CRUD movies
app.use('/theatres', theatreRoutes);    // CRUD theatres
app.use('/shows', showRoutes);          // CRUD shows
app.use('/seats', seatRoutes);          // CRUD seats
app.use('/bookings', bookingRoutes);    // CRUD bookings
app.use('/payments', paymentRoutes);    // Payment processing
app.use('/tickets', ticketRoutes);      // Ticket generation
app.use('/upload', uploadRoutes);       // File uploads
app.use('/stats', statsRoutes);        // Aggregate stats

// ─── Error Handling ──────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ─── Server Start ────────────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`Server is running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Export for Vercel serverless deployment
module.exports = app;