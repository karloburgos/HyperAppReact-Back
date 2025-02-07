-- CreateTable
CREATE TABLE `Client` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `countryCode` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `email` VARCHAR(191) NOT NULL,
    `birthDate` DATETIME(3) NULL,
    `origin` VARCHAR(191) NULL,
    `relatedClient` VARCHAR(191) NULL,
    `country` VARCHAR(191) NULL,
    `totalSpent` DOUBLE NOT NULL DEFAULT 0,
    `totalVisits` INTEGER NOT NULL DEFAULT 0,
    `reviews` INTEGER NOT NULL DEFAULT 0,
    `status` VARCHAR(191) NOT NULL DEFAULT 'active',
    `membershipType` VARCHAR(191) NOT NULL DEFAULT 'Regular',
    `image` VARCHAR(191) NULL,

    UNIQUE INDEX `Client_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
