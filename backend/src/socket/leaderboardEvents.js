const { getIO } = require("./socket");

const emitLeaderboardUpdate = (roomId, leaderboard) => {
  getIO().to(`room-${roomId}`).emit(
    "leaderboard-update",
    leaderboard
  );
  console.log("[SOCKET] leaderboard-update emitted", roomId);
};

module.exports = {
  emitLeaderboardUpdate,
};