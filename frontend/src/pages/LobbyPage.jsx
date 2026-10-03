import {
  useEffect,
  useState,
  useRef,
} from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Users,
  Crown,
  Clock,
} from "lucide-react";

import api from "../services/api";
import socket from "../services/socket";

const LobbyPage = () => {
  const countdownRef = useRef(null);
  const navigate = useNavigate();
  const roomId = localStorage.getItem("roomId");

  const [teams, setTeams] = useState([]);
  const [room, setRoom] = useState(null);
  const [countdown, setCountdown] =
    useState(null);
  const [totalTeams, setTotalTeams] =
    useState(0);

  const pollingRef = useRef(null);

  const fetchTeams = async () => {
    try {
      const response = await api.get(
        `/rooms/${roomId}/teams`
      );
      setTeams(response.data.teams);
      setTotalTeams(response.data.total_teams);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchRoom = async () => {
    try {
      const response = await api.get(
        `/rooms/${roomId}`
      );
      setRoom(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const startCountdown = (sessionData, startsAt) => {
    const teamId = localStorage.getItem("teamId");

    const mySession = sessionData.find(
      (s) => s.team_id == teamId
    );

    if (!mySession) {
      console.error(
        "No game session found for this team",
        teamId
      );
      return;
    }

    localStorage.setItem(
      "sessionId",
      String(mySession.id)
    );

    sessionStorage.removeItem(
      "gameConnectionToken"
    );

    sessionStorage.removeItem(
      "finalGameBoard"
    );

    if (countdownRef.current) {
      clearInterval(countdownRef.current);
    }

    const targetTime =
      new Date(startsAt).getTime();

    const updateCountdown = () => {
      const seconds = Math.max(
        0,
        Math.ceil(
          (targetTime - Date.now()) / 1000
        )
      );

      setCountdown(seconds);

      if (seconds <= 0) {
        clearInterval(countdownRef.current);
        countdownRef.current = null;
        navigate("/game");
      }
    };

    updateCountdown();

    countdownRef.current =
      setInterval(updateCountdown, 250);
  };

  const recoverRunningMatch = async () => {
    try {
      const roomResponse = await api.get(`/rooms/${roomId}`);
      const currentRoom = roomResponse.data;

      if (
        currentRoom.status === "RUNNING" &&
        currentRoom.starts_at
      ) {
        const sessionsResponse =
          await api.get(`/sessions/${roomId}`);

        startCountdown(
          sessionsResponse.data,
          currentRoom.starts_at
        );
      }
    } catch (error) {
      console.error("Failed to recover running match:", error);
    }
  };

  useEffect(() => {
    const initializeLobby = async () => {
      await fetchTeams();
      await fetchRoom();

      socket.emit("join-room", Number(roomId));

      // Recover the countdown if the match has already started
      // and this browser missed the match-started socket event.
      await recoverRunningMatch();
    };

    initializeLobby();

    pollingRef.current = setInterval(() => {
      fetchTeams();
    }, 3000);

    return () => {
      clearInterval(pollingRef.current);

      if (countdownRef.current) {
        clearInterval(countdownRef.current);
        countdownRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const handleMatchStarted = async () => {
      try {
        const [sessionsResponse, roomResponse] =
          await Promise.all([
            api.get(`/sessions/${roomId}`),
            api.get(`/rooms/${roomId}`),
          ]);

        startCountdown(
          sessionsResponse.data,
          roomResponse.data.starts_at
        );
      } catch (error) {
        console.error(
          "Failed to start countdown:",
          error
        );
      }
    };

    socket.on(
      "match-started",
      handleMatchStarted
    );

    return () => {
      socket.off(
        "match-started",
        handleMatchStarted
      );
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden p-8">

      {/* Background Fog */}
      <motion.div
        animate={{
          x: [0, 40, -40, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
        }}
        className="absolute top-0 left-0 w-[600px] h-[600px] bg-white/5 blur-[180px] rounded-full"
      />

      {/* Countdown Overlay */}
      {countdown !== null && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50">
          <div className="text-[220px] font-black text-white/20 animate-pulse">
            {countdown}
          </div>
        </div>
      )}

      <div className="relative z-10 max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-5xl font-bold">
              War Room
            </h1>

            <p className="text-gray-400 mt-2">
              Awaiting the King's command...
            </p>
          </div>

          <motion.div
            animate={{
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
            }}
          >
            <Crown size={50} />
          </motion.div>
        </div>

        {/* Room Info */}
        {room && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-8 backdrop-blur-xl">
            <p className="text-lg">
              Room Code:
              <span className="font-bold ml-2 text-white">
                {room.room_code}
              </span>
            </p>

            <p className="mt-2 flex items-center gap-2 text-gray-300">
              <Clock size={16} />
              Status: {room.status}
            </p>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8">

          {/* Team List */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
            <div className="flex items-center gap-3 mb-6">
              <Users />
              <h2 className="text-2xl font-bold">
                {totalTeams} Teams Joined
              </h2>
            </div>

            <div className="space-y-4">
              {teams.map((team, index) => (
                <motion.div
                  key={team.id}
                  initial={{
                    opacity: 0,
                    x: -20,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  transition={{
                    delay: index * 0.08,
                  }}
                  className="bg-black/30 border border-white/10 p-4 rounded-xl"
                >
                  {team.name}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Rules */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
            <h2 className="text-2xl font-bold mb-6">
              Battle Rules
            </h2>

            <ul className="space-y-3 text-gray-300 text-sm">
              <li>
                • Every player starts on the same chessboard with their own independent progress.
              </li>

              <li>
                • Open unlocked tiles to receive questions.
              </li>

              <li>
                • Correct answers award points and may unlock new tiles.
              </li>

              <li>
                • Wrong answers reduce your score and lower the tile's future reward.
              </li>

              <li>
                • Pawn = Easy, Knight = Medium, Rook = Hard, Treasure = Bonus Rewards.
              </li>

              <li>
                • Trap tiles are hidden and freeze your board for 15 seconds while deducting score and coins.
              </li>

              <li>
                • Coins earned during the game can be exchanged for hints.
              </li>

              <li>
                • Hints reveal the best available tile for a short duration.
              </li>

              <li>
                • The match lasts exactly <strong>15 minutes</strong>.
              </li>

              <li>
                • Highest score at the end of the timer wins.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LobbyPage;