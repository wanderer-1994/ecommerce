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
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-05-11 23:47:16
