import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Mail,
  Lock,
  ChevronLeft,
  Crown,
} from "lucide-react";

import api from "../services/api";

const AdminLoginPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const response = await api.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("adminToken", response.data.token);
      localStorage.setItem(
        "admin",
        JSON.stringify(response.data.admin)
      );

      navigate("/admin");
    } catch (error) {
      setError(
        error.response?.data?.error || "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-black overflow-hidden flex items-center justify-center px-6 text-white">

      {/* Fog Background */}
      <motion.div
        animate={{
          x: [0, 40, -40, 0],
          y: [0, -20, 20, 0],
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

      {/* Floating Crowns */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -20, 0],
            opacity: [0.15, 0.4, 0.15],
          }}
          transition={{
            duration: 3 + i,
            repeat: Infinity,
          }}
          className={`absolute text-white/10 ${
            i % 2 === 0 ? "top-24" : "bottom-24"
          } ${i < 2 ? "left-24" : "right-24"}`}
        >
          <Crown size={40 + i * 10} />
        </motion.div>
      ))}

      {/* Back */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-8 left-8 flex items-center gap-2 text-gray-400 hover:text-white transition"
      >
        <ChevronLeft size={20} />
        Back
      </button>

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 35 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="absolute inset-0 bg-white/5 blur-2xl rounded-[35px]" />

        <div className="relative bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[30px] p-8">

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
              <ShieldCheck size={38} />
            </motion.div>

            <h1 className="text-4xl font-bold mt-5">
              Admin Portal
            </h1>

            <p className="text-gray-400 mt-2 text-sm text-center">
              Control the battlefield. Start the war.
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleLogin}
            className="space-y-5"
          >
            <div className="flex items-center bg-black/30 border border-white/10 rounded-xl px-4">
              <Mail size={18} className="text-gray-400" />
              <input
                type="email"
                placeholder="Admin Email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                className="w-full bg-transparent p-4 outline-none"
              />
            </div>

            <div className="flex items-center bg-black/30 border border-white/10 rounded-xl px-4">
              <Lock size={18} className="text-gray-400" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                className="w-full bg-transparent p-4 outline-none"
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-300 p-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-gray-200"
            >
              {loading ? "Logging In..." : "Enter Portal"}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLoginPage;