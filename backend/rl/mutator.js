const cloneBoard = (board) =>
    JSON.parse(JSON.stringify(board));

const distance = (a, b) =>
  Math.abs(a.row_index - b.row_index) +
  Math.abs(a.col_index - b.col_index);

const mutateBoard = (board) => {
  const newBoard = cloneBoard(board);

  for (let i = 0; i < 3; i++) {
    let idx1 = Math.floor(Math.random() * 64);
    let idx2 = Math.floor(Math.random() * 64);
    while (idx1 === idx2 || distance(newBoard[idx1],newBoard[idx2]) <= 2)
    {
      idx2 = Math.floor(Math.random() * 64);
    }
    [
      newBoard[idx1].tile_type,
      newBoard[idx2].tile_type
    ] = [
      newBoard[idx2].tile_type,
      newBoard[idx1].tile_type
    ];
  }
  return newBoard;
};

module.exports = {
  mutateBoard
};