/*
  Warnings:

  - A unique constraint covering the columns `[board_id,row_index,col_index]` on the table `Tile` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Tile_board_id_row_index_col_index_key` ON `Tile`(`board_id`, `row_index`, `col_index`);
