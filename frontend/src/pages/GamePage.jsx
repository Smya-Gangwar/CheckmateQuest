import { useEffect, useState } from "react";
import api from "../services/api";
import BoardGrid from "../components/BoardGrid";
import ScoreBar from "../components/ScoreBar";
import Timer from "../components/Timer";
import QuestionModal from "../components/QuestionModal";
import TrapModal from "../components/TrapModal";
import socket from "../services/socket";

const GamePage = () => {
  const [boardData, setBoardData] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [isTrapActive, setIsTrapActive] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [liveScore, setLiveScore] = useState(null);
  const [hintTileId, setHintTileId] = useState(null);
  const [teamName, setTeamName] = useState("");

  const sessionId = localStorage.getItem("sessionId");

  const fetchBoard = async () => {
    try {
      const response = await api.get(`/sessions/${sessionId}/board`);
      setBoardData(response.data);
      if (
        response.data.status === "FINISHED" ||
        response.data.remaining_time <= 0
      ) {
        setGameEnded(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchMyTeam = async () => {
    try {
      const roomId = localStorage.getItem("roomId");
      const teamId = localStorage.getItem("teamId");

      const response = await api.get(`/rooms/${roomId}/teams`);

      const myTeam = response.data.teams.find(
        (team) => team.id == teamId
      );

      if (myTeam) {
        setTeamName(myTeam.name);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchBoard();
    fetchMyTeam();

    const roomId = localStorage.getItem("roomId");
    socket.emit("join-room", Number(roomId));

    socket.on("board-updated", async (data) => {
      if (data.session_id == Number(sessionId)) {
        await fetchBoard();
      }
    });

    socket.on("score-updated", (data) => {
      if (data.session_id == Number(sessionId)) {
        setLiveScore(data.score);
      }
    });

    socket.on("match-ended", async () => {
      setGameEnded(true);
      await fetchBoard();
    });

    const interval = setInterval(fetchBoard, 5000);

    return () => {
      clearInterval(interval);
      socket.off("board-updated");
      socket.off("score-updated");
      socket.off("match-ended");
    };
  }, []);

  useEffect(() => {
    window.history.pushState(null, "", window.location.href);

    const handleBack = () => {
      window.history.pushState(null, "", window.location.href);
    };

    window.addEventListener("popstate", handleBack);

    return () => {
      window.removeEventListener(
        "popstate",
        handleBack
      );
    };
  }, []);

  if (!boardData) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        Loading board...
      </div>
    );
  }

  const handleTileClick = async (tile) => {
    if (gameEnded || isTrapActive || tile.state !== "UNLOCKED") return;

    try {
      const response = await api.post(
        `/sessions/${sessionId}/open-tile`,
        { tile_id: tile.tile_id }
      );

      setModalData(response.data);
      setModalOpen(true);

      if (response.data.type === "TRAP") {
        setIsTrapActive(true);
      }
    } catch (error) {
      if (error.response?.data?.error === "Match has ended") {
        setGameEnded(true);
      }
    }
  };

  const handleTrapFinish = () => {
    setIsTrapActive(false);
    setModalOpen(false);
    setModalData(null);
  };

  const handleAnswerSubmit = async (answer) => {
    try {
      const response = await api.post(
        `/sessions/${sessionId}/submit-answer`,
        {
          tile_id: modalData.tile_id,
          answer: String(answer),
        }
      );

      if (response.data.correct) {
        setModalOpen(false);
        setModalData(null);
        return;
      }

      alert(
        `Wrong answer! ${Math.abs(
          response.data.score_delta
        )} points lost.`
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleHint = async () => {
    try {
      const response = await api.post(
        `/sessions/${sessionId}/hint`
      );

      setHintTileId(response.data.tile_id);

      setTimeout(() => {
        setHintTileId(null);
      }, 5000);
    } catch (error) {
      alert(error.response?.data?.error || "Hint failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-gray-900 text-white p-6">

      {/* Team Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-widest text-gray-400">
            Playing As
          </p>

          <h1 className="text-3xl font-bold text-white">
            {teamName || "Loading Team..."}
          </h1>
        </div>
      </div>

      {/* Top HUD */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
        <div className="flex gap-4 items-center">
          <ScoreBar
            score={liveScore ?? boardData.score}
            coins={boardData.coins}
            onHint={handleHint}
          />
        </div>

        <Timer remainingTime={boardData.remaining_time} />
      </div>

      {/* Main Layout */}
      <div className="grid lg:grid-cols-[1fr_320px] gap-8 items-start">

        {/* Board */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
          <BoardGrid
            tiles={boardData.tiles}
            onTileClick={handleTileClick}
            hintTileId={hintTileId}
          />
        </div>

        {/* Guide Panel */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-md max-w-sm">
          <h2 className="text-lg font-bold mb-4">
            How to Play?
          </h2>

          <div className="space-y-5 text-sm text-gray-300">
            <div>
              <h3 className="font-semibold text-white mb-2">
                Objective
              </h3>
              <p>
                Explore the chessboard, solve questions, unlock more tiles and earn the highest score before the 15-minute timer expires.
              </p>
            </div>

            <hr className="border-white/10" />
            <div>
              <h3 className="font-semibold text-white mb-2">
                Tile Types
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded bg-cyan-400"/>
                  Pawn → Easy question. Unlocks nearby tiles.
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded bg-violet-400"/>
                  Knight → Medium question. Unlocks L-shaped positions.
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded bg-rose-400"/>
                  Rook → Hard question. Unlocks an entire strategic direction.
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded bg-amber-400"/>
                  Treasure → Medium question with higher score and coin reward.
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded bg-red-500"/>
                  Trap → Hidden under pawn tiles. Lose score, coins and get frozen for 15 seconds.
                </div>
              </div>
            </div>

            <hr className="border-white/10" />
            <div>
              <h3 className="font-semibold text-white mb-2">
                Scoring
              </h3>

              <ul className="space-y-1 list-disc ml-5">
                <li>Correct answer earns tile points.</li>
                <li>Each wrong attempt reduces the final reward for that tile.</li>
                <li>Wrong answers also deduct immediate score.</li>
                <li>Solve quickly with fewer mistakes for maximum points.</li>
              </ul>
            </div>

            <hr className="border-white/10" />
            <div>
              <h3 className="font-semibold text-white mb-2">
                Coins & Hints
              </h3>

              <ul className="space-y-1 list-disc ml-5">
                <li>Coins are earned from solving tiles.</li>
                <li>Spend coins to reveal the best playable tile.</li>
                <li>Hints highlight one recommended tile for 5 seconds.</li>
              </ul>
            </div>

            <hr className="border-white/10" />

            <div>
              <h3 className="font-semibold text-white mb-2">
                Winning
              </h3>
              <p>
                The player with the highest score when the timer reaches zero wins the match.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Question Modal */}
      {modalData?.type === "QUESTION" && (
        <QuestionModal
          isOpen={modalOpen}
          data={modalData}
          onClose={() => {
            setModalOpen(false);
            setModalData(null);
          }}
          onSubmit={handleAnswerSubmit}
        />
      )}

      {/* Trap Modal */}
      <TrapModal
        isOpen={modalOpen && modalData?.type === "TRAP"}
        onFinish={handleTrapFinish}
      />

      {/* End Screen */}
      {gameEnded && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-lg flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-white/10 rounded-3xl p-10 w-full max-w-2xl">
            <h1 className="text-5xl font-black text-center mb-2">
              MATCH ENDED
            </h1>
            <p className="text-gray-400 text-center mb-8">
              Final Standings
            </p>

            <div className="space-y-3">
              {boardData.final_leaderboard?.map((team, index) => (
                <div
                  key={team.team_id}
                  className={`flex justify-between items-center p-4 rounded-xl ${
                    team.team_name === teamName
                      ? "bg-purple-700/40 border border-purple-400"
                      : "bg-white/5"
                  }`}
                >
                  <div className="flex gap-4">
                    <span className="font-bold w-6">
                      #{index + 1}
                    </span>
                    <span>{team.team_name}</span>
                  </div>

                  <div className="font-bold">
                    {team.score} pts
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <div className="text-3xl font-bold">
                Your Score
              </div>
              <div className="text-6xl font-black text-green-400 mt-2">
                {boardData.score}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GamePage;