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
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-05-11 23:47:15
