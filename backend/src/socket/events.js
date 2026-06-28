const { getIO } = require("./socket");
const {
  emitRoomStateUpdate,
} = require("./roomEvents");

const emitMatchStarted = (roomId, startsAt) => {
    getIO().to(`room-${roomId}`).emit(
        "match-started",
        {
            roomId,
            startsAt,
        }
    );
    console.log("[SOCKET] match-started emitted", roomId);
};

const emitMatchEnded = async (roomId) => {
    getIO().to(`room-${roomId}`).emit(
        "match-ended",
        {
            roomId,
        }
    );
    await emitRoomStateUpdate(roomId, {
        type: "MATCH_ENDED",
        room_id: roomId,
    });
    console.log("[SOCKET] match-ended emitted", roomId);
};

module.exports = {
    emitMatchStarted,
    emitMatchEnded,
};