const express = require("express");
const router = express.Router();
const ticketController = require("../controllers/ticketController");
const { protect } = require("../middleware/authMiddleware");

router.get("/booking/:bookingId", protect, ticketController.getTicketByBooking);
router.post("/", protect, ticketController.generateTicket);

module.exports = router;
