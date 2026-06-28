const express = require("express");

// Importing room controller functions
const {
  createRoom,
  getRooms,
  joinRoom,
  getRoomTeams,
  startMatch,
  getRoomById,
} = require("../controllers/room.controller");

const leaderboardController = require(
  "../controllers/leaderboard.controller"
);

const {
  authenticateAdmin,
} = require("../middleware/auth.middleware");

const adminController = require("../controllers/admin.controller");

const router = express.Router();

// POST route for creating a new room - to send room data on server
router.post("/", authenticateAdmin, createRoom);

// GET route for fetching all rooms - to retrieve existing room data from server
router.get("/", getRooms);

// POST route for joining a room
router.post("/join", joinRoom);

router.get("/:roomId", getRoomById);

// GET route for fetching teams in a specific room
router.get("/:roomId/teams", getRoomTeams);

router.post("/:roomId/start", authenticateAdmin, startMatch);

router.get(
  "/:roomId/leaderboard",
  authenticateAdmin,
  leaderboardController.getLeaderboard
);

router.get(
  "/:roomId/analytics",
  authenticateAdmin,
  adminController.getAnalytics
);

// Exporting the router
module.exports = router;