const OpenAI = require("openai");

const client = new OpenAI({
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: "https://openrouter.ai/api/v1",
});

const generateQuestions = async ({category, difficulty, count,}) => {
    const prompt = `
Generate exactly ${count} quiz questions.

Requirements:
- Category: ${category}
- Difficulty: ${difficulty}/10
- Mix MCQ and ONE_WORD naturally.
- Return STRICT JSON ONLY.
- No markdown.
- No explanations.

Format:

[
  {
    "content":"...",
    "question_type":"MCQ",
    "options":["A","B","C","D"],
    "answer":"...",
    "difficulty_score":${difficulty},
    "category":"${category}"
  }
]

ONE_WORD questions:
- options must be null.

IMPORTANT:
question_type MUST be EXACTLY one of: 
MCQ
ONE_WORD

Never use:
MCU
Multiple Choice
Multiple_Choice
ONEWORD
`;

    const response = await client.chat.completions.create({
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
    const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(cleaned);
};

module.exports = {
    generateQuestions,
};