/*
  Warnings:

  - A unique constraint covering the columns `[room_id,name]` on the table `Team` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[session_id,tile_id]` on the table `TileState` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Team_room_id_name_key` ON `Team`(`room_id`, `name`);

-- CreateIndex
CREATE UNIQUE INDEX `TileState_session_id_tile_id_key` ON `TileState`(`session_id`, `tile_id`);
