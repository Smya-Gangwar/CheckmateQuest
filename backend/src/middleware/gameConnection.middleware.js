const {
  requireGameConnection,
} = require("../services/connection.service");

const authenticateGameConnection = async (
  req,
  res,
  next
) => {
  try {
    const sessionId =
      Number(req.params.sessionId);

    const connectionToken =
      req.headers[
        "x-game-connection-token"
      ];

    if (
      !Number.isInteger(sessionId) ||
      sessionId <= 0
    ) {
      return res.status(400).json({
        error: "Invalid session ID",
      });
    }

    await requireGameConnection(
      sessionId,
      connectionToken
    );

    req.gameConnectionToken =
      connectionToken;

    next();
  } catch (error) {
    console.error(error.message);

    res.status(
      error.statusCode || 401
    ).json({
      error: error.message,
      code: error.code,
    });
  }
};

module.exports = {
  authenticateGameConnection,
};