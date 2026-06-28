import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  PlusCircle,
  Download,
  Sparkles,
  ArrowLeft,
  Search,
} from "lucide-react";
import { motion } from "framer-motion";
import api from "../services/api";
import AdminGenerateQuestionsModal from "../components/AdminGenerateQuestionsModal";

const AdminQuestionsPage = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [showAI, setShowAI] = useState(false);
  const [stats, setStats] = useState({ total: 0 });

  const fetchQuestions = async () => {
    try {
      const response = await api.get("/admin/questions", {
        params: {
          page,
          limit: 20,
          search,
          category,
          difficulty,
        },
      });

      setQuestions(response.data.questions);
      setStats({ total: response.data.total });
      setPages(response.data.pages);
    } catch (error) {
      console.error(error);
    }
  };

  const exportCSV = async () => {
    try {
      const response = await api.get("/admin/questions/export", {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(
        new Blob([response.data])
      );
      const link = document.createElement("a");
      link.href = url;
      link.download = "questions.csv";
      link.click();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteQuestion = async (id) => {
    const confirmed = window.confirm("Delete this question?");
    if (!confirmed) return;

    try {
      await api.delete(`/admin/questions/${id}`);
      setQuestions((prev) =>
        prev.filter((q) => q.id !== id)
      );
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [page, search, category, difficulty]);

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">

        <button
          onClick={() => navigate("/admin")}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-8"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <h1 className="text-5xl font-bold mb-10">
          Question Management
        </h1>

        {/* Actions */}
        <div className="flex flex-wrap gap-4 mb-8">
          <button
            onClick={() =>
              navigate("/admin/questions/create")
            }
            className="bg-white text-black px-5 py-3 rounded-xl flex items-center gap-2"
          >
            <PlusCircle size={18} />
            Add Question
          </button>

          <button
            onClick={exportCSV}
            className="border border-white/20 px-5 py-3 rounded-xl flex items-center gap-2"
          >
            <Download size={18} />
            Export CSV
          </button>

          <button
            onClick={() => setShowAI(true)}
            className="bg-purple-600 px-5 py-3 rounded-xl flex items-center gap-2"
          >
            <Sparkles size={18} />
            Generate AI
          </button>
        </div>

        {/* Stats */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
          <h2 className="text-xl font-semibold">
            Total Questions: {stats.total}
          </h2>
        </div>

        {/* Filters */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="flex items-center bg-white/5 rounded-xl px-4">
            <Search size={16} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="bg-transparent w-full p-4 outline-none"
            />
          </div>

          <input
            type="text"
            placeholder="Category"
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(1);
            }}
            className="bg-white/5 p-4 rounded-xl"
          />

          <input
            type="number"
            placeholder="Difficulty"
            value={difficulty}
            onChange={(e) => {
              setDifficulty(e.target.value);
              setPage(1);
            }}
            className="bg-white/5 p-4 rounded-xl"
          />
        </div>

        {/* Table */}
        <div className="bg-white/5 rounded-2xl overflow-hidden border border-white/10">
        <table className="w-full table-fixed">
            <thead className="bg-white/10">
            <tr className="text-left">
                <th className="px-6 py-4 w-[80px]">ID</th>
                <th className="px-6 py-4">Question</th>
                <th className="px-6 py-4 w-[140px]">Type</th>
                <th className="px-6 py-4 w-[180px]">Category</th>
                <th className="px-6 py-4 w-[120px]">Difficulty</th>
                <th className="px-6 py-4 w-[220px]">Actions</th>
            </tr>
            </thead>

            <tbody>
            {questions.map((question, index) => (
                <motion.tr
                key={question.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.03 }}
                className="border-t border-white/10 text-left align-top"
                >
                <td className="px-6 py-4">{question.id}</td>

                <td className="px-6 py-4 break-words">
                    {question.content}
                </td>

                <td className="px-6 py-4">
                    {question.question_type}
                </td>

                <td className="px-6 py-4">
                    {question.category}
                </td>

                <td className="px-6 py-4">
                    {question.difficulty_score}
                </td>

                <td className="px-6 py-4">
                    <div className="flex gap-2">
                    <button
                        onClick={() =>
                        navigate(
                            `/admin/questions/${question.id}/edit`
                        )
                        }
                        className="bg-yellow-500 px-4 py-2 rounded-lg"
                    >
                        Edit
                    </button>

                    <button
                        onClick={() =>
                        deleteQuestion(question.id)
                        }
                        className="bg-red-500 px-4 py-2 rounded-lg"
                    >
                        Delete
                    </button>
                    </div>
                </td>
                </motion.tr>
            ))}

            {questions.length === 0 && (
                <tr>
                <td
                    colSpan={6}
                    className="text-center py-10 text-gray-400"
                >
                    No Questions Found
                </td>
                </tr>
            )}
            </tbody>
        </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="bg-white/10 px-4 py-2 rounded-xl"
          >
            Previous
          </button>

          <div className="px-4 py-2">
            {page} / {pages}
          </div>

          <button
            disabled={page === pages}
            onClick={() => setPage(page + 1)}
            className="bg-white/10 px-4 py-2 rounded-xl"
          >
            Next
          </button>
        </div>

        <AdminGenerateQuestionsModal
          isOpen={showAI}
          onClose={() => setShowAI(false)}
          onSaved={fetchQuestions}
        />
      </div>
    </div>
  );
};

export default AdminQuestionsPage;