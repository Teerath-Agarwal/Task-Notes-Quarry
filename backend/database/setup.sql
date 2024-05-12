CREATE TABLE `Tasks`(
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `user` INT UNSIGNED NOT NULL,
    `title` VARCHAR(255) NULL,
    `task` LONGTEXT NOT NULL,
    `completed` TINYINT(1) NULL,
    `deadline` DATE NULL,
    `priority` TINYINT NULL
);
CREATE TABLE `Users`(
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `email` VARCHAR(255) NOT NULL,
    `password` LONGTEXT NOT NULL,
    `userName` VARCHAR(255) NOT NULL
);
ALTER TABLE
    `Users` ADD UNIQUE `users_email_unique`(`email`);
ALTER TABLE
    `Tasks` ADD CONSTRAINT `tasks_user_foreign` FOREIGN KEY(`user`) REFERENCES `Users`(`id`);