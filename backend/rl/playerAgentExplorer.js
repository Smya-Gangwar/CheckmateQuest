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

const runExplorerAgent = (
  board,
  start,
  maxSteps = 20
) => {
  const START_TILES = [
    [2,0],
    [3,0],
    [4,0],
    [3,1]
  ];
  let current = null;
  for (const [r, c] of START_TILES) {
    current = board.find(
        t => t.row_index === r && t.col_index === c
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
    moves.sort((a, b) => {
      const aVisited = visited.has(
        `${a.row_index}-${a.col_index}`
      );
      const bVisited = visited.has(
        `${b.row_index}-${b.col_index}`
      );
      return aVisited - bVisited;
    });

    current = moves[0];

    if (current.tile_type === "TREASURE") score += 60;
    if (current.tile_type === "KNIGHT") score += 40;
    if (current.tile_type === "ROOK") score += 80;
    if (current.tile_type === "TRAP") {
      score -= 40;
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
  runExplorerAgent,
};