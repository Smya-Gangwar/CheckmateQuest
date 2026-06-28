const prisma = require("../prisma/client");
const bestBoard = require("../../rl/best_board.json");

const TILE_META = {
  PAWN: {
    points_value: 20,
    hint_text: null,
    glow_level: 1,
    color_tag: "default",
  },
  TRAP: {
    points_value: -20,
    hint_text: null,
    glow_level: 1,
    color_tag: "default",
  },
  TREASURE: {
    points_value: 60,
    hint_text: null,
    glow_level: 2,
    color_tag: "gold",
  },
  KNIGHT: {
    points_value: 45,
    hint_text: null,
    glow_level: 2,
    color_tag: "blue",
  },
  ROOK: {
    points_value: 80,
    hint_text: null,
    glow_level: 3,
    color_tag: "red",
  },
};

const createBoard = async (roomId) => {
  const boardLayout = bestBoard;

  const enrichedBoardLayout = boardLayout.map((tile) => ({
    ...tile,
    ...TILE_META[tile.tile_type],
  }));

  const board = await prisma.board.create({
    data: {
      room_id: roomId,
      rl_seed: 999999,
      tile_layout: enrichedBoardLayout,
    },
  });

  const tileData = enrichedBoardLayout.map((tile) => ({
    ...tile,
    board_id: board.id,
  }));

  await prisma.tile.createMany({
    data: tileData,
  });

  return board;
};

module.exports = {
  createBoard,
};