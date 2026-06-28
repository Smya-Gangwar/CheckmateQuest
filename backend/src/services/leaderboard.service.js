const prisma = require("../prisma/client");

const buildLeaderboard = async (roomId) => {
    const sessions = await prisma.gameSession.findMany({
        where: {
          room_id: roomId,
        },
        include: {
          team: true,
        },
        orderBy: {
          score: "desc",
        },
    });

    return sessions.map((session, index) => ({
        rank: index + 1,
        session_id: session.id,
        team_id: session.team.id,
        team_name: session.team.name,
        score: session.score,
      })
    );
};

module.exports = {
  buildLeaderboard,
};