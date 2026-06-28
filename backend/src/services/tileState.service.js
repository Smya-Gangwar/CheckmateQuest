const prisma = require("../prisma/client");

const getAdjacentPositions = (
  row,
  col
) => {
  return [
    [row - 1, col],
    [row + 1, col],
    [row, col - 1],
    [row, col + 1],
  ];
};

const initializeTileStates = async (
  sessionId,
  boardId
) => {
  const tiles = await prisma.tile.findMany({
    where: {
      board_id: boardId,
    },
  });

  const START_ROW = 4;
  const START_COL = 0;

  const adjacentPositions =
    getAdjacentPositions(
      START_ROW,
      START_COL
    );

  const tileStates = [];

  for (const tile of tiles) {
    let state = "LOCKED";

    // Starting tile
    if (
      tile.row_index === START_ROW &&
      tile.col_index === START_COL
    ) {
      state = "UNLOCKED";
    }

    // Adjacent tiles
    for (const [row, col] of adjacentPositions) {
      if (
        tile.row_index === row &&
        tile.col_index === col
      ) {
        state = "UNLOCKED";
      }
    }

    tileStates.push({
      session_id: sessionId,
      tile_id: tile.id,
      state,
      unlocked_at:
        state === "UNLOCKED"
          ? new Date()
          : null,
    });
  }

  await prisma.tileState.createMany({
    data: tileStates,
  });
};

module.exports = {
  initializeTileStates,
};
