const prisma = require("../prisma/client");

const {
  createBoard,
} = require("./board.service");

const {
  createSessions,
} = require("./session.service");

const {
  initializeTileStates,
} = require("./tileState.service");

const {
  generateUniqueRoomCode,
  generateUniqueTeamCode,
} = require("../utils/codeGenerator");

const {
  emitMatchStarted,
} = require("../socket/events");

const {
  scheduleMatchEnd,
} = require("../utils/matchScheduler");

const {
  emitRoomStateUpdate,
} = require("../socket/roomEvents");

// Function to create a new room, usually called from the controller
// Flow: Route -> Controller -> Service -> PRISMA -> Database
const createRoom = async (data) => {
  // Extracts required fields from request data
  const { name, max_teams, admin_id } = data;
  const roomCode = await generateUniqueRoomCode();
  // Uses Prisma ORM to insert a new row into room table
  if (!name || !max_teams || !admin_id) {
    throw new Error("Missing required fields");
  }
  const room = await prisma.room.create({
    data: {
      name,
      room_code: roomCode,
      status: "WAITING",
      max_teams,
      admin_id,
    },
  });

  // Create board
  const board = await createBoard(room.id);

  return room;
};

// This fetches all rooms from the database along with room admin details and related teams using 'admin' & 'teams' tables.
const getRooms = async () => {
  return prisma.room.findMany({
    include: {
      admin: true,
      teams: true,
    },
  });
};

const joinRoom = async (data) => {
  const { room_code, team_name } = data;

  // Find room
  const room = await prisma.room.findUnique({
    where: {
      room_code,
    },
    include: {
      teams: true,
    },
  });

  // Validate room
  if (!room) {
    throw new Error("Room not found");
  }

  // Check room status
  if (room.status !== "WAITING") {
    throw new Error("Game already started");
  }

  // Check room capacity
  if (room.teams.length >= room.max_teams) {
    throw new Error("Room is full");
  }

  const existingTeam = await prisma.team.findFirst({
        where: {
            room_id: room.id,
            name: team_name,
        },
    });

    if (existingTeam) {
      throw new Error("Team already exists");
    }

  // Generate join code
  const joinCode = await generateUniqueTeamCode();

  // Create team
  const team = await prisma.team.create({
    data: {
      name: team_name,
      join_code: joinCode,
      status: "ACTIVE",
      room_id: room.id,
    },
  });

  await emitRoomStateUpdate(room.id, {
    type: "TEAM_JOINED",
    room_id: room.id,
    team: {
      id: team.id,
      name: team.name,
    },
  });

  const board = await prisma.board.findUnique({
    where: {
      room_id: room.id,
    },
  });
  if (!board) {
    throw new Error("Board not generated yet");
  }

  return {
    team,
    join_code: team.join_code,
  };
};

const getRoomById = async (roomId) => {
  const room = await prisma.room.findUnique({
      where: {
        id: roomId,
      },
    });
  if (!room) {
    throw new Error("Room not found");
  }
  return room;
};

const getRoomTeams = async (roomId) => {
  const room = await prisma.room.findUnique({
    where: {
      id: roomId,
    },
    include: {
      teams: {
        orderBy: {
          joined_at: "asc",
        },
      },
    },
  });

  if (!room) {
    throw new Error("Room not found");
  }

  return {
    room: room.name,
    total_teams: room.teams.length,
    teams: room.teams,
  };
};

const startMatch = async (roomId) => {
  // Validate room
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

  if (room.status !== "WAITING") {
    throw new Error("Match already started");
  }

  if (room.teams.length === 0) {
    throw new Error("No teams joined");
  }

  const board = await prisma.board.findUnique({
    where: {
      room_id: roomId,
    },
  });

  if (!board) {
    throw new Error("Board not found");
  }

  // Create sessions
  const sessions = await createSessions(
    roomId,
    board.id
  );

  // Initialize tile states
  for (const session of sessions) {
    await initializeTileStates(
      session.id,
      board.id
    );
  }

  const startTime = new Date(Date.now() + 10000);

  // Update room status
  await prisma.room.update({
    where: {
      id: roomId,
    },
    data: {
      status: "RUNNING",
      starts_at: startTime,
    },
  });

  emitMatchStarted(roomId, startTime);
  await emitRoomStateUpdate(roomId, {
    type: "MATCH_STARTED",
    room_id: roomId,
    starts_at: startTime,
  });
  scheduleMatchEnd(roomId, startTime);

  const sessionMap = sessions.map((session) => ({
    team_id: session.team_id,
    session_id: session.id,
  }));

  return {
    message: "Match started successfully",
    board_id: board.id,
    sessions_created: sessions.length,
    sessions: sessionMap,
  };
};

module.exports = {
  createRoom,
  getRooms,
  joinRoom,
  startMatch,
  getRoomTeams,
  getRoomById,
};