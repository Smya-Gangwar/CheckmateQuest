const getTile = (board, row, col) => {
  return board.find(
    (t) =>
      t.row_index === row &&
      t.col_index === col
  );
};

const getMoves = (board, current) => {
  const dirs = [[-1,0],[1,0],[0,-1],[0,1]];
  return dirs.map(([dr,dc]) =>
      getTile(
        board,
        current.row_index + dr,
        current.col_index + dc
      )
    ).filter(Boolean);
};

const tileValue = {
  PAWN: 10,
  TREASURE: 50,
  KNIGHT: 30,
  ROOK: 50,
  TRAP: -1000,
};

const runSafeAgent = (board, start, maxSteps = 20) => {
  const START_TILES = [
    [2,0],
    [3,0],
    [4,0],
    [3,1]
  ];
  let current = null;
  for (const [r, c] of START_TILES) {
    current = board.find(
        t =>
        t.row_index === r &&
        t.col_index === c
    );
    if (current) break;
  }
  if (!current) {
    return {
        score: -9999,
        trapHits: 999,
        tilesExplored: 0
    };
  }
  let visited = new Set();
  let score = 0;
  let trapHits = 0;

  for (let i = 0; i < maxSteps; i++) {
    visited.add(`${current.row_index}-${current.col_index}`);
    const moves = getMoves(board, current);
    const unvisitedMoves = moves.filter(move =>
        !visited.has(
        `${move.row_index}-${move.col_index}`
        )
    );

    if (!unvisitedMoves.length) break;
    unvisitedMoves.sort(
      (a, b) =>
        tileValue[b.tile_type] -
        tileValue[a.tile_type]
    );

    current = unvisitedMoves[0];
    score += tileValue[current.tile_type];
    if (current.tile_type === "TRAP") {
      trapHits++;
    }
  }

  return {
    score,
    trapHits,
    explored: visited.size,
  };
};

module.exports = {
  runSafeAgent,
};