import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import api from "../services/api";

const AdminCreateQuestionPage = () => {
  const navigate = useNavigate();

  const [content, setContent] = useState("");
  const [questionType, setQuestionType] = useState("ONE_WORD");
  const [option1, setOption1] = useState("");
  const [option2, setOption2] = useState("");
  const [option3, setOption3] = useState("");
  const [option4, setOption4] = useState("");
  const [answer, setAnswer] = useState("");
  const [difficulty, setDifficulty] = useState(1);
  const [category, setCategory] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const isOneWordInvalid =
    !content.trim() ||
    !answer.trim() ||
    !category.trim() ||
    !String(difficulty).trim();

  const isMCQInvalid =
    questionType === "MCQ" &&
    (
      !content.trim() ||
      !answer.trim() ||
      !category.trim() ||
      !String(difficulty).trim() ||
      [option1, option2, option3, option4].some(
        (opt) => !opt.trim()
      )
    );

  const isFormInvalid =
    questionType === "MCQ"
      ? isMCQInvalid
      : isOneWordInvalid;

  const createQuestion = async (e) => {
    e.preventDefault();
    if (isFormInvalid) {
      alert(
        questionType === "MCQ"
          ? "Please fill all required fields and all options."
          : "Please fill all required fields."
      );
      return;
    }
    try {
      setLoading(true);
      await api.post("/admin/questions", {
        content,
        question_type: questionType,
        options:
          questionType === "MCQ"
            ? [option1, option2, option3, option4]
            : null,
        answer,
        difficulty_score: Number(difficulty),
        category,
        image_url: imageUrl || null,
      });
      navigate("/admin/questions");
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="min-h-screen bg-black text-white px-6 py-10">
    <div className="max-w-5xl mx-auto">
      <button
        onClick={() => navigate("/admin/questions")}
        className="flex items-center gap-2 text-gray-400 hover:text-white mb-8"
      >
        <ArrowLeft size={18} />
        Back
      </button>

      <div className="flex justify-center">
        <div className="w-full max-w-3xl bg-white/5 rounded-3xl border border-white/10 p-8 backdrop-blur-xl">
          <h1 className="text-4xl font-bold mb-8 text-center">
            Create Question
          </h1>

          <form
            onSubmit={createQuestion}
            className="space-y-4"
          >

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Question"
            className="w-full p-4 bg-white/5 rounded-xl"
          />

          <select
            value={questionType}
            onChange={(e) =>
              setQuestionType(e.target.value)
            }
            className="w-full p-4 bg-white/5 rounded-xl"
          >
            <option value="ONE_WORD">ONE_WORD</option>
            <option value="MCQ">MCQ</option>
          </select>

          {questionType === "MCQ" &&
            [option1, option2, option3, option4].map(
              (opt, i) => (
                <input
                  key={i}
                  value={opt}
                  onChange={(e) =>
                    [setOption1, setOption2, setOption3, setOption4][i](e.target.value)
                  }
                  placeholder={`Option ${i + 1}`}
                  className="w-full p-4 bg-white/5 rounded-xl"
                />
              )
            )}

          <input
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Answer"
            className="w-full p-4 bg-white/5 rounded-xl"
          />

          <input
            type="number"
            min="1"
            max="10"
            value={difficulty}
            onChange={(e) =>
              setDifficulty(e.target.value)
            }
            className="w-full p-4 bg-white/5 rounded-xl"
          />

          <input
            value={category}
            onChange={(e) =>
              setCategory(e.target.value)
            }
            placeholder="Category"
            className="w-full p-4 bg-white/5 rounded-xl"
          />

          <input
            value={imageUrl}
            onChange={(e) =>
              setImageUrl(e.target.value)
            }
            placeholder="Image URL"
            className="w-full p-4 bg-white/5 rounded-xl"
          />

          <button
            disabled={loading || isMCQInvalid}
            className={`w-full font-bold py-4 rounded-xl ${
              loading || isFormInvalid
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-white text-black"
            }`}
          >
            {loading ? "Creating..." : "Create Question"}
          </button>
        </form>
        </div>
      </div>
    </div>
  </div>
);
};

export default AdminCreateQuestionPage;