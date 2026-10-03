const crypto = require("crypto");
const prisma = require("../prisma/client");

// A game connection is a short-lived lease.
// The browser renews it with a heartbeat.
const GAME_CONNECTION_LEASE_MS = 30 * 1000;

const createConnectionToken = () =>
  crypto.randomBytes(32).toString("hex");

const acquireGameConnection = async (
  sessionId,
  teamId,
  joinCode
) => {
  const session = await prisma.gameSession.findUnique({
    where: {
      id: sessionId,
    },
    include: {
      team: true,
    },
  });

  if (!session) {
    throw Object.assign(
      new Error("Session not found"),
      {
        statusCode: 404,
      }
    );
  }

  if (
    session.team_id !== teamId ||
    session.team.join_code !== joinCode
  ) {
    throw Object.assign(
      new Error("Invalid team credentials"),
      {
        statusCode: 403,
      }
    );
  }

  if (session.status === "FINISHED") {
    throw Object.assign(
      new Error("Match has ended"),
      {
        statusCode: 400,
      }
    );
  }

  const connectionToken =
    createConnectionToken();

  const now = new Date();

  const expiresAt = new Date(
    now.getTime() +
      GAME_CONNECTION_LEASE_MS
  );

  /*
   * IMPORTANT:
   *
   * updateMany() makes the acquisition atomic.
   *
   * If two devices attempt to connect at exactly
   * the same time, only one can update the row.
   */
  const result =
    await prisma.gameSession.updateMany({
      where: {
        id: sessionId,
        team_id: teamId,

        OR: [
          {
            active_connection_token: null,
          },
          {
            active_connection_expires_at: {
              lt: now,
            },
          },
        ],
      },

      data: {
        active_connection_token:
          connectionToken,

        active_connection_expires_at:
          expiresAt,

        active_connection_last_seen:
          now,
      },
    });

  if (result.count !== 1) {
    throw Object.assign(
      new Error(
        "This game session is already open on another device or tab."
      ),
      {
        statusCode: 409,
        code: "GAME_SESSION_IN_USE",
      }
    );
  }

  return {
    connectionToken,
    expiresAt,
    leaseMs:
      GAME_CONNECTION_LEASE_MS,
  };
};

const renewGameConnection = async (
  sessionId,
  connectionToken
) => {
  const now = new Date();

  const expiresAt = new Date(
    now.getTime() +
      GAME_CONNECTION_LEASE_MS
  );

  const result =
    await prisma.gameSession.updateMany({
      where: {
        id: sessionId,

        active_connection_token:
          connectionToken,

        active_connection_expires_at: {
          gt: now,
        },
      },

      data: {
        active_connection_expires_at:
          expiresAt,

        active_connection_last_seen:
          now,
      },
    });

  if (result.count !== 1) {
    throw Object.assign(
      new Error(
        "Your game connection is no longer active."
      ),
      {
        statusCode: 409,
        code: "GAME_CONNECTION_EXPIRED",
      }
    );
  }

  return {
    expiresAt,
  };
};

const releaseGameConnection = async (
  sessionId,
  connectionToken
) => {
  await prisma.gameSession.updateMany({
    where: {
      id: sessionId,

      active_connection_token:
        connectionToken,
    },

    data: {
      active_connection_token: null,
      active_connection_expires_at: null,
      active_connection_last_seen: null,
    },
  });
};

const requireGameConnection = async (
  sessionId,
  connectionToken
) => {
  if (!connectionToken) {
    throw Object.assign(
      new Error(
        "Game connection required"
      ),
      {
        statusCode: 401,
        code: "GAME_CONNECTION_REQUIRED",
      }
    );
  }

  const session =
    await prisma.gameSession.findFirst({
      where: {
        id: sessionId,

        active_connection_token:
          connectionToken,

        active_connection_expires_at: {
          gt: new Date(),
        },
      },
    });

  if (!session) {
    throw Object.assign(
      new Error(
        "Your game connection is no longer active. Another device or tab may now be using this game."
      ),
      {
        statusCode: 409,
        code: "GAME_CONNECTION_EXPIRED",
      }
    );
  }

  return session;
};

module.exports = {
  acquireGameConnection,
  renewGameConnection,
  releaseGameConnection,
  requireGameConnection,
  GAME_CONNECTION_LEASE_MS,
};