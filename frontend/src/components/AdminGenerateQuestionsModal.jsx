import { useState } from "react";
import { Sparkles, X } from "lucide-react";
import api from "../services/api";

const AdminGenerateQuestionsModal = ({
  isOpen,
  onClose,
  onSaved,
}) => {
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState(5);
  const [count, setCount] = useState(5);
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState([]);

  if (!isOpen) return null;

  const generate = async () => {
    try {
      setLoading(true);

      const response = await api.post(
        "/admin/ai/generate",
        {
          category,
          difficulty,
          count,
        }
      );

      const questions = response.data.questions.map((q) => {
        let normalizedOptions = q.options;
        let normalizedAnswer = q.answer;

        if (
          q.question_type === "MCQ" &&
          q.options &&
          !Array.isArray(q.options)
        ) {
          normalizedOptions = Object.values(q.options);
          if (
            typeof q.answer === "string" &&
            ["A", "B", "C", "D"].includes(q.answer.trim())
          ) {
            const answerIndex = q.answer.trim().charCodeAt(0) - 65;
            normalizedAnswer = normalizedOptions[answerIndex] || "";
          }
        }

        return {
          ...q,
          options: normalizedOptions,
          answer: normalizedAnswer,
          selected: true,
        };
      });
      setGenerated(questions);
    } catch (error) {
      alert(error.response?.data?.error || "Generation failed");
    } finally {
      setLoading(false);
    }
  };

  const updateQuestion = (
    index,
    field,
    value
  ) => {
    setGenerated((prev) =>
      prev.map((q, i) =>
        i === index ? { ...q, [field]: value } : q
      )
    );
  };

  const updateOption = (
    qIndex,
    optionIndex,
    value
  ) => {
    setGenerated((prev) =>
      prev.map((q, i) => {
        if (i !== qIndex) return q;
        const options = [...q.options];
        options[optionIndex] = value;
        return {
          ...q,
          options,
        };
      })
    );
  };

  const saveSelected = async () => {
    const selectedQuestions = generated.filter(
        (q) => q.selected
    );

    if (!selectedQuestions.length) {
      alert("No questions selected");
      return;
    }

    const invalidQuestions = selectedQuestions.filter(
        (q) => {
            const commonInvalid =
            !q.content?.trim() ||
            !q.answer?.trim() ||
            !q.category?.trim() ||
            !String(q.difficulty_score).trim();

            if (q.question_type === "MCQ") {
                return (
                    commonInvalid ||
                    !q.options ||
                    q.options.length < 4 ||
                    q.options.some(
                    (opt) => !opt.trim()
                    )
                );
            }
            return commonInvalid;
        }
    );

    if (invalidQuestions.length > 0) {
        alert("All selected MCQ questions must have all option fields filled.");
        return;
    }

    try {
      await api.post("/admin/ai/save", {
        questions: selectedQuestions,
      });

      alert(
        `${selectedQuestions.length} questions saved`
      );

      onSaved();
      onClose();
    } catch (error) {
      console.error(error);
      alert("Save failed");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex justify-center items-center p-8">
      <div className="w-full max-w-5xl max-h-[90vh] overflow-auto bg-white/5 border border-white/10 rounded-3xl p-8 text-white">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold flex items-center gap-2">
            <Sparkles />
            AI Generator
          </h2>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X />
          </button>
        </div>

        {/* Generator Inputs */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block mb-2 text-sm text-gray-400">
              Category
            </label>
            <input
              value={category}
              onChange={(e) =>
                setCategory(e.target.value)
              }
              className="w-full bg-white/5 p-4 rounded-xl border border-white/10"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm text-gray-400">
              Difficulty (1–10)
            </label>
            <input
              type="number"
              min={1}
              max={10}
              value={difficulty}
              onChange={(e) =>
                setDifficulty(
                  Number(e.target.value)
                )
              }
              className="w-full bg-white/5 p-4 rounded-xl border border-white/10"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm text-gray-400">
              Number of Questions
            </label>
            <input
              type="number"
              min={1}
              max={20}
              value={count}
              onChange={(e) =>
                setCount(Number(e.target.value))
              }
              className="w-full bg-white/5 p-4 rounded-xl border border-white/10"
            />
          </div>
        </div>

        <button
          onClick={generate}
          disabled={loading || !category.trim()}
          className="bg-purple-600 px-6 py-3 rounded-xl mb-8 hover:bg-purple-500 transition"
        >
          {loading
            ? "Generating..."
            : "Generate Questions"}
        </button>

        {/* Generated Questions */}
        {generated.length > 0 && (
          <>
            <div className="space-y-6">
              {generated.map((q, index) => (
                <div
                  key={index}
                  className="bg-white/5 p-5 rounded-2xl border border-white/10"
                >
                  {/* Checkbox */}
                  <div className="mb-4">
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={q.selected}
                        onChange={(e) =>
                          updateQuestion(
                            index,
                            "selected",
                            e.target.checked
                          )
                        }
                      />
                      <span className="text-sm text-gray-300">
                        Save this question
                      </span>
                    </label>
                  </div>

                  {/* Question */}
                  <textarea
                    value={q.content}
                    onChange={(e) =>
                      updateQuestion(
                        index,
                        "content",
                        e.target.value
                      )
                    }
                    className="w-full bg-black/30 p-4 rounded-xl mb-4"
                  />

                  {/* Metadata */}
                  <div className="grid md:grid-cols-3 gap-4 mb-4">
                    <input
                      value={q.category}
                      onChange={(e) =>
                        updateQuestion(
                          index,
                          "category",
                          e.target.value
                        )
                      }
                      className="bg-black/30 p-3 rounded-xl"
                    />

                    <input
                      type="number"
                      value={q.difficulty_score}
                      onChange={(e) =>
                        updateQuestion(
                          index,
                          "difficulty_score",
                          Number(e.target.value)
                        )
                      }
                      className="bg-black/30 p-3 rounded-xl"
                    />

                    <select
                      value={q.question_type}
                      onChange={(e) =>
                        updateQuestion(
                          index,
                          "question_type",
                          e.target.value
                        )
                      }
                      className="bg-black/30 p-3 rounded-xl"
                    >
                      <option value="MCQ">MCQ</option>
                      <option value="ONE_WORD">
                        ONE_WORD
                      </option>
                    </select>
                  </div>

                  {/* MCQ Options */}
                  {q.question_type === "MCQ" &&
                    q.options?.length > 0 && (
                      <div className="space-y-2 mb-4">
                        {q.options.map(
                          (option, optionIndex) => (
                            <input
                              key={optionIndex}
                              value={option}
                              onChange={(e) =>
                                updateOption(
                                  index,
                                  optionIndex,
                                  e.target.value
                                )
                              }
                              className="w-full bg-black/30 p-3 rounded-xl"
                            />
                          )
                        )}
                      </div>
                    )}

                  {/* Correct Answer */}
                  <div>
                    <label className="block mb-2 text-sm text-gray-400">
                      Correct Answer
                    </label>

                    <input
                      value={q.answer}
                      onChange={(e) =>
                        updateQuestion(
                          index,
                          "answer",
                          e.target.value
                        )
                      }
                      className="w-full bg-black/30 p-3 rounded-xl"
                    />
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={saveSelected}
              className="bg-green-600 px-6 py-3 rounded-xl mt-8 hover:bg-green-500 transition"
            >
              Save Selected Questions
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminGenerateQuestionsModal;