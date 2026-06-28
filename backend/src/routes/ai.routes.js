const express = require("express");
const router = express.Router();

const {
    authenticateAdmin,
} = require("../middleware/auth.middleware");

const aiController = require("../controllers/ai.controller");

router.post(
    "/generate",
    authenticateAdmin,
    aiController.generateQuestions
);

router.post(
    "/save",
    authenticateAdmin,
    aiController.saveQuestions
);

module.exports = router;