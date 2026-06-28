const prisma = require("../prisma/client");

const {
  emitRoomStateUpdate,
} = require("../socket/roomEvents");

const {
  buildLeaderboard,
} = require("./leaderboard.service");

const {
  emitLeaderboardUpdate,
} = require("../socket/leaderboardEvents");

const {
  emitMatchEnded,
} = require("../socket/events");

const getRoomAnalytics = async (roomId) => {
  const room = await prisma.room.findUnique({
    where: {
      id: roomId,
    },
    include: {
      teams: true,
    },
  });

  if (!room) {
    throw new Error("Room not found");
  }

  const sessions = await prisma.gameSession.findMany({
    where: {
      room_id: roomId,
    },
  });

  const totalTeams = room.teams.length;
  const activeSessions = sessions.filter(s => s.status !== "FINISHED").length;
  const highestScore = sessions.length ? Math.max(...sessions.map(s => s.score)) : 0;
  const averageScore = sessions.length ? Math.round(sessions.reduce((sum, s) => sum + s.score, 0) / sessions.length) : 0;

  let remainingTime = 0;

  if (room.status === "RUNNING" && room.starts_at) {
    const endTime = new Date(room.starts_at).getTime() + 15 * 60 * 1000;
    remainingTime = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
  }

  return {
    room_status: room.status,
    total_teams: totalTeams,
    active_sessions: activeSessions,
    highest_score: highestScore,
    average_score: averageScore,
    remaining_time: remainingTime,
  };
};

const getAdminRooms = async (adminId) => {
  return prisma.room.findMany({
    where: {
      admin_id: adminId,
    },
    include: {
      teams: true,
    },
    orderBy: {
      created_at: "desc",
    },
  });
};

const deleteRoom = async (roomId, adminId) => {
  const room = await prisma.room.findUnique({
    where: {
      id: roomId,
    },
  });

  if (!room) {
    throw new Error("Room not found");
  }

  if (room.admin_id !== adminId) {
    throw new Error("Unauthorized");
  }

  if (room.status !== "WAITING") {
    throw new Error("Only waiting rooms can be deleted");
  }

  await emitRoomStateUpdate(roomId, {
    type: "ROOM_DELETED",
    roomId,
  });

  await prisma.room.delete({
    where: {
      id: roomId,
    },
  });

  return {
    success: true,
  };
};

const closeRoom = async (roomId, adminId) => {
  const room = await prisma.room.findUnique({
    where: {
      id: roomId,
    },
  });

  if (!room) {
    throw new Error("Room not found");
  }

  if (room.admin_id !== adminId) {
    throw new Error("Unauthorized");
  }

  const updatedRoom = await prisma.room.update({
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
      status: {
        not: "FINISHED",
      },
    },
    data: {
      status: "FINISHED",
      finished_at: new Date(),
    },
  });

  const leaderboard = await buildLeaderboard(roomId);
  emitLeaderboardUpdate(roomId, leaderboard);
  await emitMatchEnded(roomId);

  await emitRoomStateUpdate(roomId, {
    type: "ROOM_CLOSED",
    roomId,
  });
  return updatedRoom;
};

module.exports = {
  getRoomAnalytics,
  getAdminRooms,
  deleteRoom,
  closeRoom,
};