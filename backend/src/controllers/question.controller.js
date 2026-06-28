const questionService = require(
  "../services/question.service"
);

const getQuestions = async (req, res) => {
  try {
    const questions = await questionService.getQuestions(req.query);
    res.json(questions);
  } catch (error) {
    console.error(error);
    res.status(400).json({
      error: error.message,
    });
  }
};

const getQuestionById = async (req, res) => {
  try {
    const question = await questionService.getQuestionById(Number(req.params.id));
    res.json(question);
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
};

const createQuestion = async (req, res) => {
  try {
    const question = await questionService.createQuestion(req.body);
    res.status(201).json(question);
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
};

const updateQuestion = async (req, res) => {
  try {
    const question = await questionService.updateQuestion(
        Number(req.params.id),
        req.body
      );
    res.json(question);
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
};

const deleteQuestion = async (req, res) => {
  try {
    const result = await questionService.deleteQuestion(
        Number(req.params.id)
      );
    res.json(result);
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
};

const exportQuestionsCSV = async (req, res) => {
  try {
    const csv = await questionService.exportQuestionsCSV();
    res.setHeader("Content-Type","text/csv");
    res.setHeader("Content-Disposition","attachment; filename=questions.csv");
    res.send(csv);
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
};

module.exports = {
  getQuestions,
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  exportQuestionsCSV,
};