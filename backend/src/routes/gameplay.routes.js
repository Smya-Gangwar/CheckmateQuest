const express = require("express");

const {
  getBoardState,
  openTile,
  submitAnswer,
  getHint,
} = require("../controllers/gameplay.controller");

const {
  getSessionsForRoom,
} = require("../controllers/room.controller");

const connectionController =
  require("../controllers/connection.controller");

const {
  authenticateGameConnection,
} = require("../middleware/gameConnection.middleware");

const router = express.Router();

router.get(
  "/sessions/:roomId",
  getSessionsForRoom
);

/*
 * Establish the one active connection
 * for this GameSession.
 */
router.post(
  "/sessions/:sessionId/connect",
  connectionController.connect
);

/*
 * Keep the connection alive.
 */
router.post(
  "/sessions/:sessionId/heartbeat",
  connectionController.heartbeat
);

/*
 * Release the connection when leaving
 * the game page.
 */
router.post(
  "/sessions/:sessionId/disconnect",
  connectionController.disconnect
);

/*
 * Everything that actually modifies or
 * reads game state now requires the
 * active connection token.
 */
router.get(
  "/sessions/:sessionId/board",
  authenticateGameConnection,
  getBoardState
);

router.post(
  "/sessions/:sessionId/open-tile",
  authenticateGameConnection,
  openTile
);

router.post(
  "/sessions/:sessionId/submit-answer",
  authenticateGameConnection,
  submitAnswer
);

router.post(
  "/sessions/:sessionId/hint",
  authenticateGameConnection,
  getHint
);

module.exports = router;