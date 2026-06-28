// 'useState(<initialValue>)' used to store and update data inside a component
import { useState } from "react";
// 'useNavigate' used for page navigation/routing
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  DoorOpen,
  Users,
  Hash,
  ChevronLeft,
  Crown,
} from "lucide-react";

import api from "../services/api";
import { getErrorMessage } from "../utils/errorMessages";

const JoinRoomPage = () => {
  const navigate = useNavigate();
  // Creating state variables
  // useState returns the current state and a function to update it
  const [roomCode, setRoomCode] = useState("");
  const [teamName, setTeamName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleJoinRoom = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const response = await api.post("/rooms/join", {
        room_code: roomCode,
        team_name: teamName,
      });

      const data = response.data;

      localStorage.setItem("teamId", data.team.id);
      localStorage.setItem("roomId", data.team.room_id);
      localStorage.setItem("joinCode", data.join_code);
      localStorage.setItem("teamName", data.team.name);

      navigate("/lobby");
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-black overflow-hidden flex items-center justify-center px-6 text-white">

      {/* Background Fog Layers */}
      <motion.div
        animate={{
          x: [0, 50, -50, 0],
          y: [0, -30, 30, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute w-[700px] h-[700px] bg-white/5 blur-[180px] rounded-full top-[-200px] left-[-200px]"
      />

      <motion.div
        animate={{
          x: [0, -40, 40, 0],
          y: [0, 20, -20, 0],
        }}
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute w-[600px] h-[600px] bg-white/5 blur-[160px] rounded-full bottom-[-180px] right-[-180px]"
      />

      {/* Floating Chess Icons */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -20, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 3 + i,
            repeat: Infinity,
          }}
          className={`absolute text-white/10 ${
            i % 2 === 0 ? "top-20" : "bottom-20"
          } ${i < 3 ? "left-20" : "right-20"}`}
        >
          <Crown size={40 + i * 8} />
        </motion.div>
      ))}

      {/* Back Button */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-8 left-8 flex items-center gap-2 text-gray-400 hover:text-white transition"
      >
        <ChevronLeft size={20} />
        Back
      </button>

      {/* Join Card */}
      <motion.div
        initial={{
          opacity: 0,
          y: 40,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.7,
        }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Outer Glow */}
        <div className="absolute inset-0 bg-white/5 blur-2xl rounded-[40px]" />

        {/* Main Container */}
        <div className="relative bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[32px] p-8 shadow-[0_0_40px_rgba(255,255,255,0.05)]">

          {/* Icon */}
          <div className="flex flex-col items-center mb-8">
            <motion.div
              animate={{
                rotate: [0, 8, -8, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
              }}
              className="p-4 rounded-full bg-white/10 border border-white/10"
            >
              <DoorOpen size={38} />
            </motion.div>

            <h1 className="text-4xl font-bold mt-5 tracking-wide">
              Join The Arena
            </h1>

            <p className="text-gray-400 text-center mt-2 text-sm">
              Enter your room and begin your strategic conquest.
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleJoinRoom}
            className="space-y-5"
          >
            {/* Room Code */}
            <div>
              <label className="block mb-2 text-gray-300 text-sm">
                Room Code
              </label>

              <div className="flex items-center bg-black/30 border border-white/10 rounded-xl px-4">
                <Hash size={18} className="text-gray-400" />

                <input
                  type="text"
                  value={roomCode}
                  onChange={(e) =>
                    setRoomCode(e.target.value)
                  }
                  placeholder="Enter room code"
                  required
                  className="w-full bg-transparent p-4 outline-none"
                />
              </div>
            </div>

            {/* Team Name */}
            <div>
              <label className="block mb-2 text-gray-300 text-sm">
                Team Name
              </label>

              <div className="flex items-center bg-black/30 border border-white/10 rounded-xl px-4">
                <Users size={18} className="text-gray-400" />

                <input
                  type="text"
                  value={teamName}
                  onChange={(e) =>
                    setTeamName(e.target.value)
                  }
                  placeholder="Enter team name"
                  required
                  className="w-full bg-transparent p-4 outline-none"
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <motion.div
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 1,
                }}
                className="bg-red-500/10 border border-red-500/30 text-red-300 p-3 rounded-xl text-sm"
              >
                {error}
              </motion.div>
            )}

            {/* Button */}
            <motion.button
              whileHover={{
                scale: 1.03,
              }}
              whileTap={{
                scale: 0.96,
              }}
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-gray-200 transition-all duration-300"
            >
              {loading ? "Joining..." : "Enter Room"}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default JoinRoomPage;