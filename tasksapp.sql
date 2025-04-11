-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 11, 2025 at 01:37 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `tasksapp`
--

-- --------------------------------------------------------

--
-- Table structure for table `tasks`
--

CREATE TABLE `tasks` (
  `t_id` int(11) NOT NULL,
  `t_title` varchar(255) NOT NULL,
  `t_containt` varchar(255) NOT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tasks`
--

INSERT INTO `tasks` (`t_id`, `t_title`, `t_containt`, `is_active`, `user_id`) VALUES
(2, 'hello', 'fffffffffffffffffff', 0, 1),
(3, 'hello', 'fffffffffffffffffff', 1, 1),
(4, 'yalla', 'yala yalla', 1, 1),
(5, 'عنوان جديد', '   Ggمحتوى محدث', 1, 1),
(10, 'Irirj', 'Jdudh', 1, 1),
(13, 'Rrrrrr', 'Jlvkvjcj', 1, 1),
(15, 'Basema', 'Khalil', 1, 1),
(16, 'موحبا', 'روونا', 1, 1),
(19, 'Ff', '44', 1, 3),
(20, 'H7h8h', 'G7g7hyvyc', 1, 3),
(21, 'نعنوان المهمة الجدت', 'This it my new gh', 0, 2),
(24, 'سيؤ', 'ريسرءي', 1, 3),
(25, 'سيؤ', 'ريسرءي', 1, 3),
(26, 'م م ورهدعدغذيبلل', 'Hhbbbbnnnmالييرم', 0, 2),
(27, 'dsf', 'fdsgdf', 1, 1),
(28, 'مهمة جديدة', 'مرحبا روان', 1, 2);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` int(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`) VALUES
(1, 'Rwuna', 'rwun@gmail.com', 123456),
(2, 'Rwuna', 'rawan@gmail.com', 123456),
(3, 'Khaled', 'khaled@yahoo.com', 123456);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tasks`
--
ALTER TABLE `tasks`
  ADD PRIMARY KEY (`t_id`),
  ADD KEY `user_task_fk` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tasks`
--
ALTER TABLE `tasks`
  MODIFY `t_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `tasks`
--
ALTER TABLE `tasks`
  ADD CONSTRAINT `user_task_fk` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
