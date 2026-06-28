const express = require("express");
const router = express.Router();

const {
  authenticateAdmin,
} = require("../middleware/auth.middleware");

const questionController = require(
  "../controllers/question.controller"
);

router.get(
  "/",
  authenticateAdmin,
  questionController.getQuestions
);

router.get(
  "/export",
  authenticateAdmin,
  questionController.exportQuestionsCSV
);

router.get(
  "/:id",
  authenticateAdmin,
  questionController.getQuestionById
);

router.post(
  "/",
  authenticateAdmin,
  questionController.createQuestion
);

router.patch(
  "/:id",
  authenticateAdmin,
  questionController.updateQuestion
);

router.delete(
  "/:id",
  authenticateAdmin,
  questionController.deleteQuestion
);

module.exports = router;