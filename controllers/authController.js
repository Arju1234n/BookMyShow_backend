const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validate required fields
        if (!name || !email || !password) {
            return res.status(400).json({ error: "Name, email and password are required" });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: "Invalid email format" });
        }

        // Validate password length
        if (password.length < 6) {
            return res.status(400).json({ error: "Password must be at least 6 characters" });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const userData = { name, email, password: hashedPassword };

        User.create(userData, (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY' || err.code === 11000) {
                    return res.status(400).json({ error: "Email already exists" });
                }
                return res.status(500).json({ error: "Failed to register user" });
            }
            res.status(201).json({ message: "User registered successfully", userId: result.insertId });
        });
    } catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
};

const login = (req, res) => {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }

    User.findByEmail(email, async (err, results) => {
        if (err) return res.status(500).json({ error: "Internal server error" });
        if (results.length === 0) return res.status(401).json({ error: "Invalid email or password" });

        const user = results[0];

        // Compare hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user.user_id, email: user.email, role: 'user' },
            process.env.JWT_SECRET || 'bookmyshow_secret_key_2026',
            { expiresIn: '7d' }
        );

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user.user_id,
                name: user.name,
                email: user.email
            }
        });
    });
};

const getProfile = (req, res) => {
    const userId = req.params.userId;
    User.findById(userId, (err, results) => {
        if (err) return res.status(500).json({ error: "Failed to fetch profile" });
        if (results.length === 0) return res.status(404).json({ error: "User not found" });
        res.status(200).json(results[0]);
    });
};

const updateProfile = (req, res) => {
    const userId = req.params.userId;
    const { name, email } = req.body;

    if (!name || !email) {
        return res.status(400).json({ error: "Name and email are required" });
    }

    User.updateProfile(userId, { name, email }, (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY' || err.code === 11000) {
                return res.status(400).json({ error: "Email already in use" });
            }
            return res.status(500).json({ error: "Failed to update profile" });
        }
        res.status(200).json({ message: "Profile updated successfully" });
    });
};

module.exports = {
    register,
    login,
    getProfile,
    updateProfile
};
