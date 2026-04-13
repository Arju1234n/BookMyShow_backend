const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");
const { protect, adminProtect } = require("../middleware/authMiddleware");

router.get("/booking/:bookingId", protect, paymentController.getPaymentByBooking);
router.post("/", protect, paymentController.processPayment);
router.put("/:paymentId/status", adminProtect, paymentController.updatePaymentStatus);

module.exports = router;
