import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Crown,
  Swords,
  Trophy,
  Sparkles,
} from "lucide-react";

const HomePage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Swords size={28} />,
      title: "Strategic Unlocking",
      desc: "Every move opens new possibilities.",
    },
    {
      icon: <Sparkles size={28} />,
      title: "Trivia Combat",
      desc: "Knowledge decides your next move.",
    },
    {
      icon: <Trophy size={28} />,
      title: "Live Competition",
      desc: "Outplay teams and dominate rankings.",
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">

      {/* Deep smoky radial */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#222_0%,#000_70%)]" />

      {/* Animated smoke layers */}
      <motion.div
        animate={{
          x: [0, 80, 0],
          y: [0, -40, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
        }}
        className="absolute -top-20 -left-20 w-[500px] h-[500px] bg-white/5 blur-3xl rounded-full"
      />

      <motion.div
        animate={{
          x: [0, -70, 0],
          y: [0, 40, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
        }}
        className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-white/5 blur-3xl rounded-full"
      />

      {/* Giant faded chess pieces */}
      <motion.div
        animate={{ rotate: [0, 6, -6, 0] }}
        transition={{
          duration: 12,
          repeat: Infinity,
        }}
        className="absolute left-10 top-20 opacity-[0.03]"
      >
        <Crown size={350} />
      </motion.div>

      <motion.div
        animate={{ rotate: [0, -8, 8, 0] }}
        transition={{
          duration: 14,
          repeat: Infinity,
        }}
        className="absolute right-10 bottom-10 opacity-[0.03]"
      >
        <Swords size={320} />
      </motion.div>

      {/* Dust particles */}
      {[...Array(18)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -40, 0],
            opacity: [0.2, 0.8, 0.2],
          }}
          transition={{
            duration: 4 + i,
            repeat: Infinity,
          }}
          className="absolute w-1 h-1 bg-white rounded-full"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
        />
      ))}

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6">

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.7 }}
        >
          <Crown size={80} />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-6xl md:text-8xl font-extrabold mt-6 tracking-widest text-center"
        >
          CHECKMATE QUEST
        </motion.h1>

        <p className="mt-6 text-gray-400 text-lg text-center max-w-2xl">
          Enter the battlefield. Unlock. Conquer. Survive.
        </p>

        <div className="mt-10 flex gap-5 flex-col md:flex-row">
          <button
            onClick={() => navigate("/admin/login")}
            className="px-8 py-4 bg-white text-black rounded-2xl font-bold hover:scale-105 transition"
          >
            Admin Login
          </button>

          <button
            onClick={() => navigate("/join")}
            className="px-8 py-4 border border-white rounded-2xl font-bold hover:bg-white hover:text-black transition"
          >
            Join Game
          </button>
        </div>

        <div className="mt-20 grid md:grid-cols-3 gap-8 max-w-6xl">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{
                opacity: 0,
                y: 30,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: index * 0.2,
              }}
              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6"
            >
              <div className="mb-4">{feature.icon}</div>
              <h2 className="font-bold text-xl mb-2">
                {feature.title}
              </h2>
              <p className="text-gray-400">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;