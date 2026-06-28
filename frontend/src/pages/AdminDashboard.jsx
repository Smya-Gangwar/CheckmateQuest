import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import socket from "../services/socket";

import AdminLeaderboard from "../components/AdminLeaderboard";
import AdminRoomInfo from "../components/AdminRoomInfo";
import AdminAnalytics from "../components/AdminAnalytics";

const AdminDashboard = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const [leaderboard, setLeaderboard] = useState([]);
  const [room, setRoom] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [teamCount, setTeamCount] = useState(0);

  const fetchLeaderboard = async () => {
    const res = await api.get(`/rooms/${roomId}/leaderboard`);
    setLeaderboard(res.data);
  };

  const fetchRoom = async () => {
    const roomRes = await api.get(`/rooms/${roomId}`);
    const teamRes = await api.get(`/rooms/${roomId}/teams`);
    setRoom(roomRes.data);
    setTeamCount(teamRes.data.total_teams);
  };

  const fetchAnalytics = async () => {
    const res = await api.get(`/rooms/${roomId}/analytics`);
    setAnalytics(res.data);
  };

  const startMatch = async () => {
    await api.post(`/rooms/${roomId}/start`);
    fetchRoom();
    fetchAnalytics();
  };

  useEffect(() => {
    fetchRoom();
    fetchLeaderboard();
    fetchAnalytics();

    socket.emit("join-room", Number(roomId));
    socket.on("leaderboard-update", setLeaderboard);
    socket.on("board-updated", fetchAnalytics);

    return () => {
      socket.off("leaderboard-update");
      socket.off("board-updated");
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between mb-8">
          <h1 className="text-5xl font-bold">Admin Dashboard</h1>

          <button
            onClick={() => navigate("/admin")}
            className="bg-white text-black px-5 py-3 rounded-xl"
          >
            Back
          </button>
        </div>

        <AdminRoomInfo room={room} totalTeams={teamCount} />
        <AdminAnalytics analytics={analytics} />

        {room?.status === "WAITING" && (
          <button
            onClick={startMatch}
            className="bg-white text-black px-6 py-3 rounded-xl mb-8"
          >
            Start Match
          </button>
        )}

        <AdminLeaderboard leaderboard={leaderboard} />
      </div>
    </div>
  );
};

export default AdminDashboard;