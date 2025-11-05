/*
SQLyog Community v13.1.9 (64 bit)
MySQL - 5.7.44 : Database - system_dashboard
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`system_dashboard` /*!40100 DEFAULT CHARACTER SET utf8mb4 */;

USE `system_dashboard`;

/*Table structure for table `system_categories` */

DROP TABLE IF EXISTS `system_categories`;

CREATE TABLE `system_categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` varchar(255) NOT NULL DEFAULT 'SYSTEM',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4;

/*Data for the table `system_categories` */

insert  into `system_categories`(`id`,`name`,`created_at`,`created_by`) values 
(1,'ระบบงานพื้นฐาน','2025-05-30 10:14:38','SYSTEM'),
(2,'ระบบงาน','2025-05-30 10:15:24','SYSTEM'),
(3,'อื่นๆ','2025-05-30 10:15:36','SYSTEM');

/*Table structure for table `system_permission` */

DROP TABLE IF EXISTS `system_permission`;

CREATE TABLE `system_permission` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `employee_code` varchar(255) CHARACTER SET latin1 NOT NULL,
  `system_id` int(11) NOT NULL,
  `system_name` varchar(255) CHARACTER SET latin1 NOT NULL,
  `system_path` varchar(255) CHARACTER SET latin1 NOT NULL,
  `isAdmin` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` varchar(255) CHARACTER SET latin1 NOT NULL DEFAULT 'SYSTEM',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/*Data for the table `system_permission` */

/*Table structure for table `systems` */

DROP TABLE IF EXISTS `systems`;

CREATE TABLE `systems` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET latin1 NOT NULL,
  `icon` varchar(255) CHARACTER SET latin1 NOT NULL DEFAULT 'User',
  `description` mediumtext CHARACTER SET latin1,
  `category_id` int(11) NOT NULL,
  `owner_department` varchar(255) NOT NULL DEFAULT 'none',
  `url` varchar(255) CHARACTER SET latin1 DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` varchar(255) CHARACTER SET latin1 NOT NULL DEFAULT 'SYSTEM',
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/*Data for the table `systems` */

/*Table structure for table `users` */

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) CHARACTER SET latin1 NOT NULL,
  `password` mediumtext CHARACTER SET latin1,
  `role` enum('superadmin','admin','user') CHARACTER SET latin1 NOT NULL DEFAULT 'superadmin',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` varchar(255) CHARACTER SET latin1 NOT NULL DEFAULT 'SYSTEM',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;

/*Data for the table `users` */

insert  into `users`(`id`,`username`,`password`,`role`,`created_at`,`created_by`) values 
(1,'admin','$2b$10$7N76HCYikxvHwumWkcYW4OpNAz98MVIGN/mHJJUHw1eIbKTHGCh2q','superadmin','2025-05-30 03:50:58','SYSTEM');

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
