const prisma = require("../prisma/client");
const aiService = require("../services/ai.service");
const questionService = require("../services/question.service");

const generateQuestions = async (req, res) => {
    try {
        const {category, difficulty, count,} = req.body;
        const questions = await aiService.generateQuestions({category, difficulty, count,});
        res.json({
            questions,
        });
    } catch (error) {
        console.error("AI GENERATION ERROR:");
        console.error(error);
        res.status(500).json({
            error: error.message || JSON.stringify(error),
        });
    }
};

const saveQuestions = async (req, res) => {
    try {
        const { questions } = req.body;
        const saved = await prisma.question.createMany({
            data: questions.map((q) => ({
                content: q.content,
                question_type: q.question_type,
                options: q.options,
                answer: q.answer,
                difficulty_score: q.difficulty_score,
                category: q.category,
            })),
        });

        res.json({
            saved: saved.count,
        });
    } catch (error) {
        console.error(error);
        res.status(400).json({
            error: error.message,
        });
    }
};

module.exports = {
    generateQuestions,
    saveQuestions,
};