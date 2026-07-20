-- Database Migrations

-- 25/06/26 - Sam - Updated column names for lessons and classrooms
ALTER TABLE `classrooms` CHANGE `name` `classroom_name` VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL;
ALTER TABLE `lessons` CHANGE `name` `lesson_name` VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL;

-- 16/07/26 - Silver - Rename classrooms table to rooms
RENAME TABLE `map`.`classrooms` TO `map`.`rooms`;
ALTER TABLE `rooms` CHANGE `classroom_id` `room_id` INT(11) NOT NULL AUTO_INCREMENT;

-- 20/07/26 - Sam - Database restructure to use Google IDs
DROP TABLE `students`;
DROP TABLE `teachers`;
CREATE TABLE `map`.`accounts` (`account_id` VARCHAR(256) NOT NULL , `first_name` VARCHAR(50) NOT NULL , `last_name` VARCHAR(50) NOT NULL , `email` VARCHAR(256) NOT NULL , UNIQUE `unique_id` (`account_id`)) ENGINE = InnoDB;
ALTER TABLE `accounts` ADD `is_teacher` BOOLEAN NOT NULL DEFAULT FALSE AFTER `email`;
RENAME TABLE `map`.`enrolments` TO `map`.`attendance`;