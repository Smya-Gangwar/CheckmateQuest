const connectionService =
  require("../services/connection.service");

const connect = async (
  req,
  res
) => {
  try {
    const sessionId =
      Number(req.params.sessionId);

    if (
      !Number.isInteger(sessionId) ||
      sessionId <= 0
    ) {
      return res.status(400).json({
        error: "Invalid session ID",
        code: "INVALID_SESSION_ID",
      });
    }

    const {
      team_id,
      join_code,
    } = req.body;

    const result =
      await connectionService.acquireGameConnection(
        sessionId,
        Number(team_id),
        join_code
      );

    res.json(result);
  } catch (error) {
    console.error(error.message);

    res.status(
      error.statusCode || 400
    ).json({
      error: error.message,
      code: error.code,
    });
  }
};

const heartbeat = async (
  req,
  res
) => {
  try {
    console.log(
      "[GAME HEARTBEAT] params:",
      req.params
    );

    console.log(
      "[GAME HEARTBEAT] raw sessionId:",
      req.params.sessionId
    );

    const sessionId =
      Number(req.params.sessionId);

    console.log(
      "[GAME HEARTBEAT] parsed sessionId:",
      sessionId
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

    const connectionToken =
      req.headers[
        "x-game-connection-token"
      ];

    if (!connectionToken) {
      return res.status(401).json({
        error: "Game connection token required",
        code: "GAME_CONNECTION_REQUIRED",
      });
    }

    const result =
      await connectionService.renewGameConnection(
        sessionId,
        connectionToken
      );

    res.json(result);
  } catch (error) {
    console.error(
      "[GAME HEARTBEAT ERROR]",
      error
    );

    res.status(
      error.statusCode || 409
    ).json({
      error: error.message,
      code: error.code,
    });
  }
};

const disconnect = async (
  req,
  res
) => {
  try {
    const sessionId =
      Number(req.params.sessionId);

    if (
      !Number.isInteger(sessionId) ||
      sessionId <= 0
    ) {
      return res.status(400).json({
        error: "Invalid session ID",
        code: "INVALID_SESSION_ID",
      });
    }

    const token =
      req.headers[
        "x-game-connection-token"
      ];

    if (!token) {
      return res.status(401).json({
        error: "Game connection token required",
        code: "GAME_CONNECTION_REQUIRED",
      });
    }

    await connectionService.releaseGameConnection(
      sessionId,
      token
    );

    res.status(204).send();
  } catch (error) {
    console.error(error.message);

    res.status(400).json({
      error: error.message,
    });
  }
};

module.exports = {
  connect,
  heartbeat,
  disconnect,
};