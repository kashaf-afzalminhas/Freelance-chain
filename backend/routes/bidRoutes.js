const express = require("express");
const router = express.Router();
const bidController = require("../controllers/bidController");
const authMiddleware = require("../middleware/auth");

router.post("/submit", authMiddleware, bidController.submitBid);
router.get("/job/:jobId", authMiddleware, bidController.getBidsForJob);
router.put("/:id/status", authMiddleware, bidController.updateBidStatus);
router.get("/my-bids", authMiddleware, bidController.getMyBids);
router.put("/:id", authMiddleware, bidController.updateBid); // New route for bid updates

module.exports = router;