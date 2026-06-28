const leaderboardService = require(
  "../services/leaderboard.service"
);

const getLeaderboard = async (req, res) => {
  try {
    const { roomId } = req.params;
    const leaderboard = await leaderboardService.buildLeaderboard(
      Number(roomId)
    );
    res.json(leaderboard);
  } catch (error) {
    console.error(error);
    res.status(400).json({
      error: error.message,
    });
  }
};

module.exports = {
  getLeaderboard,
};