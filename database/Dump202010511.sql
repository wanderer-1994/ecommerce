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
-- Table structure for table `category_eav`
--

DROP TABLE IF EXISTS `category_eav`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `category_eav` (
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
  PRIMARY KEY (`attribute_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category_eav`
--

LOCK TABLES `category_eav` WRITE;
/*!40000 ALTER TABLE `category_eav` DISABLE KEYS */;
INSERT INTO `category_eav` VALUES ('banner_image','Banner image',NULL,'0','input','varchar',NULL,'0','0',NULL);
/*!40000 ALTER TABLE `category_eav` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `category_eav_datetime`
--

DROP TABLE IF EXISTS `category_eav_datetime`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `category_eav_datetime` (
  `entity_id` varchar(50) NOT NULL,
  `attribute_id` varchar(50) NOT NULL,
  `value` bigint NOT NULL,
  PRIMARY KEY (`entity_id`,`attribute_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category_eav_datetime`
--

LOCK TABLES `category_eav_datetime` WRITE;
/*!40000 ALTER TABLE `category_eav_datetime` DISABLE KEYS */;
/*!40000 ALTER TABLE `category_eav_datetime` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `category_eav_decimal`
--

DROP TABLE IF EXISTS `category_eav_decimal`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `category_eav_decimal` (
  `entity_id` varchar(50) NOT NULL,
  `attribute_id` varchar(50) NOT NULL,
  `value` decimal(20,6) NOT NULL,
  PRIMARY KEY (`entity_id`,`attribute_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category_eav_decimal`
--

LOCK TABLES `category_eav_decimal` WRITE;
/*!40000 ALTER TABLE `category_eav_decimal` DISABLE KEYS */;
/*!40000 ALTER TABLE `category_eav_decimal` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `category_eav_int`
--

DROP TABLE IF EXISTS `category_eav_int`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `category_eav_int` (
  `entity_id` varchar(50) NOT NULL,
  `attribute_id` varchar(50) NOT NULL,
  `value` int NOT NULL,
  PRIMARY KEY (`entity_id`,`attribute_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category_eav_int`
--

LOCK TABLES `category_eav_int` WRITE;
/*!40000 ALTER TABLE `category_eav_int` DISABLE KEYS */;
/*!40000 ALTER TABLE `category_eav_int` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `category_eav_multi_value`
--

DROP TABLE IF EXISTS `category_eav_multi_value`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `category_eav_multi_value` (
  `entity_id` varchar(50) NOT NULL,
  `attribute_id` varchar(50) NOT NULL,
  `value` text NOT NULL,
  `sort_order` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category_eav_multi_value`
--

LOCK TABLES `category_eav_multi_value` WRITE;
/*!40000 ALTER TABLE `category_eav_multi_value` DISABLE KEYS */;
/*!40000 ALTER TABLE `category_eav_multi_value` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `category_eav_option`
--

DROP TABLE IF EXISTS `category_eav_option`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `category_eav_option` (
  `attribute_id` varchar(50) NOT NULL,
  `value` varchar(255) NOT NULL,
  `label` varchar(255) DEFAULT NULL,
  `sort_order` int DEFAULT NULL,
  PRIMARY KEY (`attribute_id`,`value`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category_eav_option`
--

LOCK TABLES `category_eav_option` WRITE;
/*!40000 ALTER TABLE `category_eav_option` DISABLE KEYS */;
/*!40000 ALTER TABLE `category_eav_option` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `category_eav_text`
--

DROP TABLE IF EXISTS `category_eav_text`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `category_eav_text` (
  `entity_id` varchar(50) NOT NULL,
  `attribute_id` varchar(50) NOT NULL,
  `value` text NOT NULL,
  PRIMARY KEY (`entity_id`,`attribute_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category_eav_text`
--

LOCK TABLES `category_eav_text` WRITE;
/*!40000 ALTER TABLE `category_eav_text` DISABLE KEYS */;
/*!40000 ALTER TABLE `category_eav_text` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `category_eav_varchar`
--

DROP TABLE IF EXISTS `category_eav_varchar`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `category_eav_varchar` (
  `entity_id` varchar(50) NOT NULL,
  `attribute_id` varchar(50) NOT NULL,
  `value` varchar(255) NOT NULL,
  PRIMARY KEY (`entity_id`,`attribute_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category_eav_varchar`
--

LOCK TABLES `category_eav_varchar` WRITE;
/*!40000 ALTER TABLE `category_eav_varchar` DISABLE KEYS */;
/*!40000 ALTER TABLE `category_eav_varchar` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `category_entity`
--

DROP TABLE IF EXISTS `category_entity`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `category_entity` (
  `entity_id` varchar(50) NOT NULL,
  `name` varchar(255) NOT NULL,
  `parent` varchar(50) DEFAULT NULL,
  `is_online` enum('0','1') DEFAULT '1',
  `position` int DEFAULT NULL,
  PRIMARY KEY (`entity_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category_entity`
--

LOCK TABLES `category_entity` WRITE;
/*!40000 ALTER TABLE `category_entity` DISABLE KEYS */;
INSERT INTO `category_entity` VALUES ('bluetooth_earbud','Tai nghe bluetooth','sound_accessories','1',1),('bluetooth_headphone','Headphone bluetooth','sound_accessories','1',3),('bluetooth_mouse','Chuột bluetooth','laptop_accessories','1',1),('charger_set','Bộ củ & cáp sạc','chargers','1',4),('chargers','Sạc',NULL,'1',2),('cooling_pad','Tản nhiệt','laptop_accessories','1',5),('keyboard','Bàn phím','laptop_accessories','1',4),('keyboard_set','Combo phím & chuột','laptop_accessories','1',3),('laptop_accessories','Phụ kiện laptop',NULL,'1',3),('mousepad','Lót chuột','laptop_accessories','0',7),('phone_adapter','Củ sạc','chargers','1',3),('phone_cable','Cáp sạc','chargers','1',2),('powerbank','Pin dự phòng','chargers','1',1),('sound_accessories','Âm thanh',NULL,'1',1),('speaker','Loa bluetooth','laptop_accessories','1',6),('wired_earbud','Tai nghe dây','sound_accessories','1',2),('wired_headphone','Headphone','sound_accessories','1',4),('wired_mouse','Chuột dây','laptop_accessories','1',2);
/*!40000 ALTER TABLE `category_entity` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inventory`
--

DROP TABLE IF EXISTS `inventory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inventory` (
  `entity_id` varchar(50) NOT NULL,
  `available_quantity` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inventory`
--

LOCK TABLES `inventory` WRITE;
/*!40000 ALTER TABLE `inventory` DISABLE KEYS */;
/*!40000 ALTER TABLE `inventory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order`
--

DROP TABLE IF EXISTS `order`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order` (
  `entity_id` int NOT NULL AUTO_INCREMENT,
  `order_time` bigint DEFAULT NULL,
  `status` enum('1','2','3','4','5','6') DEFAULT '1',
  `shipping_status` enum('1','2','3','4') DEFAULT '1',
  `rcver_name` varchar(255) NOT NULL,
  `rcver_tel` varchar(15) NOT NULL,
  `address` varchar(255) NOT NULL,
  PRIMARY KEY (`entity_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order`
--

LOCK TABLES `order` WRITE;
/*!40000 ALTER TABLE `order` DISABLE KEYS */;
/*!40000 ALTER TABLE `order` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_item`
--

DROP TABLE IF EXISTS `order_item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_item` (
  `entity_id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `prod_id` varchar(50) NOT NULL,
  `prod_name` varchar(255) NOT NULL,
  `prod_thumb` varchar(255) DEFAULT NULL,
  `price` int NOT NULL,
  `discount_percent` int DEFAULT NULL,
  `discount_direct` int DEFAULT NULL,
  `warranty` int DEFAULT NULL,
  `category` varchar(255) DEFAULT NULL,
  `variant` varchar(255) DEFAULT NULL,
  `quantity` int NOT NULL,
  PRIMARY KEY (`entity_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_item`
--

LOCK TABLES `order_item` WRITE;
/*!40000 ALTER TABLE `order_item` DISABLE KEYS */;
/*!40000 ALTER TABLE `order_item` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_category_assignment`
--

DROP TABLE IF EXISTS `product_category_assignment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_category_assignment` (
  `product_id` varchar(50) NOT NULL,
  `category_id` varchar(50) NOT NULL,
  `position` int DEFAULT '0',
  PRIMARY KEY (`product_id`,`category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_category_assignment`
--

LOCK TABLES `product_category_assignment` WRITE;
/*!40000 ALTER TABLE `product_category_assignment` DISABLE KEYS */;
INSERT INTO `product_category_assignment` VALUES ('PR0001','wired_earbud',0),('PR0004','wired_earbud',0),('PR0008','wired_earbud',0),('PR0012','bluetooth_earbud',0),('PR0013','bluetooth_earbud',0),('PR0016','bluetooth_earbud',0),('PR0019','bluetooth_earbud',0),('PR0022','wired_headphone',0),('PR0025','wired_headphone',0),('PR0026','wired_headphone',0),('PR0029','wired_headphone',0),('PR0030','wired_headphone',0),('PR0031','bluetooth_headphone',0),('PR0034','bluetooth_headphone',0),('PR0037','powerbank',0),('PR0040','powerbank',0),('PR0043','powerbank',0),('PR0046','powerbank',0),('PR0047','powerbank',0),('PR0050','powerbank',0),('PR0053','powerbank',0),('PR0056','powerbank',0),('PR0059','phone_adapter',0),('PR0060','phone_adapter',0),('PR0063','phone_adapter',0),('PR0064','phone_adapter',0),('PR0065','phone_cable',0),('PR0068','phone_cable',0),('PR0069','phone_cable',0),('PR0074','phone_cable',0),('PR0081','phone_cable',0),('PR0088','phone_cable',0),('PR0093','phone_cable',0),('PR0094','charger_set',0),('PR0098','charger_set',0),('PR0102','wired_mouse',0),('PR0105','wired_mouse',0),('PR0108','wired_mouse',0),('PR0109','wired_mouse',0),('PR0112','wired_mouse',0),('PR0113','wired_mouse',0),('PR0114','wired_mouse',0),('PR0115','wired_mouse',0),('PR0116','wired_mouse',0),('PR0117','bluetooth_mouse',0),('PR0118','bluetooth_mouse',0),('PR0121','bluetooth_mouse',0),('PR0126','bluetooth_mouse',0),('PR0131','bluetooth_mouse',0),('PR0132','mousepad',0),('PR0133','mousepad',0),('PR0134','mousepad',0),('PR0135','mousepad',0),('PR0136','mousepad',0),('PR0142','keyboard',0),('PR0143','keyboard',0),('PR0144','keyboard',0),('PR0145','keyboard',0),('PR0146','keyboard',0),('PR0147','keyboard',0),('PR0148','keyboard',0),('PR0149','keyboard',0),('PR0150','keyboard',0),('PR0151','keyboard_set',0),('PR0156','keyboard_set',0),('PR0160','keyboard_set',0),('PR0164','keyboard_set',0),('PR0167','cooling_pad',0),('PR0168','cooling_pad',0),('PR0169','speaker',0),('PR0170','speaker',0),('PR0171','speaker',0),('PR0178','speaker',0),('PR0183','speaker',0);
/*!40000 ALTER TABLE `product_category_assignment` ENABLE KEYS */;
UNLOCK TABLES;

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

--
-- Table structure for table `product_eav_datetime`
--

DROP TABLE IF EXISTS `product_eav_datetime`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_eav_datetime` (
  `entity_id` varchar(50) NOT NULL,
  `attribute_id` varchar(50) NOT NULL,
  `value` bigint NOT NULL,
  PRIMARY KEY (`entity_id`,`attribute_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_eav_datetime`
--

LOCK TABLES `product_eav_datetime` WRITE;
/*!40000 ALTER TABLE `product_eav_datetime` DISABLE KEYS */;
/*!40000 ALTER TABLE `product_eav_datetime` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_eav_decimal`
--

DROP TABLE IF EXISTS `product_eav_decimal`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_eav_decimal` (
  `entity_id` varchar(50) NOT NULL,
  `attribute_id` varchar(50) NOT NULL,
  `value` decimal(20,6) NOT NULL,
  PRIMARY KEY (`entity_id`,`attribute_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_eav_decimal`
--

LOCK TABLES `product_eav_decimal` WRITE;
/*!40000 ALTER TABLE `product_eav_decimal` DISABLE KEYS */;
/*!40000 ALTER TABLE `product_eav_decimal` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_eav_index`
--

DROP TABLE IF EXISTS `product_eav_index`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_eav_index` (
  `product_id` varchar(50) NOT NULL,
  `attribute_id` varchar(50) NOT NULL,
  `value` text NOT NULL,
  PRIMARY KEY (`product_id`,`attribute_id`,`value`(255))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_eav_index`
--

LOCK TABLES `product_eav_index` WRITE;
/*!40000 ALTER TABLE `product_eav_index` DISABLE KEYS */;
/*!40000 ALTER TABLE `product_eav_index` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_eav_int`
--

DROP TABLE IF EXISTS `product_eav_int`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_eav_int` (
  `entity_id` varchar(50) NOT NULL,
  `attribute_id` varchar(50) NOT NULL,
  `value` int NOT NULL,
  PRIMARY KEY (`entity_id`,`attribute_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_eav_int`
--

LOCK TABLES `product_eav_int` WRITE;
/*!40000 ALTER TABLE `product_eav_int` DISABLE KEYS */;
/*!40000 ALTER TABLE `product_eav_int` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_eav_multi_value`
--

DROP TABLE IF EXISTS `product_eav_multi_value`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_eav_multi_value` (
  `entity_id` varchar(50) NOT NULL,
  `attribute_id` varchar(50) NOT NULL,
  `value` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_eav_multi_value`
--

LOCK TABLES `product_eav_multi_value` WRITE;
/*!40000 ALTER TABLE `product_eav_multi_value` DISABLE KEYS */;
/*!40000 ALTER TABLE `product_eav_multi_value` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_eav_option`
--

DROP TABLE IF EXISTS `product_eav_option`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_eav_option` (
  `attribute_id` varchar(50) NOT NULL,
  `value` varchar(255) NOT NULL,
  `label` varchar(255) DEFAULT NULL,
  `sort_order` int DEFAULT NULL,
  PRIMARY KEY (`attribute_id`,`value`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_eav_option`
--

LOCK TABLES `product_eav_option` WRITE;
/*!40000 ALTER TABLE `product_eav_option` DISABLE KEYS */;
INSERT INTO `product_eav_option` VALUES ('warranty','0','Check khi nhận hàng',1),('warranty','2592000000','30 ngày',3),('warranty','5184000000','60 ngày',4),('warranty','604800000','7 ngày',2),('warranty','7776000000','90 ngày',5);
/*!40000 ALTER TABLE `product_eav_option` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_eav_text`
--

DROP TABLE IF EXISTS `product_eav_text`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_eav_text` (
  `entity_id` varchar(50) NOT NULL,
  `attribute_id` varchar(50) NOT NULL,
  `value` text NOT NULL,
  PRIMARY KEY (`entity_id`,`attribute_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_eav_text`
--

LOCK TABLES `product_eav_text` WRITE;
/*!40000 ALTER TABLE `product_eav_text` DISABLE KEYS */;
/*!40000 ALTER TABLE `product_eav_text` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_eav_varchar`
--

DROP TABLE IF EXISTS `product_eav_varchar`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_eav_varchar` (
  `entity_id` varchar(50) NOT NULL,
  `attribute_id` varchar(50) NOT NULL,
  `value` varchar(255) NOT NULL,
  PRIMARY KEY (`entity_id`,`attribute_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_eav_varchar`
--

LOCK TABLES `product_eav_varchar` WRITE;
/*!40000 ALTER TABLE `product_eav_varchar` DISABLE KEYS */;
INSERT INTO `product_eav_varchar` VALUES ('PR0001','name','Tai nghe Nhét tai HOCO M1'),('PR0002','name','Tai nghe Nhét tai HOCO M1 PRO'),('PR0002','sup_link','https://phatdatcomputer.vn/san-pham/tai-nghe-nhet-tai-hoco-m1-pro-chinh-hang-jack-typec'),('PR0003','name','Tai nghe Nhét tai HOCO M1 NPP'),('PR0003','sup_link','https://phatdatcomputer.vn/san-pham/tai-nghe-nhet-tai-hoco-m1-npp-chinh-hang'),('PR0004','name','Tai nghe nhét tai HOCO M74'),('PR0004','sup_link','https://phatdatcomputer.vn/san-pham/tai-nghe-nhet-tai-hoco-m74-nhua-tpe-12m'),('PR0005','color','Trắng'),('PR0006','color','Tím'),('PR0007','color','Đen'),('PR0008','name','Tai nghe Nhét tai BOROFONE BM34'),('PR0008','sup_link','https://phatdatcomputer.vn/san-pham/tai-nghe-nhet-tai-borofone-bm34-blackwhitepink-co-mic'),('PR0009','color','Hồng'),('PR0010','color','Trắng'),('PR0011','color','Đen'),('PR0012','name','Tai nghe Bluetooth TWS AMOI F9'),('PR0012','sup_link','https://phatdatcomputer.vn/san-pham/tai-nghe-bluetooth-tws-amoi-f9-v50-cam-ung-tich-hop-pin-du-phong-gia-do-dien-thoai'),('PR0013','name','Tai nghe Bluetooth HOCO ES13 Plus'),('PR0013','sup_link','https://phatdatcomputer.vn/san-pham/tai-nghe-bluetooth-hoco-es13-plus-chinh-hang-tai-nghe-2-ben-v41'),('PR0014','color','Đỏ'),('PR0015','color','Đen'),('PR0016','name','Tai nghe Bluetooth HOCO ES41'),('PR0016','sup_link','https://phatdatcomputer.vn/san-pham/tai-nghe-bluetooth-hoco-es41-white-chinh-hang-tai-nghe-2-ben-v50'),('PR0017','color','Trắng'),('PR0018','color','Đen'),('PR0019','name','Tai nghe Bluetooth HOCO ES45'),('PR0019','sup_link','https://phatdatcomputer.vn/san-pham/tai-nghe-bluetooth-hoco-es45-chinh-hang-cam-ung-2-ben-v50'),('PR0020','color','Trắng'),('PR0021','color','Đen'),('PR0022','name','Headphone HOCO W103'),('PR0022','sup_link','https://phatdatcomputer.vn/san-pham/headphone-hoco-w103-blackred-gaming-chinh-hang-12m-jack-headset-tich-hop-35mm-co-mic'),('PR0023','color','Đỏ'),('PR0024','color','Đen'),('PR0025','name','Headphone Gaming ESPORT VX3'),('PR0025','sup_link','https://phatdatcomputer.vn/san-pham/headphone-gaming-esport-vx3-led'),('PR0026','name','Headphone Gaming EXAVP EX220'),('PR0026','sup_link','https://phatdatcomputer.vn/san-pham/headphone-exavp-ex220-led-gaming'),('PR0027','color','Trắng xám'),('PR0028','color','Đen'),('PR0029','name','Headphone Gaming EXAVP N61'),('PR0029','sup_link','https://phatdatcomputer.vn/san-pham/headphone-exavp-n61-led-gaming'),('PR0030','name','Headphone Gaming EXAVP N62 Có Rung'),('PR0030','sup_link','https://phatdatcomputer.vn/san-pham/headphone-exavp-n62-led-rung-gaming'),('PR0031','name','Tai nghe Bluetooth Chụp tai BOROFONE BO8'),('PR0031','sup_link','https://phatdatcomputer.vn/san-pham/tai-nghe-bluetooth-chup-tai-borofone-bo8-blackwhite-chinh-hang-the-nho'),('PR0032','color','Trắng'),('PR0033','color','Đen'),('PR0034','name','Headphone Bluetooth Tai Mèo HOCO W27'),('PR0034','sup_link','https://phatdatcomputer.vn/san-pham/headphone-bluetooth-tai-meo-hoco-w27-chinh-hang-co-mic'),('PR0035','color','Hồng'),('PR0036','color','Hồng xám'),('PR0037','name','Pin dự phòng BOROFONE BT21'),('PR0037','sup_link','https://phatdatcomputer.vn/san-pham/pin-du-phong-10000mah-borofone-bt21-white-chinh-hang-co-lcd'),('PR0038','color','Trắng'),('PR0039','color','Đen'),('PR0040','name','Pin dự phòng HOCO J48'),('PR0040','sup_link','https://phatdatcomputer.vn/san-pham/pin-du-phong-10000mah-hoco-j48-chinh-hang-02-cong-usb-2a-polymer-a'),('PR0041','color','Trắng'),('PR0042','color','Đen'),('PR0043','name','Pin dự phòng LANEX LPB-N12'),('PR0043','sup_link','https://phatdatcomputer.vn/san-pham/pin-du-phong-10000mah-lanex-lpbn12-blackgreen-polymer-a-2-cong-usb-21a-man-hinh-led'),('PR0044','color','Xanh'),('PR0045','color','Đen'),('PR0046','name','Pin dự phòng LANEX LPB-P06'),('PR0046','sup_link','https://phatdatcomputer.vn/san-pham/pin-du-phong-10000mah-lanex-lpbp06-black-polymer-a-2-cong-usb-1-cong-typec-30a-pd-qc30-18w'),('PR0047','name','Pin dự phòng BOROFONE BT26A'),('PR0047','sup_link','https://phatdatcomputer.vn/san-pham/pin-du-phong-20000mah-borofone-bt26a-white-chinh-hang'),('PR0048','color','Trắng'),('PR0049','color','Đen'),('PR0050','name','Pin dự phòng LANEX LPB-N18'),('PR0050','sup_link','https://phatdatcomputer.vn/san-pham/pin-du-phong-20000mah-lanex-lpbn18-blackwhite-2-cong-usb-21a-den-led'),('PR0051','color','Trắng'),('PR0052','color','Đen'),('PR0053','name','Pin dự phòng LANEX LPB-N21'),('PR0053','sup_link','https://phatdatcomputer.vn/san-pham/pin-du-phong-30000mah-lanex-lpbn21-blackwhite-chinh-hang-2-cong-usb-21a-led'),('PR0054','color','Trắng'),('PR0055','color','Đen'),('PR0056','name','Pin dự phòng HOCO J60'),('PR0056','sup_link','https://phatdatcomputer.vn/san-pham/pin-du-phong-30000mah-hoco-j60-blackwhite-chinh-hang-4-cong-usb-led'),('PR0057','color','Đen'),('PR0058','color','Trắng'),('PR0059','name','Cóc sạc HOCO UH102'),('PR0059','sup_link','https://phatdatcomputer.vn/san-pham/coc-sac-hoco-uh102-chinh-hang'),('PR0060','name','Cóc sạc HOCO C39'),('PR0060','sup_link','https://phatdatcomputer.vn/san-pham/coc-sac-hoco-c39-24a-2-usb-man-hinh-led'),('PR0061','color','Trắng'),('PR0062','color','Đen'),('PR0063','name','Cóc sạc nhanh HOCO DC03 PRO MAX'),('PR0063','sup_link','https://phatdatcomputer.vn/san-pham/coc-sac-nhanh-hoco-dc03-pro-max-3-cong-usb-34a-man-hinh-led'),('PR0064','name','Cóc sạc nhanh HOCO C80'),('PR0064','sup_link','https://phatdatcomputer.vn/san-pham/coc-sac-nhanh-hoco-c80-1-cong-usb-typec-31a-qc-31-18w'),('PR0065','name','Cáp sạc nhanh HOCO DU10 PRO'),('PR0065','sup_link','https://phatdatcomputer.vn/san-pham/cap-sac-nhanh-hoco-du10-pro-typec-day-du-025m-30a'),('PR0066','color','Xanh'),('PR0067','color','Đen'),('PR0068','name','Cáp sạc ROMOSS Lightning'),('PR0068','sup_link','https://phatdatcomputer.vn/san-pham/cap-sac-romoss-lightning-day-dep-chinh-hang'),('PR0069','name','Cáp sạc nhanh HOCO U55'),('PR0070','color','Đỏ - usb'),('PR0070','sup_link','https://phatdatcomputer.vn/san-pham/cap-sac-nhanh-hoco-u55-microusb-day-du-24a-12m'),('PR0071','color','Đen - usb'),('PR0071','sup_link','https://phatdatcomputer.vn/san-pham/cap-sac-nhanh-hoco-u55-microusb-day-du-24a-12m'),('PR0072','color','Đỏ - typec'),('PR0072','sup_link','https://phatdatcomputer.vn/san-pham/cap-sac-nhanh-hoco-u55-typec-day-du-24a-12m'),('PR0073','color','Đen - typec'),('PR0073','sup_link','https://phatdatcomputer.vn/san-pham/cap-sac-nhanh-hoco-u55-typec-day-du-24a-12m'),('PR0074','name','Cáp sạc nhanh HOCO U70'),('PR0075','color','Đỏ - typec'),('PR0076','color','Đen - typec'),('PR0077','color','Đỏ - usb'),('PR0078','color','Đen - usb'),('PR0079','color','Đỏ - lightning'),('PR0080','color','Đen - lightning'),('PR0081','name','Cáp sạc nhanh HOCO DU10 Max'),('PR0082','color','Xanh'),('PR0082','sup_link','https://phatdatcomputer.vn/san-pham/cap-sac-nhanh-hoco-du10-max-lightning-day-du-30a-2m'),('PR0083','color','Đen'),('PR0083','sup_link','https://phatdatcomputer.vn/san-pham/cap-sac-nhanh-hoco-du10-max-lightning-day-du-30a-2m'),('PR0084','color','Xanh'),('PR0084','sup_link','https://phatdatcomputer.vn/san-pham/cap-sac-nhanh-hoco-du10-max-microusb-day-du-30a-2m'),('PR0085','color','Đen'),('PR0085','sup_link','https://phatdatcomputer.vn/san-pham/cap-sac-nhanh-hoco-du10-max-microusb-day-du-30a-2m'),('PR0086','color','Xanh'),('PR0086','sup_link','https://phatdatcomputer.vn/san-pham/cap-sac-nhanh-hoco-du10-max-typec-day-du-30a-2m'),('PR0087','color','Đen'),('PR0087','sup_link','https://phatdatcomputer.vn/san-pham/cap-sac-nhanh-hoco-du10-max-typec-day-du-30a-2m'),('PR0088','name','Cáp sạc BOROFONE BX32'),('PR0089','color','Đỏ - usb'),('PR0089','sup_link','https://phatdatcomputer.vn/san-pham/cap-sac-borofone-bx32-microusb-nhua-tpe-025m'),('PR0090','color','Đen - usb'),('PR0090','sup_link','https://phatdatcomputer.vn/san-pham/cap-sac-borofone-bx32-microusb-nhua-tpe-025m'),('PR0091','color','Đỏ - usb'),('PR0091','sup_link','https://phatdatcomputer.vn/san-pham/cap-sac-borofone-bx32-typec-nhua-tpe-025m'),('PR0092','color','Đen - usb'),('PR0092','sup_link','https://phatdatcomputer.vn/san-pham/cap-sac-borofone-bx32-typec-nhua-tpe-025m'),('PR0093','name','Cáp sạc nhanh HOCO X56 Type-C to Lightning'),('PR0093','sup_link','https://phatdatcomputer.vn/san-pham/cap-sac-nhanh-hoco-x56-typec-to-lightning-white-30a-nylon-fiber-pd-20w-1m'),('PR0094','name','Bộ sạc nhanh HOCO DC28'),('PR0095','name','Bộ sạc nhanh HOCO DC28 Lightning'),('PR0095','sup_link','https://phatdatcomputer.vn/san-pham/bo-sac-nhanh-hoco-dc28-lightning-2-cong-usb-5a-max-led-1m'),('PR0096','name','Bộ sạc nhanh HOCO DC28 Type-C'),('PR0096','sup_link','https://phatdatcomputer.vn/san-pham/bo-sac-nhanh-hoco-dc28-typec-2-cong-usb-5a-max-led-1m'),('PR0097','name','Bộ sạc nhanh HOCO DC28 MicroUSB'),('PR0097','sup_link','https://phatdatcomputer.vn/san-pham/bo-sac-nhanh-hoco-dc28-microusb-2-cong-usb-5a-max-led-1m'),('PR0098','name','Bộ cóc cáp sạc BOROFONE BA25A'),('PR0099','name','Bộ cóc cáp sạc BOROFONE BA25A MicroUSB'),('PR0099','sup_link','https://phatdatcomputer.vn/san-pham/bo-coc-cap-sac-borofone-ba25a-microusb-2-cong-usb'),('PR0100','name','Bộ cóc cáp sạc BOROFONE BA25A Lightning'),('PR0100','sup_link','https://phatdatcomputer.vn/san-pham/bo-coc-cap-sac-borofone-ba25a-lightning-2-cong-usb'),('PR0101','name','Bộ cóc cáp sạc BOROFONE BA25A Type-C'),('PR0101','sup_link','https://phatdatcomputer.vn/san-pham/bo-coc-cap-sac-borofone-ba25a-typec-2-cong-usb'),('PR0102','name','Mouse BOSSTON M15'),('PR0102','sup_link','https://phatdatcomputer.vn/san-pham/mouse-bosston-m15-led-usb-chinh-hang'),('PR0103','color','Đen'),('PR0104','color','Trắng'),('PR0105','name','Mouse BOSSTON D608'),('PR0105','sup_link','https://phatdatcomputer.vn/san-pham/mouse-bosston-d608-usb-chinh-hang'),('PR0106','color','Trắng'),('PR0107','color','Đen'),('PR0108','name','Mouse BOSSTON R30A'),('PR0108','sup_link','https://phatdatcomputer.vn/san-pham/mouse-bosston-r30a-led-usb-chinh-hang'),('PR0109','name','Mouse BOSSTON GM100'),('PR0109','sup_link','https://phatdatcomputer.vn/san-pham/mouse-bosston-gm100-led-usb-chinh-hang'),('PR0110','color','Trắng'),('PR0111','color','Đen'),('PR0112','name','Mouse iMICE V9 Gaming'),('PR0112','sup_link','https://phatdatcomputer.vn/san-pham/mouse-imice-v9-gaming-chinh-hang-day-du-led'),('PR0113','name','Mouse APEDRA M5 Gaming'),('PR0113','sup_link','https://phatdatcomputer.vn/san-pham/mouse-apedra-m5-gaming-chinh-hang'),('PR0114','name','Mouse APEDRA A7 Gaming'),('PR0114','sup_link','https://phatdatcomputer.vn/san-pham/mouse-apedra-a7-gaming-chinh-hang-day-du-led'),('PR0115','name','Mouse RAINBOW-GEAR R102 Gaming'),('PR0115','sup_link','https://phatdatcomputer.vn/san-pham/mouse-rainbowgear-r102-usb-led-rgb-gaming'),('PR0116','name','Mouse RAINBOW-GEAR R350 Gaming'),('PR0116','sup_link','https://phatdatcomputer.vn/san-pham/mouse-rainbowgear-r350-usb-led-rgb-gaming-cao-cap'),('PR0117','name','Mouse ko dây NEWMEN F266'),('PR0117','sup_link','https://phatdatcomputer.vn/san-pham/mouse-ko-day-newmen-f266-chinh-hang'),('PR0118','name','Mouse ko dây FD-i2'),('PR0118','sup_link','https://phatdatcomputer.vn/san-pham/mouse-ko-day-fdi2-chinh-hang'),('PR0119','color','Vàng'),('PR0120','color','Xanh'),('PR0121','name','Mouse ko dây FD-i882'),('PR0121','sup_link','https://phatdatcomputer.vn/san-pham/mouse-ko-day-fdi882-bluered-chinh-hang'),('PR0122','color','Đỏ'),('PR0123','color','Xanh'),('PR0124','color','Trắng'),('PR0125','color','Đen'),('PR0126','name','Mouse ko dây FD-V8'),('PR0126','sup_link','https://phatdatcomputer.vn/san-pham/mouse-ko-day-fdv8-bluegreengray-chinh-hang'),('PR0127','color','Xanh lục'),('PR0128','color','Xanh dương'),('PR0129','color','Hồng'),('PR0130','color','Xám'),('PR0131','name','Mouse ko dây T-WOLF Q13'),('PR0131','sup_link','https://phatdatcomputer.vn/san-pham/mouse-ko-day-twolf-q13'),('PR0132','name','Pad mouse Razer X3 Chuyên game'),('PR0132','sup_link','https://phatdatcomputer.vn/san-pham/pad-mouse-razer-x3-chuyen-game-kho-lon'),('PR0133','name','Pad Mouse S6 Chuyên game'),('PR0133','sup_link','https://phatdatcomputer.vn/san-pham/pad-mouse-s6-chuyen-game-800x300x3mm'),('PR0134','name','Pad mouse S9 Chuyên game'),('PR0134','sup_link','https://phatdatcomputer.vn/san-pham/pad-mouse-s9-chuyen-game-780x300x5mm'),('PR0135','name','Pad mouse ESTONE Chuyên game'),('PR0135','sup_link','https://phatdatcomputer.vn/san-pham/pad-mouse-estone-chuyen-game-290x250x3mm'),('PR0136','name','Pad mouse iMICE Chuyên game'),('PR0136','sup_link','https://phatdatcomputer.vn/san-pham/pad-mouse-imice-chuyen-game-800x300x3mm'),('PR0137','color','Xanh dương'),('PR0138','color','Vàng'),('PR0139','color','Tím'),('PR0140','color','Đỏ'),('PR0141','color','Xanh lá'),('PR0142','name','Keyboard Bosston MIni 868'),('PR0142','sup_link','https://phatdatcomputer.vn/san-pham/keyboard-bosston-mini-868'),('PR0143','name','Keyboard BOSSTON K830'),('PR0143','sup_link','https://phatdatcomputer.vn/san-pham/keyboard-bosston-k830-usb-chinh-hang'),('PR0144','name','Keyboard NEWMEN E340'),('PR0144','sup_link','https://phatdatcomputer.vn/san-pham/keyboard-newmen-e340-usb-chinh-hang'),('PR0145','name','Keyboard T-WOLF TF-20'),('PR0145','sup_link','https://phatdatcomputer.vn/san-pham/keyboard-twolf-tf20-led-7-mau-usb'),('PR0146','name','Keyboard BOSSTON 808'),('PR0146','sup_link','https://phatdatcomputer.vn/san-pham/keyboard-bosston-808-usb-chinh-hang'),('PR0147','name','Keyboard BOSSTON K380'),('PR0147','sup_link','https://phatdatcomputer.vn/san-pham/keyboard-bosston-k380-led-usb-chinh-hang-gia-co'),('PR0148','name','Keyboard BOSSTON MK912'),('PR0148','sup_link','https://phatdatcomputer.vn/san-pham/keyboard-bosston-mk912-phim-co-9-che-do-led'),('PR0149','name','Keyboard HP GK-320'),('PR0149','sup_link','https://phatdatcomputer.vn/san-pham/keyboard-hp-gk320-den-chinh-hang-usb-phim-co'),('PR0150','name','Keyboard PHILIPS SPK-8614GR'),('PR0150','sup_link','https://phatdatcomputer.vn/san-pham/keyboard-philips-spk8614gr-bac-led-chinh-hang-usb-phim-co-red-swicth'),('PR0151','name','Combo ko dây FD-iK1500'),('PR0151','sup_link','https://phatdatcomputer.vn/san-pham/combo-ko-day-keyboard-mouse-fdik1500-chinh-hang'),('PR0152','color','Đỏ'),('PR0153','color','Xanh'),('PR0154','color','Vàng'),('PR0155','color','Đen'),('PR0156','name','Combo ko dây SIMETECH SM9000 Mini'),('PR0156','sup_link','https://phatdatcomputer.vn/san-pham/combo-ko-day-keyboard-mouse-simetech-sm9000-mini-blackbluepink-nut-tron'),('PR0157','color','Xanh'),('PR0158','color','Hồng'),('PR0159','color','Đen'),('PR0160','name','Combo ko dây PSPY K68'),('PR0160','sup_link','https://phatdatcomputer.vn/san-pham/combo-ko-day-keyboard-mouse-pspy-k68-blackyellow-chinh-hang'),('PR0161','color','Vàng'),('PR0162','color','Xanh dương'),('PR0163','color','Đen'),('PR0164','name','Combo ko dây FD-iK7300'),('PR0164','sup_link','https://phatdatcomputer.vn/san-pham/combo-ko-day-keyboard-mouse-fdik7300-blackwhite-chinh-hang'),('PR0165','color','Đen'),('PR0166','color','Trắng'),('PR0167','name','Đế tản nhiệt Laptop VSP COOLER N27'),('PR0167','sup_link','https://phatdatcomputer.vn/san-pham/de-tan-nhiet-laptop-vsp-cooler-n27-1fan-14156'),('PR0168','name','Đế tản nhiệt Laptop VSP COOLER N22'),('PR0168','sup_link','https://phatdatcomputer.vn/san-pham/de-tan-nhiet-laptop-vsp-cooler-n22-6fan-14156'),('PR0169','name','Loa Bluetooth Kisonli 904'),('PR0169','sup_link','https://phatdatcomputer.vn/san-pham/loa-bluetooth-kisonli-led-904'),('PR0170','name','Loa Bluetooth Kisonli LED 901'),('PR0170','sup_link','https://phatdatcomputer.vn/san-pham/loa-bluetooth-kisonli-led-901'),('PR0171','name','Loa Bluetooth BOROFONE BR1'),('PR0171','sup_link','https://phatdatcomputer.vn/san-pham/loa-bluetooth-borofone-br1-chinh-hang-v50-pin-1200mah-tf-usb'),('PR0172','color','Đỏ'),('PR0173','color','Xanh dương'),('PR0174','color','Trắng'),('PR0175','color','Đen'),('PR0178','name','Loa Bluetooth BOROFONE BR2 Mini'),('PR0178','sup_link','https://phatdatcomputer.vn/san-pham/loa-bluetooth-borofone-br2-mini-blackwhitegreenred-chinh-hang-v50-pin-1200mah-tf-usb'),('PR0179','color','Xanh'),('PR0180','color','Hồng'),('PR0181','color','Trắng'),('PR0182','color','Đen'),('PR0183','name','Loa Bluetooth LANEX W05'),('PR0183','sup_link','https://phatdatcomputer.vn/san-pham/loa-bluetooth-lanex-w05-chinh-hang'),('PR0184','color','Xanh'),('PR0185','color','Đen');
/*!40000 ALTER TABLE `product_eav_varchar` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_entity`
--

DROP TABLE IF EXISTS `product_entity`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_entity` (
  `entity_id` varchar(50) NOT NULL,
  `type_id` enum('simple','master','variant','grouped','bundle') DEFAULT 'simple',
  `parent` varchar(50) DEFAULT NULL,
  `created_at` bigint DEFAULT NULL,
  `updated_at` bigint DEFAULT NULL,
  PRIMARY KEY (`entity_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_entity`
--

LOCK TABLES `product_entity` WRITE;
/*!40000 ALTER TABLE `product_entity` DISABLE KEYS */;
INSERT INTO `product_entity` VALUES ('PR0001','master',NULL,1620741861836,1620742185319),('PR0002','variant','PR0001',1620741992900,1620741992900),('PR0003','variant','PR0001',1620742022135,1620742022135),('PR0004','master',NULL,1620742093785,1620742225645),('PR0005','variant','PR0004',1620742145364,1620742145364),('PR0006','variant','PR0004',1620742155390,1620742155390),('PR0007','variant','PR0004',1620742163444,1620742163444),('PR0008','master',NULL,1620742287751,1620742287751),('PR0009','variant','PR0008',1620742313203,1620742313203),('PR0010','variant','PR0008',1620742324283,1620742324283),('PR0011','variant','PR0008',1620742335435,1620742335435),('PR0012','simple',NULL,1620742385868,1620742385868),('PR0013','master',NULL,1620742494152,1620742494152),('PR0014','variant','PR0013',1620742517273,1620742517273),('PR0015','variant','PR0013',1620742524755,1620742524755),('PR0016','master',NULL,1620742584669,1620742584669),('PR0017','variant','PR0016',1620742608025,1620742608025),('PR0018','variant','PR0016',1620742620243,1620742620243),('PR0019','master',NULL,1620742716705,1620742716705),('PR0020','variant','PR0019',1620742737859,1620742737859),('PR0021','variant','PR0019',1620742745290,1620742745290),('PR0022','master',NULL,1620742802350,1620742802350),('PR0023','variant','PR0022',1620742824789,1620742824789),('PR0024','variant','PR0022',1620742839530,1620742839530),('PR0025','simple',NULL,1620742883702,1620742883702),('PR0026','master',NULL,1620742958627,1620742958627),('PR0027','variant','PR0026',1620742993142,1620742993142),('PR0028','variant','PR0026',1620743004460,1620743004460),('PR0029','simple',NULL,1620743143000,1620743143000),('PR0030','simple',NULL,1620743204992,1620743204992),('PR0031','master',NULL,1620743259015,1620743259015),('PR0032','variant','PR0031',1620743279544,1620743279544),('PR0033','variant','PR0031',1620743289019,1620743289019),('PR0034','master',NULL,1620743339453,1620743339453),('PR0035','variant','PR0034',1620743364532,1620743364532),('PR0036','variant','PR0034',1620743375477,1620743375477),('PR0037','master',NULL,1620743444676,1620743444676),('PR0038','variant','PR0037',1620743465032,1620743465032),('PR0039','variant','PR0037',1620743473480,1620743473480),('PR0040','master',NULL,1620743548653,1620743548653),('PR0041','variant','PR0040',1620743565950,1620743565950),('PR0042','variant','PR0040',1620743579415,1620743579415),('PR0043','master',NULL,1620743624299,1620743624299),('PR0044','variant','PR0043',1620743653637,1620743653637),('PR0045','variant','PR0043',1620743661390,1620743661390),('PR0046','simple',NULL,1620743738247,1620743738247),('PR0047','master',NULL,1620743795818,1620743795818),('PR0048','variant','PR0047',1620743819062,1620743819062),('PR0049','variant','PR0047',1620743826340,1620743826340),('PR0050','master',NULL,1620743879700,1620743879700),('PR0051','variant','PR0050',1620743902956,1620743902956),('PR0052','variant','PR0050',1620743910285,1620743910285),('PR0053','master',NULL,1620743979956,1620743979956),('PR0054','variant','PR0053',1620744001883,1620744001883),('PR0055','variant','PR0053',1620744014036,1620744014036),('PR0056','master',NULL,1620744090745,1620744090745),('PR0057','variant','PR0056',1620744115845,1620744115845),('PR0058','variant','PR0056',1620744124859,1620744124859),('PR0059','simple',NULL,1620744243982,1620744243982),('PR0060','master',NULL,1620744302316,1620744302316),('PR0061','variant','PR0060',1620744324973,1620744324973),('PR0062','variant','PR0060',1620744332189,1620744332189),('PR0063','simple',NULL,1620744391547,1620744391547),('PR0064','simple',NULL,1620744427074,1620744427074),('PR0065','master',NULL,1620744546632,1620744546632),('PR0066','variant','PR0065',1620744565911,1620744565911),('PR0067','variant','PR0065',1620744575897,1620744575897),('PR0068','simple',NULL,1620744620396,1620744620396),('PR0069','master',NULL,1620744690434,1620744915441),('PR0070','variant','PR0069',1620744711049,1620744856125),('PR0071','variant','PR0069',1620744719173,1620744867810),('PR0072','variant','PR0069',1620744784530,1620744883898),('PR0073','variant','PR0069',1620744793333,1620744892104),('PR0074','master',NULL,1620744990544,1620744990544),('PR0075','variant','PR0074',1620745049057,1620745092639),('PR0076','variant','PR0074',1620745080530,1620745080530),('PR0077','variant','PR0074',1620745118501,1620745118501),('PR0078','variant','PR0074',1620745126159,1620745126159),('PR0079','variant','PR0074',1620745148518,1620745148518),('PR0080','variant','PR0074',1620745159239,1620745159239),('PR0081','master',NULL,1620745207637,1620745207637),('PR0082','variant','PR0081',1620745300106,1620745300106),('PR0083','variant','PR0081',1620745322043,1620745322043),('PR0084','variant','PR0081',1620745354552,1620745354552),('PR0085','variant','PR0081',1620745372157,1620745372157),('PR0086','variant','PR0081',1620745396315,1620745396315),('PR0087','variant','PR0081',1620745404989,1620745404989),('PR0088','master',NULL,1620745469244,1620745469244),('PR0089','variant','PR0088',1620745498782,1620745498782),('PR0090','variant','PR0088',1620745509201,1620745509201),('PR0091','variant','PR0088',1620745523361,1620745523361),('PR0092','variant','PR0088',1620745532736,1620745532736),('PR0093','simple',NULL,1620745593743,1620745593743),('PR0094','master',NULL,1620746703986,1620746703986),('PR0095','variant','PR0094',1620746786775,1620746786775),('PR0096','variant','PR0094',1620746809798,1620746809798),('PR0097','variant','PR0094',1620746835341,1620746835341),('PR0098','master',NULL,1620746883307,1620746883307),('PR0099','variant','PR0098',1620746921886,1620746921886),('PR0100','variant','PR0098',1620746948876,1620746948876),('PR0101','variant','PR0098',1620746970576,1620746970576),('PR0102','master',NULL,1620748649715,1620748649715),('PR0103','variant','PR0102',1620748671370,1620748671370),('PR0104','variant','PR0102',1620748680307,1620748680307),('PR0105','master',NULL,1620748720302,1620748720302),('PR0106','variant','PR0105',1620748741470,1620748741470),('PR0107','variant','PR0105',1620748751674,1620748751674),('PR0108','simple',NULL,1620748790220,1620748790220),('PR0109','master',NULL,1620748847477,1620748847477),('PR0110','variant','PR0109',1620748871792,1620748871792),('PR0111','variant','PR0109',1620748883022,1620748883022),('PR0112','simple',NULL,1620748943885,1620748943885),('PR0113','simple',NULL,1620748975321,1620748975321),('PR0114','simple',NULL,1620749017513,1620749017513),('PR0115','simple',NULL,1620749057547,1620749057547),('PR0116','simple',NULL,1620749092435,1620749092435),('PR0117','simple',NULL,1620749156420,1620749156420),('PR0118','master',NULL,1620749194714,1620749194714),('PR0119','variant','PR0118',1620749212852,1620749212852),('PR0120','variant','PR0118',1620749221401,1620749221401),('PR0121','master',NULL,1620749265774,1620749265774),('PR0122','variant','PR0121',1620749300642,1620749300642),('PR0123','variant','PR0121',1620749308200,1620749308200),('PR0124','variant','PR0121',1620749316707,1620749316707),('PR0125','variant','PR0121',1620749323992,1620749323992),('PR0126','master',NULL,1620749373539,1620749373539),('PR0127','variant','PR0126',1620749405129,1620749405129),('PR0128','variant','PR0126',1620749417296,1620749417296),('PR0129','variant','PR0126',1620749427991,1620749427991),('PR0130','variant','PR0126',1620749435636,1620749435636),('PR0131','simple',NULL,1620749474502,1620749474502),('PR0132','simple',NULL,1620749524601,1620749524601),('PR0133','simple',NULL,1620749566175,1620749566175),('PR0134','simple',NULL,1620749597791,1620749597791),('PR0135','simple',NULL,1620749638377,1620749638377),('PR0136','master',NULL,1620749666538,1620749666538),('PR0137','variant','PR0136',1620749716295,1620749716295),('PR0138','variant','PR0136',1620749727777,1620749727777),('PR0139','variant','PR0136',1620749737013,1620749737013),('PR0140','variant','PR0136',1620749745211,1620749745211),('PR0141','variant','PR0136',1620749753476,1620749753476),('PR0142','simple',NULL,1620749841877,1620749841877),('PR0143','simple',NULL,1620749870568,1620749870568),('PR0144','simple',NULL,1620749901601,1620749901601),('PR0145','simple',NULL,1620749933818,1620749933818),('PR0146','simple',NULL,1620749958188,1620749958188),('PR0147','simple',NULL,1620749992264,1620749992264),('PR0148','simple',NULL,1620750014372,1620750014372),('PR0149','simple',NULL,1620750094035,1620750094035),('PR0150','simple',NULL,1620750163670,1620750163670),('PR0151','master',NULL,1620750314533,1620750314533),('PR0152','variant','PR0151',1620750344258,1620750344258),('PR0153','variant','PR0151',1620750351602,1620750351602),('PR0154','variant','PR0151',1620750360398,1620750360398),('PR0155','variant','PR0151',1620750367944,1620750367944),('PR0156','master',NULL,1620750428145,1620750428145),('PR0157','variant','PR0156',1620750452207,1620750452207),('PR0158','variant','PR0156',1620750467970,1620750467970),('PR0159','variant','PR0156',1620750479336,1620750479336),('PR0160','master',NULL,1620750528310,1620750528310),('PR0161','variant','PR0160',1620750566978,1620750566978),('PR0162','variant','PR0160',1620750575412,1620750575412),('PR0163','variant','PR0160',1620750583825,1620750583825),('PR0164','master',NULL,1620750638404,1620750638404),('PR0165','variant','PR0164',1620750664689,1620750664689),('PR0166','variant','PR0164',1620750677376,1620750677376),('PR0167','simple',NULL,1620750724470,1620750724470),('PR0168','simple',NULL,1620750837018,1620750837018),('PR0169','simple',NULL,1620750901168,1620750901168),('PR0170','simple',NULL,1620750966691,1620750966691),('PR0171','master',NULL,1620751064797,1620751064797),('PR0172','variant','PR0171',1620751107822,1620751107822),('PR0173','variant','PR0171',1620751138889,1620751138889),('PR0174','variant','PR0171',1620751151471,1620751151471),('PR0175','variant','PR0171',1620751160256,1620751160256),('PR0178','master',NULL,1620751274480,1620751274480),('PR0179','variant','PR0178',1620751312967,1620751312967),('PR0180','variant','PR0178',1620751325030,1620751325030),('PR0181','variant','PR0178',1620751337966,1620751337966),('PR0182','variant','PR0178',1620751353803,1620751353803),('PR0183','master',NULL,1620751400800,1620751400800),('PR0184','variant','PR0183',1620751432111,1620751432111),('PR0185','variant','PR0183',1620751446756,1620751446756);
/*!40000 ALTER TABLE `product_entity` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_tier_price`
--

DROP TABLE IF EXISTS `product_tier_price`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_tier_price` (
  `entity_id` varchar(50) NOT NULL,
  `price` int NOT NULL,
  PRIMARY KEY (`entity_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_tier_price`
--

LOCK TABLES `product_tier_price` WRITE;
/*!40000 ALTER TABLE `product_tier_price` DISABLE KEYS */;
/*!40000 ALTER TABLE `product_tier_price` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-05-11 23:48:59
