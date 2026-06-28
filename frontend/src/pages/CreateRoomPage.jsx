import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  PlusSquare,
} from "lucide-react";
import api from "../services/api";

const CreateRoomPage = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [maxTeams, setMaxTeams] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const admin = JSON.parse(
        localStorage.getItem("admin")
      );

      const response = await api.post("/rooms", {
        name,
        max_teams: Number(maxTeams),
        admin_id: admin.id,
      });

      navigate(`/admin/rooms/${response.data.id}`);
    } catch (error) {
      setError(
        error.response?.data?.error ||
          "Failed to create room"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-black overflow-hidden flex items-center justify-center px-6 text-white">
      {/* Background Glow */}
      <motion.div
        animate={{
          x: [0, 30, -30, 0],
          y: [0, -20, 20, 0],
        }}
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute w-[650px] h-[650px] bg-white/5 blur-[170px] rounded-full top-[-180px] left-[-180px]"
      />

      <motion.div
        animate={{
          x: [0, -30, 30, 0],
          y: [0, 20, -20, 0],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute w-[550px] h-[550px] bg-white/5 blur-[150px] rounded-full bottom-[-180px] right-[-180px]"
      />

      {/* Back Button */}
      <button
        onClick={() => navigate("/admin")}
        className="absolute top-8 left-8 flex items-center gap-2 text-gray-400 hover:text-white transition"
      >
        <ChevronLeft size={20} />
        Back
      </button>

      {/* Card */}
      <motion.form
        initial={{
          opacity: 0,
          y: 35,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        onSubmit={handleSubmit}
        className="relative z-10 w-full max-w-lg"
      >
        <div className="absolute inset-0 bg-white/5 blur-2xl rounded-[35px]" />

        <div className="relative bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[30px] p-10">
          {/* Header */}
          <div className="flex flex-col items-center mb-8">
            <motion.div
              animate={{
                rotate: [0, 6, -6, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
              }}
              className="p-4 rounded-full bg-white/10"
            >
              <PlusSquare size={36} />
            </motion.div>

            <h1 className="text-4xl font-bold mt-5">
              Create Room
            </h1>

            <p className="text-gray-400 mt-2 text-sm text-center">
              Set up a new battlefield for players.
            </p>
          </div>

          {/* Inputs */}
          <div className="space-y-5">
            <input
              className="w-full p-4 rounded-xl bg-black/30 border border-white/10 outline-none"
              placeholder="Room Name"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
            />

            <input
              type="number"
              min="2"
              max="100"
              className="w-full p-4 rounded-xl bg-black/30 border border-white/10 outline-none"
              value={maxTeams}
              onChange={(e) =>
                setMaxTeams(e.target.value)
              }
            />

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-300 p-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            {/* Submit */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              disabled={loading}
              className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-gray-200"
            >
              {loading
                ? "Creating..."
                : "Create Room"}
            </motion.button>
          </div>
        </div>
      </motion.form>
    </div>
  );
};

export default CreateRoomPage;