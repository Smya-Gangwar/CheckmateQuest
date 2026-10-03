ALTER TABLE `GameSession`
  ADD COLUMN `active_connection_token` VARCHAR(191) NULL,
  ADD COLUMN `active_connection_expires_at` DATETIME(3) NULL,
  ADD COLUMN `active_connection_last_seen` DATETIME(3) NULL;

CREATE UNIQUE INDEX `GameSession_active_connection_token_key`
  ON `GameSession`(`active_connection_token`);