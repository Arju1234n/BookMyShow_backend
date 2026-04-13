const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { adminProtect } = require('../middleware/authMiddleware');

// Configure multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// File filter (optional but good practice)
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Not an image! Please upload an image.'), false);
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 5 // 5MB limit
    }
});

router.post('/', adminProtect, upload.single('poster'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Please upload a file' });
        }
        
        // Return the path starting with /uploads/ so frontend can easily construct the URL
        const imageUrl = `/uploads/${req.file.filename}`;
        
        res.status(200).json({ 
            message: 'Image uploaded successfully',
            imageUrl: imageUrl
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error during upload' });
    }
});

module.exports = router;
