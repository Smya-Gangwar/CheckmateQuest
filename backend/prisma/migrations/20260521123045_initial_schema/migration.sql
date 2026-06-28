-- CreateTable
CREATE TABLE `Admin` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `hashed_password` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Admin_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Room` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `room_code` VARCHAR(191) NOT NULL,
    `status` ENUM('WAITING', 'RUNNING', 'CLOSED') NOT NULL,
    `max_teams` INTEGER NOT NULL,
    `starts_at` DATETIME(3) NULL,
    `ends_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `admin_id` INTEGER NOT NULL,

    UNIQUE INDEX `Room_room_code_key`(`room_code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Team` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `join_code` VARCHAR(191) NOT NULL,
    `status` ENUM('ACTIVE', 'DISCONNECTED', 'ELIMINATED') NOT NULL,
    `joined_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `room_id` INTEGER NOT NULL,

    UNIQUE INDEX `Team_join_code_key`(`join_code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Board` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `rl_seed` INTEGER NOT NULL,
    `tile_layout` JSON NOT NULL,
    `generated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `room_id` INTEGER NOT NULL,

    UNIQUE INDEX `Board_room_id_key`(`room_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Tile` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `row_index` INTEGER NOT NULL,
    `col_index` INTEGER NOT NULL,
    `tile_type` ENUM('PAWN', 'KNIGHT', 'ROOK', 'TRAP', 'TREASURE') NOT NULL,
    `points_value` INTEGER NOT NULL,
    `hint_text` VARCHAR(191) NULL,
    `glow_level` INTEGER NULL,
    `color_tag` VARCHAR(191) NULL,
    `board_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GameSession` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `score` INTEGER NOT NULL DEFAULT 0,
    `coins` INTEGER NOT NULL DEFAULT 100,
    `status` ENUM('ACTIVE', 'FINISHED', 'FROZEN') NOT NULL,
    `started_at` DATETIME(3) NULL,
    `trap_freeze_until` DATETIME(3) NULL,
    `finished_at` DATETIME(3) NULL,
    `room_id` INTEGER NOT NULL,
    `team_id` INTEGER NOT NULL,
    `board_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Question` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `content` TEXT NOT NULL,
    `question_type` ENUM('MCQ', 'ONE_WORD') NOT NULL,
    `options` JSON NULL,
    `answer` VARCHAR(191) NOT NULL,
    `difficulty_score` DOUBLE NOT NULL,
    `category` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TileState` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `state` ENUM('LOCKED', 'UNLOCKED', 'SOLVED') NOT NULL,
    `unlocked_at` DATETIME(3) NULL,
    `solved_at` DATETIME(3) NULL,
    `score_earned` INTEGER NOT NULL DEFAULT 0,
    `trap_triggered` BOOLEAN NOT NULL DEFAULT false,
    `wrong_attempts` INTEGER NOT NULL DEFAULT 0,
    `session_id` INTEGER NOT NULL,
    `tile_id` INTEGER NOT NULL,
    `active_question_id` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AttemptLog` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `submitted_ans` VARCHAR(191) NOT NULL,
    `is_correct` BOOLEAN NOT NULL,
    `score_delta` INTEGER NOT NULL,
    `attempted_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `session_id` INTEGER NOT NULL,
    `tile_id` INTEGER NOT NULL,
    `question_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `HintLog` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `hint_text` VARCHAR(191) NOT NULL,
    `hint_type` ENUM('TEXT', 'VISUAL') NOT NULL,
    `viewed_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `session_id` INTEGER NOT NULL,
    `tile_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CoinTransaction` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `reason` VARCHAR(191) NOT NULL,
    `delta` INTEGER NOT NULL,
    `balance_after` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `session_id` INTEGER NOT NULL,
    `tile_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Leaderboard` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `rank` INTEGER NOT NULL,
    `score` INTEGER NOT NULL,
    `finish_time` DATETIME(3) NULL,
    `snapshot_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `room_id` INTEGER NOT NULL,
    `session_id` INTEGER NOT NULL,
    `team_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ConnectionSession` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `socket_id` VARCHAR(191) NOT NULL,
    `connected_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `disconnected_at` DATETIME(3) NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `last_ping_at` DATETIME(3) NULL,
    `team_id` INTEGER NOT NULL,

    UNIQUE INDEX `ConnectionSession_socket_id_key`(`socket_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BoardEvaluation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fairness_score` INTEGER NOT NULL,
    `avg_completion_time` DOUBLE NOT NULL,
    `avg_score` INTEGER NOT NULL,
    `dead_end_rate` INTEGER NOT NULL,
    `path_diversity` INTEGER NOT NULL,
    `board_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Room` ADD CONSTRAINT `Room_admin_id_fkey` FOREIGN KEY (`admin_id`) REFERENCES `Admin`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Team` ADD CONSTRAINT `Team_room_id_fkey` FOREIGN KEY (`room_id`) REFERENCES `Room`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Board` ADD CONSTRAINT `Board_room_id_fkey` FOREIGN KEY (`room_id`) REFERENCES `Room`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Tile` ADD CONSTRAINT `Tile_board_id_fkey` FOREIGN KEY (`board_id`) REFERENCES `Board`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GameSession` ADD CONSTRAINT `GameSession_room_id_fkey` FOREIGN KEY (`room_id`) REFERENCES `Room`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GameSession` ADD CONSTRAINT `GameSession_team_id_fkey` FOREIGN KEY (`team_id`) REFERENCES `Team`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `GameSession` ADD CONSTRAINT `GameSession_board_id_fkey` FOREIGN KEY (`board_id`) REFERENCES `Board`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TileState` ADD CONSTRAINT `TileState_session_id_fkey` FOREIGN KEY (`session_id`) REFERENCES `GameSession`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TileState` ADD CONSTRAINT `TileState_tile_id_fkey` FOREIGN KEY (`tile_id`) REFERENCES `Tile`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TileState` ADD CONSTRAINT `TileState_active_question_id_fkey` FOREIGN KEY (`active_question_id`) REFERENCES `Question`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AttemptLog` ADD CONSTRAINT `AttemptLog_session_id_fkey` FOREIGN KEY (`session_id`) REFERENCES `GameSession`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AttemptLog` ADD CONSTRAINT `AttemptLog_tile_id_fkey` FOREIGN KEY (`tile_id`) REFERENCES `Tile`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AttemptLog` ADD CONSTRAINT `AttemptLog_question_id_fkey` FOREIGN KEY (`question_id`) REFERENCES `Question`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HintLog` ADD CONSTRAINT `HintLog_session_id_fkey` FOREIGN KEY (`session_id`) REFERENCES `GameSession`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HintLog` ADD CONSTRAINT `HintLog_tile_id_fkey` FOREIGN KEY (`tile_id`) REFERENCES `Tile`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CoinTransaction` ADD CONSTRAINT `CoinTransaction_session_id_fkey` FOREIGN KEY (`session_id`) REFERENCES `GameSession`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CoinTransaction` ADD CONSTRAINT `CoinTransaction_tile_id_fkey` FOREIGN KEY (`tile_id`) REFERENCES `Tile`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Leaderboard` ADD CONSTRAINT `Leaderboard_room_id_fkey` FOREIGN KEY (`room_id`) REFERENCES `Room`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Leaderboard` ADD CONSTRAINT `Leaderboard_session_id_fkey` FOREIGN KEY (`session_id`) REFERENCES `GameSession`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Leaderboard` ADD CONSTRAINT `Leaderboard_team_id_fkey` FOREIGN KEY (`team_id`) REFERENCES `Team`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ConnectionSession` ADD CONSTRAINT `ConnectionSession_team_id_fkey` FOREIGN KEY (`team_id`) REFERENCES `Team`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BoardEvaluation` ADD CONSTRAINT `BoardEvaluation_board_id_fkey` FOREIGN KEY (`board_id`) REFERENCES `Board`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
