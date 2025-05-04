const express = require("express");
const router = express.Router();
const bidController = require("../controllers/bidController");
const authMiddleware = require("../middleware/auth");

router.post("/submit", authMiddleware, bidController.submitBid);
router.get("/job/:jobId", authMiddleware, bidController.getBidsForJob);

module.exports = router;