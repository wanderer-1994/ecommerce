-- MySQL dump 10.13  Distrib 8.0.23, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: ecommerce
-- ------------------------------------------------------
-- Server version	8.0.23

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `product_eav`
--

DROP TABLE IF EXISTS `product_eav`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_eav` (
  `attribute_id` varchar(50) NOT NULL,
  `label` varchar(50) NOT NULL,
  `referred_target` varchar(255) DEFAULT NULL,
  `admin_only` enum('0','1') DEFAULT '0',
  `html_type` enum('input','multiinput','select','multiselect','password','boolean') NOT NULL,
  `data_type` enum('int','decimal','varchar','text','html','datetime') NOT NULL,
  `validation` varchar(255) DEFAULT NULL,
  `is_super` enum('0','1') DEFAULT '0',
  `is_system` enum('0','1') DEFAULT '0',
  `unit` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`attribute_id`),
  UNIQUE KEY `label` (`label`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_eav`
--

LOCK TABLES `product_eav` WRITE;
/*!40000 ALTER TABLE `product_eav` DISABLE KEYS */;
INSERT INTO `product_eav` VALUES ('color','Color',NULL,'0','input','varchar',NULL,'0','0',NULL),('gallery','Gallery',NULL,'0','multiinput','varchar',NULL,'0','0',NULL),('name','Product name',NULL,'0','input','varchar',NULL,'0','0',NULL),('sup_link','Supplier link',NULL,'1','input','varchar',NULL,'0','0',NULL),('sup_name','Supplier name',NULL,'1','input','varchar',NULL,'0','0',NULL),('sup_price','Supplier price',NULL,'1','input','decimal',NULL,'0','0',NULL),('sup_stock','Supplier stock',NULL,'1','boolean','int',NULL,'0','0',NULL),('sup_warranty','Supplier warranty',NULL,'1','input','varchar',NULL,'0','0',NULL),('supplier_last_updated','Supplier last updated',NULL,'1','input','datetime',NULL,'0','0',NULL),('supplier_update_acknowledge','Supplier update acknowledge',NULL,'1','boolean','int',NULL,'0','0',NULL),('supplier_updated_info','Supplier update info',NULL,'1','input','html',NULL,'0','0',NULL),('thumbnail','Thumbnail',NULL,'0','input','varchar',NULL,'0','0',NULL),('warranty','Warranty',NULL,'0','select','datetime',NULL,'0','0',NULL);
/*!40000 ALTER TABLE `product_eav` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-05-11 23:47:16
