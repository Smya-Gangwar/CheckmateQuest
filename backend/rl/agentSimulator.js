const getTile = (board, row, col) => {
  return board.find(
    (t) => t.row_index === row && t.col_index === col
  );
};

const getValidMoves = (board, row, col) => {
  const moves = [
    [row + 1, col],
    [row - 1, col],
    [row, col + 1],
    [row, col - 1],
  ];
  return moves.map(([r, c]) => getTile(board, r, c)).filter(Boolean);
};

const tileReward = {
  PAWN: 5,
  KNIGHT: 20,
  TREASURE: 35,
  ROOK: 50,
  TRAP: -25,
};

const START_TILES = [
  [2, 0],
  [3, 0],
  [4, 0],
  [3, 1],
];

const getRandomStart = (board) => {
  const randomIndex = Math.floor(Math.random() * START_TILES.length);
  const [row, col] = START_TILES[randomIndex];
  return getTile(board, row, col);
};

const simulateAgent = (board, steps = 25) => {
  let current = getRandomStart(board);
  let totalReward = 0;
  const visited = new Set();
  for (let i = 0; i < steps; i++) {
    visited.add(
      `${current.row_index}-${current.col_index}`
    );

    totalReward += tileReward[current.tile_type];
    const moves = getValidMoves(
      board,
      current.row_index,
      current.col_index
    );
    
    const unvisited = moves.filter(
      (m) =>
        !visited.has(
          `${m.row_index}-${m.col_index}`
        )
    );

    if (!unvisited.length) break;
    unvisited.sort(
      (a, b) =>
        tileReward[b.tile_type] -
        tileReward[a.tile_type]
    );
    current = unvisited[0];
  }
  return totalReward;
};

module.exports = {
  simulateAgent,
};