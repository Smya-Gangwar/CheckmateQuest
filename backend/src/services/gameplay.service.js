const prisma = require("../prisma/client");

const {
  getUnlockPositions,
} = require("../utils/unlockEngine");

const { getIO } = require("../socket/socket");

const {
  emitMatchEnded,
} = require("../socket/events");

const {
  buildLeaderboard,
} = require("./leaderboard.service");

const {
  emitLeaderboardUpdate,
} = require("../socket/leaderboardEvents");

const {
  addCoins,
} = require("./coin.service");

const {
  emitRoomStateUpdate,
} = require("../socket/roomEvents");

const getBoardState = async (sessionId) => {
  // Fetch session
  const session = await prisma.gameSession.findUnique({
      where: {
        id: sessionId,
      },
      include: {
        room: true,
        tile_states: {
          include: {
            tile: true,
          },
        },
      },
    });

  if (!session) {
    throw new Error("Session not found");
  }

  // Match expiry validation
  const isExpired = await checkAndFreezeMatch(session);
  if (isExpired) {
    session.status = "FINISHED";
  }

  // Calculate remaining time
  let remainingTime = 0;
  const room = session.room;

  if (session.status !== "FINISHED" && room?.starts_at) {
    const endTime = new Date(room.starts_at).getTime() + 15 * 60 * 1000;
    remainingTime = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
  }

  // Transform tile data for frontend
  const transformedTiles = session.tile_states.map((tileState) => {
        const tile = tileState.tile;
        const isVisible = tileState.state !== "LOCKED";

        return {
          tile_id: tile.id,
          row: tile.row_index,
          col: tile.col_index,
          state: tileState.state,
          visible_type: isVisible ? tile.tile_type : null,
          points: isVisible ? tile.points_value : null,
          color_tag: isVisible ? tile.color_tag : null,
        };
      }
    );

  return {
    session_id: session.id,
    score: session.score,
    coins: session.coins,
    status: session.status,
    remaining_time: remainingTime,
    tiles: transformedTiles,
  };
};

const checkAndFreezeMatch = async (session) => {
    // Already finished
    if (session.status === "FINISHED") {
      return true;
    }

    const room = await prisma.room.findUnique({
        where: {
          id: session.room_id,
        },
    });

    if (room.status === "CLOSED") {
      return true;
    }

    if (!room.starts_at) {
      return false;
    }

    const now = new Date();
    const endTime = new Date(room.starts_at);

    endTime.setMinutes(endTime.getMinutes() + 15);

    // Match expired
    if (now >= endTime) {
      await prisma.gameSession.updateMany({
        where: {
          room_id: session.room_id,
          status: {
            not: "FINISHED",
          },
        },
        data: {
          status: "FINISHED",
          finished_at: now,
        },
      });

      await prisma.room.update({
        where: {
          id: session.room_id,
        },
        data: {
          status: "CLOSED",
          ends_at: now,
        },
      });
      await emitMatchEnded(session.room_id);
      await emitRoomStateUpdate(session.room_id,
        {
          type: "MATCH_ENDED",
        }
      );
      return true;
    }
    return false;
};

const TILE_DIFFICULTY = {
  PAWN: {
    min: 1,
    max: 4,
  },
  KNIGHT: {
    min: 4,
    max: 7,
  },
  ROOK: {
    min: 7,
    max: 10,
  },
  TREASURE: {
    min: 4,
    max: 7,
  },
};

const TILE_COIN_REWARDS = {
  PAWN: 3,
  KNIGHT: 6,
  TREASURE: 10,
  ROOK: 15,
};

const HINT_COST_MAP = {
  PAWN: 4,
  KNIGHT: 7,
  TREASURE: 10,
  ROOK: 14,
};

const TILE_HINT_PRIORITY = {
  PAWN: 1,
  KNIGHT: 2,
  TREASURE: 3,
  ROOK: 4,
};

const getQuestionForTile = async (tileType, sessionId) => {
    const difficulty = TILE_DIFFICULTY[tileType];
    const usedQuestions = await prisma.tileState.findMany({
        where: {
            session_id: sessionId,
            active_question_id: {
                not: null,
            },
        },
        select: {
            active_question_id: true,
        },
    });
    const usedQuestionIds = usedQuestions.map(
        (q) => q.active_question_id
    );
    const questions = await prisma.question.findMany({
      where: {
        difficulty_score: {
          gte: difficulty.min,
          lte: difficulty.max,
        },
        id: {
            notIn: usedQuestionIds,
        },
      },
    });
    if (!questions.length) {
      throw new Error("No unused questions available");
    }
    const randomIndex = Math.floor(Math.random() * questions.length);
    return questions[randomIndex];
  };

const openTile = async (sessionId, tileId) => {
  // Fetch tile state
  const tileState = await prisma.tileState.findUnique({
      where: {
        session_id_tile_id: {
          session_id: sessionId,
          tile_id: tileId,
        },
      },
      include: {
        tile: true,
      },
    });

  if (!tileState) {
    throw new Error("Tile state not found");
  }

  // Check unlocked
  if (tileState.state === "LOCKED") {
    throw new Error("Tile is locked");
  }

  // Check solved
  if (tileState.state === "SOLVED") {
    throw new Error("Tile already solved");
  }

  // Fetch session
  const session = await prisma.gameSession.findUnique({
    where: {
        id: sessionId,
    },
  });

  // Match expiry validation
  const isExpired = await checkAndFreezeMatch(session);
  if (isExpired) {
    throw new Error("Match has ended");
  }

  // Freeze validation
  if (session.trap_freeze_until && new Date() < session.trap_freeze_until) {
    throw new Error("You are trapped");
  }

  // Handle trap tile
  if (tileState.tile.tile_type === "TRAP") {
    const freezeUntil = new Date(Date.now() + 15000);

    // Update session
    const updatedSession = await prisma.gameSession.update({
      where: {
        id: sessionId,
      },
      data: {
        score: {
          decrement: 10,
        },
        trap_freeze_until: freezeUntil,
      },
    });

    await addCoins(
      sessionId,
      -5,
      "TRAP_TRIGGERED",
      tileId
    );

    // Update tile state
    await prisma.tileState.update({
      where: {
        id: tileState.id,
      },
      data: {
        trap_triggered: true,
      },
    });

    getIO().to(`room-${session.room_id}`).emit("score-updated", {
        session_id: sessionId,
        score: updatedSession.score,
        team_id: session.team_id,
    });

    const leaderboard = await buildLeaderboard(session.room_id);
    emitLeaderboardUpdate(session.room_id, leaderboard);

    return {
      type: "TRAP",
      tile_id: tileId,
      message: "Trap activated",
      freeze_until: freezeUntil,
    };
  }

  // Reuse existing assigned question
  if (tileState.active_question_id) {
    const existingQuestion = await prisma.question.findUnique({
      where: {
        id: tileState.active_question_id,
      },
    });
    return {
      type: "QUESTION",
      tile_id: tileId,
      tile_type: tileState.tile.tile_type,
      question: {
        id: existingQuestion.id,
        content: existingQuestion.content,
        image_url: existingQuestion.image_url,
        question_type: existingQuestion.question_type,
        options: existingQuestion.options,
      },
    };
  }

  // Fetch random question
  const question = await getQuestionForTile(tileState.tile.tile_type, sessionId);

  // Assign active question
  await prisma.tileState.update({
    where: {
      id: tileState.id,
    },
    data: {
      active_question_id: question.id,
    },
  });

  return {
    type: "QUESTION",
    tile_id: tileId,
    tile_type: tileState.tile.tile_type,
    question: {
      id: question.id,
      content: question.content,
      image_url: question.image_url,
      question_type: question.question_type,
      options: question.options,
    },
  };
};

const submitAnswer = async (sessionId, tileId, answer) => {
  const session = await prisma.gameSession.findUnique({
    where: {
      id: sessionId,
    },
  });
  if (!session) {
    throw new Error("Session not found");
  }

  // Match expiry validation
  const isExpired = await checkAndFreezeMatch(session);
  if (isExpired) {
    throw new Error("Match has ended");
  }

  // Fetch tile state
  const tileState = await prisma.tileState.findUnique({
      where: {
        session_id_tile_id: {
          session_id: sessionId,
          tile_id: tileId,
        },
      },
      include: {
        tile: true,
        active_question: true,
      },
    });

  if (!tileState) {
    throw new Error("Tile state not found");
  }

  if (!tileState.active_question) {
    throw new Error("No active question");
  }

  // Validate answer
  const correctAnswer = tileState.active_question.answer.trim().toLowerCase();
  const submittedAnswer = answer.trim().toLowerCase();
  const isCorrect = (correctAnswer === submittedAnswer);
  const wrongPenalty = Math.max(4,Math.floor(tileState.tile.points_value * 0.25));
  console.log("Wrong penalty = ",wrongPenalty);

  // Wrong answer
  if (!isCorrect) {
    await prisma.attemptLog.create({
      data: {
        session_id: sessionId,
        tile_id: tileId,
        question_id: tileState.active_question.id,
        submitted_ans: answer,
        is_correct: false,
        score_delta: -wrongPenalty,
      },
    });

    const updatedSession = await prisma.gameSession.update({
        where: {
            id: sessionId,
        },
        data: {
            score: {
                decrement: wrongPenalty,
            },
        },
    });

    await prisma.tileState.update({
      where: {
        id: tileState.id,
      },
      data: {
        wrong_attempts: {
          increment: 1,
        },
      },
    });

    await addCoins(
      sessionId,
      -3,
      "WRONG_ANSWER",
      tileId
    );

    getIO().to(`room-${session.room_id}`).emit("score-updated", {
        session_id: sessionId,
        score: updatedSession.score,
        team_id: session.team_id,
    });

    const leaderboard = await buildLeaderboard(session.room_id);
    emitLeaderboardUpdate(session.room_id, leaderboard);

    return {
      correct: false,
      score_delta: -wrongPenalty,
    };
  }

  // Correct answer
  const wrongAttempts = tileState.wrong_attempts;
  const penalty = Math.floor(tileState.tile.points_value * 0.25);
  const scoreDelta = Math.max(0, tileState.tile.points_value - wrongAttempts * penalty);

  // Update session score
  const updatedSession = await prisma.gameSession.update({
      where: {
        id: sessionId,
      },
      data: {
        score: { increment: scoreDelta },
      },
    });

  const coinReward = TILE_COIN_REWARDS[tileState.tile.tile_type] || 0;
  await addCoins(
    sessionId,
    coinReward,
    "QUESTION_SOLVED",
    tileId
  );

  const leaderboard = await buildLeaderboard(session.room_id);
  emitLeaderboardUpdate(session.room_id, leaderboard);

  // Mark tile solved
  await prisma.tileState.update({
    where: {
      id: tileState.id,
    },
    data: {
      state: "SOLVED",
      solved_at: new Date(),
      score_earned: scoreDelta,
    },
  });

  // Create attempt log
  await prisma.attemptLog.create({
    data: {
      session_id: sessionId,
      tile_id: tileId,
      question_id: tileState.active_question.id,
      submitted_ans: answer,
      is_correct: true,
      score_delta: scoreDelta,
    },
  });

  // Unlock logic
  const boardTiles = await prisma.tile.findMany({
    where: {
      board_id: tileState.tile.board_id,
    },
  });

  const allTileStates = await prisma.tileState.findMany({
    where: {
        session_id: sessionId,
    },
  });

  const unlockPositions = getUnlockPositions(
    tileState.tile.tile_type,
    tileState.tile.row_index,
    tileState.tile.col_index,
    boardTiles,
    allTileStates
  );

  const newUnlocks = [];
  for (const [row, col] of unlockPositions) {
    const targetTile = boardTiles.find((tile) =>
          tile.row_index === row &&
          tile.col_index === col
      );

    if (!targetTile) continue;

    const targetState = await prisma.tileState.findUnique({
        where: {
          session_id_tile_id: {
            session_id: sessionId,
            tile_id: targetTile.id,
          },
        },
      });

    if (targetState.state === "LOCKED") {
      await prisma.tileState.update({
        where: {
          id: targetState.id,
        },
        data: {
          state: "UNLOCKED",
          unlocked_at: new Date(),
        },
      });

      newUnlocks.push({
        tile_id: targetTile.id,
        row,
        col,
      });
    }
  }

  const freshSession = await prisma.gameSession.findUnique({
    where: {
      id: sessionId,
    },
  });

  getIO().to(`room-${freshSession.room_id}`).emit("score-updated", {
    session_id: sessionId,
    score: freshSession.score,
    team_id: freshSession.team_id,
  });

  console.log("[SOCKET] score-updated emitted",
    {
        room: freshSession.room_id,
        session: sessionId,
        score: updatedSession.score,
    }
  );

  getIO().to(`room-${freshSession.room_id}`).emit("board-updated", {
    session_id: sessionId,
  });

  console.log("[SOCKET] board-updated emitted",
    {
        room: freshSession.room_id,
        session: sessionId,
    }
  );

  return {
    correct: true,
    score_delta: scoreDelta,
    new_score: updatedSession.score,
    new_unlocks: newUnlocks,
  };
};

const getHint = async (sessionId) => {
  const session = await prisma.gameSession.findUnique({
    where: {
      id: sessionId,
    },
  });

  if (!session) {
    throw new Error("Session not found");
  }

  const tileStates = await prisma.tileState.findMany({
    where: {
      session_id: sessionId,
      state: "UNLOCKED",
    },
    include: {
      tile: true,
    },
  });

  const validTiles = tileStates.filter(
    (t) => t.tile.tile_type !== "TRAP"
  );

  if (!validTiles.length) {
    throw new Error("No valid hint available");
  }

  validTiles.sort((a, b) => {
    return (
      TILE_HINT_PRIORITY[b.tile.tile_type] -
      TILE_HINT_PRIORITY[a.tile.tile_type]
    );
  });

  const bestTile = validTiles[0];
  const hintCost = HINT_COST_MAP[bestTile.tile.tile_type] || 8;
  if (session.coins < hintCost) {
    throw new Error(
      `Not enough coins to use hint.`
    );
  }

  await addCoins(
    sessionId,
    -hintCost,
    "HINT_USED",
    bestTile.tile.id
  );

  await prisma.hintLog.create({
    data: {
      session_id: sessionId,
      tile_id: bestTile.tile.id,
      hint_text: `Best move: ${bestTile.tile.tile_type}`,
      hint_type: "TEXT",
    },
  });

  return {
    tile_id: bestTile.tile.id,
    row: bestTile.tile.row_index,
    col: bestTile.tile.col_index,
    tile_type: bestTile.tile.tile_type,
    hint_cost: hintCost,
  };
};

module.exports = {
  getBoardState,
  openTile,
  submitAnswer,
  getHint
};
