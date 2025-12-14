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

USE `system_dashboard`;

/*Table structure for table `category_permissions` */

DROP TABLE IF EXISTS `category_permissions`;

CREATE TABLE `category_permissions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `employee_code` varchar(255) NOT NULL,
  `category_id` int(11) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL,
  `created_by` varchar(255) NOT NULL DEFAULT 'SYSTEM',
  `updated_by` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;

/*Data for the table `category_permissions` */

insert  into `category_permissions`(`id`,`employee_code`,`category_id`,`created_at`,`updated_at`,`created_by`,`updated_by`) values 
(1,'BET0047',17,'2025-06-27 14:04:51',NULL,'SYSTEM',NULL);

/*Table structure for table `system_categories` */

DROP TABLE IF EXISTS `system_categories`;

CREATE TABLE `system_categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` varchar(255) NOT NULL DEFAULT 'SYSTEM',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4;

/*Data for the table `system_categories` */

insert  into `system_categories`(`id`,`name`,`created_at`,`created_by`,`updated_at`,`updated_by`) values 
(1,'ระบบงานพื้นฐาน','2025-05-30 10:14:38','SYSTEM','2025-06-23 11:09:02','BET0047'),
(17,'ระบบงานด้านสวัสดิการพนักงาน','2025-06-20 07:01:46','admin','2025-06-20 14:07:02','admin'),
(23,'งานเทคโนโลยีทางการศึกษา','2025-06-25 14:17:59','admin','2025-06-25 14:17:59',NULL);

/*Table structure for table `system_permissions` */

DROP TABLE IF EXISTS `system_permissions`;

CREATE TABLE `system_permissions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `employee_code` varchar(255) CHARACTER SET latin1 NOT NULL,
  `system_id` int(11) NOT NULL,
  `isAdmin` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` varchar(255) CHARACTER SET latin1 NOT NULL DEFAULT 'SYSTEM',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4;

/*Data for the table `system_permissions` */

insert  into `system_permissions`(`id`,`employee_code`,`system_id`,`isAdmin`,`created_at`,`created_by`) values 
(1,'BET0047',17,1,'2025-06-16 11:54:40','SYSTEM'),
(4,'BET0047',19,1,'2025-06-27 12:56:43','system');

/*Table structure for table `systems` */

DROP TABLE IF EXISTS `systems`;

CREATE TABLE `systems` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `icon` varchar(255) NOT NULL DEFAULT 'User',
  `description` longtext,
  `category_id` int(11) NOT NULL,
  `owner_department` varchar(255) NOT NULL DEFAULT 'none',
  `url` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` varchar(255) NOT NULL DEFAULT 'SYSTEM',
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4;

/*Data for the table `systems` */

insert  into `systems`(`id`,`name`,`icon`,`description`,`category_id`,`owner_department`,`url`,`created_at`,`created_by`,`updated_at`,`updated_by`) values 
(17,'ระบบบริการงานเทคโน','airplay','ระบบสำหรับบริการงานเทคโนฯ เช่น การขอใช้บริการ Network , การขอใช้บริการงานโสตทัศนูปกร ฯลฯ',23,'งานเทคโนโลยีทางการศึกษา','https://med.tu.ac.th/employee-service-techno','2025-06-25 14:24:13','admin','2025-06-25 14:24:13',NULL),
(19,'ระบบสวัสดิการบุคลากร','banana','ระบบแสดงสวัสดิการ 5000 คณะแพทยศาสตร์ และ สวัสดิการยืดหยุ่น',17,'งานทรัพยากรมนุษย์','https://med.tu.ac.th/employee_welfare_dev_v1','2025-06-25 15:49:04','admin','2025-06-25 15:49:04',NULL);

/*Table structure for table `users` */

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) CHARACTER SET latin1 NOT NULL,
  `password` mediumtext CHARACTER SET latin1,
  `role` enum('superadmin','admin','user') CHARACTER SET latin1 NOT NULL DEFAULT 'superadmin',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` varchar(255) CHARACTER SET latin1 NOT NULL DEFAULT 'SYSTEM',
  `fname` varchar(255) NOT NULL,
  `lname` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UNIQUE` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4;

/*Data for the table `users` */

insert  into `users`(`id`,`username`,`password`,`role`,`created_at`,`created_by`,`fname`,`lname`) values 
(3,'admin','$2b$10$vYT8er6FjTRiIAKNDJqQROCxTt5XTuw7GMFwyKQdc8IweFJ7DTIvu','superadmin','2025-06-12 07:42:12','SYSTEM','Administrator','system');

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
