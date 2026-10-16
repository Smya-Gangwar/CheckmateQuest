const prisma = require("../prisma/client");

const authenticateGameConnection = async (
  req,
  res,
  next
) => {
  try {
    const sessionId = Number(
      req.params.sessionId
    );

    if (
      !Number.isInteger(sessionId) ||
      sessionId <= 0
    ) {
      return res.status(400).json({
        error: "Invalid session ID",
        code: "INVALID_SESSION_ID",
      });
    }

    // Confirm that the game session exists.
    // Do not require a single-tab connection token.
    const session = await prisma.gameSession.findUnique({
      where: {
        id: sessionId,
      },
      select: {
        id: true,
        status: true,
      },
    });

    if (!session) {
      return res.status(404).json({
        error: "Game session not found",
        code: "SESSION_NOT_FOUND",
      });
    }

    req.gameSession = session;
    next();
  } catch (error) {
    console.error(
      "[GAME SESSION VALIDATION ERROR]",
      error
    );

    return res.status(500).json({
      error: "Unable to validate game session",
    });
  }
};

module.exports = {
  authenticateGameConnection,
};