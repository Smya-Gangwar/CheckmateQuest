const BOARD_SIZE = 8;

const TILE_TYPES = {
  PAWN: "PAWN",
  KNIGHT: "KNIGHT",
  ROOK: "ROOK",
  TRAP: "TRAP",
  TREASURE: "TREASURE",
};

const createEmptyBoard = () => {
  const board = [];
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      board.push({
        row_index: row,
        col_index: col,
        tile_type: TILE_TYPES.PAWN,
      });
    }
  }
  return board;
};

const randomPosition = () => ({
  row: Math.floor(Math.random() * BOARD_SIZE),
  col: Math.floor(Math.random() * BOARD_SIZE),
});

const getTile = (board, row, col) => board.find(
    (t) => t.row_index === row && t.col_index === col
);

const placePiece = (board, type, count) => {
  let placed = 0;
  while (placed < count) {
    const pos = randomPosition();
    const tile = getTile(board, pos.row, pos.col);

    if (tile.tile_type === TILE_TYPES.PAWN) {
      tile.tile_type = type;
      placed++;
    }
  }
};

const sampleBoard = () => {
  const board = createEmptyBoard();
  placePiece(board, TILE_TYPES.TRAP, 8);
  placePiece(board, TILE_TYPES.TREASURE, 8);
  placePiece(board, TILE_TYPES.KNIGHT, 3);
  placePiece(board, TILE_TYPES.ROOK, 3);
  return board;
};

module.exports = {
  sampleBoard,
  TILE_TYPES,
  BOARD_SIZE,
};