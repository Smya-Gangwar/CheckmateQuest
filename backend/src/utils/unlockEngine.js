const BOARD_SIZE = 8;

const isValidPosition = (
  row,
  col
) => {
  return (
    row >= 0 &&
    row < BOARD_SIZE &&
    col >= 0 &&
    col < BOARD_SIZE
  );
};

const getPawnUnlocks = (
  row,
  col
) => {
  return [
    [row - 1, col],
    [row + 1, col],
    [row, col - 1],
    [row, col + 1],
  ].filter(([r, c]) => isValidPosition(r, c));
};

const getKnightUnlocks = (
  row,
  col
) => {
  const positions = [
    [row - 2, col - 1],
    [row - 2, col + 1],
    [row + 2, col - 1],
    [row + 2, col + 1],
    [row - 1, col - 2],
    [row - 1, col + 2],
    [row + 1, col - 2],
    [row + 1, col + 2],
  ];
  return positions.filter(
    ([r, c]) => isValidPosition(r, c)
  );
};

const getRookUnlocks = (
  row,
  col,
  boardTiles,
  tileStates
) => {
  const rowPositions = [];
  const colPositions = [];
  let rowLockedCount = 0;
  let colLockedCount = 0;

  // ROW scan
  for (let c = 0; c < BOARD_SIZE; c++) {
    if (c === col) continue;
    const targetTile = boardTiles.find((tile) =>
        tile.row_index === row &&
        tile.col_index === c
    );

    if (!targetTile) continue;

    const targetState = tileStates.find((state) =>
        state.tile_id === targetTile.id
    );

    rowPositions.push([row, c]);

    if (targetState?.state === "LOCKED") {
      rowLockedCount++;
    }
  }

  // COLUMN scan
  for (let r = 0; r < BOARD_SIZE; r++) {
    if (r === row) continue;

    const targetTile = boardTiles.find((tile) =>
        tile.row_index === r &&
        tile.col_index === col
    );

    if (!targetTile) continue;

    const targetState = tileStates.find((state) =>
        state.tile_id === targetTile.id
    );

    colPositions.push([r, col]);

    if (targetState?.state === "LOCKED") {
      colLockedCount++;
    }
  }

  // Choose direction with MORE locked tiles
  if (rowLockedCount >= colLockedCount) {
    return rowPositions;
  }
  return colPositions;
};

const getUnlockPositions = (
  tileType, row, col, boardTiles, tileStates
) => {
  switch (tileType) {
    case "PAWN": return getPawnUnlocks(row, col);
    case "KNIGHT": return getKnightUnlocks(row, col);
    case "ROOK": return getRookUnlocks(row, col, boardTiles, tileStates);
    case "BISHOP": return getBishopUnlocks(row, col);
    default: return [];
  }
};

module.exports = {
  getUnlockPositions
};