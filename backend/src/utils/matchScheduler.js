const { getIO } = require("../socket/socket");
const prisma = require("../prisma/client");
const {
  emitMatchEnded,
} = require("../socket/events");

const scheduleMatchEnd = (roomId, startTime) => {
  const endTime = new Date(startTime).getTime() + 15 * 60 * 1000;
  const delay = endTime - Date.now();
  if (delay <= 0) {
    return;
  }
  setTimeout(async () => {
    try {
      await prisma.room.update({
        where: {
          id: roomId,
        },
        data: {
          status: "CLOSED",
          ends_at: new Date(),
        },
      });

      await prisma.gameSession.updateMany({
        where: {
          room_id: roomId,
        },
        data: {
          status: "FINISHED",
          finished_at: new Date(),
        },
      });
      emitMatchEnded(roomId);
      console.log(`Match ended for room ${roomId}`);
    } catch (error) {
      console.error(error);
    }
  }, delay);
};

module.exports = {
  scheduleMatchEnd
};