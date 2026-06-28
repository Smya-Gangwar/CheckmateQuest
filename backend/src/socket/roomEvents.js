const { getIO } = require("./socket");

const emitRoomStateUpdate = async (roomId, payload) => {
  getIO().to(`room-${roomId}`).emit("room-state-update", payload);
  console.log("[SOCKET] room-state-update emitted", roomId);
};

module.exports = {
  emitRoomStateUpdate,
};