-- Database Migrations

-- 21/07/26 - Silver - Rename classrooms table to rooms
ALTER TABLE `rooms` CHANGE `classroom_name` `room_name` VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL;

-- 21/07/26 - Silver - Fix sam's room
UPDATE `rooms` SET `points` = '\"[[5, 3], [2, 3], [2, 1], [5, 1]]\"' WHERE `rooms`.`room_id` = 1;
