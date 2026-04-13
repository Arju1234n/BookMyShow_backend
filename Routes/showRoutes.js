const express = require("express");
const router = express.Router();
const showController = require("../controllers/showController");
const { adminProtect } = require("../middleware/authMiddleware");

router.get("/", showController.getAllShows);
router.get("/movie/:movieId", showController.getShowsByMovie);
router.post("/", adminProtect, showController.createShow);
router.delete("/:showId", adminProtect, showController.deleteShow);

module.exports = router;
