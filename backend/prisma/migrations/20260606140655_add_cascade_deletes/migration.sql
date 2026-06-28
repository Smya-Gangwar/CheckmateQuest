-- DropForeignKey
ALTER TABLE `Board` DROP FOREIGN KEY `Board_room_id_fkey`;

-- DropForeignKey
ALTER TABLE `GameSession` DROP FOREIGN KEY `GameSession_board_id_fkey`;

-- DropForeignKey
ALTER TABLE `GameSession` DROP FOREIGN KEY `GameSession_room_id_fkey`;

-- DropForeignKey
ALTER TABLE `GameSession` DROP FOREIGN KEY `GameSession_team_id_fkey`;

-- DropForeignKey
ALTER TABLE `Team` DROP FOREIGN KEY `Team_room_id_fkey`;

-- DropForeignKey
ALTER TABLE `Tile` DROP FOREIGN KEY `Tile_board_id_fkey`;

-- DropForeignKey
ALTER TABLE `TileState` DROP FOREIGN KEY `TileState_session_id_fkey`;

-- DropForeignKey
ALTER TABLE `TileState` DROP FOREIGN KEY `TileState_tile_id_fkey`;

-- AddForeignKey
ALTER TABLE `Team` ADD CONSTRAINT `Team_room_id_fkey` FOREIGN KEY (`room_id`) REFERENCES `Room`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Board` ADD CONSTRAINT `Board_room_id_fkey` FOREIGN KEY (`room_id`) REFERENCES `Room`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Tile` ADD CONSTRAINT `Tile_board_id_fkey` FOREIGN KEY (`board_id`) REFERENCES `Board`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GameSession` ADD CONSTRAINT `GameSession_board_id_fkey` FOREIGN KEY (`board_id`) REFERENCES `Board`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GameSession` ADD CONSTRAINT `GameSession_room_id_fkey` FOREIGN KEY (`room_id`) REFERENCES `Room`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GameSession` ADD CONSTRAINT `GameSession_team_id_fkey` FOREIGN KEY (`team_id`) REFERENCES `Team`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TileState` ADD CONSTRAINT `TileState_session_id_fkey` FOREIGN KEY (`session_id`) REFERENCES `GameSession`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TileState` ADD CONSTRAINT `TileState_tile_id_fkey` FOREIGN KEY (`tile_id`) REFERENCES `Tile`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
