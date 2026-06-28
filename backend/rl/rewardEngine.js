const BOARD_SIZE = 8;

const getTile = (board, row, col) => board.find(
    (t) =>
      t.row_index === row &&
      t.col_index === col
  );

const getRadiusTiles = (
  board,
  row,
  col,
  radius = 2
) => {
  const tiles = [];
  for (let r = row - radius; r <= row + radius; r++) {
    for (let c = col - radius; c <= col + radius; c++) {
      if (
        r < 0 ||
        r >= BOARD_SIZE ||
        c < 0 ||
        c >= BOARD_SIZE ||
        (r === row && c === col)
      )
        continue;
      const tile = getTile(board, r, c);
      if (tile) tiles.push(tile);
    }
  }
  return tiles;
};

const evaluateBoard = (board) => {
  let reward = 0;
  const clusterPenalty = {
    TRAP: 22,
    TREASURE: 18,
    ROOK: 30,
    KNIGHT: 14
  };

  for (const tile of board) {
    const nearby = getRadiusTiles(
      board,
      tile.row_index,
      tile.col_index,
      2
    );

    // anti-clustering
    if (
      ["TRAP", "TREASURE", "ROOK", "KNIGHT"]
        .includes(tile.tile_type)
    ) {
      const sameType = nearby.filter(
          (n) =>
            n.tile_type === tile.tile_type
        ).length;

      reward -= sameType * clusterPenalty[tile.tile_type];
    }

    // dead zone prevention
    if (tile.tile_type === "PAWN") {
      const pawnCount = nearby.filter(
          (n) => n.tile_type === "PAWN"
        ).length;

      if (pawnCount >= 7) {
        reward -= 12;
      }
    }

    const row = tile.row_index;

    // progressive tension
    if (row <= 2) {
      if (tile.tile_type === "TRAP")
        reward += 8;
      if (tile.tile_type === "TREASURE")
        reward += 6;
    }

    if (row >= 3 && row <= 5) {
      if (tile.tile_type === "TRAP")
        reward += 14;
      if (tile.tile_type === "TREASURE")
        reward += 10;
      if (tile.tile_type === "KNIGHT")
        reward += 12;
    }

    if (row >= 6) {
      if (tile.tile_type === "ROOK")
        reward += 20;
      if (tile.tile_type === "TREASURE")
        reward += 8;
      if (tile.tile_type === "TRAP")
        reward += 8;
    }

    // hard rook gating
    if (tile.tile_type === "ROOK" && row <= 4) {
      reward -= 120;
    }
  }

  // start zone safety
  const startTiles = [
    [2, 0],
    [3, 0],
    [4, 0],
    [3, 1]
  ];

  for (const [r, c] of startTiles) {
    const tile = getTile(board, r, c);
    if (tile.tile_type === "TRAP")
      reward -= 80;
    if (tile.tile_type === "ROOK")
      reward -= 100;
    if (tile.tile_type === "TREASURE")
      reward += 20;
    if (tile.tile_type === "KNIGHT")
      reward += 15;
  }

  // global spread reward
  const specials = board.filter(
    (t) => t.tile_type !== "PAWN"
  );

  let spreadScore = 0;
  for (let i = 0; i < specials.length; i++) {
    for (let j = i + 1; j < specials.length; j++) {
      const dist = 
        Math.abs(specials[i].row_index - specials[j].row_index) +
        Math.abs(specials[i].col_index - specials[j].col_index);
      spreadScore += dist;
    }
  }
  reward += spreadScore * 0.35;
  return reward;
};

module.exports = {
  evaluateBoard
};