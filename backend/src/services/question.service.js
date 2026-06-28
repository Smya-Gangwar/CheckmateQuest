const prisma = require("../prisma/client");

const getQuestions = async (query) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 20;
  const skip = (page - 1) * limit;
  const where = {};

  if (query.search) {
    where.content = {
      contains: query.search,
    };
  }

  if (query.category) {
    where.category = query.category;
  }

  if (query.difficulty) {
    where.difficulty_score = Number(query.difficulty);
  }

  const [questions, total] =
    await Promise.all([
      prisma.question.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          created_at: "desc",
        },
      }),

      prisma.question.count({
        where,
      }),
    ]);

  return {
    questions,
    total,
    page,
    pages: Math.ceil(total / limit),
  };
};

const getQuestionById = async (id) => {
  const question = await prisma.question.findUnique({
    where: {
      id,
    },
  });

  if (!question) {
    throw new Error("Question not found");
  }

  return question;
};

const createQuestion = async (data) => {
  return prisma.question.create({
    data,
  });
};

const updateQuestion = async (id, data) => {
  const existing = await prisma.question.findUnique({
    where: {
      id,
    },
  });

  if (!existing) {
    throw new Error("Question not found");
  }

  return prisma.question.update({
    where: {
      id,
    },
    data,
  });
};

const deleteQuestion = async (id) => {
  const existing = await prisma.question.findUnique({
    where: {
      id,
    },
  });

  if (!existing) {
    throw new Error("Question not found");
  }

  await prisma.question.delete({
    where: {
      id,
    },
  });

  return {
    success: true,
  };
};

const exportQuestionsCSV = async () => {
  const questions = await prisma.question.findMany({
    orderBy: {
      created_at: "desc",
    },
  });

  const headers = [
    "id",
    "content",
    "question_type",
    "answer",
    "difficulty_score",
    "category",
    "image_url",
  ];

  const rows = questions.map((q) => [
    q.id,
    `"${q.content?.replace(/"/g, '""')}"`,
    q.question_type,
    `"${q.answer?.replace(/"/g, '""')}"`,
    q.difficulty_score,
    q.category,
    q.image_url || "",
  ]);

  const csv = [
    headers.join(","),
    ...rows.map((row) => row.join(",")),
  ].join("\n");

  return csv;
};

const bulkCreateQuestions = async (questions) => {
    await prisma.question.createMany({
        data: questions,
    });
    return {
        success: true,
        inserted: questions.length,
    };
};

module.exports = {
  getQuestions,
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  exportQuestionsCSV,
  bulkCreateQuestions
};