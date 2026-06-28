const express = require("express");

const router = express.Router();

const leaderboardController = require("../controllers/leaderboard.controller");

router.get(
  "/rooms/:roomId/leaderboard",
  leaderboardController.getLeaderboard
);

module.exports = router;