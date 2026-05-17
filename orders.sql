-- MySQL dump 10.13  Distrib 8.0.40, for Linux (x86_64)
--
-- Host: mydb.czc4sy2y2ij2.eu-north-1.rds.amazonaws.com    Database: salespulse
-- ------------------------------------------------------
-- Server version	8.0.39

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ '';

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `date` datetime DEFAULT CURRENT_TIMESTAMP,
  `delivery_type` varchar(90) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `customer_type` enum('WALKIN','CUSTOMER') COLLATE utf8mb4_unicode_ci DEFAULT 'WALKIN',
  `customer_id` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `table_id` int DEFAULT NULL,
  `status` enum('created','completed','cancelled') COLLATE utf8mb4_unicode_ci DEFAULT 'created',
  `token_no` int DEFAULT NULL,
  `payment_status` enum('pending','paid') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `invoice_id` int DEFAULT NULL,
  `tenant_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `tenant_id` (`tenant_id`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (27,'2024-11-28 06:33:45','dinein','CUSTOMER','9989568204',10,'completed',1,'paid',1,14),(28,'2024-12-07 07:13:58','dinein','CUSTOMER','9989568204',9,'completed',1,'paid',2,14),(29,'2024-12-07 07:14:45','dinein','CUSTOMER','9989568204',9,'completed',2,'paid',3,14),(30,'2024-12-07 07:18:33','dinein','CUSTOMER','9989568201',8,'completed',3,'paid',4,14),(31,'2024-12-11 02:44:07','dinein','CUSTOMER','9989568206',10,'completed',1,'paid',5,14),(32,'2024-12-11 02:45:03','dinein','CUSTOMER','9989568207',6,'completed',2,'paid',6,14),(33,'2024-12-11 02:45:53','dinein','CUSTOMER','93818 73146',10,'completed',3,'paid',7,14),(34,'2024-12-11 02:48:45','dinein','CUSTOMER','9989568207',11,'completed',4,'paid',8,14),(35,'2024-12-11 02:49:49','dinein','CUSTOMER','9989568206',10,'completed',5,'paid',9,14),(36,'2024-12-11 02:50:53','dinein','CUSTOMER','9989568201',12,'completed',6,'paid',10,14),(37,'2024-12-23 06:46:04','dinein','CUSTOMER','93818 73146',11,'completed',1,'paid',11,14),(38,'2025-01-05 16:25:17','dinein','CUSTOMER','93818 73146',10,'completed',1,'paid',12,14);
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-01-13 10:36:43
