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
        points_value: 20,
        hint_text: null,
        glow_level: 1,
        color_tag: "default",
      });
    }
  }
  return board;
};

const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min;
};

const getTile = (board, row, col) => {
  return board.find(
    (tile) =>
      tile.row_index === row &&
      tile.col_index === col
  );
};

const isSpecialTile = (tile) => {
  return tile.tile_type !== TILE_TYPES.PAWN;
};

const placeTraps = (board) => {
  for (let row = 0; row < BOARD_SIZE; row++) {
    let placed = false;

    while (!placed) {
      const randomCol = getRandomInt(0, BOARD_SIZE);
      const tile = getTile(board, row, randomCol);

      if (!isSpecialTile(tile)) {
        tile.tile_type = TILE_TYPES.TRAP;
        tile.points_value = -20;
        placed = true;
      }
    }
  }
};

const placeTreasures = (board) => {
  for (let row = 0; row < BOARD_SIZE; row++) {
    let placed = false;

    while (!placed) {
      const randomCol = getRandomInt(0, BOARD_SIZE);
      const tile = getTile(board, row, randomCol);

      if (!isSpecialTile(tile)) {
        tile.tile_type = TILE_TYPES.TREASURE;
        tile.points_value = 60;
        tile.color_tag = "gold";
        placed = true;
      }
    }
  }
};

const QUADRANTS = [
  {
    rowStart: 0,
    rowEnd: 3,
    colStart: 0,
    colEnd: 3,
  },
  {
    rowStart: 0,
    rowEnd: 3,
    colStart: 4,
    colEnd: 7,
  },
  {
    rowStart: 4,
    rowEnd: 7,
    colStart: 0,
    colEnd: 3,
  },
  {
    rowStart: 4,
    rowEnd: 7,
    colStart: 4,
    colEnd: 7,
  },
];

const placeKnights = (board) => {
  const selectedQuadrants = [0, 1, 2];

  selectedQuadrants.forEach((quadrantIndex) => {
    const quadrant = QUADRANTS[quadrantIndex];

    let placed = false;
    while (!placed) {
      const row = getRandomInt(
        quadrant.rowStart,
        quadrant.rowEnd + 1
      );

      const col = getRandomInt(
        quadrant.colStart,
        quadrant.colEnd + 1
      );

      const tile = getTile(board, row, col);

      if (!isSpecialTile(tile)) {
        tile.tile_type = TILE_TYPES.KNIGHT;
        tile.points_value = 45;
        tile.color_tag = "blue";
        placed = true;
      }
    }
  });
};

const placeRooks = (board) => {
  const selectedQuadrants = [1, 2, 3];

  selectedQuadrants.forEach((quadrantIndex) => {
    const quadrant = QUADRANTS[quadrantIndex];

    let placed = false;
    while (!placed) {
      const row = getRandomInt(
        quadrant.rowStart,
        quadrant.rowEnd + 1
      );

      const col = getRandomInt(
        quadrant.colStart,
        quadrant.colEnd + 1
      );

      const tile = getTile(board, row, col);

      if (!isSpecialTile(tile)) {
        tile.tile_type = TILE_TYPES.ROOK;
        tile.points_value = 80;
        tile.color_tag = "red";
        placed = true;
      }
    }
  });
};

const generateBoardLayout = () => {
  const board = createEmptyBoard();
  placeTraps(board);
  placeTreasures(board);
  placeKnights(board);
  placeRooks(board);
  return board;
};

module.exports = {
  generateBoardLayout,
};