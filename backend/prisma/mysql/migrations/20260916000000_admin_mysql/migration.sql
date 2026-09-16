-- CreateTable
CREATE TABLE `AdminWorkspace` (
    `id` VARCHAR(32) NOT NULL,
    `data` JSON NOT NULL,
    `version` INTEGER NOT NULL DEFAULT 0,
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AdminMedia` (
    `id` VARCHAR(36) NOT NULL,
    `mime` VARCHAR(64) NOT NULL,
    `data` LONGBLOB NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(150) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `number` VARCHAR(20) NOT NULL DEFAULT '',
    `dob` VARCHAR(30) NULL,
    `country` VARCHAR(100) NULL,
    `status` SMALLINT NOT NULL DEFAULT 1,
    `type` SMALLINT NOT NULL DEFAULT 2,
    `linkHash` INTEGER NULL,
    `isVerified` SMALLINT NOT NULL DEFAULT 0,
    `isSubscribed` SMALLINT NOT NULL DEFAULT 0,
    `refreshToken` TEXT NULL,
    `isDeleted` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    INDEX `users_number_idx`(`number`),
    INDEX `users_isDeleted_idx`(`isDeleted`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
