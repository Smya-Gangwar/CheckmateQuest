const express = require("express");

const {
  getBoardState,
  openTile,
  submitAnswer,
  getHint,
} = require("../controllers/gameplay.controller");

const {
  getSessionsForRoom
} = require("../controllers/room.controller");

const router = express.Router();

router.get(
  "/sessions/:roomId",
  getSessionsForRoom
);

router.get(
  "/sessions/:sessionId/board",
  getBoardState
);

router.post(
  "/sessions/:sessionId/open-tile",
  openTile
);

router.post(
  "/sessions/:sessionId/submit-answer",
  submitAnswer
);

router.post(
  "/sessions/:sessionId/hint",
  getHint
);

module.exports = router;