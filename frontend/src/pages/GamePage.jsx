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

    const interval = setInterval(fetchBoard, 1000);

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

      await fetchBoard();

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

      await fetchBoard();

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
            Quick Guide
          </h2>

          <div className="space-y-3 text-sm text-gray-300">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded bg-cyan-400" />
              Pawn → Easy challenge (+5 pts)
            </div>

            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded bg-violet-400" />
              Knight → Medium challenge (+10 pts)
            </div>

            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded bg-rose-400" />
              Rook → Hard challenge (+15 pts)
            </div>

            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded bg-amber-400" />
              Treasure → Instant bonus coins/points
            </div>

            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded bg-cyan-400" />
              Trap → Hidden among Pawn tiles
            </div>

            <hr className="border-white/10 my-3" />

            <p>
              • Wrong answers deduct the tile's points.
            </p>

            <p>
              • Hint reveals one high-value playable tile for 5 seconds.
            </p>

            <p>
              • Hints cost few coins.
            </p>

            <p>
              • Trap freezes your board for 15 seconds.
            </p>

            <p>
              • Solve faster and smarter to maximize score before timer ends.
            </p>
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
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
          <div className="text-center">
            <h1 className="text-7xl font-black mb-6">
              MATCH ENDED
            </h1>
            <p className="text-2xl text-gray-300">
              Final scores locked
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default GamePage;