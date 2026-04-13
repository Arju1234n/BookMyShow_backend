const express = require("express");
const router = express.Router();
const theatreController = require("../controllers/theatreController");
const { adminProtect } = require("../middleware/authMiddleware");

router.get("/", theatreController.getAllTheatres);
router.post("/", adminProtect, theatreController.createTheatre);
router.put("/:theatreId", adminProtect, theatreController.updateTheatre);

module.exports = router;
