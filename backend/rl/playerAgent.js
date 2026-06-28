const BOARD_SIZE = 8;

const getTile = (board, row, col) => {
  return board.find(
    (tile) =>
      tile.row_index === row &&
      tile.col_index === col
  );
};

const getMoves = (row, col) => {
  const directions = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];

  return directions.map(([dr, dc]) => ({
      row: row + dr,
      col: col + dc,
    })).filter(
      (move) =>
        move.row >= 0 &&
        move.row < BOARD_SIZE &&
        move.col >= 0 &&
        move.col < BOARD_SIZE
    );
};

const chooseMove = (
  board,
  row,
  col,
  visited
) => {
  const moves = getMoves(row, col);
  let bestMove = moves[0];
  let bestScore = -Infinity;

  for (const move of moves) {
    const tile = getTile(
      board,
      move.row,
      move.col
    );
    let score = 0;

    // Rewards
    if (tile.tile_type === "TREASURE") {
      score += 28;
    }
    if (tile.tile_type === "KNIGHT") {
      score += 18;
    }
    if (tile.tile_type === "ROOK") {
      score += 35;
    }

    // Trap penalty reduced
    if (tile.tile_type === "TRAP") {
      score -= 12;
    }

    // Revisit penalty
    const visitKey = `${move.row}-${move.col}`;
    if (visited.has(visitKey)) {
      score -= 10;
    }

    // Forward exploration bias
    score += move.row * 2;

    // Strong randomness for imperfect decisions
    score += Math.random() * 20;
    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }
  return bestMove;
};

module.exports = {
  chooseMove,
};