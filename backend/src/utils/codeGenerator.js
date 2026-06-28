const prisma = require("../prisma/client");

const generateCode = (length = 6) => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < length; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
};

const generateUniqueRoomCode = async () => {
    let isUnique = false;
    let roomCode = "";
    while (!isUnique) {
      roomCode = generateCode(6);
      const existingRoom = await prisma.room.findUnique({
          where: {
            room_code: roomCode,
          },
        });
      if (!existingRoom) {
        isUnique = true;
      }
    }
    return roomCode;
  };

  const generateUniqueTeamCode = async () => {
    let isUnique = false;
    let joinCode = "";
    while (!isUnique) {
      joinCode = generateCode(8);
      const existingTeam = await prisma.team.findUnique({
          where: {
            join_code: joinCode,
          },
        });
      if (!existingTeam) {
        isUnique = true;
      }
    }
    return joinCode;
  };

module.exports = {
  generateUniqueRoomCode,
  generateUniqueTeamCode,
};