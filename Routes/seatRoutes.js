const express = require("express");
const router = express.Router();
const seatController = require("../controllers/seatController");
const { protect, adminProtect } = require("../middleware/authMiddleware");

router.get("/show/:showId", seatController.getSeatsForShow);
router.post("/", adminProtect, seatController.addSeat);
router.put("/:seatId/status", protect, seatController.updateSeatStatus);

module.exports = router;
