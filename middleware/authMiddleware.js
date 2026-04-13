const jwt = require('jsonwebtoken');

// Middleware to verify a user or admin is logged in
const protect = (req, res, next) => {
    let token;
    
    // Check if Authorization header exists and starts with "Bearer"
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Extract token
            token = req.headers.authorization.split(' ')[1];
            
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'bookmyshow_secret_key_2026');
            
            // Attach user details to request
            req.user = decoded;
            
            next();
        } catch (error) {
            console.error('JWT Verification Error:', error.message);
            res.status(401).json({ error: "Not authorized, token failed" });
        }
    } else {
        res.status(401).json({ error: "Not authorized, no token" });
    }
};

// Middleware to specifically verify an Admin is logged in
const adminProtect = (req, res, next) => {
    protect(req, res, () => {
        if (req.user && req.user.role === 'admin') {
            next();
        } else {
            res.status(403).json({ error: "Not authorized as an admin" });
        }
    });
};

module.exports = { protect, adminProtect };
