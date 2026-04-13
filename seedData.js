require('dotenv').config();
const mongoose = require('./db');
const { Movie, Theatre, Show, Seat, Admin } = require('./models/collections');
const bcrypt = require('bcryptjs');

async function seedData() {
    try {
        // Wait for database connection
        await new Promise((resolve) => {
            if (mongoose.connection.readyState === 1) return resolve();
            mongoose.connection.once('connected', resolve);
        });
        console.log('✅ Connected to MongoDB');

        // Clear existing data
        console.log('🗑️  Clearing existing data...');
        await Movie.deleteMany({});
        await Theatre.deleteMany({});
        await Show.deleteMany({});
        await Seat.deleteMany({});

        // ===================== MOVIES =====================
        console.log('🎬 Inserting movies...');
        const movies = await Movie.insertMany([
            {
                title: 'Pushpa 2: The Rule',
                genre: 'Action',
                language: 'Telugu',
                duration: 180,
                release_date: new Date('2025-12-05'),
                poster_url: 'https://image.tmdb.org/t/p/w500/bGLguBv6kfMOaIBUbYMQOI5JLPQ.jpg'
            },
            {
                title: 'Stree 2',
                genre: 'Horror Comedy',
                language: 'Hindi',
                duration: 152,
                release_date: new Date('2025-08-15'),
                poster_url: 'https://image.tmdb.org/t/p/w500/3S4TMEA3NR3MvLkEOGH8eLTmFdT.jpg'
            },
            {
                title: 'Kalki 2898 AD',
                genre: 'Sci-Fi',
                language: 'Telugu',
                duration: 181,
                release_date: new Date('2025-06-27'),
                poster_url: 'https://image.tmdb.org/t/p/w500/kCGlIMHnOm8JPXq3rXM6c5wMxcT.jpg'
            },
            {
                title: 'Devara: Part 1',
                genre: 'Action',
                language: 'Telugu',
                duration: 165,
                release_date: new Date('2025-09-27'),
                poster_url: 'https://image.tmdb.org/t/p/w500/g2z0KObra3AiGENWRQb3E6TMpHJ.jpg'
            },
            {
                title: 'Bhool Bhulaiyaa 3',
                genre: 'Horror Comedy',
                language: 'Hindi',
                duration: 158,
                release_date: new Date('2025-11-01'),
                poster_url: 'https://image.tmdb.org/t/p/w500/oB0GKc9JWKJFBw1Yj4VPzxKKbJm.jpg'
            },
            {
                title: 'Singham Again',
                genre: 'Action',
                language: 'Hindi',
                duration: 144,
                release_date: new Date('2025-11-01'),
                poster_url: 'https://image.tmdb.org/t/p/w500/4H5TGQJXGGX8r8vGabvCNbC0dlA.jpg'
            },
            {
                title: 'Amaran',
                genre: 'Drama',
                language: 'Tamil',
                duration: 169,
                release_date: new Date('2025-10-31'),
                poster_url: 'https://image.tmdb.org/t/p/w500/lmb8Y6aNMnPByOEY5a3R0v5FAlp.jpg'
            },
            {
                title: 'The Greatest of All Time',
                genre: 'Action',
                language: 'Tamil',
                duration: 178,
                release_date: new Date('2025-09-05'),
                poster_url: 'https://image.tmdb.org/t/p/w500/4bpLkjbPe5bYzcdvCfMkWGOAfqo.jpg'
            },
            {
                title: 'KGF Chapter 3',
                genre: 'Action',
                language: 'Kannada',
                duration: 170,
                release_date: new Date('2026-06-15'),
                poster_url: 'https://image.tmdb.org/t/p/w500/u1GhKyrjfEN8YXdRsGmT2PmhLIQ.jpg'
            },
            {
                title: 'Salaar: Part 2',
                genre: 'Action',
                language: 'Telugu',
                duration: 175,
                release_date: new Date('2026-04-10'),
                poster_url: 'https://image.tmdb.org/t/p/w500/75T7GVuNfbmmJhqEx1VGLe5lJdJ.jpg'
            },
            {
                title: 'Fighter',
                genre: 'Action',
                language: 'Hindi',
                duration: 155,
                release_date: new Date('2026-01-26'),
                poster_url: 'https://image.tmdb.org/t/p/w500/lReNqJZtaOmmqPSv7lnR7DKOTFJ.jpg'
            },
            {
                title: 'RRR',
                genre: 'Action',
                language: 'Telugu',
                duration: 190,
                release_date: new Date('2026-07-25'),
                poster_url: 'https://image.tmdb.org/t/p/w500/nEufeZYoDBPKgfOmLIorFfhwdg3.jpg'
            }
        ]);
        console.log(`   ✅ Inserted ${movies.length} movies`);

        // ===================== THEATRES =====================
        console.log('🏛️  Inserting theatres...');
        const theatres = await Theatre.insertMany([
            { name: 'PVR Cinemas', location: 'Hyderabad' },
            { name: 'INOX Megaplex', location: 'Mumbai' },
            { name: 'Cinepolis', location: 'Bangalore' },
            { name: 'AMB Cinemas', location: 'Hyderabad' },
            { name: 'Sathyam Cinemas', location: 'Chennai' },
            { name: 'PVR ICON', location: 'Delhi' },
            { name: 'Carnival Cinemas', location: 'Pune' },
            { name: 'Miraj Cinemas', location: 'Kolkata' }
        ]);
        console.log(`   ✅ Inserted ${theatres.length} theatres`);

        // ===================== SHOWS =====================
        console.log('🎭 Inserting shows...');
        const showsData = [
            // Pushpa 2 - multiple theatres & times
            { movie_id: movies[0]._id, theatre_id: theatres[0]._id, show_time: new Date('2026-04-14T10:00:00'), price: 250 },
            { movie_id: movies[0]._id, theatre_id: theatres[0]._id, show_time: new Date('2026-04-14T14:30:00'), price: 300 },
            { movie_id: movies[0]._id, theatre_id: theatres[3]._id, show_time: new Date('2026-04-14T18:00:00'), price: 350 },
            { movie_id: movies[0]._id, theatre_id: theatres[1]._id, show_time: new Date('2026-04-15T11:00:00'), price: 280 },
            // Stree 2
            { movie_id: movies[1]._id, theatre_id: theatres[1]._id, show_time: new Date('2026-04-14T09:30:00'), price: 220 },
            { movie_id: movies[1]._id, theatre_id: theatres[5]._id, show_time: new Date('2026-04-14T15:00:00'), price: 260 },
            { movie_id: movies[1]._id, theatre_id: theatres[6]._id, show_time: new Date('2026-04-15T20:00:00'), price: 200 },
            // Kalki 2898 AD
            { movie_id: movies[2]._id, theatre_id: theatres[0]._id, show_time: new Date('2026-04-14T11:30:00'), price: 300 },
            { movie_id: movies[2]._id, theatre_id: theatres[2]._id, show_time: new Date('2026-04-14T16:00:00'), price: 320 },
            { movie_id: movies[2]._id, theatre_id: theatres[4]._id, show_time: new Date('2026-04-15T19:00:00'), price: 280 },
            // Devara
            { movie_id: movies[3]._id, theatre_id: theatres[3]._id, show_time: new Date('2026-04-14T13:00:00'), price: 270 },
            { movie_id: movies[3]._id, theatre_id: theatres[0]._id, show_time: new Date('2026-04-15T10:30:00'), price: 250 },
            // Bhool Bhulaiyaa 3
            { movie_id: movies[4]._id, theatre_id: theatres[5]._id, show_time: new Date('2026-04-14T12:00:00'), price: 240 },
            { movie_id: movies[4]._id, theatre_id: theatres[1]._id, show_time: new Date('2026-04-14T21:00:00'), price: 300 },
            // Singham Again
            { movie_id: movies[5]._id, theatre_id: theatres[1]._id, show_time: new Date('2026-04-14T10:00:00'), price: 250 },
            { movie_id: movies[5]._id, theatre_id: theatres[6]._id, show_time: new Date('2026-04-15T17:00:00'), price: 230 },
            // Amaran
            { movie_id: movies[6]._id, theatre_id: theatres[4]._id, show_time: new Date('2026-04-14T14:00:00'), price: 260 },
            { movie_id: movies[6]._id, theatre_id: theatres[2]._id, show_time: new Date('2026-04-15T11:30:00'), price: 240 },
            // GOAT
            { movie_id: movies[7]._id, theatre_id: theatres[4]._id, show_time: new Date('2026-04-14T18:30:00'), price: 280 },
            { movie_id: movies[7]._id, theatre_id: theatres[2]._id, show_time: new Date('2026-04-15T15:00:00'), price: 260 },
            // KGF 3
            { movie_id: movies[8]._id, theatre_id: theatres[2]._id, show_time: new Date('2026-04-14T10:00:00'), price: 350 },
            { movie_id: movies[8]._id, theatre_id: theatres[3]._id, show_time: new Date('2026-04-14T19:30:00'), price: 400 },
            // Salaar 2
            { movie_id: movies[9]._id, theatre_id: theatres[0]._id, show_time: new Date('2026-04-14T21:00:00'), price: 320 },
            { movie_id: movies[9]._id, theatre_id: theatres[3]._id, show_time: new Date('2026-04-15T14:00:00'), price: 300 },
            // Fighter 2
            { movie_id: movies[10]._id, theatre_id: theatres[5]._id, show_time: new Date('2026-04-14T11:00:00'), price: 260 },
            { movie_id: movies[10]._id, theatre_id: theatres[7]._id, show_time: new Date('2026-04-15T16:30:00'), price: 240 },
            // RRR 2
            { movie_id: movies[11]._id, theatre_id: theatres[0]._id, show_time: new Date('2026-04-14T17:00:00'), price: 350 },
            { movie_id: movies[11]._id, theatre_id: theatres[3]._id, show_time: new Date('2026-04-15T20:00:00'), price: 380 },
        ];

        const shows = await Show.insertMany(showsData);
        console.log(`   ✅ Inserted ${shows.length} shows`);

        // ===================== SEATS =====================
        console.log('💺 Inserting seats for each show...');
        const rows = ['A', 'B', 'C', 'D', 'E'];
        const seatsPerRow = 10;
        let totalSeats = 0;

        for (const show of shows) {
            const seats = [];
            for (const row of rows) {
                for (let num = 1; num <= seatsPerRow; num++) {
                    seats.push({
                        show_id: show._id,
                        seat_number: `${row}${num}`,
                        status: 'available'
                    });
                }
            }
            await Seat.insertMany(seats);
            totalSeats += seats.length;
        }
        console.log(`   ✅ Inserted ${totalSeats} seats across ${shows.length} shows`);

        // ===================== ADMIN (ensure exists) =====================
        const existingAdmin = await Admin.findOne({ email: 'admin@bookmyshow.com' });
        if (!existingAdmin) {
            console.log('👤 Creating admin user...');
            const hashedPassword = await bcrypt.hash('admin123', 10);
            await Admin.create({
                name: 'Admin',
                email: 'admin@bookmyshow.com',
                password: hashedPassword
            });
            console.log('   ✅ Admin created (admin@bookmyshow.com / admin123)');
        } else {
            console.log('👤 Admin already exists, skipping...');
        }

        console.log('\n🎉 Database seeded successfully!');
        console.log('📊 Summary:');
        console.log(`   Movies:   ${movies.length}`);
        console.log(`   Theatres: ${theatres.length}`);
        console.log(`   Shows:    ${shows.length}`);
        console.log(`   Seats:    ${totalSeats}`);

        process.exit(0);
    } catch (err) {
        console.error('❌ Seeding failed:', err);
        process.exit(1);
    }
}

seedData();
