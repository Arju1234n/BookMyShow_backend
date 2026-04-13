const Admin = require('../models/adminModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ error: "Name, email and password are required" });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: "Invalid email format" });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: "Password must be at least 6 characters" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const adminData = { name, email, password: hashedPassword };

        Admin.create(adminData, (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY' || err.code === 11000) {
                    return res.status(400).json({ error: "Email already exists" });
                }
                return res.status(500).json({ error: "Failed to register admin" });
            }
            res.status(201).json({ message: "Admin registered successfully", adminId: result.insertId });
        });
    } catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
};

const login = (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }

    Admin.findByEmail(email, async (err, results) => {
        if (err) return res.status(500).json({ error: "Internal server error" });
        if (results.length === 0) return res.status(401).json({ error: "Invalid email or password" });

        const admin = results[0];

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const token = jwt.sign(
            { id: admin.admin_id, email: admin.email, role: 'admin' },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(200).json({
            message: "Admin login successful",
            token,
            admin: {
                id: admin.admin_id,
                name: admin.name,
                email: admin.email
            }
        });
    });
};

module.exports = {
    register,
    login
};
