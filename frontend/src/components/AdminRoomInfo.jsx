import { Copy } from "lucide-react";

const AdminRoomInfo = ({ room, totalTeams }) => {
  const copyRoomCode = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      alert("Room code copied!");
    } catch (error) {
      console.error("Copy failed", error);
    }
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6">
      <h2 className="text-2xl font-bold mb-4">Room Information</h2>
      <div className="space-y-3 text-gray-300">
        <div className="flex items-center gap-2">
          <span>Room Code:</span>
          <span className="font-bold">{room?.room_code}</span>
          <button onClick={() => copyRoomCode(room?.room_code)}>
            <Copy size={15} />
          </button>
        </div>

        <p>Status: {room?.status}</p>
        <p>Teams Joined: {totalTeams}</p>
      </div>
    </div>
  );
};

export default AdminRoomInfo;