const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

const validateQuestion = (q) => {
  if (!q.content || !q.question_type || !q.answer) {
    return false;
  }

  if (!["MCQ", "ONE_WORD"].includes(q.question_type)) {
    return false;
  }

  if (q.question_type === "MCQ") {
    if (!Array.isArray(q.options) || q.options.length !== 4) {
      return false;
    }

    const badOptions = ["A", "B", "C", "D"];

    const placeholderOnly = q.options.every((opt) =>
      badOptions.includes(opt.trim())
    );

    if (placeholderOnly) {
      return false;
    }

    if (!q.options.includes(q.answer)) {
      return false;
    }
  }

  if (q.question_type === "ONE_WORD") {
    q.options = [];
  }

  return true;
};

const generateQuestions = async ({
  category,
  difficulty,
  count,
}) => {
  const prompt = `
Generate exactly ${count} quiz questions.

Rules:
- Category: ${category}
- Difficulty: ${difficulty}/10
- Mix MCQ and ONE_WORD naturally.
- Return ONLY raw JSON array.
- No markdown.
- No explanations.

STRICT MCQ RULES:
- options MUST contain 4 FULL answer texts.
- NEVER use placeholders like A/B/C/D.
- answer MUST exactly match one option.

STRICT ONE_WORD RULES:
- options MUST be [].

Example format:

[
  {
    "content": "Which planet is known as the Red Planet?",
    "question_type": "MCQ",
    "options": ["Earth", "Mars", "Venus", "Jupiter"],
    "answer": "Mars",
    "difficulty_score": ${difficulty},
    "category": "${category}"
  },
  {
    "content": "Capital of Japan?",
    "question_type": "ONE_WORD",
    "options": [],
    "answer": "Tokyo",
    "difficulty_score": ${difficulty},
    "category": "${category}"
  }
]
`;

  for (let attempt = 0; attempt < 3; attempt++) {
    const response =
      await client.chat.completions.create({
        model: "openrouter/free",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
      });

    const text = response.choices[0].message.content;

    const cleaned = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    try {
      const parsed = JSON.parse(cleaned);

      const valid = parsed.every(validateQuestion);

      if (valid) {
        return parsed;
      }

      console.log(
        `Invalid AI output. Retrying (${attempt + 1}/3)...`
      );
    } catch (err) {
      console.log(
        `JSON parse failed. Retrying (${attempt + 1}/3)...`
      );
    }
  }

  throw new Error("AI failed to generate valid questions.");
};

module.exports = {
  generateQuestions,
};