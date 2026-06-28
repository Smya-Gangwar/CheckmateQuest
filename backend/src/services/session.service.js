const prisma = require("../prisma/client");

// Create game sessions for each team in a room
const createSessions = async (
  roomId,
  boardId
) => {
  // Fetch all teams 
  const teams = await prisma.team.findMany({
    where: {
      room_id: roomId,
    },
  });

  const sessions = [];
  for (const team of teams) {
    const session = await prisma.gameSession.create({
        data: {
          room_id: roomId,
          board_id: boardId,
          team_id: team.id,
          score: 0,
          coins: 20,
          status: "ACTIVE",
          started_at: new Date(),
        },
      });
    sessions.push(session);
  }
  return sessions;
};

const getSessionsForRoom = async (roomId) => {
  const sessions = await prisma.gameSession.findMany({
    where: {
      room_id: roomId,
    },
  });
  return sessions;
};

module.exports = {
  createSessions,
  getSessionsForRoom,
};