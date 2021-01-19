-- MySQL dump 10.13  Distrib 8.0.15, for Win64 (x86_64)
--
-- Host: localhost    Database: phukiendhqg_reset
-- ------------------------------------------------------
-- Server version	8.0.15

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
 SET NAMES utf8 ;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `admin`
--

DROP TABLE IF EXISTS `admin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `admin` (
  `admin_id` tinyint(3) NOT NULL AUTO_INCREMENT,
  `admin_tel` varchar(11) DEFAULT NULL,
  `admin_name` varchar(100) DEFAULT NULL,
  `admin_pas` varchar(45) DEFAULT NULL,
  `admin_cookie` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`admin_id`),
  UNIQUE KEY `admin_tel_UNIQUE` (`admin_tel`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `category`
--

DROP TABLE IF EXISTS `category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `category` (
  `category_id` tinyint(3) NOT NULL AUTO_INCREMENT,
  `category_path` varchar(100) DEFAULT NULL,
  `category_name` varchar(100) DEFAULT NULL,
  `priority` tinyint(2) DEFAULT NULL,
  PRIMARY KEY (`category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `order`
--

DROP TABLE IF EXISTS `order`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `order` (
  `record_id` int(11) NOT NULL AUTO_INCREMENT,
  `timestamp_id` float DEFAULT NULL,
  `user_tel` varchar(11) DEFAULT NULL,
  `user_name` varchar(100) DEFAULT NULL,
  `user_address` varchar(300) DEFAULT NULL,
  `user_location` varchar(300) DEFAULT NULL,
  `prod_id` int(5) DEFAULT NULL,
  `sup_code` varchar(45) DEFAULT NULL,
  `prod_link` varchar(300) DEFAULT NULL,
  `sup_name` varchar(200) DEFAULT NULL,
  `prod_name` varchar(200) DEFAULT NULL,
  `prod_thumb` varchar(300) DEFAULT NULL,
  `prod_img` varchar(300) DEFAULT NULL,
  `category` varchar(100) DEFAULT NULL,
  `sup_warranty` varchar(45) DEFAULT NULL,
  `warranty` varchar(45) DEFAULT NULL,
  `sup_price` float DEFAULT NULL,
  `prod_price` float DEFAULT NULL,
  `saleoff_percent` float DEFAULT NULL,
  `order_qty` float DEFAULT NULL,
  `note` longtext,
  `ship_qty` float DEFAULT NULL,
  `status` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`record_id`),
  UNIQUE KEY `timestamp_id_UNIQUE` (`timestamp_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `product`
--

DROP TABLE IF EXISTS `product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `product` (
  `prod_id` int(5) NOT NULL AUTO_INCREMENT,
  `sup_code` varchar(45) DEFAULT NULL,
  `prod_link` varchar(300) NOT NULL,
  `sup_name` varchar(200) DEFAULT NULL,
  `prod_name` varchar(200) DEFAULT NULL,
  `prod_thumb` varchar(300) DEFAULT NULL,
  `prod_img` varchar(300) DEFAULT NULL,
  `category` varchar(100) DEFAULT NULL,
  `sup_warranty` varchar(45) DEFAULT NULL,
  `warranty` varchar(45) DEFAULT NULL,
  `sup_price` float DEFAULT NULL,
  `prod_price` float DEFAULT NULL,
  `saleoff_percent` float DEFAULT NULL,
  `prod_stock` float DEFAULT NULL,
  `last_updated` float DEFAULT NULL,
  `updated_info` longtext,
  `prod_trend` float DEFAULT NULL,
  PRIMARY KEY (`prod_id`),
  UNIQUE KEY `prod_link_UNIQUE` (`prod_link`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `user` (
  `user_id` int(5) NOT NULL,
  `user_tel` varchar(11) DEFAULT NULL,
  `user_name` varchar(100) DEFAULT NULL,
  `user_address` varchar(300) DEFAULT NULL,
  `user_location` varchar(300) DEFAULT NULL,
  `completed_order` float DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `user_tel_UNIQUE` (`user_tel`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-02-03  7:18:25
