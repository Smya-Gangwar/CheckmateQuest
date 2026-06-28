import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import {
  Copy,
  PlusCircle,
  LogOut,
  LayoutDashboard,
  House,
} from "lucide-react";
import { motion } from "framer-motion";

const AdminHomePage = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);

  const fetchRooms = async () => {
    try {
      const response = await api.get("/admin/rooms");
      setRooms(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const logout = () => {
    localStorage.clear();
    navigate("/admin/login");
  };

  const copyRoomCode = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      alert("Room code copied!");
    } catch (error) {
      console.error("Copy failed", error);
    }
  };

  const handleDeleteRoom = async (roomId) => {
    await api.delete(`/admin/rooms/${roomId}`);
    setRooms((prev) =>
      prev.filter((room) => room.id !== roomId)
    );
  };

  const handleCloseRoom = async (roomId) => {
    const response = await api.patch(
      `/admin/rooms/${roomId}/close`
    );

    setRooms((prev) =>
      prev.map((room) =>
        room.id === roomId ? response.data : room
      )
    );
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden p-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#ffffff10,transparent_40%)]" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Top Header */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-5xl font-bold tracking-wide">
              Control Center
            </h1>

            <p className="text-gray-400 mt-2">
              Manage active rooms and monitor matches.
            </p>
          </div>

          <div className="flex gap-3">
            {/* Home Button */}
            <button
              onClick={() => navigate("/")}
              className="flex items-center justify-center w-12 h-12 border border-white/20 rounded-xl hover:bg-white hover:text-black transition"
            >
              <House size={20} />
            </button>

            {/* Logout Button */}
            <button
              onClick={logout}
              className="flex items-center gap-2 px-5 py-3 bg-white text-black rounded-xl font-semibold"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 mb-10">
          <button
            onClick={() => navigate("/admin/create-room")}
            className="flex items-center gap-2 bg-white text-black px-5 py-3 rounded-xl font-semibold"
          >
            <PlusCircle size={18} />
            Create Room
          </button>

          <button
            onClick={() => navigate("/admin/questions")}
            className="flex items-center gap-2 border border-white px-5 py-3 rounded-xl"
          >
            <LayoutDashboard size={18} />
            Questions
          </button>
        </div>

        {/* Rooms */}
        <div className="grid gap-6">
          {rooms.map((room, index) => (
            <motion.div
              key={room.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold">
                    {room.name}
                  </h2>

                  <div className="flex items-center gap-2 mt-2 text-gray-400">
                    {room.room_code}

                    <button
                      onClick={() =>
                        copyRoomCode(room.room_code)
                      }
                    >
                      <Copy size={15} />
                    </button>
                  </div>

                  <p className="mt-2">
                    Teams: {room.teams.length}
                  </p>

                  <p
                    className={`mt-2 font-semibold ${
                      room.status === "WAITING"
                        ? "text-yellow-400"
                        : room.status === "RUNNING"
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {room.status}
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() =>
                      navigate(`/admin/rooms/${room.id}`)
                    }
                    className="px-5 py-2 bg-white text-black rounded-xl"
                  >
                    Open
                  </button>

                  {room.status === "WAITING" && (
                    <button
                      onClick={() =>
                        handleDeleteRoom(room.id)
                      }
                      className="px-5 py-2 bg-red-500 rounded-xl"
                    >
                      Delete
                    </button>
                  )}

                  {room.status === "RUNNING" && (
                    <button
                      onClick={() =>
                        handleCloseRoom(room.id)
                      }
                      className="px-5 py-2 bg-orange-500 rounded-xl"
                    >
                      Close
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminHomePage;