const express = require("express");
const router = express.Router();
const movieController = require("../controllers/movieController");
const { adminProtect } = require("../middleware/authMiddleware");

router.get("/", movieController.getAllMovies);
router.post("/", adminProtect, movieController.createMovie);
router.put("/:movieId", adminProtect, movieController.updateMovie);
router.delete("/:movieId", adminProtect, movieController.deleteMovie);

module.exports = router;