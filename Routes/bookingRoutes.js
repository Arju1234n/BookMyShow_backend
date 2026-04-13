const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");
const { protect, adminProtect } = require("../middleware/authMiddleware");

router.get("/", adminProtect, bookingController.getAllBookings);
router.get("/user/:userId", protect, bookingController.getBookingsByUser);
router.post("/", protect, bookingController.createBooking);
router.delete("/:bookingId", protect, bookingController.cancelBooking);

module.exports = router;
