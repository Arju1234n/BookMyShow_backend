CREATE DATABASE IF NOT EXISTS movie_booking_db;
USE movie_booking_db;

-- drop existing tables to recreate them according to the new schema
DROP TABLE IF EXISTS tickets;
DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS seats;
DROP TABLE IF EXISTS shows;
DROP TABLE IF EXISTS theatres;
DROP TABLE IF EXISTS movies;
DROP TABLE IF EXISTS admins;
DROP TABLE IF EXISTS users;

-- user table
CREATE TABLE users (
user_id INT AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(100),
email VARCHAR(100) UNIQUE,
password VARCHAR(255),
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- admin table
CREATE TABLE admins (
admin_id INT AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(100),
email VARCHAR(100),
password VARCHAR(255)
);

-- movie table
CREATE TABLE movies (
movie_id INT AUTO_INCREMENT PRIMARY KEY,
title VARCHAR(200),
genre VARCHAR(100),
language VARCHAR(50),
duration INT,
release_date DATE,
poster_url VARCHAR(500)
);

-- theatre table 
CREATE TABLE theatres (
theatre_id INT AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(150),
location VARCHAR(150)
);

-- show_table
CREATE TABLE shows (
show_id INT AUTO_INCREMENT PRIMARY KEY,
movie_id INT,
theatre_id INT,
show_time DATETIME,
price DECIMAL(10,2),
FOREIGN KEY (movie_id) REFERENCES movies(movie_id),
FOREIGN KEY (theatre_id) REFERENCES theatres(theatre_id)
);

-- seat_ table
CREATE TABLE seats (
seat_id INT AUTO_INCREMENT PRIMARY KEY,
show_id INT,
seat_number VARCHAR(10),
status VARCHAR(20) DEFAULT 'available',
FOREIGN KEY (show_id) REFERENCES shows(show_id)
);
-- booking table

CREATE TABLE bookings (
booking_id INT AUTO_INCREMENT PRIMARY KEY,
user_id INT,
show_id INT,
booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
total_amount DECIMAL(10,2),
FOREIGN KEY (user_id) REFERENCES users(user_id),
FOREIGN KEY (show_id) REFERENCES shows(show_id)
);

-- payment table

CREATE TABLE payments (
payment_id INT AUTO_INCREMENT PRIMARY KEY,
booking_id INT,
amount DECIMAL(10,2),
payment_method VARCHAR(50),
payment_status VARCHAR(20),
FOREIGN KEY (booking_id) REFERENCES bookings(booking_id)
);

-- ticket table
CREATE TABLE tickets (
ticket_id INT AUTO_INCREMENT PRIMARY KEY,
booking_id INT,
seat_number VARCHAR(10),
qr_code TEXT,
FOREIGN KEY (booking_id) REFERENCES bookings(booking_id)
);
