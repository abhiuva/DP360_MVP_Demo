-- MySQL dump 10.13  Distrib 8.0.42, for macos15 (x86_64)
--
-- Host: 20.193.128.146    Database: salespulse
-- ------------------------------------------------------
-- Server version	8.0.42-0ubuntu0.24.04.1

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
-- Table structure for table `categories`
--

/* Updated Employee table to make Employeeemail and Employeephone into UNIQUE KEY*/

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tenant_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `tenant_id` (`tenant_id`),
  CONSTRAINT `categories_ibfk_1` FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (4,'Soups',14),(5,'Drinks',14),(6,'BIryanis',14),(7,'Deserts',14),(8,'Italian',14),(9,'soft drinks',14),(10,'Chinese',14),(11,'yteeststst',14),(13,'Breakfast',18),(14,'Sandwiches',18),(15,'Salads',18),(16,'Soups',18),(17,'Appetizers',18);
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customer_feedbacks`
--

DROP TABLE IF EXISTS `customer_feedbacks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customer_feedbacks` (
  `id` int NOT NULL AUTO_INCREMENT,
  `review` varchar(1024) NOT NULL,
  `customer_name` varchar(100) NOT NULL,
  `rating` int NOT NULL,
  `tenant_id` int NOT NULL,
  `review_result` varchar(10) DEFAULT NULL,
  `service` int DEFAULT '0',
  `food` int DEFAULT '0',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customer_feedbacks`
--

LOCK TABLES `customer_feedbacks` WRITE;
/*!40000 ALTER TABLE `customer_feedbacks` DISABLE KEYS */;
INSERT INTO `customer_feedbacks` VALUES (5,'nice!!!!!!!!!!!!!!!!!111','Palani',4,14,'POSITIVE',0,0,'2025-03-26 09:58:14'),(6,'ok ok','kishore',3,14,'NEUTRAL',0,0,'2025-03-26 09:58:14'),(7,'not good','kumar',2,14,'NEGATIVE',0,0,'2025-03-26 09:58:14'),(8,'excellent','suresh',5,14,'POSITIVE',0,0,'2025-03-26 09:58:14'),(9,'Amazing Food','Grace',5,14,'POSITIVE',0,0,'2025-03-26 09:58:14'),(10,'excellent ','kumar',5,14,'POSITIVE',0,0,'2025-03-26 09:58:14'),(11,'Very cool Project ','Usha',5,14,'POSITIVE',0,0,'2025-03-26 09:58:14'),(12,'excellent','sai',4,14,'POSITIVE',0,0,'2025-03-26 09:58:14'),(13,'good','sai',5,14,'POSITIVE',0,0,'2025-03-26 09:58:14'),(14,'ok','hi',1,14,'NEGATIVE',0,0,'2025-03-26 09:58:14'),(15,'okok','sai',5,14,'POSITIVE',0,0,'2025-03-26 09:58:14'),(16,'ok','nani',3,14,'NEUTRAL',0,0,'2025-03-26 09:58:14'),(17,'Good food','Grace',4,14,'POSITIVE',0,0,'2025-03-26 09:58:14'),(18,'The food is outstandingly good, freshly prepared, well-presented and packed with flavour.','varsha',4,14,'POSITIVE',0,0,'2025-03-26 09:58:14'),(19,'','Palani Kumar',3,14,'NEUTRAL',4,4,'2025-03-26 11:47:09'),(20,'','Palani Kumar',3,14,'NEUTRAL',4,4,'2025-03-26 11:47:20'),(21,'','xyz',4,14,'POSITIVE',3,3,'2025-03-26 11:53:00'),(22,'','Sai',5,14,'POSITIVE',5,4,'2025-03-26 13:23:03'),(23,'','swetha',5,14,'POSITIVE',5,5,'2025-04-04 13:25:34'),(24,'','Radha',4,14,'POSITIVE',5,4,'2025-04-10 10:21:11');
/*!40000 ALTER TABLE `customer_feedbacks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customers`
--

DROP TABLE IF EXISTS `customers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customers` (
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `birth_date` date DEFAULT NULL,
  `gender` enum('male','female','other') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_member` tinyint(1) DEFAULT '0',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `update_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `tenant_id` int NOT NULL,
  `id` int NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`,`tenant_id`),
  KEY `customers_ibfk_1` (`tenant_id`),
  CONSTRAINT `customers_ibfk_1` FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customers`
--

LOCK TABLES `customers` WRITE;
/*!40000 ALTER TABLE `customers` DISABLE KEYS */;
INSERT INTO `customers` VALUES ('+19873234553','food','salespulse@sales.com','2025-02-22','male',NULL,'2025-01-16 13:12:03','2025-01-16 13:12:03',14,1),('00000','sai','sai123@gmail.com',NULL,NULL,NULL,'2025-01-20 17:48:37','2025-01-20 17:48:37',14,2),('017829647','Sree',NULL,NULL,NULL,NULL,'2025-01-22 17:28:07','2025-01-22 17:28:07',14,3),('12456','Daniel',NULL,NULL,NULL,NULL,'2025-01-20 13:48:22','2025-01-20 13:48:22',14,4),('45364532543','test','adsfasfasdfsd@dsfg.com','2025-03-06','male',NULL,'2025-03-11 07:26:56','2025-03-11 07:26:56',14,5),('87654321','Arjun',NULL,NULL,NULL,NULL,'2025-01-21 13:35:59','2025-01-21 13:35:59',14,6),('8919531591','Ranjith','nani@gmail.com','2002-03-31','male',NULL,'2025-03-14 06:12:03','2025-03-14 06:12:03',14,7),('8965423212','customer',NULL,NULL,NULL,NULL,'2025-01-20 16:18:18','2025-01-20 16:18:18',14,8),('93818 73146','Sagar',NULL,NULL,'male',NULL,'2024-12-11 02:39:13','2024-12-11 02:39:13',14,9),('9989568201','Venkatrao',NULL,NULL,'male',NULL,'2024-12-11 02:38:54','2024-12-11 02:38:54',14,10),('9989568204','Srinu',NULL,NULL,'male',NULL,'2024-12-11 02:39:29','2024-12-11 02:39:29',14,11),('9989568206','Swathi',NULL,NULL,'female',NULL,'2024-12-11 02:40:14','2024-12-11 02:40:14',14,12),('9989568207','Sumathi',NULL,NULL,'female',NULL,'2024-12-11 02:39:50','2024-12-11 02:39:50',14,13),('12345678','Rahul Verma','RAHUL@GMAIL.COM','2025-03-24','male',NULL,'2025-03-24 12:09:54','2025-03-24 12:09:54',14,14),('0909876657','SRIKAR ','srikar@gmail.com','1988-06-21','male',NULL,'2025-03-24 12:12:26','2025-03-24 12:12:26',14,15),('9876543245','Varsha','Varshasri@gmail.com','2001-11-15','female',NULL,'2025-03-24 14:01:12','2025-03-24 14:01:12',14,16),('987654321','kiransai','saikiran123@gmail.com','1999-05-01','male',NULL,'2025-03-29 14:05:35','2025-03-29 14:05:35',14,17),('345325353543543','dsf','teewrea@rest.com','2011-05-22','male',NULL,'2025-04-01 09:29:15','2025-04-01 09:29:15',14,18),('7702554552','Rebecca','Rebecca.paul@yahoo.com','1993-03-20','female',NULL,'2025-04-02 18:17:10','2025-04-02 18:17:10',14,19),('8172637164132374','shiva','shiva1234@yahoo.com','1997-06-04','male',NULL,'2025-04-04 14:21:29','2025-04-04 14:21:29',14,20),('6752345121','haritha','haritha123@gmail.com','1998-09-11','female',NULL,'2025-04-04 14:24:52','2025-04-04 14:24:52',14,21),(NULL,'test-1',NULL,NULL,NULL,NULL,'2025-04-06 17:20:26','2025-04-06 17:20:26',14,22),(NULL,'test','test@gmail.com',NULL,NULL,NULL,'2025-04-08 07:57:19','2025-04-08 07:57:19',14,23),(NULL,'radha',NULL,'1998-06-10','female',NULL,'2025-04-10 10:04:16','2025-04-10 10:04:16',14,24);
/*!40000 ALTER TABLE `customers` ENABLE KEYS */;
UNLOCK TABLES;



ALTER TABLE customers
ADD COLUMN password VARCHAR(255) DEFAULT NULL AFTER email;
--
-- Table structure for table `employee`
--

DROP TABLE IF EXISTS `employee`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employee` (
  `employeeName` varchar(255) DEFAULT NULL,
  `employeeDepartment` varchar(45) DEFAULT NULL,
  `employeeDesignation` varchar(45) DEFAULT NULL,
  `employeeShift` varchar(45) DEFAULT NULL,
  `employeeJoiningDate` date DEFAULT NULL,
  `employeeLeavingDate` date DEFAULT NULL,
  `employeeEmail` varchar(45) NOT NULL,
  `employeePhone` varchar(45) NOT NULL,
  `employeePresentAddress` varchar(45) DEFAULT NULL,
  `employeePermanentAddress` varchar(45) DEFAULT NULL,
  `employeeEmergencyContact` varchar(45) DEFAULT NULL,
  `employeeNIDNumber` varchar(45) DEFAULT NULL,
  `employeeGender` varchar(45) DEFAULT NULL,
  `employeeReligion` varchar(45) DEFAULT NULL,
  `employeeMartialStatus` varchar(45) DEFAULT NULL,
  `employeeDOB` date DEFAULT NULL,
  `employeeSalaryType` varchar(45) DEFAULT NULL,
  `employeeSalary` varchar(45) DEFAULT NULL,
  `employeeStatus` varchar(45) DEFAULT NULL,
  `employeeAccountHolderName` varchar(45) DEFAULT NULL,
  `employeeAccountNumber` varchar(45) DEFAULT NULL,
  `employeeBankName` varchar(45) DEFAULT NULL,
  `employeeBankIdentifierCode` varchar(45) DEFAULT NULL,
  `employeeBranchLocation` varchar(45) DEFAULT NULL,
  `employeeTaxPayerId` varchar(45) DEFAULT NULL,
  `employeeId` int NOT NULL AUTO_INCREMENT,
  `updated_at` datetime DEFAULT NULL,
  `employeeProfilePicture` varchar(2000) DEFAULT NULL,
  PRIMARY KEY (`employeeId`),
  UNIQUE (`employeePhone` ),
  UNIQUE (`employeeEmail` )
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employee`
--

LOCK TABLES `employee` WRITE;
/*!40000 ALTER TABLE `employee` DISABLE KEYS */;
INSERT INTO `employee` VALUES ('Ramu','bnd','general_manager','evening','2025-02-11',NULL,'ramu@gmail.com','7878787890','ramu','ramu','7878787890','1234','male','Hindhu','single','2025-02-21','Month','2000','Inactive',NULL,NULL,NULL,NULL,NULL,NULL,2,'2025-04-08 08:17:55','profile/2_1740419953739.ebp'),('Jann','bnd','general_manager','evening','2025-02-11',NULL,'jann@gmail.com','7878787898','jann','jannn','7878787898','1234','male','Hindhu','single','2025-02-21','Month','2000','Active',NULL,NULL,NULL,NULL,NULL,NULL,3,'2025-02-24 18:35:27','profile/3_1740632292037.jpg'),('Satya','bnd','general_manager','evening','2025-02-11',NULL,'abhi@gmail.com','7878787896','satya','satya','7878787896','1244','male','Hindhu','single','2025-02-21','Month','20000','Active',NULL,NULL,NULL,NULL,NULL,NULL,5,'2025-02-27 14:51:17','profile/5_1740648076587.peg'),('Abhi','bnd','general_manager','evening','2025-02-11',NULL,'satya@gmail.com','7878787895','satya','satya','7878787895','1234','male','Hindhu','single','2025-02-21','Month','20000','Active',NULL,NULL,NULL,NULL,NULL,NULL,6,'2025-02-27 14:49:07','profile/6_1740647946822.jpg'),('Raghu','bnd','general_manager','evening','2025-02-11',NULL,'raghi@gmail.com','7878787894','satya','satya','7878787894','123','male','Hindhu','single','2025-02-21','Month','20000','Active',NULL,NULL,NULL,NULL,NULL,NULL,7,'2025-02-27 14:49:51','profile/7_1740647990592.peg'),('Vikram','bnd','general_manager','evening','2025-02-11',NULL,'vikram@gmail.com','7878787893','satya','satya','7878787893','1343','male','Hindhu','single','2025-02-21','Month','20000','Active',NULL,NULL,NULL,NULL,NULL,NULL,8,'2025-02-23 22:54:57',NULL),('Shiva','bnd','general_manager','evening','2025-02-11',NULL,'shiva@gmail.com','7878787892','satya','satya','7878787892','134','female','Hindhu','single','2025-02-21','Month','20000','Active',NULL,NULL,NULL,NULL,NULL,NULL,9,'2025-02-19 12:21:19',NULL),('Ranjith','management','general_manager','morning','2025-02-20',NULL,'ranjith720@gmail.com','+918919531591','Ranjith','Ranjith','+91123456789','12345','morning','hindhu','morning','2025-02-28','Monthly','10000','Inactive','','','','','','',12,'2025-02-19 12:21:19',NULL),('Srinu','kitchen','chef','evening','2025-02-20',NULL,'srinu720@gmail.com','+918919531590','Srinu','Srinu','+91123456789','12345','morning','Hindhu','morning','2025-02-28','Monthly','10000','Inactive','','','','','','',13,'2025-02-19 12:21:19',NULL),('Rohith','kitchen','general_manager','evening','2025-02-11',NULL,'rohith#gmail.com','7878787878','17','17','8787878787','1234','morning','Hindhu','morning','2025-02-21','Montly','19000','Inactive','','','','','','',14,'2025-02-19 12:21:19',NULL),('Hero','front_of_house','marketing_manager','morning','2025-02-20',NULL,'hero@gmail.com','6789678900','hero-01','hero-01','9876987600','12345','morning','Hindhu','morning','2025-02-20','Monthly','1000','Inactive','Hero ','1234','SBI','SBIn000','MNCL','!@#$',15,'2025-02-19 19:40:43',NULL),('Pranay','management','general_manager','morning','2025-02-21',NULL,'pranay@gmail.com','9876556789','pranay','pranay','5678998765','1234','Male','Hindhu','Single','2025-02-21','Month','10000','Inactive','','','','','','',16,'2025-02-20 17:56:34',NULL),('Vamshi','front_of_house','marketing_manager','morning','2025-02-11',NULL,'vamshi@gmail.com','1234567890','vamshi','vamshi','1234567890','12345','male','Hindhu','single','2025-02-20','Yearly','120000','Active','','','','','','',17,'2025-02-21 19:19:47',NULL);
/*!40000 ALTER TABLE `employee` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `employee_attendance`
--

DROP TABLE IF EXISTS `employee_attendance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employee_attendance` (
  `id` int NOT NULL AUTO_INCREMENT,
  `employeeId` int NOT NULL,
  `attendanceDate` date NOT NULL,
  `checkInTime` datetime DEFAULT NULL,
  `checkOutTime` datetime DEFAULT NULL,
  `workHours` decimal(5,2) DEFAULT NULL,
  `status` enum('Present','Absent','Leave','Half-day') NOT NULL,
  `updated_by` varchar(45) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `employeeId` (`employeeId`),
  CONSTRAINT `employee_attendance_ibfk_1` FOREIGN KEY (`employeeId`) REFERENCES `employee` (`employeeId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employee_attendance`
--

LOCK TABLES `employee_attendance` WRITE;
/*!40000 ALTER TABLE `employee_attendance` DISABLE KEYS */;
INSERT INTO `employee_attendance` VALUES (1,17,'2025-02-28','2025-02-28 11:00:00','2025-02-28 17:00:00',6.00,'Present','@admin','2025-02-27 17:00:00'),(2,16,'2025-02-28','2025-02-28 10:00:00','2025-02-28 18:00:00',8.00,'Present','@admin','2025-02-28 09:00:00');
/*!40000 ALTER TABLE `employee_attendance` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `employee_feedback`
--

DROP TABLE IF EXISTS `employee_feedback`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employee_feedback` (
  `id` int NOT NULL AUTO_INCREMENT,
  `employee_name` varchar(45) NOT NULL,
  `review` varchar(1024) NOT NULL,
  `rating` int NOT NULL,
  `review_result` varchar(45) DEFAULT NULL,
  `service` int NOT NULL,
  `punchuality` int NOT NULL,
  `customer_feedback_on_staff` int NOT NULL,
  `manager_behaviour_feedback_on_employee` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employee_feedback`
--

LOCK TABLES `employee_feedback` WRITE;
/*!40000 ALTER TABLE `employee_feedback` DISABLE KEYS */;
INSERT INTO `employee_feedback` VALUES (1,'ranjith','OK',5,'POSITIVE',2,3,3,4),(2,'Ramu','ok',2,'NEGATIVE',3,3,3,2),(3,'Hero','bad',1,'NEGATIVE',1,1,1,1),(4,'Jann','hgdf',3,'NEUTRAL',5,2,3,3),(5,'Ranjith','Good',4,'POSITIVE',4,5,5,4),(6,'Raghu','test',2,'NEGATIVE',2,3,5,2),(7,'Raghu','Excellent',5,'POSITIVE',5,3,5,5),(8,'Jann','Outstanding',4,'POSITIVE',4,4,3,4),(9,'Satya','good',4,'POSITIVE',4,5,4,4);
/*!40000 ALTER TABLE `employee_feedback` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `exchange_rates`
--

DROP TABLE IF EXISTS `exchange_rates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `exchange_rates` (
  `currency_code` varchar(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `rate_to_usd` decimal(10,6) DEFAULT NULL,
  PRIMARY KEY (`currency_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `exchange_rates`
--

LOCK TABLES `exchange_rates` WRITE;
/*!40000 ALTER TABLE `exchange_rates` DISABLE KEYS */;
INSERT INTO `exchange_rates` VALUES ('AED',0.272294),('AFN',0.011605),('ALL',0.009282),('AMD',0.002597),('ANG',0.558778),('AOA',0.001781),('ARS',0.005990),('AUD',0.642500),('BBD',0.499491),('BDT',0.009529),('BGN',0.546679),('BHD',2.659832),('BIF',0.000534),('BMD',1.000000),('BND',0.728092),('BOB',0.144319),('BRL',0.199698),('BSD',1.000000),('BTN',0.012350),('BWP',0.074960),('BYN',0.382052),('BZD',0.499491),('CAD',0.751200),('CDF',0.000478),('CHF',1.130100),('CLP',0.001261),('CNY',0.138800),('COP',0.000254),('CRC',0.001787),('CUP',0.039418),('CVE',0.009850),('CZK',0.044845),('DJF',0.005663),('DKK',0.151189),('DOP',0.017578),('DZD',0.007337),('EGP',0.032837),('ERN',0.066673),('ETB',0.018990),('EUR',1.083500),('FJD',0.455470),('FKP',1.213880),('GBP',1.271600),('GEL',0.378442),('GHS',0.084208),('GMD',0.019555),('GNF',0.000092),('GTQ',0.128165),('GYD',0.004752),('HNL',0.040623),('HRK',0.144318),('HTG',0.009611),('HUF',0.002940),('IDR',0.000065),('ILS',0.277613),('INR',0.012200),('IQD',0.000685),('IRR',0.000023),('ISK',0.007390),('JMD',0.006605),('JPY',0.006745),('KES',0.006915),('KGS',0.011845),('KHR',0.000025),('KID',0.642500),('KMF',0.002263),('KRW',0.000752),('KWD',3.290740),('KYD',1.202783),('KZT',0.002167),('LAK',0.000053),('LBP',0.000660),('LKR',0.003028),('LRD',0.053222),('LSL',0.051787),('LYD',0.217060),('MAD',0.097896),('MDL',0.055085),('MGA',0.000209),('MKD',0.020469),('MMK',0.000473),('MNT',0.000268),('MOP',0.124596),('MRO',0.002820),('MUR',0.022677),('MVR',0.064782),('MWK',0.001282),('MXN',0.055600),('MYR',0.215823),('MZN',0.015904),('NAD',0.051787),('NGN',0.002164),('NIO',0.027879),('NOK',0.093181),('NPR',0.009551),('NZD',0.601468),('OMR',2.600228),('PAB',1.000000),('PEN',0.269066),('PGK',0.284833),('PHP',0.018072),('PKR',0.003489),('PLN',0.260738),('PYG',0.000141),('QAR',0.274604),('RON',0.222891),('RSD',0.009238),('RUB',0.010352),('RWF',0.000912),('SAR',0.266697),('SBD',0.124509),('SCR',0.061233),('SDG',0.002093),('SEK',0.091820),('SGD',0.728092),('SHP',1.213880),('SLL',0.000052),('SOS',0.001761),('SRD',0.050451),('SSP',0.005547),('STN',0.046463),('SYP',0.001880),('SZL',0.051787),('THB',0.028871),('TJS',0.088342),('TMT',0.285969),('TND',0.330593),('TOP',0.437072),('TRY',0.037168),('TTD',0.148161),('TWD',0.031336),('TZS',0.000409),('UAH',0.027422),('UGX',0.000264),('USD',1.000000),('UYU',0.026892),('UZS',0.000094),('VES',0.034453),('VND',0.000042),('VUV',0.008731),('WST',0.384982),('XAF',0.001648),('XAG',22.120000),('XAU',1955.410000),('XCD',0.370129),('XDR',1.411709),('XOF',0.001648),('XPF',0.009390),('YER',0.003947),('ZAR',0.051787),('ZMW',0.037858),('ZWL',0.011788);
/*!40000 ALTER TABLE `exchange_rates` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `groceries`
--

DROP TABLE IF EXISTS `groceries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `groceries` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `price` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `groceries`
--

LOCK TABLES `groceries` WRITE;
/*!40000 ALTER TABLE `groceries` DISABLE KEYS */;
INSERT INTO `groceries` VALUES (1,'rice','1000');
/*!40000 ALTER TABLE `groceries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inventory_items`
--

DROP TABLE IF EXISTS `inventory_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inventory_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(100) NOT NULL,
  `supplier_name` varchar(100) DEFAULT NULL,
  `category` int NOT NULL,
  `quantity` int NOT NULL DEFAULT '0',
  `last_ordered_date` date DEFAULT NULL,
  `tenant_id` int NOT NULL,
  `image` varchar(2000) DEFAULT NULL,
  `inventory_changed_time` datetime DEFAULT NULL,
  `stock_alert_quantity` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=58 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inventory_items`
--

LOCK TABLES `inventory_items` WRITE;
/*!40000 ALTER TABLE `inventory_items` DISABLE KEYS */;
INSERT INTO `inventory_items` VALUES (3,'Heineken','store_1',5,2,NULL,14,NULL,'2025-05-08 00:00:00',5),(4,'jack Daniels',NULL,5,34,NULL,14,NULL,'2025-04-10 00:00:00',9),(5,'Red Label',NULL,7,19,NULL,14,NULL,'2025-05-08 00:00:00',5),(6,'Blue label',NULL,6,32,NULL,14,NULL,'2025-03-26 00:00:00',5),(7,'Bacadi Gold',NULL,4,25,NULL,14,NULL,'2025-04-02 00:00:00',5),(8,'BACARDI LEMON',NULL,7,35,NULL,14,NULL,NULL,5),(9,'BACARDI','tester',4,-4,NULL,14,NULL,'2025-04-08 00:00:00',5),(10,'JOHNNIE WALKER',NULL,6,96,NULL,14,NULL,'2025-03-26 00:00:00',5),(11,'ABSOLUT VODKA',NULL,4,55,NULL,14,NULL,NULL,5),(12,'SMIRNOFF',NULL,7,28,NULL,14,NULL,'2025-03-26 00:00:00',5),(13,'MR.DOWELLS',NULL,6,24,NULL,14,NULL,NULL,5),(14,'BLACK DOG',NULL,5,40,NULL,14,NULL,NULL,5),(15,'BLACK DOG',NULL,4,39,NULL,14,NULL,'2025-04-02 00:00:00',5),(16,'ROYAL CHALLENGES',NULL,6,18,NULL,14,NULL,'2025-03-24 00:00:00',5),(17,'VAT 69',NULL,7,35,NULL,14,NULL,'2025-04-02 00:00:00',5),(18,'SIGNATURE',NULL,4,30,NULL,14,NULL,NULL,5),(19,'ANTIQUITY',NULL,7,-8,NULL,14,NULL,'2025-04-10 00:00:00',5),(20,'JAMESON',NULL,4,19,NULL,14,NULL,'2025-03-26 00:00:00',5),(21,'CORONA EXTRA',NULL,7,38,NULL,14,NULL,'2025-05-08 00:00:00',5),(22,'CJIVAS REGAL',NULL,4,30,NULL,14,NULL,NULL,5),(23,'BEEFEATER',NULL,6,35,NULL,14,NULL,NULL,5),(24,'HENNESSY',NULL,4,29,NULL,14,NULL,'2025-03-26 00:00:00',5),(25,'BUDWEISER',NULL,4,299,NULL,14,NULL,'2025-03-24 00:00:00',5),(26,'BECKI',NULL,5,250,NULL,14,NULL,NULL,5),(27,'BHOOM',NULL,6,150,NULL,14,NULL,NULL,5),(28,'TUBORG',NULL,7,300,NULL,14,NULL,NULL,5),(29,'MILLER',NULL,7,200,NULL,14,NULL,NULL,5),(30,'KNOW OUT',NULL,4,200,NULL,14,NULL,NULL,5),(31,'KING FISHER',NULL,4,149,NULL,14,NULL,'2025-03-24 00:00:00',5),(32,'KING FISHER ULTRA',NULL,5,180,NULL,14,NULL,NULL,5),(33,'CARLSBERG ',NULL,7,250,NULL,14,NULL,NULL,5),(34,'HARDY ',NULL,7,149,NULL,14,NULL,'2025-03-24 00:00:00',5),(35,'STELLA ARTOIS',NULL,6,100,NULL,14,NULL,NULL,5),(36,'Besan',NULL,7,1000,NULL,14,NULL,NULL,NULL),(37,'Thumbs up','Traders',5,96,NULL,14,NULL,'2025-04-10 00:00:00',NULL),(38,'Biryani',NULL,6,10,NULL,14,NULL,NULL,5),(39,'Biryani','Tester',6,10,NULL,14,NULL,NULL,NULL),(40,'Bread',NULL,13,15,NULL,18,NULL,NULL,NULL),(41,'Sliced Ham',NULL,14,50,NULL,18,NULL,NULL,NULL),(42,'Red Cabbage',NULL,14,5,NULL,18,NULL,NULL,NULL),(43,'Cheese',NULL,14,15,NULL,18,NULL,NULL,NULL),(44,'Granola',NULL,13,20,NULL,18,NULL,NULL,5),(45,'Avacado',NULL,13,10,NULL,18,NULL,NULL,NULL),(46,'Tomato',NULL,14,30,NULL,18,NULL,NULL,NULL),(47,'Basil',NULL,14,2,NULL,18,NULL,NULL,NULL),(48,'Mozzarella',NULL,14,5,NULL,18,NULL,NULL,NULL),(49,'Onions',NULL,14,30,NULL,18,NULL,NULL,NULL),(50,'Fries',NULL,17,9,NULL,18,NULL,'2025-04-10 00:00:00',NULL),(51,'Chicken',NULL,17,10,NULL,18,NULL,NULL,NULL),(52,'Eggs',NULL,17,150,NULL,18,NULL,NULL,NULL),(53,'Lettuce',NULL,15,6,NULL,18,NULL,NULL,NULL),(54,'Spinach',NULL,16,25,NULL,18,NULL,NULL,NULL),(55,'Cream',NULL,16,3,NULL,18,NULL,NULL,NULL),(56,'Corn',NULL,16,5,NULL,18,NULL,NULL,NULL),(57,'Potatoes',NULL,17,24,NULL,18,NULL,'2025-04-10 00:00:00',NULL);
/*!40000 ALTER TABLE `inventory_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `invoice_sequences`
--

DROP TABLE IF EXISTS `invoice_sequences`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `invoice_sequences` (
  `tenant_id` int NOT NULL,
  `sequence_no` int DEFAULT NULL,
  PRIMARY KEY (`tenant_id`),
  CONSTRAINT `invoice_sequences_ibfk_1` FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `invoice_sequences`
--

LOCK TABLES `invoice_sequences` WRITE;
/*!40000 ALTER TABLE `invoice_sequences` DISABLE KEYS */;
INSERT INTO `invoice_sequences` VALUES (14,207),(18,7);
/*!40000 ALTER TABLE `invoice_sequences` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `invoices`
--

DROP TABLE IF EXISTS `invoices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `invoices` (
  `id` int NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `sub_total` decimal(10,2) DEFAULT NULL,
  `tax_total` decimal(10,2) DEFAULT NULL,
  `total` decimal(10,2) DEFAULT NULL,
  `payment_type_id` int DEFAULT NULL,
  `tenant_id` int NOT NULL,
  `charges` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`id`,`tenant_id`),
  KEY `tenant_id` (`tenant_id`),
  CONSTRAINT `invoices_ibfk_1` FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `invoices`
--

LOCK TABLES `invoices` WRITE;
/*!40000 ALTER TABLE `invoices` DISABLE KEYS */;
INSERT INTO `invoices` VALUES (1,'2024-11-28 12:04:09',1700.00,0.00,1700.00,3,14,0.00),(1,'2025-04-10 11:24:59',3.99,0.80,4.59,NULL,18,NULL),(2,'2024-12-07 12:44:23',4645.00,0.00,4645.00,4,14,0.00),(2,'2025-04-10 11:31:32',5.99,1.20,7.19,10,18,NULL),(3,'2024-12-07 12:44:50',7750.00,0.00,7750.00,4,14,0.00),(3,'2025-04-10 11:31:36',5.99,1.20,7.19,12,18,NULL),(4,'2024-12-07 12:49:12',4700.00,0.00,4700.00,5,14,0.00),(4,'2025-04-10 11:31:39',5.99,1.20,7.19,10,18,NULL),(5,'2024-12-11 08:14:35',4400.00,0.00,4400.00,3,14,0.00),(5,'2025-04-10 11:31:42',5.99,1.20,7.19,12,18,NULL),(6,'2024-12-11 08:16:25',4850.00,0.00,4850.00,3,14,0.00),(6,'2025-04-10 11:31:46',5.99,1.20,7.19,12,18,NULL),(7,'2024-12-11 08:16:33',4850.00,0.00,4850.00,4,14,0.00),(7,'2025-04-10 11:31:50',5.99,1.20,7.19,10,18,NULL),(8,'2024-12-11 08:19:21',8430.00,0.00,8430.00,3,14,0.00),(9,'2024-12-11 08:20:20',6200.00,0.00,6200.00,4,14,0.00),(10,'2024-12-11 08:22:05',6400.00,0.00,6400.00,5,14,0.00),(11,'2024-12-23 12:24:48',1100.00,0.00,1100.00,4,14,0.00),(12,'2025-01-05 16:25:16',200.00,0.00,200.00,3,14,0.00),(13,'2025-01-15 12:36:56',300.00,0.00,300.00,3,14,0.00),(14,'2025-01-18 06:19:10',2342.00,0.00,2342.00,4,14,0.00),(15,'2025-01-18 07:39:59',200.00,0.00,200.00,3,14,0.00),(16,'2025-01-18 07:40:11',100.00,0.00,100.00,4,14,0.00),(17,'2025-01-18 07:41:27',200.00,0.00,200.00,3,14,0.00),(18,'2025-01-18 07:44:18',2742.00,0.00,2742.00,NULL,14,0.00),(19,'2025-01-18 08:07:23',5084.00,0.00,5084.00,3,14,0.00),(20,'2025-01-18 08:17:50',600.00,0.00,600.00,4,14,0.00),(21,'2025-01-18 08:20:04',5084.00,0.00,5084.00,3,14,0.00),(22,'2025-01-18 08:21:42',5084.00,0.00,5084.00,5,14,0.00),(23,'2025-01-18 08:24:12',5084.00,0.00,5084.00,4,14,0.00),(24,'2025-01-18 08:30:33',800.00,0.00,800.00,4,14,0.00),(25,'2025-01-18 08:35:42',1024.00,0.00,1024.00,3,14,0.00),(26,'2025-01-18 13:40:09',2342.00,0.00,2342.00,4,14,0.00),(27,'2025-01-20 12:37:45',3042.00,0.00,3042.00,4,14,0.00),(28,'2025-01-20 16:12:13',400.00,0.00,400.00,4,14,0.00),(29,'2025-01-21 16:58:41',5284.00,0.00,5284.00,NULL,14,0.00),(30,'2025-01-21 17:04:46',900.00,0.00,900.00,NULL,14,0.00),(31,'2025-01-21 17:05:07',3871.00,0.00,3871.00,NULL,14,0.00),(32,'2025-01-21 17:05:24',600.00,0.00,600.00,NULL,14,0.00),(33,'2025-01-21 17:07:02',2742.00,0.00,2742.00,3,14,0.00),(34,'2025-01-21 17:12:06',2842.00,0.00,2842.00,3,14,0.00),(35,'2025-01-21 17:43:22',100.00,0.00,100.00,5,14,0.00),(36,'2025-01-21 17:44:07',900.00,0.00,900.00,4,14,0.00),(37,'2025-01-23 21:25:37',1200.00,0.00,1200.00,NULL,14,0.00),(38,'2025-01-23 21:26:48',1400.00,0.00,1400.00,NULL,14,0.00),(39,'2025-01-23 21:27:22',300.00,0.00,300.00,NULL,14,0.00),(40,'2025-01-23 21:27:40',600.00,0.00,600.00,NULL,14,0.00),(41,'2025-01-23 21:28:25',200.00,0.00,200.00,NULL,14,0.00),(42,'2025-01-23 21:51:44',2542.00,0.00,2542.00,NULL,14,0.00),(43,'2025-01-23 21:57:02',200.00,0.00,200.00,NULL,14,0.00),(44,'2025-01-23 22:00:46',200.00,0.00,200.00,NULL,14,0.00),(45,'2025-01-23 22:05:58',100.00,0.00,100.00,NULL,14,0.00),(46,'2025-01-23 22:06:33',200.00,0.00,200.00,NULL,14,0.00),(47,'2025-01-25 17:46:16',200.00,0.00,200.00,5,14,0.00),(48,'2025-01-25 17:46:24',200.00,0.00,200.00,NULL,14,0.00),(49,'2025-01-25 17:48:15',700.00,0.00,700.00,NULL,14,0.00),(50,'2025-01-27 07:48:06',200.00,0.00,200.00,4,14,0.00),(51,'2025-01-27 07:48:27',2342.00,0.00,2342.00,3,14,0.00),(52,'2025-01-27 07:49:41',2342.00,0.00,2342.00,3,14,0.00),(53,'2025-01-27 07:52:46',200.00,0.00,200.00,3,14,0.00),(54,'2025-01-27 07:53:56',204.00,0.00,204.00,3,14,0.00),(55,'2025-01-28 19:46:51',900.00,0.00,900.00,4,14,0.00),(56,'2025-01-28 19:47:35',220.00,0.00,220.00,NULL,14,0.00),(57,'2025-01-29 16:45:07',400.00,0.00,400.00,4,14,0.00),(58,'2025-02-20 09:08:14',2442.00,0.00,2442.00,NULL,14,0.00),(59,'2025-03-03 16:30:13',200.00,40.00,240.00,4,14,0.00),(60,'2025-03-03 19:36:10',200.00,40.00,240.00,4,14,0.00),(61,'2025-03-04 11:25:50',201.00,40.20,241.20,4,14,NULL),(62,'2025-03-04 11:48:34',2342.00,0.00,2342.00,4,14,NULL),(63,'2025-03-10 17:21:10',190.00,0.00,0.00,190,14,NULL),(64,'2025-03-10 17:23:19',270.00,0.00,0.00,270,14,NULL),(65,'2025-03-10 17:39:55',201.00,40.20,0.00,241,14,NULL),(66,'2025-03-11 07:47:40',100.00,20.00,0.00,115,14,NULL),(67,'2025-03-11 07:48:32',201.00,40.20,0.00,241,14,NULL),(68,'2025-03-11 13:53:44',290.00,20.00,NULL,305,14,NULL),(69,'2025-03-11 14:15:38',100.00,20.00,NULL,115,14,NULL),(70,'2025-03-11 14:16:57',100.00,20.00,NULL,115,14,NULL),(71,'2025-03-11 14:53:21',100.00,20.00,115.00,4,14,NULL),(72,'2025-03-11 14:55:29',100.00,20.00,115.00,4,14,NULL),(73,'2025-03-11 14:57:09',100.00,20.00,115.00,4,14,NULL),(74,'2025-03-11 14:57:52',100.00,20.00,115.00,4,14,NULL),(75,'2025-03-11 15:00:09',100.00,20.00,115.00,4,14,NULL),(76,'2025-03-11 09:32:52',100.00,20.00,0.00,115,14,NULL),(77,'2025-03-11 15:27:39',100.00,20.00,115.00,4,14,NULL),(78,'2025-03-11 21:36:48',100.00,20.00,115.00,4,14,NULL),(79,'2025-03-11 21:37:13',100.00,20.00,115.00,4,14,NULL),(80,'2025-03-13 15:05:10',190.00,0.00,190.00,4,14,NULL),(81,'2025-03-14 21:39:08',600.00,20.00,615.00,4,14,NULL),(82,'2025-03-14 21:39:35',201.00,40.20,241.20,4,14,NULL),(83,'2025-03-19 17:36:14',100.00,20.00,115.00,4,14,NULL),(84,'2025-03-19 17:52:15',100.00,20.00,115.00,4,14,NULL),(85,'2025-03-20 10:18:27',190.00,0.00,190.00,4,14,NULL),(86,'2025-03-20 12:26:20',200.00,0.00,200.00,4,14,NULL),(87,'2025-03-24 08:05:47',678.00,0.00,678.00,NULL,14,NULL),(88,'2025-03-24 08:07:17',190.00,0.00,190.00,NULL,14,NULL),(89,'2025-03-24 08:07:38',190.00,0.00,190.00,4,14,NULL),(90,'2025-03-24 08:11:47',528.00,0.00,528.00,4,14,NULL),(91,'2025-03-24 08:25:11',100.00,20.00,115.00,5,14,NULL),(92,'2025-03-24 08:31:11',529.00,0.00,529.00,5,14,NULL),(93,'2025-03-24 08:31:25',300.00,0.00,300.00,4,14,NULL),(94,'2025-03-24 08:33:15',400.00,0.00,400.00,4,14,NULL),(95,'2025-03-24 08:43:50',300.00,20.00,315.00,4,14,NULL),(96,'2025-03-24 12:19:22',393.00,0.00,393.00,4,14,NULL),(97,'2025-03-24 12:19:50',1284.00,20.00,1299.00,4,14,NULL),(98,'2025-03-24 12:41:18',2542.00,0.00,2542.00,4,14,NULL),(99,'2025-03-24 13:05:56',500.00,0.00,500.00,5,14,NULL),(100,'2025-03-24 13:06:02',390.00,0.00,390.00,4,14,NULL),(101,'2025-03-24 13:06:07',400.00,0.00,400.00,4,14,NULL),(102,'2025-03-24 13:06:14',600.00,20.00,615.00,5,14,NULL),(103,'2025-03-24 13:22:42',2541.00,0.00,2541.00,4,14,NULL),(104,'2025-03-24 13:23:10',4110.00,0.00,4110.00,5,14,NULL),(105,'2025-03-24 13:29:50',1665.00,60.00,1710.00,4,14,NULL),(106,'2025-03-24 13:55:38',1665.00,60.00,1710.00,5,14,NULL),(107,'2025-03-24 15:13:48',700.00,20.00,715.00,4,14,NULL),(108,'2025-03-24 15:42:32',2643.00,60.20,2698.20,4,14,NULL),(109,'2025-03-24 15:50:26',2342.00,0.00,2342.00,4,14,NULL),(110,'2025-03-24 15:54:41',2543.00,0.00,2583.20,4,14,NULL),(111,'2025-03-24 18:19:29',700.00,20.00,715.00,4,14,NULL),(112,'2025-03-25 14:29:09',528.00,0.00,528.00,NULL,14,NULL),(113,'2025-03-25 21:54:15',0.00,0.00,0.00,4,14,NULL),(114,'2025-03-25 21:56:35',2643.00,60.20,2698.20,4,14,NULL),(115,'2025-03-25 22:05:24',657.00,0.00,657.00,4,14,NULL),(116,'2025-03-25 22:10:41',3170.00,0.00,3170.00,4,14,NULL),(117,'2025-03-25 22:18:10',2543.00,40.20,2583.20,4,14,NULL),(118,'2025-03-25 22:36:53',600.00,0.00,600.00,4,14,NULL),(119,'2025-03-25 22:54:43',500.00,0.00,500.00,4,14,NULL),(120,'2025-03-26 07:01:56',1600.00,0.00,1600.00,4,14,NULL),(121,'2025-03-26 12:40:31',500.00,0.00,500.00,4,14,NULL),(122,'2025-03-26 12:40:40',500.00,20.00,515.00,4,14,NULL),(123,'2025-03-26 12:46:54',500.00,100.00,575.00,7,14,NULL),(124,'2025-03-26 12:48:07',400.00,0.00,400.00,5,14,NULL),(125,'2025-03-26 12:48:29',100.00,20.00,115.00,6,14,NULL),(126,'2025-03-26 12:48:59',100.00,20.00,115.00,7,14,NULL),(127,'2025-03-26 13:45:44',100.00,25.00,120.00,4,14,NULL),(128,'2025-03-26 13:46:14',100.00,25.00,120.00,4,14,NULL),(129,'2025-03-26 13:47:41',200.00,50.00,245.00,4,14,NULL),(130,'2025-03-26 13:48:14',400.00,100.00,500.00,4,14,NULL),(131,'2025-03-26 13:48:55',150.00,37.50,187.50,4,14,NULL),(132,'2025-03-26 15:30:55',100.00,0.00,100.00,4,14,NULL),(133,'2025-03-26 15:31:03',1063.00,0.00,1063.00,7,14,NULL),(134,'2025-03-26 15:31:40',300.00,0.00,300.00,8,14,NULL),(135,'2025-03-26 16:51:01',670.00,0.00,670.00,3,14,NULL),(136,'2025-03-26 18:52:41',390.00,0.00,390.00,3,14,NULL),(137,'2025-03-26 19:10:08',290.00,0.00,290.00,5,14,NULL),(138,'2025-03-26 19:10:41',300.00,0.00,300.00,4,14,NULL),(139,'2025-03-26 19:11:20',100.00,0.00,100.00,4,14,NULL),(140,'2025-03-26 19:12:10',728.00,0.00,728.00,4,14,NULL),(141,'2025-03-26 19:13:05',201.00,0.00,201.00,6,14,NULL),(142,'2025-03-26 19:21:37',100.00,0.00,100.00,7,14,NULL),(143,'2025-03-26 19:44:49',500.00,0.00,500.00,4,14,NULL),(144,'2025-03-26 19:46:49',100.00,0.00,100.00,4,14,NULL),(145,'2025-03-27 17:23:40',100.00,0.00,100.00,4,14,NULL),(146,'2025-03-27 17:24:19',100.00,0.00,100.00,4,14,NULL),(147,'2025-03-27 18:00:39',100.00,0.00,100.00,7,14,NULL),(148,'2025-03-27 18:03:24',100.00,25.00,125.00,7,14,NULL),(149,'2025-03-28 17:32:53',800.00,200.00,1000.00,4,14,NULL),(150,'2025-03-28 17:37:34',1000.00,250.00,1250.00,4,14,NULL),(151,'2025-04-01 16:04:38',2342.00,585.50,2927.50,4,14,NULL),(152,'2025-04-01 16:46:51',201.00,0.00,201.00,NULL,14,NULL),(153,'2025-04-01 16:46:51',201.00,0.00,201.00,NULL,14,NULL),(154,'2025-04-01 16:54:16',201.00,0.00,201.00,NULL,14,NULL),(155,'2025-04-01 16:54:16',201.00,0.00,201.00,NULL,14,NULL),(156,'2025-04-01 17:01:16',2342.00,585.50,2927.50,NULL,14,NULL),(157,'2025-04-01 17:01:16',2342.00,585.50,2927.50,NULL,14,NULL),(158,'2025-04-01 17:03:16',201.00,0.00,201.00,NULL,14,NULL),(159,'2025-04-01 17:03:16',201.00,0.00,201.00,NULL,14,NULL),(160,'2025-04-01 18:34:27',1500.00,50.00,1550.00,4,14,NULL),(161,'2025-04-01 18:36:12',500.00,25.00,525.00,NULL,14,NULL),(162,'2025-04-01 18:36:12',500.00,25.00,525.00,NULL,14,NULL),(163,'2025-04-02 17:46:29',2542.00,585.50,3127.50,NULL,14,NULL),(164,'2025-04-02 17:46:29',2542.00,585.50,3127.50,NULL,14,NULL),(165,'2025-04-02 17:48:53',849.00,0.00,849.00,4,14,NULL),(166,'2025-04-02 17:54:10',2342.00,585.50,2927.50,4,14,NULL),(167,'2025-04-02 17:55:34',100.00,25.00,125.00,4,14,NULL),(168,'2025-04-02 17:58:46',1359.00,0.00,1359.00,NULL,14,NULL),(169,'2025-04-02 17:58:46',1359.00,0.00,1359.00,NULL,14,NULL),(170,'2025-04-02 18:00:57',860.00,0.00,860.00,NULL,14,NULL),(171,'2025-04-02 18:00:57',860.00,0.00,860.00,NULL,14,NULL),(172,'2025-04-03 14:41:08',500.00,0.00,500.00,NULL,14,NULL),(173,'2025-04-03 14:41:08',500.00,0.00,500.00,NULL,14,NULL),(174,'2025-04-04 11:59:21',2442.00,610.50,3052.50,NULL,14,NULL),(175,'2025-04-04 11:59:21',2442.00,610.50,3052.50,NULL,14,NULL),(176,'2025-04-04 13:22:51',500.00,25.00,525.00,4,14,NULL),(177,'2025-04-04 13:23:52',100.00,25.00,125.00,4,14,NULL),(178,'2025-04-04 13:44:47',5000.00,1250.00,6250.00,4,14,NULL),(179,'2025-04-04 14:01:56',500.00,0.00,500.00,4,14,NULL),(180,'2025-04-04 14:06:53',500.00,25.00,525.00,4,14,NULL),(181,'2025-04-04 14:08:08',5000.00,1250.00,6250.00,NULL,14,NULL),(182,'2025-04-04 14:08:08',5000.00,1250.00,6250.00,NULL,14,NULL),(183,'2025-04-06 17:42:14',2342.00,585.50,2927.50,NULL,14,NULL),(184,'2025-04-07 16:13:59',500.00,25.00,525.00,4,14,NULL),(185,'2025-04-08 07:56:55',2342.00,585.50,2927.50,4,14,NULL),(186,'2025-04-08 08:23:34',2342.00,585.50,2927.50,4,14,NULL),(187,'2025-04-08 10:41:45',201.00,0.00,201.00,NULL,14,NULL),(188,'2025-04-08 10:43:21',201.00,0.00,201.00,NULL,14,NULL),(189,'2025-04-08 10:50:53',201.00,0.00,201.00,4,14,NULL),(190,'2025-04-08 10:50:57',201.00,0.00,201.00,4,14,NULL),(191,'2025-04-08 10:51:08',0.00,0.00,0.00,4,14,NULL),(192,'2025-04-08 10:51:56',201.00,0.00,201.00,NULL,14,NULL),(193,'2025-04-10 10:03:17',600.00,150.00,750.00,4,14,NULL),(194,'2025-04-10 10:03:20',600.00,150.00,750.00,4,14,NULL),(195,'2025-04-10 10:18:39',50.00,5.00,55.00,4,14,NULL),(196,'2025-04-10 10:18:40',50.00,5.00,55.00,4,14,NULL),(197,'2025-04-10 10:18:42',50.00,5.00,55.00,4,14,NULL),(198,'2025-04-10 10:19:28',50.00,5.00,55.00,4,14,NULL),(199,'2025-04-10 10:20:16',1200.00,0.00,1200.00,4,14,NULL),(200,'2025-04-10 10:20:22',1200.00,0.00,1200.00,4,14,NULL),(201,'2025-04-10 10:20:55',1200.00,0.00,1200.00,4,14,NULL),(202,'2025-04-10 10:51:04',400.00,0.00,400.00,NULL,14,NULL),(203,'2025-04-10 10:54:42',100.00,25.00,125.00,4,14,NULL),(204,'2025-04-10 11:02:08',379.00,0.00,379.00,4,14,NULL),(205,'2025-04-10 11:02:14',379.00,0.00,379.00,4,14,NULL),(206,'2025-04-10 11:02:22',0.00,0.00,0.00,4,14,NULL),(207,'2025-05-08 09:43:21',400.00,25.00,425.00,4,14,NULL);
/*!40000 ALTER TABLE `invoices` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `menu_item_addons`
--

DROP TABLE IF EXISTS `menu_item_addons`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `menu_item_addons` (
  `id` int NOT NULL AUTO_INCREMENT,
  `item_id` int NOT NULL,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` decimal(10,2) NOT NULL DEFAULT '0.00',
  `tenant_id` int DEFAULT NULL,
  PRIMARY KEY (`id`,`item_id`),
  KEY `fk_menu_item_idx` (`item_id`),
  KEY `fk_menu_item_idx_index` (`item_id`),
  KEY `tenant_id` (`tenant_id`),
  CONSTRAINT `fk_addon_menu_item` FOREIGN KEY (`item_id`) REFERENCES `menu_items` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `menu_item_addons_ibfk_1` FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `menu_item_addons`
--

LOCK TABLES `menu_item_addons` WRITE;
/*!40000 ALTER TABLE `menu_item_addons` DISABLE KEYS */;
INSERT INTO `menu_item_addons` VALUES (8,23,'Mayonnaise',3.00,14),(9,23,'Ketchup',4.00,14),(10,23,'Mushrooms',20.00,14),(11,83,'ketchup',0.05,18),(12,84,'Mango lassi',60.00,14),(13,83,'Extra Cheese',0.50,18),(14,83,'Extra Cream',0.50,18);
/*!40000 ALTER TABLE `menu_item_addons` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `menu_item_variants`
--

DROP TABLE IF EXISTS `menu_item_variants`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `menu_item_variants` (
  `id` int NOT NULL AUTO_INCREMENT,
  `item_id` int NOT NULL,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` decimal(10,2) NOT NULL DEFAULT '0.00',
  `tenant_id` int DEFAULT NULL,
  PRIMARY KEY (`id`,`item_id`),
  KEY `fk_variant_menu_item_id_idx` (`item_id`),
  KEY `tenant_id` (`tenant_id`),
  CONSTRAINT `fk_variant_menu_item_id` FOREIGN KEY (`item_id`) REFERENCES `menu_items` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `menu_item_variants_ibfk_1` FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `menu_item_variants`
--

LOCK TABLES `menu_item_variants` WRITE;
/*!40000 ALTER TABLE `menu_item_variants` DISABLE KEYS */;
INSERT INTO `menu_item_variants` VALUES (10,23,'Chicken Pizza',190.00,14),(11,23,'Chicken Tikka Pizza',200.00,14),(12,23,'Cheese and Tomato',170.00,14),(13,23,'Chicken BBQ Original Pizza',199.00,14),(14,77,'Pesto',350.00,14),(15,77,'Spaghetti',360.00,14),(16,83,'Hazelnut',2.30,18),(17,83,'Cheese',2.30,18),(18,83,'Chocolate',2.40,18),(19,84,'Mango',50.00,14),(20,83,'Almond',2.50,18),(21,83,'Ham and Cheese',3.50,18),(22,83,'Cheese and Spinach',2.99,18);
/*!40000 ALTER TABLE `menu_item_variants` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `menu_items`
--

DROP TABLE IF EXISTS `menu_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `menu_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `net_price` decimal(10,2) DEFAULT NULL,
  `tax_id` int DEFAULT NULL,
  `image` varchar(2000) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `category` int DEFAULT NULL,
  `tenant_id` int DEFAULT NULL,
  `inventory_id` int DEFAULT NULL,
  `discount` decimal(10,2) DEFAULT '0.00',
  `tax` decimal(10,2) DEFAULT '0.00',
  `status` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT 'Avaiable',
  PRIMARY KEY (`id`),
  KEY `tenant_id` (`tenant_id`),
  CONSTRAINT `menu_items_ibfk_1` FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=95 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `menu_items`
--

LOCK TABLES `menu_items` WRITE;
/*!40000 ALTER TABLE `menu_items` DISABLE KEYS */;
INSERT INTO `menu_items` VALUES (20,'Test-1',201.00,201.00,NULL,'/public/14/20',6,14,9,NULL,20.00,'Available'),(21,'test',2342.00,234221.00,2,NULL,4,14,4,NULL,0.00,'Available'),(22,'Biryani',100.00,120.00,2,'/public/14/22',6,14,21,NULL,20.00,'Available'),(23,'Domino\'s pizza',200.00,220.00,2,'/public/14/23',7,14,19,NULL,0.00,'Available'),(24,'pista',400.00,420.00,NULL,'/public/14/24',7,14,4,NULL,0.00,'Available'),(25,'Burger',200.00,220.00,NULL,'/public/14/25',7,14,5,NULL,0.00,'Available'),(26,'juice',100.00,20.00,NULL,'/public/14/26',5,14,3,NULL,0.00,'Available'),(27,'Shawarma',200.00,20.00,NULL,'/public/14/27',7,14,7,NULL,0.00,'Available'),(28,'Cakes',150.00,20.00,NULL,'/public/14/28',7,14,17,NULL,0.00,'Available'),(29,'paneer Burger',129.00,10.00,NULL,'/public/14/29',7,14,6,NULL,0.00,'Available'),(30,'Prawns Briyani',399.00,50.00,NULL,'/public/14/30',6,14,7,NULL,0.00,'Available'),(31,'Tandori Roll Chicken roll',399.00,30.00,NULL,'/public/14/31',7,14,15,NULL,0.00,'Available'),(32,'Strawberry ice cream',185.00,15.00,NULL,'/public/14/32',7,14,10,0.00,0.00,'Available'),(33,'paneer butter cheese pizza',344.00,25.00,NULL,'/public/14/33',7,14,9,0.00,0.00,'Available'),(34,'chicken fried mandi',310.00,30.00,NULL,'/public/14/34',7,14,12,0.00,0.00,'Available'),(35,'chicken tikka ',370.00,30.00,NULL,'/public/14/35',7,14,13,0.00,0.00,'Available'),(36,'Fruit salad',180.00,10.00,NULL,'/public/14/36',7,14,16,0.00,0.00,'Available'),(37,'Peanut Butter cold coffee',319.00,15.00,NULL,'/public/14/37',7,14,30,0.00,0.00,'Available'),(38,'Salted French Fries',250.00,20.00,NULL,'/public/14/38',7,14,18,0.00,0.00,'Available'),(39,'Caribbean sky Mocktail',379.00,15.00,NULL,'/public/14/39',5,14,19,0.00,0.00,'Available'),(40,'Mexican cheesy Fries',339.00,25.00,NULL,'/public/14/40',7,14,20,0.00,0.00,'Available'),(41,'chicken pineapple salad',700.00,50.00,NULL,'/public/14/41',7,14,34,0.00,0.00,'Available'),(42,'Mushroom Onion Omelette',229.00,15.00,NULL,'/public/14/42',7,14,24,0.00,0.00,'Available'),(43,'Chocochip Pancake',280.00,30.00,NULL,'/public/14/43',7,14,25,0.00,0.00,'Available'),(44,'Nutella Waffle',249.00,25.00,NULL,'/public/14/44',7,14,26,0.00,0.00,'Available'),(45,'Chicken Sandwich',389.00,25.00,NULL,'/public/14/45',7,14,31,0.00,0.00,'Available'),(46,'Avocado Toast',578.00,35.00,NULL,'/public/14/46',7,14,23,0.00,0.00,'Available'),(47,'Cheesy Potato Croquettes',270.00,10.00,NULL,'/public/14/47',7,14,33,0.00,0.00,'Available'),(48,'Loaded Chip Bowl',279.00,15.00,NULL,'/public/14/48',7,14,35,0.00,0.00,'Available'),(49,'Crispy Veg Strips',270.00,10.00,NULL,'/public/14/49',7,14,29,0.00,0.00,'Available'),(51,'Chicken Popcorn',113.00,10.00,NULL,'/public/14/51',7,14,20,0.00,0.00,'Available'),(52,'Hot & Crispy Wings',113.00,10.00,NULL,'/public/14/52',7,14,3,0.00,0.00,'Available'),(53,'Sitaphal Milk Shake',169.00,15.00,NULL,'/public/14/53',7,14,22,0.00,0.00,'Available'),(54,'Rich Dark Chocolate Tub',99.00,10.00,NULL,'/public/14/54',7,14,28,0.00,0.00,'Available'),(55,'Chicken Tikka Kebab',315.00,20.00,NULL,'/public/14/55',7,14,20,0.00,0.00,'Available'),(56,'Tandoori Chicken',320.00,10.00,NULL,'/public/14/56',7,14,23,0.00,0.00,'Available'),(57,'Chicken 65',295.00,10.00,NULL,'/public/14/57',7,14,4,0.00,0.00,'Available'),(58,'Butter Chicken',295.00,15.00,NULL,'/public/14/58',7,14,20,0.00,0.00,'Available'),(59,'Mutton Biryani',350.00,25.00,NULL,'/public/14/59',6,14,20,0.00,0.00,'Available'),(60,'Special Double Gosht Mutton Biryani BESTSELLER',475.00,25.00,NULL,NULL,6,14,5,0.00,0.00,'Available'),(61,'Veg Manchuria',110.00,10.00,NULL,'/public/14/61',7,14,35,0.00,0.00,'Available'),(62,'Veg Fried Rice',90.00,10.00,NULL,'/public/14/62',7,14,12,0.00,0.00,'Available'),(63,'Egg Noodles',250.00,20.00,NULL,'/public/14/63',7,14,17,0.00,0.00,'Available'),(64,'Special Deccan Chicken Haleem',280.00,20.00,NULL,'/public/14/64',7,14,18,0.00,0.00,'Available'),(65,'Veg Steamed Momos (6pcs)',149.00,15.00,NULL,'/public/14/65',7,14,9,0.00,0.00,'Available'),(66,'Hot & Crispy Chicken Momos (6pcs)',199.00,15.00,NULL,'/public/14/66',7,14,16,0.00,0.00,'Available'),(67,'Sweet Corn Soup',190.00,10.00,NULL,'/public/14/67',4,14,16,0.00,0.00,'Available'),(68,'Dragon Potato',270.00,20.00,NULL,'/public/14/68',7,14,32,0.00,0.00,'Available'),(69,'Crispy Corn',270.00,15.00,NULL,'/public/14/69',7,14,15,0.00,0.00,'Available'),(70,'Paneer 65',280.00,15.00,NULL,'/public/14/70',7,14,33,0.00,0.00,'Available'),(71,'Veg Spring Roll',250.00,10.00,NULL,'/public/14/71',7,14,29,0.00,0.00,'Available'),(72,'Baby Corn Chilly',330.00,20.00,NULL,'/public/14/72',7,14,34,0.00,0.00,'Available'),(73,'Hara Bhara Kabab',280.00,10.00,NULL,'/public/14/73',7,14,17,0.00,0.00,'Available'),(74,'Aloo Jeera',250.00,10.00,NULL,'/public/14/74',7,14,7,0.00,0.00,'Available'),(75,'Bro Code',400.00,400.00,NULL,NULL,5,14,3,0.00,0.00,'Available'),(76,'Coke',20.00,20.00,NULL,NULL,5,14,33,0.00,0.00,'Available'),(77,'Pasta',350.00,350.00,NULL,NULL,8,14,3,NULL,0.00,'Available'),(78,'Pav Bhaji',150.00,NULL,2,NULL,8,14,3,0.00,0.00,'Available'),(79,'tested',254.00,124333.00,2,NULL,5,14,6,NULL,0.00,'Available'),(80,'test-2',100.00,100.00,NULL,NULL,5,14,4,NULL,0.00,'Available'),(82,'Pizza',130.00,130.00,8,NULL,14,18,40,137.00,0.00,'Available'),(83,'Croissant',2.30,2.30,7,NULL,13,18,40,NULL,0.00,'Available'),(84,'Juice',50.00,50.00,4,NULL,5,14,37,NULL,0.00,'Available'),(85,'Salted Fries',2.99,2.99,7,NULL,17,18,50,5.00,0.00,'Available'),(86,'Peri Peri Fries',3.99,3.99,7,NULL,17,18,50,5.00,0.00,'Available'),(87,'Onion Rings',5.99,5.99,7,NULL,17,18,49,5.00,0.00,'Available'),(88,'Potato Wedges',5.99,5.99,7,NULL,17,18,57,0.00,0.00,'Available'),(89,'Chicken and Corn Soup',6.99,6.99,7,NULL,16,18,56,0.00,0.00,'Available'),(90,'Cream and Spinach Soup',5.99,5.99,7,NULL,16,18,55,0.00,0.00,'Available'),(91,'Greek Salad',6.99,6.99,7,NULL,15,18,53,0.00,0.00,'Available'),(92,'Classic Chicken Salad',7.99,7.99,7,NULL,15,18,51,0.00,0.00,'Available'),(93,'Original Ham and Cheese',3.90,3.90,7,NULL,14,18,41,0.00,0.00,'Available'),(94,'Granola Bar',2.90,2.90,7,NULL,13,18,44,0.00,0.00,'Available');
/*!40000 ALTER TABLE `menu_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` int DEFAULT NULL,
  `item_id` int DEFAULT NULL,
  `variant_id` int DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `quantity` int DEFAULT NULL,
  `status` enum('created','preparing','completed','cancelled','delivered') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'created',
  `date` datetime DEFAULT CURRENT_TIMESTAMP,
  `notes` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `addons` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `tenant_id` int DEFAULT NULL,
  `item_discount` decimal(10,2) DEFAULT '0.00',
  `item_name` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `tenant_id` (`tenant_id`),
  CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=538 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
INSERT INTO `order_items` VALUES (42,27,13,NULL,200.00,4,'preparing','2024-11-28 06:33:45',NULL,NULL,14,0.00,NULL),(43,27,14,NULL,900.00,1,'preparing','2024-11-28 06:33:45',NULL,NULL,14,0.00,NULL),(44,28,17,NULL,280.00,5,'preparing','2024-12-07 07:13:59',NULL,NULL,14,0.00,NULL),(45,28,18,NULL,499.00,5,'preparing','2024-12-07 07:13:59',NULL,NULL,14,0.00,NULL),(46,28,19,NULL,750.00,1,'preparing','2024-12-07 07:13:59',NULL,NULL,14,0.00,NULL),(47,29,14,NULL,900.00,6,'preparing','2024-12-07 07:14:45',NULL,NULL,14,0.00,NULL),(48,29,15,NULL,150.00,5,'preparing','2024-12-07 07:14:45',NULL,NULL,14,0.00,NULL),(49,29,13,NULL,200.00,1,'preparing','2024-12-07 07:14:45',NULL,NULL,14,0.00,NULL),(50,29,17,NULL,280.00,5,'preparing','2024-12-07 07:14:45',NULL,NULL,14,0.00,NULL),(51,30,13,NULL,200.00,4,'created','2024-12-07 07:18:33',NULL,NULL,14,0.00,NULL),(52,30,15,NULL,150.00,2,'preparing','2024-12-07 07:18:33',NULL,NULL,14,0.00,NULL),(53,30,14,NULL,900.00,4,'preparing','2024-12-07 07:18:33',NULL,NULL,14,0.00,NULL),(54,31,13,NULL,200.00,1,'preparing','2024-12-11 02:44:07',NULL,NULL,14,0.00,NULL),(55,31,15,NULL,150.00,4,'preparing','2024-12-11 02:44:07',NULL,NULL,14,0.00,NULL),(56,31,14,NULL,900.00,4,'preparing','2024-12-11 02:44:07',NULL,NULL,14,0.00,NULL),(57,32,14,NULL,900.00,4,'preparing','2024-12-11 02:45:03',NULL,NULL,14,0.00,NULL),(58,32,16,NULL,250.00,5,'preparing','2024-12-11 02:45:03',NULL,NULL,14,0.00,NULL),(59,33,14,NULL,900.00,4,'preparing','2024-12-11 02:45:53',NULL,NULL,14,0.00,NULL),(60,33,16,NULL,250.00,5,'preparing','2024-12-11 02:45:53',NULL,NULL,14,0.00,NULL),(61,34,17,NULL,280.00,6,'preparing','2024-12-11 02:48:46',NULL,NULL,14,0.00,NULL),(62,34,15,NULL,150.00,5,'preparing','2024-12-11 02:48:46',NULL,NULL,14,0.00,NULL),(63,34,16,NULL,250.00,6,'preparing','2024-12-11 02:48:46',NULL,NULL,14,0.00,NULL),(64,34,14,NULL,900.00,5,'preparing','2024-12-11 02:48:46',NULL,NULL,14,0.00,NULL),(65,35,15,NULL,150.00,9,'preparing','2024-12-11 02:49:49',NULL,NULL,14,0.00,NULL),(66,35,14,NULL,900.00,4,'preparing','2024-12-11 02:49:49',NULL,NULL,14,0.00,NULL),(67,35,16,NULL,250.00,5,'preparing','2024-12-11 02:49:49',NULL,NULL,14,0.00,NULL),(68,36,16,NULL,250.00,10,'preparing','2024-12-11 02:50:53',NULL,NULL,14,0.00,NULL),(69,36,15,NULL,150.00,8,'preparing','2024-12-11 02:50:53',NULL,NULL,14,0.00,NULL),(70,36,14,NULL,900.00,3,'preparing','2024-12-11 02:50:53',NULL,NULL,14,0.00,NULL),(71,37,13,NULL,200.00,1,'completed','2024-12-23 06:46:05',NULL,NULL,14,0.00,NULL),(72,37,14,NULL,900.00,1,'completed','2024-12-23 06:46:05',NULL,NULL,14,0.00,NULL),(73,38,20,NULL,200.00,1,'completed','2025-01-05 16:25:17',NULL,NULL,14,7.00,NULL),(74,39,20,NULL,200.00,1,'created','2025-01-15 12:36:56',NULL,NULL,14,7.00,NULL),(75,39,22,NULL,100.00,1,'created','2025-01-15 12:36:56',NULL,NULL,14,0.00,NULL),(76,40,21,NULL,2342.00,1,'created','2025-01-18 06:19:10',NULL,NULL,14,0.00,NULL),(77,41,20,NULL,200.00,1,'preparing','2025-01-18 07:39:59',NULL,NULL,14,7.00,NULL),(78,42,22,NULL,100.00,1,'preparing','2025-01-18 07:40:11',NULL,NULL,14,0.00,NULL),(79,43,23,NULL,200.00,1,'preparing','2025-01-18 07:40:54',NULL,NULL,14,0.00,'Domino\'s pizza'),(80,44,20,NULL,200.00,2,'created','2025-01-18 07:44:18',NULL,NULL,14,7.00,NULL),(81,44,21,NULL,2342.00,1,'created','2025-01-18 07:44:18',NULL,NULL,14,0.00,NULL),(82,45,20,NULL,200.00,2,'created','2025-01-18 08:07:23',NULL,NULL,14,7.00,NULL),(83,45,21,NULL,2342.00,2,'created','2025-01-18 08:07:23',NULL,NULL,14,0.00,NULL),(84,46,22,NULL,100.00,2,'created','2025-01-18 08:17:50',NULL,NULL,14,0.00,NULL),(85,46,23,NULL,200.00,2,'created','2025-01-18 08:17:50',NULL,NULL,14,0.00,'Domino\'s pizza'),(86,47,20,NULL,200.00,2,'created','2025-01-18 08:20:04',NULL,NULL,14,7.00,NULL),(87,47,21,NULL,2342.00,2,'created','2025-01-18 08:20:04',NULL,NULL,14,0.00,NULL),(88,48,20,NULL,200.00,2,'preparing','2025-01-18 08:21:11',NULL,NULL,14,7.00,NULL),(89,48,21,NULL,2342.00,2,'preparing','2025-01-18 08:21:11',NULL,NULL,14,0.00,NULL),(90,49,20,NULL,200.00,2,'created','2025-01-18 08:24:12',NULL,NULL,14,7.00,NULL),(91,49,21,NULL,2342.00,2,'created','2025-01-18 08:24:12',NULL,NULL,14,0.00,NULL),(92,50,20,NULL,200.00,2,'created','2025-01-18 08:30:33',NULL,NULL,14,7.00,NULL),(93,50,23,NULL,200.00,2,'created','2025-01-18 08:30:33',NULL,NULL,14,0.00,'Domino\'s pizza'),(94,51,34,NULL,310.00,1,'preparing','2025-01-18 08:34:31',NULL,NULL,14,0.00,NULL),(95,51,35,NULL,370.00,1,'preparing','2025-01-18 08:34:31',NULL,NULL,14,0.00,NULL),(96,51,33,NULL,344.00,1,'preparing','2025-01-18 08:34:31',NULL,NULL,14,0.00,NULL),(97,52,21,NULL,2342.00,1,'created','2025-01-18 13:40:09',NULL,NULL,14,0.00,NULL),(98,53,22,NULL,100.00,1,'delivered','2025-01-20 12:35:20',NULL,NULL,14,0.00,NULL),(99,53,23,NULL,200.00,1,'delivered','2025-01-20 12:35:20',NULL,NULL,14,0.00,'Domino\'s pizza'),(100,53,21,NULL,2342.00,1,'delivered','2025-01-20 12:35:20',NULL,NULL,14,0.00,NULL),(101,53,24,NULL,400.00,1,'delivered','2025-01-20 12:35:20',NULL,NULL,14,0.00,NULL),(102,54,23,NULL,200.00,1,'cancelled','2025-01-20 14:06:01',NULL,NULL,14,0.00,'Domino\'s pizza'),(103,54,25,NULL,200.00,1,'cancelled','2025-01-20 14:06:01',NULL,NULL,14,0.00,NULL),(104,54,24,NULL,400.00,1,'preparing','2025-01-20 14:06:01',NULL,NULL,14,0.00,NULL),(105,55,22,NULL,100.00,1,'created','2025-01-20 14:07:19',NULL,NULL,14,0.00,NULL),(106,55,24,NULL,400.00,1,'created','2025-01-20 14:07:19',NULL,NULL,14,0.00,NULL),(107,56,22,NULL,100.00,1,'created','2025-01-20 14:08:34',NULL,NULL,14,0.00,NULL),(108,57,23,NULL,200.00,1,'created','2025-01-20 14:12:24',NULL,NULL,14,0.00,'Domino\'s pizza'),(109,57,22,NULL,100.00,1,'created','2025-01-20 14:12:24',NULL,NULL,14,0.00,NULL),(110,57,27,NULL,200.00,1,'created','2025-01-20 14:12:24',NULL,NULL,14,0.00,NULL),(111,58,26,NULL,100.00,1,'created','2025-01-20 14:13:03',NULL,NULL,14,0.00,NULL),(112,58,27,NULL,200.00,1,'created','2025-01-20 14:13:03',NULL,NULL,14,0.00,NULL),(113,58,25,NULL,200.00,1,'created','2025-01-20 14:13:03',NULL,NULL,14,0.00,NULL),(114,59,25,NULL,200.00,1,'created','2025-01-20 14:15:54',NULL,NULL,14,0.00,NULL),(115,60,23,NULL,200.00,1,'created','2025-01-20 14:16:16',NULL,NULL,14,0.00,'Domino\'s pizza'),(116,61,24,NULL,400.00,1,'created','2025-01-20 14:17:22',NULL,NULL,14,0.00,NULL),(117,61,25,NULL,200.00,1,'created','2025-01-20 14:17:22',NULL,NULL,14,0.00,NULL),(118,62,23,NULL,200.00,2,'delivered','2025-01-20 16:11:23',NULL,NULL,14,0.00,'Domino\'s pizza'),(119,63,22,NULL,100.00,1,'completed','2025-01-20 17:40:42',NULL,NULL,14,0.00,NULL),(120,63,23,NULL,200.00,1,'preparing','2025-01-20 17:40:42',NULL,NULL,14,0.00,'Domino\'s pizza'),(121,63,24,NULL,400.00,1,'created','2025-01-20 17:40:42',NULL,NULL,14,0.00,NULL),(122,63,25,NULL,200.00,1,'created','2025-01-20 17:40:42','add cheese',NULL,14,0.00,NULL),(123,64,23,NULL,200.00,2,'created','2025-01-21 13:38:52',NULL,NULL,14,0.00,'Domino\'s pizza'),(124,64,27,NULL,200.00,1,'created','2025-01-21 13:38:52',NULL,NULL,14,0.00,NULL),(125,65,21,NULL,2342.00,1,'created','2025-01-21 16:46:04',NULL,NULL,14,0.00,NULL),(126,65,23,NULL,200.00,1,'created','2025-01-21 16:46:04',NULL,NULL,14,0.00,'Domino\'s pizza'),(127,66,21,NULL,2342.00,1,'created','2025-01-21 16:49:25',NULL,NULL,14,0.00,NULL),(128,66,21,NULL,2342.00,1,'created','2025-01-21 16:49:25',NULL,NULL,14,0.00,NULL),(129,66,21,NULL,2342.00,1,'created','2025-01-21 16:49:25',NULL,NULL,14,0.00,NULL),(130,66,23,NULL,200.00,1,'created','2025-01-21 16:49:25',NULL,NULL,14,0.00,'Domino\'s pizza'),(131,67,23,NULL,200.00,1,'created','2025-01-21 16:57:59',NULL,NULL,14,0.00,'Domino\'s pizza'),(132,67,23,NULL,200.00,1,'created','2025-01-21 16:57:59',NULL,NULL,14,0.00,'Domino\'s pizza'),(133,67,29,NULL,129.00,1,'created','2025-01-21 16:57:59',NULL,NULL,14,0.00,NULL),(134,67,20,NULL,200.00,1,'created','2025-01-21 16:57:59',NULL,NULL,14,7.00,NULL),(135,67,21,NULL,2342.00,1,'created','2025-01-21 16:57:59',NULL,NULL,14,0.00,NULL),(136,67,22,NULL,100.00,1,'created','2025-01-21 16:57:59',NULL,NULL,14,0.00,NULL),(137,67,23,NULL,200.00,1,'created','2025-01-21 16:57:59',NULL,NULL,14,0.00,'Domino\'s pizza'),(138,67,22,NULL,100.00,1,'created','2025-01-21 16:57:59',NULL,NULL,14,0.00,NULL),(139,67,26,NULL,100.00,1,'created','2025-01-21 16:57:59',NULL,NULL,14,0.00,NULL),(140,67,25,NULL,200.00,1,'created','2025-01-21 16:57:59',NULL,NULL,14,0.00,NULL),(141,67,22,NULL,100.00,1,'created','2025-01-21 16:57:59',NULL,NULL,14,0.00,NULL),(142,68,21,NULL,2342.00,1,'completed','2025-01-21 16:58:41',NULL,NULL,14,0.00,NULL),(143,68,23,NULL,200.00,1,'completed','2025-01-21 16:58:41',NULL,NULL,14,0.00,'Domino\'s pizza'),(144,68,24,NULL,400.00,1,'completed','2025-01-21 16:58:41',NULL,NULL,14,0.00,NULL),(145,68,21,NULL,2342.00,1,'completed','2025-01-21 16:58:41',NULL,NULL,14,0.00,NULL),(146,69,27,NULL,200.00,1,'delivered','2025-01-21 16:58:53',NULL,NULL,14,0.00,NULL),(147,69,25,NULL,200.00,1,'completed','2025-01-21 16:58:53',NULL,NULL,14,0.00,NULL),(148,69,23,NULL,200.00,1,'completed','2025-01-21 16:58:53',NULL,NULL,14,0.00,'Domino\'s pizza'),(149,69,22,NULL,100.00,1,'delivered','2025-01-21 16:58:53',NULL,NULL,14,0.00,NULL),(150,69,23,NULL,200.00,1,'delivered','2025-01-21 16:58:53',NULL,NULL,14,0.00,'Domino\'s pizza'),(151,70,20,NULL,200.00,1,'created','2025-01-21 17:05:52',NULL,NULL,14,7.00,NULL),(152,70,23,NULL,200.00,1,'created','2025-01-21 17:05:52',NULL,NULL,14,0.00,'Domino\'s pizza'),(153,70,21,NULL,2342.00,1,'created','2025-01-21 17:05:52',NULL,NULL,14,0.00,NULL),(154,71,20,NULL,200.00,1,'cancelled','2025-01-21 17:07:31',NULL,NULL,14,7.00,NULL),(155,71,22,NULL,100.00,1,'completed','2025-01-21 17:07:31',NULL,NULL,14,0.00,NULL),(156,72,20,NULL,200.00,1,'created','2025-01-21 17:10:08',NULL,NULL,14,7.00,NULL),(157,72,22,NULL,100.00,2,'created','2025-01-21 17:10:08',NULL,NULL,14,0.00,NULL),(158,73,21,NULL,2342.00,1,'created','2025-01-21 17:10:10',NULL,NULL,14,0.00,NULL),(159,73,22,NULL,100.00,1,'created','2025-01-21 17:10:10',NULL,NULL,14,0.00,NULL),(160,74,23,NULL,200.00,1,'created','2025-01-21 17:44:41',NULL,NULL,14,0.00,'Domino\'s pizza'),(161,74,25,NULL,200.00,1,'created','2025-01-21 17:44:41',NULL,NULL,14,0.00,NULL),(162,74,25,NULL,200.00,1,'created','2025-01-21 17:44:41',NULL,NULL,14,0.00,NULL),(163,74,23,NULL,200.00,1,'created','2025-01-21 17:44:41',NULL,NULL,14,0.00,'Domino\'s pizza'),(164,74,47,NULL,270.00,1,'created','2025-01-21 17:44:41',NULL,NULL,14,0.00,NULL),(165,75,27,NULL,200.00,1,'created','2025-01-21 17:45:40',NULL,NULL,14,0.00,NULL),(166,75,26,NULL,100.00,1,'created','2025-01-21 17:45:40',NULL,NULL,14,0.00,NULL),(167,75,24,NULL,400.00,1,'created','2025-01-21 17:45:40',NULL,NULL,14,0.00,NULL),(168,76,23,NULL,200.00,1,'created','2025-01-21 17:47:20',NULL,NULL,14,0.00,'Domino\'s pizza'),(169,76,25,NULL,200.00,1,'created','2025-01-21 17:47:20',NULL,NULL,14,0.00,NULL),(170,77,22,NULL,100.00,1,'created','2025-01-23 21:25:37',NULL,NULL,14,0.00,NULL),(171,77,22,NULL,100.00,1,'created','2025-01-23 21:25:37',NULL,NULL,14,0.00,NULL),(172,77,20,NULL,200.00,1,'created','2025-01-23 21:25:37',NULL,NULL,14,7.00,NULL),(173,77,24,NULL,400.00,1,'created','2025-01-23 21:25:37',NULL,NULL,14,0.00,NULL),(174,77,22,NULL,100.00,1,'created','2025-01-23 21:25:37',NULL,NULL,14,0.00,NULL),(175,77,22,NULL,100.00,1,'created','2025-01-23 21:25:37',NULL,NULL,14,0.00,NULL),(176,77,20,NULL,200.00,1,'created','2025-01-23 21:25:37',NULL,NULL,14,7.00,NULL),(177,78,25,NULL,200.00,1,'created','2025-01-23 21:26:48',NULL,NULL,14,0.00,NULL),(178,78,25,NULL,200.00,1,'created','2025-01-23 21:26:48',NULL,NULL,14,0.00,NULL),(179,78,27,NULL,200.00,1,'created','2025-01-23 21:26:48',NULL,NULL,14,0.00,NULL),(180,78,27,NULL,200.00,1,'created','2025-01-23 21:26:48',NULL,NULL,14,0.00,NULL),(181,78,27,NULL,200.00,1,'created','2025-01-23 21:26:48',NULL,NULL,14,0.00,NULL),(182,78,27,NULL,200.00,1,'created','2025-01-23 21:26:48',NULL,NULL,14,0.00,NULL),(183,78,27,NULL,200.00,1,'created','2025-01-23 21:26:48',NULL,NULL,14,0.00,NULL),(184,79,22,NULL,100.00,1,'created','2025-01-23 21:27:22',NULL,NULL,14,0.00,NULL),(185,79,20,NULL,200.00,1,'created','2025-01-23 21:27:22',NULL,NULL,14,7.00,NULL),(186,80,24,NULL,400.00,1,'created','2025-01-23 21:27:40',NULL,NULL,14,0.00,NULL),(187,80,25,NULL,200.00,1,'created','2025-01-23 21:27:40',NULL,NULL,14,0.00,NULL),(188,81,20,NULL,200.00,1,'completed','2025-01-23 21:28:25',NULL,NULL,14,7.00,NULL),(189,82,21,NULL,2342.00,1,'created','2025-01-23 21:51:44',NULL,NULL,14,0.00,NULL),(190,82,23,NULL,200.00,1,'created','2025-01-23 21:51:44',NULL,NULL,14,0.00,'Domino\'s pizza'),(191,83,27,NULL,200.00,1,'created','2025-01-23 21:57:02',NULL,NULL,14,0.00,NULL),(192,84,20,NULL,200.00,1,'completed','2025-01-23 22:00:46',NULL,NULL,14,7.00,NULL),(193,85,22,NULL,100.00,1,'created','2025-01-23 22:05:41',NULL,NULL,14,0.00,NULL),(194,86,23,NULL,200.00,1,'created','2025-01-23 22:06:23',NULL,NULL,14,0.00,'Domino\'s pizza'),(195,87,22,NULL,100.00,1,'created','2025-01-23 22:29:49','Spicy',NULL,14,0.00,NULL),(196,87,23,NULL,200.00,1,'created','2025-01-23 22:29:49','No olives',NULL,14,0.00,'Domino\'s pizza'),(197,87,22,NULL,100.00,1,'created','2025-01-23 22:29:49',NULL,NULL,14,0.00,NULL),(198,88,28,NULL,150.00,1,'completed','2025-01-24 11:34:13',NULL,NULL,14,0.00,NULL),(199,88,30,NULL,399.00,1,'completed','2025-01-24 11:34:13',NULL,NULL,14,0.00,NULL),(200,89,23,NULL,200.00,1,'created','2025-01-24 14:08:27',NULL,NULL,14,0.00,'Domino\'s pizza'),(201,90,22,NULL,100.00,1,'created','2025-01-25 17:40:11',NULL,NULL,14,0.00,NULL),(202,90,23,NULL,200.00,1,'created','2025-01-25 17:40:11',NULL,NULL,14,0.00,'Domino\'s pizza'),(203,90,22,NULL,100.00,1,'created','2025-01-25 17:40:11',NULL,NULL,14,0.00,NULL),(204,90,22,NULL,100.00,1,'created','2025-01-25 17:40:11',NULL,NULL,14,0.00,NULL),(205,91,22,NULL,100.00,3,'created','2025-01-25 17:40:58',NULL,NULL,14,0.00,NULL),(206,91,23,NULL,200.00,2,'created','2025-01-25 17:40:58',NULL,NULL,14,0.00,'Domino\'s pizza'),(207,92,23,NULL,200.00,1,'created','2025-01-25 17:46:16',NULL,NULL,14,0.00,'Domino\'s pizza'),(208,93,23,NULL,200.00,1,'created','2025-01-25 17:46:24',NULL,NULL,14,0.00,'Domino\'s pizza'),(209,94,23,NULL,200.00,1,'completed','2025-01-25 17:49:18',NULL,NULL,14,0.00,'Domino\'s pizza'),(210,95,20,NULL,200.00,1,'completed','2025-01-27 07:47:24',NULL,NULL,14,7.00,NULL),(211,96,21,NULL,2342.00,1,'completed','2025-01-27 07:48:27',NULL,NULL,14,0.00,NULL),(212,97,21,NULL,2342.00,1,'completed','2025-01-27 07:49:41',NULL,NULL,14,0.00,NULL),(213,98,20,NULL,200.00,1,'created','2025-01-27 07:52:46',NULL,NULL,14,7.00,NULL),(214,99,23,11,204.00,1,'preparing','2025-01-27 07:53:55',NULL,'[\"9\"]',14,0.00,'Domino\'s pizza'),(215,100,20,NULL,200.00,1,'created','2025-01-28 19:19:35',NULL,NULL,14,7.00,NULL),(216,100,23,10,190.00,1,'created','2025-01-28 19:19:35',NULL,NULL,14,0.00,'Domino\'s pizza'),(217,100,23,12,173.00,1,'created','2025-01-28 19:19:35',NULL,'[\"8\"]',14,0.00,'Domino\'s pizza'),(218,101,20,NULL,200.00,1,'preparing','2025-01-28 19:46:02',NULL,NULL,14,7.00,NULL),(219,101,22,NULL,100.00,1,'preparing','2025-01-28 19:46:02',NULL,NULL,14,0.00,NULL),(220,101,24,NULL,400.00,1,'preparing','2025-01-28 19:46:02',NULL,NULL,14,0.00,NULL),(221,101,25,NULL,200.00,1,'preparing','2025-01-28 19:46:02',NULL,NULL,14,0.00,NULL),(222,102,23,11,220.00,1,'created','2025-01-28 19:47:27',NULL,'[\"10\"]',14,0.00,'Domino\'s pizza'),(223,103,25,NULL,200.00,2,'created','2025-01-29 16:44:40',NULL,NULL,14,0.00,NULL),(224,104,78,NULL,150.00,1,'created','2025-01-29 21:07:07',NULL,NULL,14,0.00,NULL),(225,104,23,12,193.00,1,'created','2025-01-29 21:07:07',NULL,'[\"8\",\"10\"]',14,0.00,'Domino\'s pizza'),(226,105,23,12,193.00,1,'created','2025-01-29 21:07:38',NULL,'[\"8\",\"10\"]',14,0.00,'Domino\'s pizza'),(227,105,25,NULL,200.00,1,'created','2025-01-29 21:07:38',NULL,NULL,14,0.00,NULL),(228,105,27,NULL,200.00,1,'created','2025-01-29 21:07:38',NULL,NULL,14,0.00,NULL),(229,106,22,NULL,100.00,1,'created','2025-01-29 21:08:09',NULL,NULL,14,0.00,NULL),(230,106,24,NULL,400.00,2,'created','2025-01-29 21:08:09',NULL,NULL,14,0.00,NULL),(231,107,26,NULL,100.00,1,'created','2025-01-29 21:08:51',NULL,NULL,14,0.00,NULL),(232,107,28,NULL,150.00,1,'created','2025-01-29 21:08:51',NULL,NULL,14,0.00,NULL),(233,108,21,NULL,2342.00,1,'completed','2025-02-01 14:54:28',NULL,NULL,14,0.00,NULL),(234,108,23,12,173.00,1,'created','2025-02-01 14:54:28',NULL,'[\"8\"]',14,0.00,'Domino\'s pizza'),(235,109,21,NULL,2342.00,1,'created','2025-02-20 09:08:14',NULL,NULL,14,0.00,NULL),(236,109,22,NULL,100.00,1,'completed','2025-02-20 09:08:14',NULL,NULL,14,0.00,NULL),(239,112,20,NULL,200.00,1,'created','2025-03-03 11:00:13',NULL,NULL,14,7.00,NULL),(240,113,20,NULL,200.00,1,'cancelled','2025-03-03 14:06:10',NULL,NULL,14,7.00,NULL),(241,114,20,NULL,201.00,1,'cancelled','2025-03-04 05:55:50',NULL,NULL,14,7.00,NULL),(242,115,21,NULL,2342.00,1,'created','2025-03-04 06:18:35',NULL,NULL,14,0.00,NULL),(243,116,27,NULL,200.00,2,'created','2025-03-04 10:10:18',NULL,NULL,14,0.00,NULL),(244,116,20,NULL,201.00,1,'created','2025-03-04 10:10:18',NULL,NULL,14,7.00,NULL),(247,118,23,10,190.00,1,'created','2025-03-10 11:50:49',NULL,NULL,14,0.00,NULL),(248,119,22,NULL,100.00,1,'completed','2025-03-10 11:52:26',NULL,NULL,14,0.00,NULL),(249,119,23,12,170.00,1,'completed','2025-03-10 11:52:26',NULL,NULL,14,0.00,NULL),(250,120,20,NULL,201.00,1,'completed','2025-03-10 12:09:02',NULL,NULL,14,0.00,NULL),(251,121,22,NULL,100.00,1,'completed','2025-03-10 12:12:55',NULL,NULL,14,0.00,NULL),(252,122,20,NULL,201.00,1,'created','2025-03-11 07:48:24',NULL,NULL,14,0.00,NULL),(253,123,20,NULL,201.00,1,'created','2025-03-11 07:49:10',NULL,NULL,14,0.00,NULL),(254,124,22,NULL,100.00,1,'created','2025-03-11 08:09:10',NULL,NULL,14,0.00,NULL),(255,125,22,NULL,100.00,1,'created','2025-03-11 08:12:28',NULL,NULL,14,0.00,NULL),(256,125,23,10,190.00,1,'created','2025-03-11 08:12:28',NULL,NULL,14,0.00,NULL),(257,126,23,10,190.00,1,'created','2025-03-11 08:14:58',NULL,NULL,14,0.00,NULL),(258,126,22,NULL,100.00,1,'created','2025-03-11 08:14:58',NULL,NULL,14,0.00,NULL),(259,127,22,NULL,100.00,1,'created','2025-03-11 08:45:10',NULL,NULL,14,0.00,NULL),(260,128,22,NULL,100.00,1,'created','2025-03-11 08:46:37',NULL,NULL,14,0.00,NULL),(261,129,22,NULL,100.00,1,'created','2025-03-11 09:22:52',NULL,NULL,14,0.00,NULL),(262,130,22,NULL,100.00,1,'created','2025-03-11 09:24:47',NULL,NULL,14,0.00,NULL),(263,131,22,NULL,100.00,1,'created','2025-03-11 09:26:27',NULL,NULL,14,0.00,NULL),(264,132,22,NULL,100.00,1,'created','2025-03-11 09:27:33',NULL,NULL,14,0.00,NULL),(265,133,22,NULL,100.00,1,'created','2025-03-11 09:28:18',NULL,NULL,14,0.00,NULL),(266,134,22,NULL,100.00,1,'created','2025-03-11 09:32:45',NULL,NULL,14,0.00,NULL),(267,135,22,NULL,100.00,1,'created','2025-03-11 09:55:58',NULL,NULL,14,0.00,NULL),(268,136,22,NULL,100.00,1,'completed','2025-03-11 09:57:12',NULL,NULL,14,0.00,NULL),(269,137,22,NULL,100.00,1,'created','2025-03-11 16:06:28',NULL,NULL,14,0.00,NULL),(270,138,22,NULL,100.00,1,'created','2025-03-11 16:07:00',NULL,NULL,14,0.00,NULL),(271,139,23,10,190.00,1,'created','2025-03-13 14:20:32',NULL,NULL,14,0.00,NULL),(272,140,22,NULL,100.00,1,'created','2025-03-13 15:09:45',NULL,NULL,14,0.00,NULL),(273,140,23,10,194.00,1,'created','2025-03-13 15:09:45',NULL,'[\"9\"]',14,0.00,NULL),(274,140,27,NULL,200.00,1,'created','2025-03-13 15:09:45',NULL,NULL,14,0.00,NULL),(275,140,29,NULL,129.00,1,'created','2025-03-13 15:09:45',NULL,NULL,14,0.00,NULL),(276,140,31,NULL,399.00,1,'created','2025-03-13 15:09:45',NULL,NULL,14,0.00,NULL),(277,140,32,NULL,185.00,1,'created','2025-03-13 15:09:45',NULL,NULL,14,0.00,NULL),(278,140,34,NULL,310.00,1,'created','2025-03-13 15:09:45',NULL,NULL,14,0.00,NULL),(279,140,35,NULL,370.00,1,'created','2025-03-13 15:09:45',NULL,NULL,14,0.00,NULL),(280,141,27,NULL,200.00,1,'created','2025-03-13 15:10:11',NULL,NULL,14,0.00,NULL),(281,141,29,NULL,129.00,1,'created','2025-03-13 15:10:11',NULL,NULL,14,0.00,NULL),(282,141,31,NULL,399.00,1,'created','2025-03-13 15:10:11',NULL,NULL,14,0.00,NULL),(283,142,29,NULL,129.00,1,'created','2025-03-13 15:11:00',NULL,NULL,14,0.00,NULL),(284,142,31,NULL,399.00,1,'created','2025-03-13 15:11:00',NULL,NULL,14,0.00,NULL),(285,142,30,NULL,399.00,1,'created','2025-03-13 15:11:00',NULL,NULL,14,0.00,NULL),(286,143,22,NULL,100.00,1,'created','2025-03-13 18:01:27',NULL,NULL,14,0.00,NULL),(287,143,24,NULL,400.00,1,'created','2025-03-13 18:01:27',NULL,NULL,14,0.00,NULL),(288,143,26,NULL,100.00,1,'created','2025-03-13 18:01:27',NULL,NULL,14,0.00,NULL),(289,144,20,NULL,201.00,1,'created','2025-03-14 16:01:06',NULL,NULL,14,0.00,NULL),(290,145,22,NULL,100.00,1,'completed','2025-03-18 05:31:20','Spicy',NULL,14,0.00,NULL),(291,145,23,11,200.00,1,'completed','2025-03-18 05:31:20',NULL,NULL,14,0.00,NULL),(292,146,20,NULL,201.00,1,'created','2025-03-19 11:36:31',NULL,NULL,14,0.00,NULL),(293,147,22,NULL,100.00,1,'created','2025-03-19 12:06:14',NULL,NULL,14,0.00,NULL),(294,148,22,NULL,100.00,1,'created','2025-03-19 12:22:16',NULL,NULL,14,0.00,NULL),(295,149,22,NULL,100.00,1,'created','2025-03-20 04:29:11',NULL,NULL,14,0.00,NULL),(296,150,23,10,190.00,1,'created','2025-03-20 04:47:19',NULL,NULL,14,0.00,NULL),(297,151,23,10,190.00,1,'created','2025-03-20 04:48:27',NULL,NULL,14,0.00,NULL),(298,152,25,NULL,200.00,1,'created','2025-03-20 06:56:20',NULL,NULL,14,0.00,NULL),(299,153,23,10,190.00,1,'created','2025-03-20 06:57:05',NULL,NULL,14,0.00,NULL),(300,153,25,NULL,200.00,1,'created','2025-03-20 06:57:05',NULL,NULL,14,0.00,NULL),(301,154,22,NULL,100.00,1,'created','2025-03-24 07:52:31',NULL,NULL,14,0.00,NULL),(302,155,25,NULL,200.00,1,'created','2025-03-24 08:05:34',NULL,NULL,14,0.00,NULL),(303,155,27,NULL,200.00,1,'created','2025-03-24 08:05:34',NULL,NULL,14,0.00,NULL),(304,155,29,NULL,129.00,1,'created','2025-03-24 08:05:34',NULL,NULL,14,0.00,NULL),(305,156,29,NULL,129.00,1,'created','2025-03-24 08:05:47',NULL,NULL,14,0.00,NULL),(306,156,28,NULL,150.00,1,'created','2025-03-24 08:05:47',NULL,NULL,14,0.00,NULL),(307,156,30,NULL,399.00,1,'created','2025-03-24 08:05:47',NULL,NULL,14,0.00,NULL),(308,157,23,10,190.00,1,'preparing','2025-03-24 08:07:17',NULL,NULL,14,0.00,NULL),(309,158,23,10,190.00,1,'created','2025-03-24 08:07:38',NULL,NULL,14,0.00,NULL),(310,159,25,NULL,200.00,1,'completed','2025-03-24 08:11:36',NULL,NULL,14,0.00,NULL),(311,159,26,NULL,100.00,1,'completed','2025-03-24 08:11:36',NULL,NULL,14,0.00,NULL),(312,160,29,NULL,129.00,1,'created','2025-03-24 08:11:47',NULL,NULL,14,0.00,NULL),(313,160,31,NULL,399.00,1,'created','2025-03-24 08:11:47',NULL,NULL,14,0.00,NULL),(314,161,25,NULL,200.00,1,'completed','2025-03-24 08:32:15',NULL,NULL,14,0.00,NULL),(315,161,27,NULL,200.00,1,'completed','2025-03-24 08:32:15',NULL,NULL,14,0.00,NULL),(316,162,22,NULL,100.00,1,'completed','2025-03-24 08:42:56',NULL,NULL,14,0.00,NULL),(317,162,25,NULL,200.00,1,'completed','2025-03-24 08:42:56',NULL,NULL,14,0.00,NULL),(318,163,28,NULL,150.00,1,'delivered','2025-03-24 10:10:57',NULL,NULL,14,0.00,NULL),(319,163,29,NULL,129.00,1,'delivered','2025-03-24 10:10:57',NULL,NULL,14,0.00,NULL),(320,164,22,NULL,100.00,1,'created','2025-03-24 10:54:43',NULL,NULL,14,0.00,NULL),(321,164,24,NULL,400.00,1,'created','2025-03-24 10:54:43',NULL,NULL,14,0.00,NULL),(322,164,27,NULL,200.00,1,'created','2025-03-24 10:54:43',NULL,NULL,14,0.00,NULL),(323,164,30,NULL,399.00,1,'created','2025-03-24 10:54:43',NULL,NULL,14,0.00,NULL),(324,164,32,NULL,185.00,1,'created','2025-03-24 10:54:43',NULL,NULL,14,0.00,NULL),(325,165,25,NULL,200.00,1,'created','2025-03-24 12:01:12',NULL,NULL,14,0.00,NULL),(326,165,23,10,193.00,1,'created','2025-03-24 12:01:12',NULL,'[\"8\"]',14,0.00,NULL),(327,166,24,NULL,400.00,1,'created','2025-03-24 12:01:37',NULL,NULL,14,0.00,NULL),(328,167,23,10,190.00,1,'created','2025-03-24 12:02:30',NULL,NULL,14,0.00,NULL),(329,167,25,NULL,200.00,1,'created','2025-03-24 12:02:30',NULL,NULL,14,0.00,NULL),(330,168,24,NULL,400.00,1,'created','2025-03-24 12:03:07',NULL,NULL,14,0.00,NULL),(331,169,26,NULL,100.00,1,'created','2025-03-24 12:04:26',NULL,NULL,14,0.00,NULL),(332,170,22,NULL,100.00,1,'created','2025-03-24 12:11:08',NULL,NULL,14,0.00,NULL),(333,170,24,NULL,400.00,1,'created','2025-03-24 12:11:08',NULL,NULL,14,0.00,NULL),(334,170,26,NULL,100.00,1,'created','2025-03-24 12:11:08',NULL,NULL,14,0.00,NULL),(335,171,25,NULL,200.00,1,'created','2025-03-24 12:15:15',NULL,NULL,14,0.00,NULL),(336,171,21,NULL,2342.00,1,'created','2025-03-24 12:15:15',NULL,NULL,14,0.00,NULL),(337,172,24,NULL,400.00,2,'completed','2025-03-24 13:04:44',NULL,NULL,14,0.00,NULL),(338,172,22,NULL,100.00,3,'completed','2025-03-24 13:04:44',NULL,NULL,14,0.00,NULL),(339,172,27,NULL,200.00,1,'preparing','2025-03-24 13:04:44',NULL,NULL,14,0.00,NULL),(340,173,32,NULL,185.00,1,'completed','2025-03-24 13:08:14',NULL,NULL,14,0.00,NULL),(341,173,36,NULL,180.00,1,'preparing','2025-03-24 13:08:14',NULL,NULL,14,0.00,NULL),(342,174,21,NULL,2342.00,1,'created','2025-03-24 13:22:07',NULL,NULL,14,0.00,NULL),(343,174,31,NULL,399.00,1,'created','2025-03-24 13:22:07',NULL,NULL,14,0.00,NULL),(344,174,41,NULL,700.00,1,'created','2025-03-24 13:22:07',NULL,NULL,14,0.00,NULL),(345,174,43,NULL,280.00,1,'created','2025-03-24 13:22:07',NULL,NULL,14,0.00,NULL),(346,174,45,NULL,389.00,1,'created','2025-03-24 13:22:07',NULL,NULL,14,0.00,NULL),(347,175,21,NULL,2342.00,1,'created','2025-03-24 13:22:42',NULL,NULL,14,0.00,NULL),(348,175,23,13,199.00,1,'created','2025-03-24 13:22:42',NULL,NULL,14,0.00,NULL),(349,176,22,NULL,100.00,3,'created','2025-03-24 13:34:00',NULL,NULL,14,0.00,NULL),(350,176,24,NULL,400.00,2,'created','2025-03-24 13:34:00',NULL,NULL,14,0.00,NULL),(351,176,32,NULL,185.00,1,'created','2025-03-24 13:34:00',NULL,NULL,14,0.00,NULL),(352,176,36,NULL,180.00,1,'created','2025-03-24 13:34:00',NULL,NULL,14,0.00,NULL),(353,176,27,NULL,200.00,1,'created','2025-03-24 13:34:00',NULL,NULL,14,0.00,NULL),(354,177,20,NULL,201.00,1,'preparing','2025-03-24 14:24:01',NULL,NULL,14,0.00,NULL),(355,177,21,NULL,2342.00,1,'created','2025-03-24 14:24:01',NULL,NULL,14,0.00,NULL),(356,177,22,NULL,100.00,1,'preparing','2025-03-24 14:24:01',NULL,NULL,14,0.00,NULL),(357,178,22,NULL,100.00,1,'preparing','2025-03-24 15:12:44',NULL,NULL,14,0.00,NULL),(358,178,24,NULL,400.00,1,'completed','2025-03-24 15:12:44',NULL,NULL,14,0.00,NULL),(359,178,25,NULL,200.00,1,'completed','2025-03-24 15:12:44',NULL,NULL,14,0.00,NULL),(360,179,21,NULL,2342.00,1,'created','2025-03-24 15:50:12',NULL,NULL,14,0.00,NULL),(361,180,20,NULL,201.00,1,'created','2025-03-24 15:54:41',NULL,NULL,14,0.00,NULL),(362,180,21,NULL,2342.00,1,'cancelled','2025-03-24 15:54:41',NULL,NULL,14,0.00,NULL),(363,181,21,NULL,2342.00,1,'cancelled','2025-03-24 18:11:33',NULL,NULL,14,0.00,NULL),(364,182,21,NULL,2342.00,1,'cancelled','2025-03-24 18:14:14',NULL,NULL,14,0.00,NULL),(365,183,25,NULL,200.00,1,'created','2025-03-24 18:19:06',NULL,NULL,14,0.00,NULL),(366,183,24,NULL,400.00,1,'created','2025-03-24 18:19:06',NULL,NULL,14,0.00,NULL),(367,183,22,NULL,100.00,1,'created','2025-03-24 18:19:06',NULL,NULL,14,0.00,NULL),(368,184,22,NULL,100.00,1,'completed','2025-03-24 18:20:15',NULL,NULL,14,0.00,NULL),(369,184,20,NULL,201.00,1,'preparing','2025-03-24 18:20:15',NULL,NULL,14,0.00,NULL),(370,184,21,NULL,2342.00,1,'preparing','2025-03-24 18:20:15',NULL,NULL,14,0.00,NULL),(371,185,21,NULL,2342.00,1,'created','2025-03-24 18:22:22',NULL,NULL,14,0.00,NULL),(372,185,20,NULL,201.00,1,'created','2025-03-24 18:22:22',NULL,NULL,14,0.00,NULL),(373,186,29,NULL,129.00,2,'created','2025-03-24 18:23:37',NULL,NULL,14,0.00,NULL),(374,186,31,NULL,399.00,1,'created','2025-03-24 18:23:37',NULL,NULL,14,0.00,NULL),(375,187,21,NULL,2342.00,1,'created','2025-03-24 19:03:09',NULL,NULL,14,0.00,NULL),(376,188,29,NULL,129.00,1,'created','2025-03-25 14:29:09',NULL,NULL,14,0.00,NULL),(377,188,31,NULL,399.00,1,'created','2025-03-25 14:29:09',NULL,NULL,14,0.00,NULL),(378,189,26,NULL,100.00,1,'created','2025-03-25 16:40:13',NULL,NULL,14,0.00,NULL),(379,189,27,NULL,200.00,1,'created','2025-03-25 16:40:13',NULL,NULL,14,0.00,NULL),(380,190,26,NULL,100.00,2,'created','2025-03-25 17:06:37',NULL,NULL,14,0.00,NULL),(381,190,27,NULL,200.00,2,'created','2025-03-25 17:06:37',NULL,NULL,14,0.00,NULL),(382,191,24,NULL,400.00,1,'created','2025-03-25 17:17:36',NULL,NULL,14,0.00,NULL),(383,191,26,NULL,100.00,2,'created','2025-03-25 17:17:36',NULL,NULL,14,0.00,NULL),(384,192,26,NULL,100.00,1,'created','2025-03-25 17:18:00',NULL,NULL,14,0.00,NULL),(385,192,24,NULL,400.00,1,'created','2025-03-25 17:18:00',NULL,NULL,14,0.00,NULL),(386,193,24,NULL,400.00,1,'created','2025-03-25 17:20:54',NULL,NULL,14,0.00,NULL),(387,193,26,NULL,100.00,1,'created','2025-03-25 17:20:54',NULL,NULL,14,0.00,NULL),(388,194,26,NULL,100.00,1,'created','2025-03-25 17:21:09',NULL,NULL,14,0.00,NULL),(389,194,24,NULL,400.00,1,'created','2025-03-25 17:21:09',NULL,NULL,14,0.00,NULL),(390,195,26,NULL,100.00,1,'created','2025-03-25 17:24:27',NULL,NULL,14,0.00,NULL),(391,195,24,NULL,400.00,1,'created','2025-03-25 17:24:27',NULL,NULL,14,0.00,NULL),(392,196,22,NULL,100.00,1,'created','2025-03-26 09:11:59',NULL,NULL,14,0.00,NULL),(393,196,24,NULL,400.00,1,'created','2025-03-26 09:11:59',NULL,NULL,14,0.00,NULL),(394,197,22,NULL,100.00,5,'delivered','2025-03-26 12:46:31',NULL,NULL,14,0.00,NULL),(395,198,26,NULL,100.00,4,'created','2025-03-26 12:47:50',NULL,NULL,14,0.00,NULL),(396,199,22,NULL,100.00,1,'created','2025-03-26 12:48:19',NULL,NULL,14,0.00,NULL),(397,200,22,NULL,100.00,1,'created','2025-03-26 12:48:47',NULL,NULL,14,0.00,NULL),(398,201,22,NULL,100.00,1,'completed','2025-03-26 13:45:33',NULL,NULL,14,0.00,NULL),(399,202,22,NULL,100.00,1,'preparing','2025-03-26 13:45:57',NULL,NULL,14,0.00,NULL),(400,203,26,NULL,100.00,1,'delivered','2025-03-26 13:47:02',NULL,NULL,14,0.00,NULL),(401,203,22,NULL,100.00,1,'delivered','2025-03-26 13:47:02',NULL,NULL,14,0.00,NULL),(402,204,24,NULL,400.00,1,'created','2025-03-26 13:48:05',NULL,NULL,14,0.00,NULL),(403,205,28,NULL,150.00,1,'created','2025-03-26 13:48:40',NULL,NULL,14,0.00,NULL),(404,206,32,NULL,185.00,1,'created','2025-03-26 14:16:20',NULL,NULL,14,0.00,NULL),(405,206,34,NULL,310.00,1,'created','2025-03-26 14:16:20',NULL,NULL,14,0.00,NULL),(406,206,40,NULL,339.00,1,'created','2025-03-26 14:16:20',NULL,NULL,14,0.00,NULL),(407,206,42,NULL,229.00,1,'created','2025-03-26 14:16:20',NULL,NULL,14,0.00,NULL),(408,207,22,NULL,100.00,1,'created','2025-03-26 15:30:27',NULL,NULL,14,0.00,NULL),(409,208,22,NULL,100.00,3,'delivered','2025-03-26 15:31:31',NULL,NULL,14,0.00,NULL),(410,209,23,10,190.00,3,'completed','2025-03-26 16:48:57',NULL,NULL,14,0.00,NULL),(411,209,22,NULL,100.00,1,'completed','2025-03-26 16:48:57',NULL,NULL,14,0.00,NULL),(412,210,23,10,190.00,1,'completed','2025-03-26 18:44:41',NULL,NULL,14,0.00,NULL),(413,210,25,NULL,200.00,1,'completed','2025-03-26 18:44:41',NULL,NULL,14,0.00,NULL),(414,211,20,NULL,201.00,1,'created','2025-03-26 18:44:52',NULL,NULL,14,0.00,NULL),(415,212,27,NULL,200.00,1,'created','2025-03-26 18:56:35',NULL,NULL,14,0.00,NULL),(416,212,29,NULL,129.00,1,'created','2025-03-26 18:56:35',NULL,NULL,14,0.00,NULL),(417,212,31,NULL,399.00,1,'created','2025-03-26 18:56:35',NULL,NULL,14,0.00,NULL),(418,213,22,NULL,100.00,1,'created','2025-03-26 19:10:08',NULL,NULL,14,0.00,NULL),(419,213,23,10,190.00,1,'created','2025-03-26 19:10:08',NULL,NULL,14,0.00,NULL),(420,214,22,NULL,100.00,1,'created','2025-03-26 19:10:41',NULL,NULL,14,0.00,NULL),(421,214,25,NULL,200.00,1,'created','2025-03-26 19:10:41',NULL,NULL,14,0.00,NULL),(422,215,22,NULL,100.00,1,'created','2025-03-26 19:11:20',NULL,NULL,14,0.00,NULL),(423,216,22,NULL,100.00,1,'created','2025-03-26 19:21:25',NULL,NULL,14,0.00,NULL),(424,217,22,NULL,100.00,1,'created','2025-03-26 19:44:23',NULL,NULL,14,0.00,NULL),(425,217,24,NULL,400.00,1,'created','2025-03-26 19:44:23',NULL,NULL,14,0.00,NULL),(426,218,22,NULL,100.00,1,'created','2025-03-26 19:44:34',NULL,NULL,14,0.00,NULL),(427,219,22,NULL,100.00,1,'preparing','2025-03-27 17:23:12',NULL,NULL,14,0.00,NULL),(428,220,22,NULL,100.00,1,'created','2025-03-27 17:23:57',NULL,NULL,14,0.00,NULL),(429,221,22,NULL,100.00,1,'created','2025-03-27 17:32:07',NULL,NULL,14,0.00,NULL),(430,222,22,NULL,100.00,1,'created','2025-03-27 18:00:32',NULL,NULL,14,0.00,NULL),(431,223,22,NULL,100.00,1,'created','2025-03-27 18:03:08',NULL,NULL,14,0.00,NULL),(432,224,22,NULL,100.00,8,'created','2025-03-28 11:59:39',NULL,NULL,14,0.00,NULL),(433,225,22,NULL,100.00,10,'created','2025-03-28 12:06:58',NULL,NULL,14,0.00,NULL),(434,226,22,NULL,100.00,10,'created','2025-03-28 12:12:58',NULL,NULL,14,0.00,NULL),(435,227,22,NULL,100.00,23,'created','2025-03-28 12:18:44',NULL,NULL,14,0.00,NULL),(436,228,24,NULL,400.00,1,'created','2025-03-28 13:30:52',NULL,NULL,14,0.00,NULL),(437,228,23,10,210.00,1,'created','2025-03-28 13:30:52',NULL,'[\"10\"]',14,0.00,NULL),(438,229,25,NULL,200.00,1,'created','2025-03-28 15:02:05',NULL,NULL,14,0.00,NULL),(439,229,24,NULL,400.00,1,'created','2025-03-28 15:02:05',NULL,NULL,14,0.00,NULL),(440,230,30,NULL,399.00,1,'created','2025-03-28 15:02:25',NULL,NULL,14,0.00,NULL),(441,230,32,NULL,185.00,1,'created','2025-03-28 15:02:25',NULL,NULL,14,0.00,NULL),(442,231,24,NULL,400.00,1,'created','2025-03-28 15:06:23',NULL,NULL,14,0.00,NULL),(443,231,26,NULL,100.00,1,'created','2025-03-28 15:06:23',NULL,NULL,14,0.00,NULL),(444,232,22,NULL,100.00,2,'created','2025-03-28 15:06:50',NULL,NULL,14,0.00,NULL),(445,232,24,NULL,400.00,1,'created','2025-03-28 15:06:50',NULL,NULL,14,0.00,NULL),(446,233,24,NULL,400.00,1,'created','2025-04-01 08:28:18',NULL,NULL,14,0.00,NULL),(447,233,26,NULL,100.00,1,'created','2025-04-01 08:28:18',NULL,NULL,14,0.00,NULL),(448,234,22,NULL,100.00,1,'created','2025-04-01 08:28:38',NULL,NULL,14,0.00,NULL),(449,234,24,NULL,400.00,1,'created','2025-04-01 08:28:38',NULL,NULL,14,0.00,NULL),(450,235,26,NULL,100.00,1,'created','2025-04-01 08:31:25',NULL,NULL,14,0.00,NULL),(451,235,28,NULL,150.00,1,'created','2025-04-01 08:31:25',NULL,NULL,14,0.00,NULL),(452,236,26,NULL,100.00,1,'created','2025-04-01 08:33:10',NULL,NULL,14,0.00,NULL),(453,236,28,NULL,150.00,1,'created','2025-04-01 08:33:10',NULL,NULL,14,0.00,NULL),(454,237,22,NULL,100.00,1,'created','2025-04-01 09:25:44',NULL,NULL,14,0.00,NULL),(455,237,24,NULL,400.00,1,'created','2025-04-01 09:25:44',NULL,NULL,14,0.00,NULL),(456,238,20,NULL,201.00,1,'completed','2025-04-01 12:33:38',NULL,NULL,14,0.00,NULL),(457,239,21,NULL,2342.00,1,'created','2025-04-01 15:06:03',NULL,NULL,14,0.00,NULL),(458,240,23,10,190.00,1,'created','2025-04-01 15:10:34',NULL,NULL,14,0.00,NULL),(459,241,22,NULL,100.00,1,'created','2025-04-01 15:22:44',NULL,NULL,14,0.00,NULL),(460,241,24,NULL,400.00,1,'created','2025-04-01 15:22:44',NULL,NULL,14,0.00,NULL),(461,242,29,NULL,129.00,1,'created','2025-04-01 15:23:36',NULL,NULL,14,0.00,NULL),(462,243,27,NULL,200.00,1,'created','2025-04-01 15:24:43',NULL,NULL,14,0.00,NULL),(463,244,21,NULL,2342.00,1,'created','2025-04-01 16:04:25',NULL,NULL,14,0.00,NULL),(464,245,20,NULL,201.00,1,'created','2025-04-01 16:37:46',NULL,NULL,14,0.00,NULL),(465,246,20,NULL,201.00,1,'created','2025-04-01 16:46:21',NULL,NULL,14,0.00,NULL),(466,247,20,NULL,201.00,1,'created','2025-04-01 16:53:48',NULL,NULL,14,0.00,NULL),(467,248,20,NULL,201.00,1,'created','2025-04-01 17:00:32',NULL,NULL,14,0.00,NULL),(468,249,21,NULL,2342.00,1,'created','2025-04-01 17:00:47',NULL,NULL,14,0.00,NULL),(469,250,20,NULL,201.00,1,'created','2025-04-01 17:02:49',NULL,NULL,14,0.00,NULL),(470,251,22,NULL,100.00,1,'created','2025-04-01 18:35:05',NULL,NULL,14,0.00,NULL),(471,251,24,NULL,400.00,1,'created','2025-04-01 18:35:05',NULL,NULL,14,0.00,NULL),(472,252,21,NULL,2342.00,1,'created','2025-04-02 17:45:42',NULL,NULL,14,0.00,NULL),(473,252,25,NULL,200.00,1,'created','2025-04-02 17:45:42',NULL,NULL,14,0.00,NULL),(474,253,27,NULL,200.00,1,'completed','2025-04-02 17:48:31',NULL,NULL,14,0.00,NULL),(475,253,26,NULL,100.00,1,'completed','2025-04-02 17:48:31',NULL,NULL,14,0.00,NULL),(476,253,28,NULL,150.00,1,'completed','2025-04-02 17:48:31',NULL,NULL,14,0.00,NULL),(477,253,31,NULL,399.00,1,'completed','2025-04-02 17:48:31',NULL,NULL,14,0.00,NULL),(478,254,21,NULL,2342.00,1,'completed','2025-04-02 17:50:46',NULL,NULL,14,0.00,NULL),(479,255,22,NULL,100.00,1,'completed','2025-04-02 17:51:16',NULL,NULL,14,0.00,NULL),(480,256,41,NULL,700.00,1,'created','2025-04-02 17:58:01',NULL,NULL,14,0.00,NULL),(481,256,43,NULL,280.00,1,'created','2025-04-02 17:58:01',NULL,NULL,14,0.00,NULL),(482,256,39,NULL,379.00,1,'created','2025-04-02 17:58:01',NULL,NULL,14,0.00,NULL),(483,257,22,NULL,100.00,1,'preparing','2025-04-02 17:59:38',NULL,NULL,14,0.00,NULL),(484,257,24,NULL,400.00,1,'preparing','2025-04-02 17:59:38',NULL,NULL,14,0.00,NULL),(485,258,35,NULL,370.00,1,'created','2025-04-02 18:00:18',NULL,NULL,14,0.00,NULL),(486,258,34,NULL,310.00,1,'created','2025-04-02 18:00:18',NULL,NULL,14,0.00,NULL),(487,258,36,NULL,180.00,1,'created','2025-04-02 18:00:18',NULL,NULL,14,0.00,NULL),(488,259,24,NULL,400.00,1,'created','2025-04-03 14:38:55',NULL,NULL,14,0.00,NULL),(489,259,26,NULL,100.00,1,'created','2025-04-03 14:38:55',NULL,NULL,14,0.00,NULL),(490,260,22,NULL,100.00,1,'preparing','2025-04-03 14:39:38',NULL,NULL,14,0.00,NULL),(491,260,24,NULL,400.00,1,'preparing','2025-04-03 14:39:38',NULL,NULL,14,0.00,NULL),(492,261,24,NULL,400.00,1,'created','2025-04-03 14:40:09',NULL,NULL,14,0.00,NULL),(493,261,26,NULL,100.00,1,'created','2025-04-03 14:40:09',NULL,NULL,14,0.00,NULL),(494,262,22,NULL,100.00,1,'preparing','2025-04-04 07:11:42',NULL,NULL,14,0.00,NULL),(495,262,24,NULL,400.00,1,'preparing','2025-04-04 07:11:42',NULL,NULL,14,0.00,NULL),(496,263,21,NULL,2342.00,1,'created','2025-04-04 11:58:22',NULL,NULL,14,0.00,NULL),(497,263,22,NULL,100.00,1,'created','2025-04-04 11:58:22',NULL,NULL,14,0.00,NULL),(498,264,22,NULL,100.00,1,'created','2025-04-04 13:21:19',NULL,NULL,14,0.00,NULL),(499,264,24,NULL,400.00,1,'created','2025-04-04 13:21:19',NULL,NULL,14,0.00,NULL),(500,264,25,NULL,200.00,1,'created','2025-04-04 13:21:19',NULL,NULL,14,0.00,NULL),(501,264,27,NULL,200.00,1,'created','2025-04-04 13:21:19',NULL,NULL,14,0.00,NULL),(502,265,22,NULL,100.00,1,'created','2025-04-04 13:23:40',NULL,NULL,14,0.00,NULL),(503,266,22,NULL,100.00,50,'completed','2025-04-04 13:44:26',NULL,NULL,14,0.00,NULL),(504,267,22,NULL,100.00,50,'preparing','2025-04-04 14:07:33',NULL,NULL,14,0.00,NULL),(505,268,21,NULL,2342.00,1,'completed','2025-04-06 17:41:35',NULL,NULL,14,0.00,NULL),(506,269,22,NULL,100.00,1,'created','2025-04-07 05:39:03',NULL,NULL,14,0.00,NULL),(507,269,24,NULL,400.00,1,'created','2025-04-07 05:39:03',NULL,NULL,14,0.00,NULL),(508,270,24,NULL,400.00,1,'created','2025-04-07 16:07:10',NULL,NULL,14,0.00,NULL),(509,270,22,NULL,100.00,1,'created','2025-04-07 16:07:10',NULL,NULL,14,0.00,NULL),(510,271,25,NULL,200.00,1,'created','2025-04-07 16:07:32',NULL,NULL,14,0.00,NULL),(511,271,21,NULL,2342.00,1,'created','2025-04-07 16:07:32',NULL,NULL,14,0.00,NULL),(512,272,24,NULL,400.00,1,'created','2025-04-07 16:10:40',NULL,NULL,14,0.00,NULL),(513,273,21,NULL,2342.00,1,'delivered','2025-04-08 07:25:42',NULL,NULL,14,0.00,NULL),(514,274,21,NULL,2342.00,1,'created','2025-04-08 08:00:39',NULL,NULL,14,0.00,NULL),(515,275,21,NULL,2342.00,1,'created','2025-04-08 08:06:32',NULL,NULL,14,0.00,NULL),(516,276,21,NULL,2342.00,1,'preparing','2025-04-08 08:22:50',NULL,NULL,14,0.00,NULL),(517,277,20,NULL,201.00,1,'created','2025-04-08 10:41:07',NULL,NULL,14,0.00,NULL),(518,278,20,NULL,201.00,1,'created','2025-04-08 10:42:59',NULL,NULL,14,0.00,NULL),(519,279,20,NULL,201.00,1,'created','2025-04-08 10:44:24',NULL,NULL,14,0.00,NULL),(520,280,20,NULL,201.00,1,'created','2025-04-08 10:50:40',NULL,NULL,14,0.00,NULL),(521,281,20,NULL,201.00,1,'created','2025-04-08 10:51:35',NULL,NULL,14,0.00,NULL),(522,282,22,NULL,100.00,1,'created','2025-04-08 14:33:15',NULL,NULL,14,0.00,NULL),(523,282,24,NULL,400.00,1,'created','2025-04-08 14:33:15',NULL,NULL,14,0.00,NULL),(524,283,26,NULL,100.00,1,'created','2025-04-08 14:33:49',NULL,NULL,14,0.00,NULL),(525,283,28,NULL,150.00,1,'created','2025-04-08 14:33:49',NULL,NULL,14,0.00,NULL),(526,284,22,NULL,100.00,1,'created','2025-04-10 10:02:34',NULL,NULL,14,0.00,NULL),(527,285,22,NULL,100.00,5,'created','2025-04-10 10:02:53',NULL,NULL,14,0.00,NULL),(528,286,84,19,50.00,1,'completed','2025-04-10 10:18:21',NULL,NULL,14,0.00,NULL),(529,287,24,NULL,400.00,3,'completed','2025-04-10 10:19:56',NULL,NULL,14,0.00,NULL),(530,288,24,NULL,400.00,1,'preparing','2025-04-10 10:50:12',NULL,NULL,14,0.00,NULL),(531,289,22,NULL,100.00,1,'created','2025-04-10 10:54:28',NULL,NULL,14,0.00,NULL),(532,290,39,NULL,379.00,1,'created','2025-04-10 11:01:31',NULL,NULL,14,0.00,NULL),(533,291,86,NULL,3.99,1,'completed','2025-04-10 11:24:20',NULL,NULL,18,0.00,NULL),(534,292,88,NULL,5.99,1,'created','2025-04-10 11:29:12',NULL,NULL,18,0.00,NULL),(535,293,22,NULL,100.00,1,'created','2025-05-08 09:42:03',NULL,NULL,14,0.00,NULL),(536,293,25,NULL,200.00,1,'created','2025-05-08 09:42:03',NULL,NULL,14,0.00,NULL),(537,293,26,NULL,100.00,1,'created','2025-05-08 09:42:03',NULL,NULL,14,0.00,NULL);
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `date` datetime DEFAULT CURRENT_TIMESTAMP,
  `delivery_type` varchar(90) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `customer_type` enum('WALKIN','CUSTOMER') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'WALKIN',
  `customer_id` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `table_id` int DEFAULT NULL,
  `status` enum('created','completed','cancelled') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'created',
  `token_no` int DEFAULT NULL,
  `payment_status` enum('pending','paid') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `invoice_id` int DEFAULT NULL,
  `tenant_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `tenant_id` (`tenant_id`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=294 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (27,'2024-11-28 06:33:45','dinein','CUSTOMER','9',10,'completed',1,'paid',1,14),(28,'2024-12-07 07:13:58','dinein','CUSTOMER','9',9,'completed',1,'paid',2,14),(29,'2024-12-07 07:14:45','dinein','CUSTOMER','9',9,'completed',2,'paid',3,14),(30,'2024-12-07 07:18:33','dinein','CUSTOMER','9',8,'completed',3,'paid',4,14),(31,'2024-12-11 02:44:07','dinein','CUSTOMER','9',10,'completed',1,'paid',5,14),(32,'2024-12-11 02:45:03','dinein','CUSTOMER','9',6,'completed',2,'paid',6,14),(33,'2024-12-11 02:45:53','dinein','CUSTOMER','9',10,'completed',3,'paid',7,14),(34,'2024-12-11 02:48:45','dinein','CUSTOMER','9',11,'completed',4,'paid',8,14),(35,'2024-12-11 02:49:49','dinein','CUSTOMER','9',10,'completed',5,'paid',9,14),(36,'2024-12-11 02:50:53','dinein','CUSTOMER','9',12,'completed',6,'paid',10,14),(37,'2024-12-23 06:46:04','dinein','CUSTOMER','9',11,'completed',1,'paid',11,14),(38,'2025-01-05 16:25:17','dinein','CUSTOMER','9',10,'completed',1,'paid',12,14),(39,'2025-01-15 12:36:56','dinein','WALKIN','9',10,'created',1,'paid',13,14),(40,'2025-01-18 06:19:10','','WALKIN','9',NULL,'completed',1,'paid',14,14),(41,'2025-01-18 07:39:59','','WALKIN','9',NULL,'completed',2,'paid',15,14),(42,'2025-01-18 07:40:11','','WALKIN','9',NULL,'completed',3,'paid',16,14),(43,'2025-01-18 07:40:54','dinein','WALKIN','9',10,'completed',4,'paid',17,14),(44,'2025-01-18 07:44:18','','WALKIN','9',NULL,'completed',5,'paid',18,14),(45,'2025-01-18 08:07:23','','WALKIN','9',NULL,'completed',6,'paid',19,14),(46,'2025-01-18 08:17:50','','WALKIN','9',NULL,'completed',7,'paid',20,14),(47,'2025-01-18 08:20:04','','WALKIN','9',NULL,'completed',8,'paid',21,14),(48,'2025-01-18 08:21:11','','WALKIN','9',NULL,'completed',9,'paid',22,14),(49,'2025-01-18 08:24:12','','WALKIN','9',NULL,'completed',10,'paid',23,14),(50,'2025-01-18 08:30:33','','WALKIN','9',NULL,'completed',11,'paid',24,14),(51,'2025-01-18 08:34:31','','WALKIN','9',NULL,'completed',12,'paid',25,14),(52,'2025-01-18 13:40:09','dinein','WALKIN','9',10,'completed',13,'paid',26,14),(53,'2025-01-20 12:35:20','','WALKIN','9',NULL,'completed',1,'paid',27,14),(54,'2025-01-20 14:06:01','takeaway','WALKIN','9',NULL,'created',2,'pending',NULL,14),(55,'2025-01-20 14:07:19','','WALKIN','9',NULL,'cancelled',3,'pending',NULL,14),(56,'2025-01-20 14:08:34','takeaway','WALKIN','9',NULL,'cancelled',4,'pending',NULL,14),(57,'2025-01-20 14:12:24','dinein','WALKIN','9',NULL,'created',5,'pending',NULL,14),(58,'2025-01-20 14:13:03','','WALKIN','9',NULL,'created',6,'pending',NULL,14),(59,'2025-01-20 14:15:54','dinein','WALKIN','9',NULL,'created',7,'pending',NULL,14),(60,'2025-01-20 14:16:16','takeaway','WALKIN','9',NULL,'created',8,'pending',NULL,14),(61,'2025-01-20 14:17:22','dinein','WALKIN','9',11,'created',9,'pending',NULL,14),(62,'2025-01-20 16:11:23','dinein','CUSTOMER','9',10,'completed',10,'paid',28,14),(63,'2025-01-20 17:40:42','dinein','WALKIN','9',10,'completed',11,'paid',30,14),(64,'2025-01-21 13:38:52','dinein','WALKIN','9',14,'completed',1,'paid',32,14),(65,'2025-01-21 16:46:04','','WALKIN','9',NULL,'cancelled',2,'pending',NULL,14),(66,'2025-01-21 16:49:25','takeaway','WALKIN','9',NULL,'cancelled',3,'pending',NULL,14),(67,'2025-01-21 16:57:59','','WALKIN','9',NULL,'completed',4,'paid',31,14),(68,'2025-01-21 16:58:41','','WALKIN','9',NULL,'completed',5,'paid',29,14),(69,'2025-01-21 16:58:53','','WALKIN','9',NULL,'completed',6,'paid',36,14),(70,'2025-01-21 17:05:52','','WALKIN','9',NULL,'completed',7,'paid',33,14),(71,'2025-01-21 17:07:31','','WALKIN','9',NULL,'completed',8,'paid',35,14),(72,'2025-01-21 17:10:08','dinein','WALKIN','9',10,'completed',9,'paid',34,14),(73,'2025-01-21 17:10:10','dinein','WALKIN','9',10,'completed',10,'paid',34,14),(74,'2025-01-21 17:44:41','takeaway','WALKIN','9',11,'cancelled',11,'pending',NULL,14),(75,'2025-01-21 17:45:40','delivery','WALKIN','9',12,'created',12,'pending',NULL,14),(76,'2025-01-21 17:47:20','takeaway','WALKIN','9',NULL,'created',13,'pending',NULL,14),(77,'2025-01-23 21:25:37','','WALKIN','9',NULL,'cancelled',1,'paid',37,14),(78,'2025-01-23 21:26:48','takeaway','WALKIN','9',NULL,'completed',2,'paid',38,14),(79,'2025-01-23 21:27:22','takeaway','WALKIN','9',NULL,'cancelled',3,'paid',39,14),(80,'2025-01-23 21:27:40','delivery','WALKIN','9',NULL,'completed',4,'paid',40,14),(81,'2025-01-23 21:28:25','takeaway','WALKIN','9',10,'completed',5,'paid',41,14),(82,'2025-01-23 21:51:44','','WALKIN','9',NULL,'cancelled',6,'paid',42,14),(83,'2025-01-23 21:57:02','dinein','WALKIN','9',NULL,'completed',7,'paid',43,14),(84,'2025-01-23 22:00:46','','WALKIN','9',NULL,'completed',8,'paid',44,14),(85,'2025-01-23 22:05:41','','WALKIN','9',NULL,'completed',9,'paid',45,14),(86,'2025-01-23 22:06:23','','WALKIN','9',NULL,'completed',10,'paid',46,14),(87,'2025-01-23 22:29:49','dinein','WALKIN','9',10,'created',11,'pending',NULL,14),(88,'2025-01-24 11:34:13','takeaway','WALKIN','9',10,'created',1,'pending',NULL,14),(89,'2025-01-24 14:08:27','delivery','WALKIN','9',NULL,'created',2,'pending',NULL,14),(90,'2025-01-25 17:40:11','','WALKIN','9',NULL,'cancelled',1,'pending',NULL,14),(91,'2025-01-25 17:40:58','','WALKIN','9',NULL,'completed',2,'paid',49,14),(92,'2025-01-25 17:46:16','','WALKIN','9',NULL,'completed',3,'paid',47,14),(93,'2025-01-25 17:46:24','','WALKIN','9',NULL,'created',4,'paid',48,14),(94,'2025-01-25 17:49:18','','WALKIN','9',NULL,'created',5,'pending',NULL,14),(95,'2025-01-27 07:47:24','','WALKIN','9',NULL,'completed',1,'paid',50,14),(96,'2025-01-27 07:48:27','','WALKIN','9',NULL,'completed',2,'paid',51,14),(97,'2025-01-27 07:49:41','','WALKIN','9',NULL,'completed',3,'paid',52,14),(98,'2025-01-27 07:52:46','','WALKIN','9',NULL,'completed',4,'paid',53,14),(99,'2025-01-27 07:53:55','','WALKIN','9',NULL,'created',5,'paid',54,14),(100,'2025-01-28 19:19:35','','WALKIN','9',NULL,'created',1,'pending',NULL,14),(101,'2025-01-28 19:46:02','dinein','CUSTOMER','9',NULL,'completed',2,'paid',55,14),(102,'2025-01-28 19:47:27','takeaway','CUSTOMER','9',NULL,'completed',3,'paid',56,14),(103,'2025-01-29 16:44:40','','WALKIN','9',NULL,'completed',1,'paid',57,14),(104,'2025-01-29 21:07:07','','WALKIN','9',NULL,'created',2,'pending',NULL,14),(105,'2025-01-29 21:07:38','','WALKIN','9',NULL,'created',3,'pending',NULL,14),(106,'2025-01-29 21:08:09','','WALKIN','9',NULL,'created',4,'pending',NULL,14),(107,'2025-01-29 21:08:51','','WALKIN','9',NULL,'created',5,'pending',NULL,14),(108,'2025-02-01 14:54:28','','WALKIN','9',NULL,'created',1,'pending',NULL,14),(109,'2025-02-20 09:08:14','dinein','WALKIN','9',10,'created',1,'paid',58,14),(112,'2025-03-03 11:00:13','','WALKIN','9',NULL,'completed',1,'paid',59,14),(113,'2025-03-03 14:06:10','','WALKIN','9',NULL,'completed',2,'paid',60,14),(114,'2025-03-04 05:55:50','','WALKIN','9',NULL,'cancelled',1,'paid',61,14),(115,'2025-03-04 06:18:35','','WALKIN','9',NULL,'cancelled',2,'paid',62,14),(116,'2025-03-04 10:10:18','','WALKIN','9',NULL,'cancelled',3,'pending',NULL,14),(118,'2025-03-10 11:50:49','','WALKIN','9',NULL,'completed',1,'paid',63,14),(119,'2025-03-10 11:52:25','','WALKIN','9',NULL,'completed',2,'paid',64,14),(120,'2025-03-10 12:09:02','','WALKIN','9',NULL,'completed',3,'paid',65,14),(121,'2025-03-10 12:12:55','','WALKIN','9',NULL,'completed',4,'paid',66,14),(122,'2025-03-11 07:48:24','','WALKIN','9',NULL,'completed',1,'paid',67,14),(123,'2025-03-11 07:49:10','','WALKIN','9',NULL,'cancelled',2,'pending',NULL,14),(124,'2025-03-11 08:09:10','','WALKIN','9',NULL,'cancelled',3,'pending',NULL,14),(125,'2025-03-11 08:12:28','','WALKIN','9',NULL,'cancelled',4,'pending',NULL,14),(126,'2025-03-11 08:14:58','','WALKIN','9',NULL,'completed',5,'paid',68,14),(127,'2025-03-11 08:45:10','','WALKIN','9',NULL,'completed',6,'paid',69,14),(128,'2025-03-11 08:46:37','','WALKIN','9',NULL,'completed',7,'paid',70,14),(129,'2025-03-11 09:22:52','','WALKIN','9',NULL,'completed',8,'paid',71,14),(130,'2025-03-11 09:24:47','','WALKIN','9',NULL,'completed',9,'paid',72,14),(131,'2025-03-11 09:26:27','','WALKIN','9',NULL,'completed',10,'paid',73,14),(132,'2025-03-11 09:27:33','','WALKIN','9',NULL,'completed',11,'paid',74,14),(133,'2025-03-11 09:28:18','','WALKIN','9',NULL,'completed',12,'paid',75,14),(134,'2025-03-11 09:32:45','','WALKIN','9',NULL,'completed',13,'paid',76,14),(135,'2025-03-11 09:55:58','','WALKIN','9',NULL,'cancelled',14,'pending',NULL,14),(136,'2025-03-11 09:57:12','','WALKIN','9',NULL,'completed',15,'paid',77,14),(137,'2025-03-11 16:06:28','','WALKIN','9',NULL,'completed',16,'paid',78,14),(138,'2025-03-11 16:07:00','','WALKIN','9',NULL,'completed',17,'paid',79,14),(139,'2025-03-13 14:20:32','dinein','WALKIN','9',NULL,'completed',1,'paid',80,14),(140,'2025-03-13 15:09:45','dinein','WALKIN','9',10,'created',2,'pending',NULL,14),(141,'2025-03-13 15:10:11','dinein','WALKIN','9',10,'created',3,'pending',NULL,14),(142,'2025-03-13 15:11:00','dinein','WALKIN','9',17,'created',4,'pending',NULL,14),(143,'2025-03-13 18:01:27','dinein','WALKIN','9',11,'completed',5,'paid',81,14),(144,'2025-03-14 16:01:06','','WALKIN','9',10,'completed',1,'paid',82,14),(145,'2025-03-18 05:31:20','','WALKIN','9',NULL,'created',1,'pending',NULL,14),(146,'2025-03-19 11:36:31','','WALKIN','9',NULL,'created',1,'pending',NULL,14),(147,'2025-03-19 12:06:14','','WALKIN','9',NULL,'completed',2,'paid',83,14),(148,'2025-03-19 12:22:16','','WALKIN','9',NULL,'completed',3,'paid',84,14),(149,'2025-03-20 04:29:11','','WALKIN','9',NULL,'created',1,'pending',NULL,14),(150,'2025-03-20 04:47:19','','WALKIN','9',NULL,'created',2,'pending',NULL,14),(151,'2025-03-20 04:48:27','','WALKIN','9',NULL,'completed',3,'paid',85,14),(152,'2025-03-20 06:56:20','','WALKIN','9',NULL,'completed',4,'paid',86,14),(153,'2025-03-20 06:57:05','','WALKIN','9',NULL,'created',5,'pending',NULL,14),(154,'2025-03-24 07:52:31','','WALKIN','9',NULL,'completed',1,'paid',91,14),(155,'2025-03-24 08:05:34','','WALKIN','9',NULL,'completed',2,'paid',92,14),(156,'2025-03-24 08:05:47','','WALKIN','9',NULL,'completed',3,'paid',87,14),(157,'2025-03-24 08:07:17','','WALKIN','9',NULL,'completed',4,'paid',88,14),(158,'2025-03-24 08:07:38','','WALKIN','9',NULL,'completed',5,'paid',89,14),(159,'2025-03-24 08:11:36','','WALKIN','9',NULL,'completed',6,'paid',93,14),(160,'2025-03-24 08:11:47','','WALKIN','9',NULL,'completed',7,'paid',90,14),(161,'2025-03-24 08:32:15','','WALKIN','9',NULL,'completed',8,'paid',94,14),(162,'2025-03-24 08:42:56','','WALKIN','9',NULL,'completed',9,'paid',95,14),(163,'2025-03-24 10:10:57','takeaway','WALKIN','9',NULL,'cancelled',10,'pending',NULL,14),(164,'2025-03-24 10:54:43','dinein','WALKIN','9',NULL,'completed',11,'paid',97,14),(165,'2025-03-24 12:01:12','takeaway','WALKIN','9',NULL,'completed',12,'paid',96,14),(166,'2025-03-24 12:01:37','delivery','WALKIN','9',11,'completed',13,'paid',99,14),(167,'2025-03-24 12:02:30','takeaway','WALKIN','9',NULL,'completed',14,'paid',100,14),(168,'2025-03-24 12:03:07','dinein','WALKIN','9',NULL,'completed',15,'paid',101,14),(169,'2025-03-24 12:04:26','dinein','WALKIN','9',11,'completed',16,'paid',99,14),(170,'2025-03-24 12:11:08','dinein','WALKIN','9',12,'completed',17,'paid',102,14),(171,'2025-03-24 12:15:15','dinein','CUSTOMER','15',13,'completed',18,'paid',98,14),(172,'2025-03-24 13:04:44','','WALKIN','9',13,'completed',19,'paid',105,14),(173,'2025-03-24 13:08:14','','WALKIN','9',13,'completed',20,'paid',105,14),(174,'2025-03-24 13:22:07','','WALKIN','9',NULL,'completed',21,'paid',104,14),(175,'2025-03-24 13:22:42','','WALKIN','9',NULL,'completed',22,'paid',103,14),(176,'2025-03-24 13:34:00','','WALKIN','9',NULL,'completed',23,'paid',106,14),(177,'2025-03-24 14:24:01','dinein','WALKIN','9',NULL,'completed',24,'paid',108,14),(178,'2025-03-24 15:12:44','dinein','WALKIN','9',10,'completed',25,'paid',107,14),(179,'2025-03-24 15:50:12','','WALKIN','9',NULL,'completed',26,'paid',109,14),(180,'2025-03-24 15:54:41','','WALKIN','9',NULL,'created',27,'paid',110,14),(181,'2025-03-24 18:11:33','dinein','WALKIN','9',NULL,'completed',28,'paid',113,14),(182,'2025-03-24 18:14:14','','WALKIN','9',NULL,'created',29,'pending',NULL,14),(183,'2025-03-24 18:19:06','dinein','WALKIN','9',11,'completed',30,'paid',111,14),(184,'2025-03-24 18:20:15','','WALKIN','9',NULL,'completed',31,'paid',114,14),(185,'2025-03-24 18:22:22','dinein','WALKIN','9',NULL,'completed',32,'paid',117,14),(186,'2025-03-24 18:23:37','delivery','WALKIN','9',15,'completed',33,'paid',115,14),(187,'2025-03-24 19:03:09','dinein','WALKIN','9',10,'completed',34,'paid',116,14),(188,'2025-03-25 14:29:09','dinein','WALKIN','9',10,'completed',1,'paid',116,14),(189,'2025-03-25 16:40:13','dinein','WALKIN','9',10,'completed',2,'paid',116,14),(190,'2025-03-25 17:06:37','dinein','WALKIN','9',10,'completed',3,'paid',118,14),(191,'2025-03-25 17:17:36','dinein','WALKIN','9',10,'completed',4,'paid',120,14),(192,'2025-03-25 17:18:00','dinein','WALKIN','9',10,'completed',5,'paid',120,14),(193,'2025-03-25 17:20:54','dinein','WALKIN','9',12,'completed',6,'paid',121,14),(194,'2025-03-25 17:21:09','dinein','WALKIN','9',15,'completed',7,'paid',119,14),(195,'2025-03-25 17:24:27','dinein','WALKIN','9',10,'completed',8,'paid',120,14),(196,'2025-03-26 09:11:59','dinein','WALKIN','9',16,'completed',1,'paid',122,14),(197,'2025-03-26 12:46:31','delivery','WALKIN','9',NULL,'completed',2,'paid',123,14),(198,'2025-03-26 12:47:50','dinein','WALKIN','9',10,'completed',3,'paid',124,14),(199,'2025-03-26 12:48:19','delivery','WALKIN','9',NULL,'completed',4,'paid',125,14),(200,'2025-03-26 12:48:47','delivery','WALKIN','9',NULL,'completed',5,'paid',126,14),(201,'2025-03-26 13:45:33','delivery','WALKIN','9',NULL,'completed',6,'paid',127,14),(202,'2025-03-26 13:45:57','delivery','WALKIN','9',NULL,'completed',7,'paid',128,14),(203,'2025-03-26 13:47:02','delivery','WALKIN','9',NULL,'completed',8,'paid',129,14),(204,'2025-03-26 13:48:05','takeaway','WALKIN','9',NULL,'completed',9,'paid',130,14),(205,'2025-03-26 13:48:40','delivery','WALKIN','9',NULL,'completed',10,'paid',131,14),(206,'2025-03-26 14:16:20','dinein','WALKIN','9',10,'completed',11,'paid',133,14),(207,'2025-03-26 15:30:27','delivery','WALKIN','9',NULL,'completed',12,'paid',132,14),(208,'2025-03-26 15:31:31','delivery','WALKIN','9',NULL,'completed',13,'paid',134,14),(209,'2025-03-26 16:48:57','delivery','WALKIN','9',NULL,'completed',14,'paid',135,14),(210,'2025-03-26 18:44:41','dinein','WALKIN','9',12,'completed',15,'paid',136,14),(211,'2025-03-26 18:44:52','dinein','WALKIN','9',10,'completed',16,'paid',141,14),(212,'2025-03-26 18:56:35','delivery','WALKIN','9',NULL,'completed',17,'paid',140,14),(213,'2025-03-26 19:10:08','','WALKIN','9',NULL,'completed',18,'paid',137,14),(214,'2025-03-26 19:10:41','','WALKIN','9',NULL,'cancelled',19,'paid',138,14),(215,'2025-03-26 19:11:20','','WALKIN','9',NULL,'completed',20,'paid',139,14),(216,'2025-03-26 19:21:25','delivery','WALKIN','9',NULL,'completed',21,'paid',142,14),(217,'2025-03-26 19:44:23','dinein','WALKIN','9',12,'completed',22,'paid',143,14),(218,'2025-03-26 19:44:34','delivery','WALKIN','9',NULL,'completed',23,'paid',144,14),(219,'2025-03-27 17:23:12','dinein','WALKIN','9',10,'completed',1,'paid',145,14),(220,'2025-03-27 17:23:57','takeaway','WALKIN','9',NULL,'completed',2,'paid',146,14),(221,'2025-03-27 17:32:07','dinein','WALKIN','9',10,'created',3,'pending',NULL,14),(222,'2025-03-27 18:00:32','delivery','WALKIN','9',NULL,'completed',4,'paid',147,14),(223,'2025-03-27 18:03:08','delivery','WALKIN','9',NULL,'completed',5,'paid',148,14),(224,'2025-03-28 11:59:39','dinein','WALKIN','9',11,'completed',1,'paid',149,14),(225,'2025-03-28 12:06:58','dinein','WALKIN','9',15,'completed',2,'paid',150,14),(226,'2025-03-28 12:12:58','dinein','WALKIN','9',10,'created',3,'pending',NULL,14),(227,'2025-03-28 12:18:44','dinein','WALKIN','9',10,'created',4,'pending',NULL,14),(228,'2025-03-28 13:30:52','dinein','WALKIN','9',11,'created',5,'pending',NULL,14),(229,'2025-03-28 15:02:05','dinein','WALKIN','9',12,'created',6,'pending',NULL,14),(230,'2025-03-28 15:02:25','dinein','WALKIN','9',12,'created',7,'pending',NULL,14),(231,'2025-03-28 15:06:23','dinein','WALKIN','9',21,'created',8,'pending',NULL,14),(232,'2025-03-28 15:06:50','dinein','WALKIN','9',21,'created',9,'pending',NULL,14),(233,'2025-04-01 08:28:18','dinein','WALKIN','9',12,'created',1,'pending',NULL,14),(234,'2025-04-01 08:28:38','dinein','WALKIN','9',10,'completed',2,'paid',160,14),(235,'2025-04-01 08:31:25','dinein','WALKIN','9',10,'completed',3,'paid',160,14),(236,'2025-04-01 08:33:10','dinein','WALKIN','9',10,'completed',4,'paid',160,14),(237,'2025-04-01 09:25:44','dinein','WALKIN','9',10,'completed',5,'paid',160,14),(238,'2025-04-01 12:33:38','delivery','WALKIN','9',NULL,'created',6,'pending',NULL,14),(239,'2025-04-01 15:06:03','delivery','WALKIN','9',NULL,'created',7,'pending',NULL,14),(240,'2025-04-01 15:10:34','dinein','WALKIN','9',13,'created',8,'pending',NULL,14),(241,'2025-04-01 15:22:44','dinein','WALKIN','9',12,'created',9,'pending',NULL,14),(242,'2025-04-01 15:23:36','delivery','WALKIN','9',NULL,'created',10,'pending',NULL,14),(243,'2025-04-01 15:24:43','delivery','WALKIN','9',NULL,'created',11,'pending',NULL,14),(244,'2025-04-01 16:04:25','dinein','WALKIN','9',11,'completed',12,'paid',151,14),(245,'2025-04-01 16:37:46','delivery','WALKIN','9',NULL,'created',13,'pending',NULL,14),(246,'2025-04-01 16:46:21','delivery','WALKIN','9',NULL,'created',14,'pending',NULL,14),(247,'2025-04-01 16:53:48','delivery','WALKIN','9',NULL,'created',15,'pending',NULL,14),(248,'2025-04-01 17:00:32','delivery','WALKIN','9',NULL,'created',16,'pending',NULL,14),(249,'2025-04-01 17:00:47','delivery','WALKIN','9',NULL,'created',17,'pending',NULL,14),(250,'2025-04-01 17:02:49','takeaway','WALKIN','9',NULL,'completed',18,'paid',159,14),(251,'2025-04-01 18:35:05','dinein','WALKIN','9',11,'completed',19,'paid',162,14),(252,'2025-04-02 17:45:42','dinein','WALKIN','9',16,'completed',1,'paid',164,14),(253,'2025-04-02 17:48:31','delivery','WALKIN','9',NULL,'completed',2,'paid',165,14),(254,'2025-04-02 17:50:46','dinein','WALKIN','9',13,'completed',3,'paid',166,14),(255,'2025-04-02 17:51:16','dinein','CUSTOMER','16',16,'completed',4,'paid',167,14),(256,'2025-04-02 17:58:01','takeaway','WALKIN','9',NULL,'created',5,'paid',169,14),(257,'2025-04-02 17:59:38','delivery','WALKIN','9',NULL,'created',6,'pending',NULL,14),(258,'2025-04-02 18:00:18','takeaway','WALKIN','9',NULL,'created',7,'paid',171,14),(259,'2025-04-03 14:38:55','dinein','WALKIN','9',21,'completed',1,'paid',179,14),(260,'2025-04-03 14:39:38','dinein','WALKIN','9',16,'completed',2,'paid',180,14),(261,'2025-04-03 14:40:09','dinein','WALKIN','9',17,'completed',3,'paid',173,14),(262,'2025-04-04 07:11:42','delivery','WALKIN','9',NULL,'completed',1,'paid',176,14),(263,'2025-04-04 11:58:22','dinein','CUSTOMER','16',15,'completed',2,'paid',175,14),(264,'2025-04-04 13:21:19','delivery','WALKIN','9',NULL,'cancelled',3,'pending',NULL,14),(265,'2025-04-04 13:23:40','delivery','WALKIN','9',NULL,'completed',4,'paid',177,14),(266,'2025-04-04 13:44:26','delivery','WALKIN','9',NULL,'completed',5,'paid',178,14),(267,'2025-04-04 14:07:33','delivery','WALKIN','9',NULL,'completed',6,'paid',182,14),(268,'2025-04-06 17:41:35','delivery','WALKIN',NULL,NULL,'completed',1,'paid',183,14),(269,'2025-04-07 05:39:03','dinein','WALKIN',NULL,12,'created',1,'pending',NULL,14),(270,'2025-04-07 16:07:10','delivery','WALKIN',NULL,NULL,'completed',2,'paid',184,14),(271,'2025-04-07 16:07:32','delivery','WALKIN',NULL,NULL,'created',3,'pending',NULL,14),(272,'2025-04-07 16:10:40','delivery','WALKIN',NULL,NULL,'created',4,'pending',NULL,14),(273,'2025-04-08 07:25:42','delivery','CUSTOMER',NULL,NULL,'completed',1,'paid',185,14),(274,'2025-04-08 08:00:39','delivery','CUSTOMER',NULL,NULL,'created',2,'pending',NULL,14),(275,'2025-04-08 08:06:32','delivery','CUSTOMER',NULL,NULL,'created',3,'pending',NULL,14),(276,'2025-04-08 08:22:50','delivery','CUSTOMER','5',NULL,'completed',4,'paid',186,14),(277,'2025-04-08 10:41:07','delivery','WALKIN',NULL,NULL,'completed',5,'paid',187,14),(278,'2025-04-08 10:42:59','delivery','WALKIN',NULL,NULL,'completed',6,'paid',188,14),(279,'2025-04-08 10:44:24','delivery','WALKIN',NULL,NULL,'created',7,'pending',NULL,14),(280,'2025-04-08 10:50:40','delivery','WALKIN',NULL,NULL,'completed',8,'paid',191,14),(281,'2025-04-08 10:51:35','delivery','WALKIN',NULL,NULL,'completed',9,'paid',192,14),(282,'2025-04-08 14:33:15','dinein','WALKIN',NULL,16,'created',10,'pending',NULL,14),(283,'2025-04-08 14:33:49','dinein','WALKIN',NULL,16,'created',11,'pending',NULL,14),(284,'2025-04-10 10:02:34','dinein','WALKIN',NULL,11,'completed',1,'paid',194,14),(285,'2025-04-10 10:02:53','delivery','WALKIN',NULL,11,'completed',2,'paid',194,14),(286,'2025-04-10 10:18:21','delivery','WALKIN',NULL,NULL,'completed',3,'paid',198,14),(287,'2025-04-10 10:19:56','dinein','WALKIN',NULL,11,'completed',4,'paid',201,14),(288,'2025-04-10 10:50:12','delivery','WALKIN',NULL,NULL,'cancelled',5,'paid',202,14),(289,'2025-04-10 10:54:28','delivery','WALKIN',NULL,NULL,'completed',6,'paid',203,14),(290,'2025-04-10 11:01:31','dinein','WALKIN',NULL,13,'completed',7,'paid',206,14),(291,'2025-04-10 11:24:20','takeaway','WALKIN',NULL,NULL,'completed',1,'paid',1,18),(292,'2025-04-10 11:29:12','dinein','WALKIN',NULL,22,'completed',2,'paid',7,18),(293,'2025-05-08 09:42:03','dinein','WALKIN',NULL,11,'completed',1,'paid',207,14);
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payment_types`
--

DROP TABLE IF EXISTS `payment_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment_types` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT NULL,
  `icon` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tenant_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `tenant_id` (`tenant_id`),
  CONSTRAINT `payment_types_ibfk_1` FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment_types`
--

LOCK TABLES `payment_types` WRITE;
/*!40000 ALTER TABLE `payment_types` DISABLE KEYS */;
INSERT INTO `payment_types` VALUES (3,'Cash',1,'cash',14),(4,'Card',1,'card',14),(5,'Scanner',1,'qrcode',14),(6,'PAYPAL',0,'paypal',14),(8,'stripe',1,'card',14),(10,'Stripe',1,'card',18),(11,'Card',0,'card',18),(12,'Cash',1,'cash',18);
/*!40000 ALTER TABLE `payment_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `print_settings`
--

DROP TABLE IF EXISTS `print_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `print_settings` (
  `tenant_id` int NOT NULL,
  `page_format` varchar(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `header` varchar(2000) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `footer` varchar(2000) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `show_notes` tinyint(1) DEFAULT NULL,
  `is_enable_print` tinyint(1) DEFAULT NULL,
  `show_store_details` tinyint(1) DEFAULT NULL,
  `show_customer_details` tinyint(1) DEFAULT NULL,
  `print_token` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`tenant_id`),
  CONSTRAINT `ps_tenantid_fk` FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `print_settings`
--

LOCK TABLES `print_settings` WRITE;
/*!40000 ALTER TABLE `print_settings` DISABLE KEYS */;
INSERT INTO `print_settings` VALUES (14,'57','Millers450','DEAL PULSE 360',1,1,1,1,0);
/*!40000 ALTER TABLE `print_settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `qr_order_items`
--

DROP TABLE IF EXISTS `qr_order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `qr_order_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` int DEFAULT NULL,
  `item_id` int DEFAULT NULL,
  `variant_id` int DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `quantity` int DEFAULT NULL,
  `status` enum('created','preparing','completed','cancelled','delivered') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'created',
  `date` datetime DEFAULT CURRENT_TIMESTAMP,
  `notes` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `addons` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `tenant_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `tenant_id` (`tenant_id`),
  CONSTRAINT `tenant_id` FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `qr_order_items`
--

LOCK TABLES `qr_order_items` WRITE;
/*!40000 ALTER TABLE `qr_order_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `qr_order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `qr_orders`
--

DROP TABLE IF EXISTS `qr_orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `qr_orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `date` datetime DEFAULT CURRENT_TIMESTAMP,
  `delivery_type` varchar(90) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `customer_type` enum('WALKIN','CUSTOMER') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'WALKIN',
  `customer_id` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `table_id` int DEFAULT NULL,
  `status` enum('created','completed','cancelled') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'created',
  `payment_status` enum('pending','paid') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `tenant_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `tenant_id` (`tenant_id`),
  CONSTRAINT `tenantId` FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `qr_orders`
--

LOCK TABLES `qr_orders` WRITE;
/*!40000 ALTER TABLE `qr_orders` DISABLE KEYS */;
/*!40000 ALTER TABLE `qr_orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `refresh_tokens`
--

DROP TABLE IF EXISTS `refresh_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `refresh_tokens` (
  `username` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `refresh_token` text COLLATE utf8mb4_unicode_ci,
  `device_ip` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `device_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `device_location` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `expiry` datetime DEFAULT NULL,
  `device_id` int NOT NULL AUTO_INCREMENT,
  `tenant_id` int DEFAULT NULL,
  PRIMARY KEY (`device_id`,`username`),
  UNIQUE KEY `device_id` (`device_id`),
  KEY `tenant_id` (`tenant_id`),
  CONSTRAINT `refresh_tokens_ibfk_1` FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=589 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `refresh_tokens`
--

LOCK TABLES `refresh_tokens` WRITE;
/*!40000 ALTER TABLE `refresh_tokens` DISABLE KEYS */;
INSERT INTO `refresh_tokens` VALUES ('superadmin@salespulse.com','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InN1cGVyYWRtaW5Ac2FsZXNwdWxzZS5jb20iLCJuYW1lIjoiU3VwZXJhZG1pbiIsInJvbGUiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzMyNzc3NDM0LCJleHAiOjE3MzUzNjk0MzQsImlzcyI6ImxvY2FsaG9zdCJ9.gs3p-Pm0p7SQlDT9F8y39BgCYgy2Zk9_wQPdUgH3qkc','::ffff:117.208.205.108','Microsoft Windows\nBrowser: Chrome',NULL,'2024-11-28 07:03:54','2024-12-28 07:03:55',69,NULL),('superadmin@salespulse.com','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InN1cGVyYWRtaW5Ac2FsZXNwdWxzZS5jb20iLCJuYW1lIjoiU3VwZXJhZG1pbiIsInJvbGUiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzMyNzc3NjA3LCJleHAiOjE3MzUzNjk2MDcsImlzcyI6ImxvY2FsaG9zdCJ9.m4xDUkeDy4NwiRAAijVjADaxEeyfdIouhIyoMnL_eRc','::ffff:117.204.39.47','Microsoft Windows\nBrowser: Chrome',NULL,'2024-11-28 07:06:47','2024-12-28 07:06:47',70,NULL),('superadmin@salespulse.com','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InN1cGVyYWRtaW5Ac2FsZXNwdWxzZS5jb20iLCJuYW1lIjoiU3VwZXJhZG1pbiIsInJvbGUiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzMyNzc3Nzg1LCJleHAiOjE3MzUzNjk3ODUsImlzcyI6ImxvY2FsaG9zdCJ9.i9t2xHHFXUn96lHJlR1JeNXczbSnKxw_qy_rebIx6C8','::ffff:117.204.39.47','Microsoft Windows\nBrowser: Chrome',NULL,'2024-11-28 07:09:45','2024-12-28 07:09:45',71,NULL),('superadmin@salespulse.com','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InN1cGVyYWRtaW5Ac2FsZXNwdWxzZS5jb20iLCJuYW1lIjoiU3VwZXJhZG1pbiIsInJvbGUiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzMyNzc3OTE4LCJleHAiOjE3MzUzNjk5MTgsImlzcyI6ImxvY2FsaG9zdCJ9.3OYasZ-YRBEtUAGpdWtZdX2mtPAxQl4APTPZj--oMCE','::ffff:117.204.39.47','unknown\nBrowser: unknown',NULL,'2024-11-28 07:11:58','2024-12-28 07:11:59',72,NULL),('superadmin@salespulse.com','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InN1cGVyYWRtaW5Ac2FsZXNwdWxzZS5jb20iLCJuYW1lIjoiU3VwZXJhZG1pbiIsInJvbGUiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzMyODAzODA3LCJleHAiOjE3MzUzOTU4MDcsImlzcyI6IjEyNy4wLjAuMSJ9.wInRVEH27u0ssLNkA29RYIW82RxJdaGfeYrlYbi7rsg','::ffff:61.1.142.1','Microsoft Windows\nBrowser: Chrome',NULL,'2024-11-28 14:23:27','2024-12-28 14:23:28',85,NULL),('superadmin@salespulse.com','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InN1cGVyYWRtaW5Ac2FsZXNwdWxzZS5jb20iLCJuYW1lIjoiU3VwZXJhZG1pbiIsInJvbGUiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzMyODAzOTI1LCJleHAiOjE3MzUzOTU5MjUsImlzcyI6IjEzLjUzLjEyMi43OSJ9.pCMkrDTkUTfOtI-DdnJCGfSAYUSIbt_68gFMgKQup-U','::ffff:61.1.142.1','Microsoft Windows\nBrowser: Chrome',NULL,'2024-11-28 14:25:25','2024-12-28 14:25:26',86,NULL),('superadmin@salespulse.com','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InN1cGVyYWRtaW5Ac2FsZXNwdWxzZS5jb20iLCJuYW1lIjoiU3VwZXJhZG1pbiIsInJvbGUiOiJzdXBlcmFkbWluIiwiaWF0IjoxNzMyODA4ODQ0LCJleHAiOjE3MzU0MDA4NDQsImlzcyI6Imh0dHA6Ly8xMy41MS4xNzMuMTM3In0.r4TkPO4v-QkW3gGABglST3sEDEWHtJ6sUh6DpDQ8Mto','::ffff:61.1.142.1','Microsoft Windows\nBrowser: Chrome',NULL,'2024-11-28 15:47:24','2024-12-28 15:47:25',87,NULL),('palanikumar0073@gmail.com','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5hbnRfaWQiOjE0LCJ1c2VybmFtZSI6InBhbGFuaWt1bWFyMDA3M0BnbWFpbC5jb20iLCJuYW1lIjoiUGFsYW5pIiwicm9sZSI6InVzZXIiLCJzY29wZSI6IkRBU0hCT0FSRCxQT1MsQ1VTVE9NRVJfRElTUExBWSxLSVRDSEVOX0RJU1BMQVksT1JERVJfU1RBVFVTX0RJU1BMQVksT1JERVJfU1RBVFVTLE9SREVSUyxLSVRDSEVOLFJFU0VSVkFUSU9OUyxWSUVXX1JFU0VSVkFUSU9OUyxNQU5BR0VfUkVTRVJWQVRJT05TLENVU1RPTUVSUyxWSUVXX0NVU1RPTUVSUyxNQU5BR0VfQ1VTVE9NRVJTLElOVk9JQ0VTLE1FTUJFUlNISVAsSU5WRU5UT1JZLFZJRVdfSU5WRU5UT1JZLE1BTkFHRV9JTlZFTlRPUlksU0VUVElOR1MsRkVFREJBQ0ssUkVQT1JUUyIsImlzX2FjdGl2ZSI6MSwiaWF0IjoxNzQxNjI1NjAxLCJleHAiOjE3NDQyMTc2MDEsImlzcyI6IjIwLjE5My4xMjguMTQ2In0.WKruk0VYUgqQ-HQsX8mbZ2ICzAXpGxhOdf3ZdksQcJ4','::ffff:49.43.217.16','Linux\nBrowser: Chrome','','2025-03-10 16:53:21','2025-04-09 16:53:21',295,14),('palanikumar0073@gmail.com','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5hbnRfaWQiOjE0LCJ1c2VybmFtZSI6InBhbGFuaWt1bWFyMDA3M0BnbWFpbC5jb20iLCJuYW1lIjoiUGFsYW5pIiwicm9sZSI6InVzZXIiLCJzY29wZSI6IkRBU0hCT0FSRCxQT1MsQ1VTVE9NRVJfRElTUExBWSxLSVRDSEVOX0RJU1BMQVksT1JERVJfU1RBVFVTX0RJU1BMQVksT1JERVJfU1RBVFVTLE9SREVSUyxLSVRDSEVOLFJFU0VSVkFUSU9OUyxWSUVXX1JFU0VSVkFUSU9OUyxNQU5BR0VfUkVTRVJWQVRJT05TLENVU1RPTUVSUyxWSUVXX0NVU1RPTUVSUyxNQU5BR0VfQ1VTVE9NRVJTLElOVk9JQ0VTLE1FTUJFUlNISVAsSU5WRU5UT1JZLFZJRVdfSU5WRU5UT1JZLE1BTkFHRV9JTlZFTlRPUlksU0VUVElOR1MsRkVFREJBQ0ssUkVQT1JUUyIsImlzX2FjdGl2ZSI6MSwiaWF0IjoxNzQyODAyNzE0LCJleHAiOjE3NDUzOTQ3MTQsImlzcyI6IjIwLjE5My4xMjguMTQ2In0.QerSUZ9K2RbaLuzXMqTiOtgqWWr7kVwCklGJHWDW8Rw','::ffff:49.43.219.127','Linux\nBrowser: Chrome','','2025-03-24 07:51:54','2025-04-23 07:51:54',336,14),('palanikumar0073@gmail.com','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5hbnRfaWQiOjE0LCJ1c2VybmFtZSI6InBhbGFuaWt1bWFyMDA3M0BnbWFpbC5jb20iLCJuYW1lIjoiUGFsYW5pIiwicm9sZSI6InVzZXIiLCJzY29wZSI6IkRBU0hCT0FSRCxQT1MsQ1VTVE9NRVJfRElTUExBWSxLSVRDSEVOX0RJU1BMQVksT1JERVJfU1RBVFVTX0RJU1BMQVksT1JERVJfU1RBVFVTLE9SREVSUyxLSVRDSEVOLFJFU0VSVkFUSU9OUyxWSUVXX1JFU0VSVkFUSU9OUyxNQU5BR0VfUkVTRVJWQVRJT05TLENVU1RPTUVSUyxWSUVXX0NVU1RPTUVSUyxNQU5BR0VfQ1VTVE9NRVJTLElOVk9JQ0VTLE1FTUJFUlNISVAsSU5WRU5UT1JZLFZJRVdfSU5WRU5UT1JZLE1BTkFHRV9JTlZFTlRPUlksU0VUVElOR1MsRkVFREJBQ0ssUkVQT1JUUyIsImlzX2FjdGl2ZSI6MSwiaWF0IjoxNzQyODA0Njk4LCJleHAiOjE3NDUzOTY2OTgsImlzcyI6IjIwLjE5My4xMjguMTQ2In0.qOOzfOsyHO0WrB4jqHVnlRWI1jdpyNaW8oBq3WkABo0','::ffff:49.43.219.127','Linux\nBrowser: Chrome','','2025-03-24 08:24:58','2025-04-23 08:24:58',339,14),('swethasri_pavuluri@uvaproit.com','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5hbnRfaWQiOjE0LCJ1c2VybmFtZSI6InN3ZXRoYXNyaV9wYXZ1bHVyaUB1dmFwcm9pdC5jb20iLCJuYW1lIjoiU3dldGhhIFBhdnVsdXJpIiwicm9sZSI6InVzZXIiLCJzY29wZSI6IkRBU0hCT0FSRCxQT1MsQ1VTVE9NRVJfRElTUExBWSxLSVRDSEVOX0RJU1BMQVksT1JERVJfU1RBVFVTX0RJU1BMQVksT1JERVJfU1RBVFVTLE9SREVSUyxLSVRDSEVOLFJFU0VSVkFUSU9OUyxWSUVXX1JFU0VSVkFUSU9OUyxNQU5BR0VfUkVTRVJWQVRJT05TLENVU1RPTUVSUyxWSUVXX0NVU1RPTUVSUyxNQU5BR0VfQ1VTVE9NRVJTLElOVk9JQ0VTLE1FTUJFUlNISVAsSU5WRU5UT1JZLFZJRVdfSU5WRU5UT1JZLE1BTkFHRV9JTlZFTlRPUlksU0VUVElOR1MsRkVFREJBQ0ssUkVQT1JUUyIsImlzX2FjdGl2ZSI6MSwiaWF0IjoxNzQyODE3NjI1LCJleHAiOjE3NDU0MDk2MjUsImlzcyI6IjIwLjE5My4xMjguMTQ2In0.6TUJ5eS5wpomiO1lA7u0eeGUnLfSUbwpjdBubVHJvT8','::ffff:183.83.172.201','Apple Mac\nBrowser: Chrome','','2025-03-24 12:00:25','2025-04-23 12:00:26',349,14),('swethasri_pavuluri@uvaproit.com','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5hbnRfaWQiOjE0LCJ1c2VybmFtZSI6InN3ZXRoYXNyaV9wYXZ1bHVyaUB1dmFwcm9pdC5jb20iLCJuYW1lIjoiU3dldGhhIFBhdnVsdXJpIiwicm9sZSI6InVzZXIiLCJzY29wZSI6IkRBU0hCT0FSRCxQT1MsQ1VTVE9NRVJfRElTUExBWSxLSVRDSEVOX0RJU1BMQVksT1JERVJfU1RBVFVTX0RJU1BMQVksT1JERVJfU1RBVFVTLE9SREVSUyxLSVRDSEVOLFJFU0VSVkFUSU9OUyxWSUVXX1JFU0VSVkFUSU9OUyxNQU5BR0VfUkVTRVJWQVRJT05TLENVU1RPTUVSUyxWSUVXX0NVU1RPTUVSUyxNQU5BR0VfQ1VTVE9NRVJTLElOVk9JQ0VTLE1FTUJFUlNISVAsSU5WRU5UT1JZLFZJRVdfSU5WRU5UT1JZLE1BTkFHRV9JTlZFTlRPUlksU0VUVElOR1MsRkVFREJBQ0ssUkVQT1JUUyIsImlzX2FjdGl2ZSI6MSwiaWF0IjoxNzQyODIzNTIxLCJleHAiOjE3NDU0MTU1MjEsImlzcyI6IjIwLjE5My4xMjguMTQ2In0.kcLuDC4fqKDjML9DIRvNfzpGm41GbcD3g4xOC6wbzbA','::ffff:183.83.172.201','Apple Mac\nBrowser: Chrome','','2025-03-24 13:38:41','2025-04-23 13:38:41',354,14),('palanikumar0073@gmail.com','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5hbnRfaWQiOjE0LCJ1c2VybmFtZSI6InBhbGFuaWt1bWFyMDA3M0BnbWFpbC5jb20iLCJuYW1lIjoiUGFsYW5pIiwicm9sZSI6InVzZXIiLCJzY29wZSI6IkRBU0hCT0FSRCxQT1MsQ1VTVE9NRVJfRElTUExBWSxLSVRDSEVOX0RJU1BMQVksT1JERVJfU1RBVFVTX0RJU1BMQVksT1JERVJfU1RBVFVTLE9SREVSUyxLSVRDSEVOLFJFU0VSVkFUSU9OUyxWSUVXX1JFU0VSVkFUSU9OUyxNQU5BR0VfUkVTRVJWQVRJT05TLENVU1RPTUVSUyxWSUVXX0NVU1RPTUVSUyxNQU5BR0VfQ1VTVE9NRVJTLElOVk9JQ0VTLE1FTUJFUlNISVAsSU5WRU5UT1JZLFZJRVdfSU5WRU5UT1JZLE1BTkFHRV9JTlZFTlRPUlksU0VUVElOR1MsRkVFREJBQ0ssUkVQT1JUUyIsImlzX2FjdGl2ZSI6MSwiaWF0IjoxNzQyODMxMTM2LCJleHAiOjE3NDU0MjMxMzYsImlzcyI6IjIwLjE5My4xMjguMTQ2In0.M25poaeeZH9h8AtfZorO6LOuCsbtFtxuRkjA_MZRWSA','::ffff:49.43.219.127','Linux\nBrowser: Chrome','','2025-03-24 15:45:36','2025-04-23 15:45:36',368,14),('palanikumar0073@gmail.com','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5hbnRfaWQiOjE0LCJ1c2VybmFtZSI6InBhbGFuaWt1bWFyMDA3M0BnbWFpbC5jb20iLCJuYW1lIjoiUGFsYW5pIiwicm9sZSI6InVzZXIiLCJzY29wZSI6IkRBU0hCT0FSRCxQT1MsQ1VTVE9NRVJfRElTUExBWSxLSVRDSEVOX0RJU1BMQVksT1JERVJfU1RBVFVTX0RJU1BMQVksT1JERVJfU1RBVFVTLE9SREVSUyxLSVRDSEVOLFJFU0VSVkFUSU9OUyxWSUVXX1JFU0VSVkFUSU9OUyxNQU5BR0VfUkVTRVJWQVRJT05TLENVU1RPTUVSUyxWSUVXX0NVU1RPTUVSUyxNQU5BR0VfQ1VTVE9NRVJTLElOVk9JQ0VTLE1FTUJFUlNISVAsSU5WRU5UT1JZLFZJRVdfSU5WRU5UT1JZLE1BTkFHRV9JTlZFTlRPUlksU0VUVElOR1MsRkVFREJBQ0ssUkVQT1JUUyIsImlzX2FjdGl2ZSI6MSwiaWF0IjoxNzQyODM3MTM5LCJleHAiOjE3NDU0MjkxMzksImlzcyI6IjIwLjE5My4xMjguMTQ2In0.txS-ARsUp9NwctuYLozBQRcn3zznxFTcJNFhlMnvB8c','::ffff:49.43.219.127','Linux\nBrowser: Chrome','','2025-03-24 17:25:39','2025-04-23 17:25:40',369,14),('palanikumar0073@gmail.com','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5hbnRfaWQiOjE0LCJ1c2VybmFtZSI6InBhbGFuaWt1bWFyMDA3M0BnbWFpbC5jb20iLCJuYW1lIjoiUGFsYW5pIiwicm9sZSI6InVzZXIiLCJzY29wZSI6IkRBU0hCT0FSRCxQT1MsQ1VTVE9NRVJfRElTUExBWSxLSVRDSEVOX0RJU1BMQVksT1JERVJfU1RBVFVTX0RJU1BMQVksT1JERVJfU1RBVFVTLE9SREVSUyxLSVRDSEVOLFJFU0VSVkFUSU9OUyxWSUVXX1JFU0VSVkFUSU9OUyxNQU5BR0VfUkVTRVJWQVRJT05TLENVU1RPTUVSUyxWSUVXX0NVU1RPTUVSUyxNQU5BR0VfQ1VTVE9NRVJTLElOVk9JQ0VTLE1FTUJFUlNISVAsSU5WRU5UT1JZLFZJRVdfSU5WRU5UT1JZLE1BTkFHRV9JTlZFTlRPUlksU0VUVElOR1MsRkVFREJBQ0ssUkVQT1JUUyIsImlzX2FjdGl2ZSI6MSwiaWF0IjoxNzQyODM4Njk0LCJleHAiOjE3NDU0MzA2OTQsImlzcyI6IjIwLjE5My4xMjguMTQ2In0.uzaawS53LTcDwMYN88LV0NxFASWQ4Ze-FIbOndWSjZA','::ffff:49.43.219.127','Linux\nBrowser: Chrome','','2025-03-24 17:51:34','2025-04-23 17:51:34',378,14),('palanikumar0073@gmail.com','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5hbnRfaWQiOjE0LCJ1c2VybmFtZSI6InBhbGFuaWt1bWFyMDA3M0BnbWFpbC5jb20iLCJuYW1lIjoiUGFsYW5pIiwicm9sZSI6InVzZXIiLCJzY29wZSI6IkRBU0hCT0FSRCxQT1MsQ1VTVE9NRVJfRElTUExBWSxLSVRDSEVOX0RJU1BMQVksT1JERVJfU1RBVFVTX0RJU1BMQVksT1JERVJfU1RBVFVTLE9SREVSUyxLSVRDSEVOLFJFU0VSVkFUSU9OUyxWSUVXX1JFU0VSVkFUSU9OUyxNQU5BR0VfUkVTRVJWQVRJT05TLENVU1RPTUVSUyxWSUVXX0NVU1RPTUVSUyxNQU5BR0VfQ1VTVE9NRVJTLElOVk9JQ0VTLE1FTUJFUlNISVAsSU5WRU5UT1JZLFZJRVdfSU5WRU5UT1JZLE1BTkFHRV9JTlZFTlRPUlksU0VUVElOR1MsRkVFREJBQ0ssUkVQT1JUUyIsImlzX2FjdGl2ZSI6MSwiaWF0IjoxNzQyODM5NTU1LCJleHAiOjE3NDU0MzE1NTUsImlzcyI6IjIwLjE5My4xMjguMTQ2In0.9etE4jHYtQdEqyg-RtP-niDRf9mKvIMPXsU1A3r8LiA','::ffff:49.43.219.127','Linux\nBrowser: Chrome','','2025-03-24 18:05:55','2025-04-23 18:05:55',379,14),('sai_bhavana@uvaproit.com','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5hbnRfaWQiOjE0LCJ1c2VybmFtZSI6InNhaV9iaGF2YW5hQHV2YXByb2l0LmNvbSIsIm5hbWUiOiJTYWkgQmhhdmFuYSBTYW1hbnR1bGEiLCJyb2xlIjoidXNlciIsInNjb3BlIjoiS0lUQ0hFTixSRVNFUlZBVElPTlMsSU5WRU5UT1JZLElOVk9JQ0VTLFJFUE9SVFMsREFTSEJPQVJELFBPUyxDVVNUT01FUl9ESVNQTEFZLEtJVENIRU5fRElTUExBWSxPUkRFUl9TVEFUVVMsT1JERVJfU1RBVFVTX0RJU1BMQVksT1JERVJTLFZJRVdfUkVTRVJWQVRJT05TLENVU1RPTUVSUyxNQU5BR0VfUkVTRVJWQVRJT05TLFZJRVdfQ1VTVE9NRVJTLE1BTkFHRV9DVVNUT01FUlMsTUVNQkVSU0hJUCxWSUVXX0lOVkVOVE9SWSxNQU5BR0VfSU5WRU5UT1JZLFNFVFRJTkdTLEZFRURCQUNLIiwiaXNfYWN0aXZlIjoxLCJpYXQiOjE3NDI4NDAyMDIsImV4cCI6MTc0NTQzMjIwMiwiaXNzIjoiMjAuMTkzLjEyOC4xNDYifQ.-AprfVjbw8nBzgOfO_N5ok-ttllyN1Y5Ty3xFJhqo8I','::ffff:82.5.90.66','Apple Mac\nBrowser: Chrome','','2025-03-24 18:16:42','2025-04-23 18:16:42',382,14),('palanikumar0073@gmail.com','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5hbnRfaWQiOjE0LCJ1c2VybmFtZSI6InBhbGFuaWt1bWFyMDA3M0BnbWFpbC5jb20iLCJuYW1lIjoiUGFsYW5pIiwicm9sZSI6InVzZXIiLCJzY29wZSI6IkRBU0hCT0FSRCxQT1MsQ1VTVE9NRVJfRElTUExBWSxLSVRDSEVOX0RJU1BMQVksT1JERVJfU1RBVFVTX0RJU1BMQVksT1JERVJfU1RBVFVTLE9SREVSUyxLSVRDSEVOLFJFU0VSVkFUSU9OUyxWSUVXX1JFU0VSVkFUSU9OUyxNQU5BR0VfUkVTRVJWQVRJT05TLENVU1RPTUVSUyxWSUVXX0NVU1RPTUVSUyxNQU5BR0VfQ1VTVE9NRVJTLElOVk9JQ0VTLE1FTUJFUlNISVAsSU5WRU5UT1JZLFZJRVdfSU5WRU5UT1JZLE1BTkFHRV9JTlZFTlRPUlksU0VUVElOR1MsRkVFREJBQ0ssUkVQT1JUUyIsImlzX2FjdGl2ZSI6MSwiaWF0IjoxNzQyODQzNDExLCJleHAiOjE3NDU0MzU0MTEsImlzcyI6IjIwLjE5My4xMjguMTQ2In0.dTpnIb6K_A0KvSKBjgEOHQRmOlwpCfS3rW8omcVrgDU','::ffff:49.43.219.127','Linux\nBrowser: Chrome','','2025-03-24 19:10:11','2025-04-23 19:10:12',386,14),('sai_bhavana@uvaproit.com','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5hbnRfaWQiOjE0LCJ1c2VybmFtZSI6InNhaV9iaGF2YW5hQHV2YXByb2l0LmNvbSIsIm5hbWUiOiJTYWkgQmhhdmFuYSBTYW1hbnR1bGEiLCJyb2xlIjoidXNlciIsInNjb3BlIjoiS0lUQ0hFTixSRVNFUlZBVElPTlMsSU5WRU5UT1JZLElOVk9JQ0VTLFJFUE9SVFMsREFTSEJPQVJELFBPUyxDVVNUT01FUl9ESVNQTEFZLEtJVENIRU5fRElTUExBWSxPUkRFUl9TVEFUVVMsT1JERVJfU1RBVFVTX0RJU1BMQVksT1JERVJTLFZJRVdfUkVTRVJWQVRJT05TLENVU1RPTUVSUyxNQU5BR0VfUkVTRVJWQVRJT05TLFZJRVdfQ1VTVE9NRVJTLE1BTkFHRV9DVVNUT01FUlMsTUVNQkVSU0hJUCxWSUVXX0lOVkVOVE9SWSxNQU5BR0VfSU5WRU5UT1JZLFNFVFRJTkdTLEZFRURCQUNLIiwiaXNfYWN0aXZlIjoxLCJpYXQiOjE3NDI5OTAwMTAsImV4cCI6MTc0NTU4MjAxMCwiaXNzIjoiMjAuMTkzLjEyOC4xNDYifQ.Azssp6G3QytWktK9OegPbei1prswWTXOPWGJTI4oQ7o','::ffff:82.5.90.66','Apple Mac\nBrowser: Chrome','','2025-03-26 11:53:30','2025-04-25 11:53:31',412,14),('swethasri_pavuluri@uvaproit.com','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5hbnRfaWQiOjE0LCJ1c2VybmFtZSI6InN3ZXRoYXNyaV9wYXZ1bHVyaUB1dmFwcm9pdC5jb20iLCJuYW1lIjoiU3dldGhhIFBhdnVsdXJpIiwicm9sZSI6InVzZXIiLCJzY29wZSI6IkRBU0hCT0FSRCxQT1MsQ1VTVE9NRVJfRElTUExBWSxLSVRDSEVOX0RJU1BMQVksT1JERVJfU1RBVFVTX0RJU1BMQVksT1JERVJfU1RBVFVTLE9SREVSUyxLSVRDSEVOLFJFU0VSVkFUSU9OUyxWSUVXX1JFU0VSVkFUSU9OUyxNQU5BR0VfUkVTRVJWQVRJT05TLENVU1RPTUVSUyxWSUVXX0NVU1RPTUVSUyxNQU5BR0VfQ1VTVE9NRVJTLElOVk9JQ0VTLE1FTUJFUlNISVAsSU5WRU5UT1JZLFZJRVdfSU5WRU5UT1JZLE1BTkFHRV9JTlZFTlRPUlksU0VUVElOR1MsRkVFREJBQ0ssUkVQT1JUUyIsImlzX2FjdGl2ZSI6MSwiaWF0IjoxNzQyOTkyODEwLCJleHAiOjE3NDU1ODQ4MTAsImlzcyI6IjIwLjE5My4xMjguMTQ2In0.C7GeDGPS9lff5XZKtPwB_JxWDSs5mi3p5o8ukDUbuTI','::ffff:183.83.172.201','Apple Mac\nBrowser: Chrome','','2025-03-26 12:40:10','2025-04-25 12:40:10',413,14),('sai_bhavana@uvaproit.com','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5hbnRfaWQiOjE0LCJ1c2VybmFtZSI6InNhaV9iaGF2YW5hQHV2YXByb2l0LmNvbSIsIm5hbWUiOiJTYWkgQmhhdmFuYSBTYW1hbnR1bGEiLCJyb2xlIjoidXNlciIsInNjb3BlIjoiS0lUQ0hFTixSRVNFUlZBVElPTlMsSU5WRU5UT1JZLElOVk9JQ0VTLFJFUE9SVFMsREFTSEJPQVJELFBPUyxDVVNUT01FUl9ESVNQTEFZLEtJVENIRU5fRElTUExBWSxPUkRFUl9TVEFUVVMsT1JERVJfU1RBVFVTX0RJU1BMQVksT1JERVJTLFZJRVdfUkVTRVJWQVRJT05TLENVU1RPTUVSUyxNQU5BR0VfUkVTRVJWQVRJT05TLFZJRVdfQ1VTVE9NRVJTLE1BTkFHRV9DVVNUT01FUlMsTUVNQkVSU0hJUCxWSUVXX0lOVkVOVE9SWSxNQU5BR0VfSU5WRU5UT1JZLFNFVFRJTkdTLEZFRURCQUNLIiwiaXNfYWN0aXZlIjoxLCJpYXQiOjE3NDI5OTUxMDgsImV4cCI6MTc0NTU4NzEwOCwiaXNzIjoiMjAuMTkzLjEyOC4xNDYifQ.P3dszVX3uUszOMwjSLmz2n04oAl_PuR-JBoABbA2vDo','::ffff:82.5.90.66','Apple Mac\nBrowser: Chrome','','2025-03-26 13:18:28','2025-04-25 13:18:28',414,14),('palanikumar0073@gmail.com','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5hbnRfaWQiOjE0LCJ1c2VybmFtZSI6InBhbGFuaWt1bWFyMDA3M0BnbWFpbC5jb20iLCJuYW1lIjoiUGFsYW5pIiwicm9sZSI6InVzZXIiLCJzY29wZSI6IkRBU0hCT0FSRCxQT1MsQ1VTVE9NRVJfRElTUExBWSxLSVRDSEVOX0RJU1BMQVksT1JERVJfU1RBVFVTX0RJU1BMQVksT1JERVJfU1RBVFVTLE9SREVSUyxLSVRDSEVOLFJFU0VSVkFUSU9OUyxWSUVXX1JFU0VSVkFUSU9OUyxNQU5BR0VfUkVTRVJWQVRJT05TLENVU1RPTUVSUyxWSUVXX0NVU1RPTUVSUyxNQU5BR0VfQ1VTVE9NRVJTLElOVk9JQ0VTLE1FTUJFUlNISVAsSU5WRU5UT1JZLFZJRVdfSU5WRU5UT1JZLE1BTkFHRV9JTlZFTlRPUlksU0VUVElOR1MsRkVFREJBQ0ssUkVQT1JUUyIsImlzX2FjdGl2ZSI6MSwiaWF0IjoxNzQyOTk1Mjc0LCJleHAiOjE3NDU1ODcyNzQsImlzcyI6IjIwLjE5My4xMjguMTQ2In0.CIkBbgMz_lgWADXnQ5dgS_rHr-EEUAJZhsi8JZ5af0E','::ffff:49.43.218.34','Linux\nBrowser: Chrome','','2025-03-26 13:21:14','2025-04-25 13:21:15',415,14),('swethasri_pavuluri@uvaproit.com','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5hbnRfaWQiOjE0LCJ1c2VybmFtZSI6InN3ZXRoYXNyaV9wYXZ1bHVyaUB1dmFwcm9pdC5jb20iLCJuYW1lIjoiU3dldGhhIFBhdnVsdXJpIiwicm9sZSI6InVzZXIiLCJzY29wZSI6IkRBU0hCT0FSRCxQT1MsQ1VTVE9NRVJfRElTUExBWSxLSVRDSEVOX0RJU1BMQVksT1JERVJfU1RBVFVTX0RJU1BMQVksT1JERVJfU1RBVFVTLE9SREVSUyxLSVRDSEVOLFJFU0VSVkFUSU9OUyxWSUVXX1JFU0VSVkFUSU9OUyxNQU5BR0VfUkVTRVJWQVRJT05TLENVU1RPTUVSUyxWSUVXX0NVU1RPTUVSUyxNQU5BR0VfQ1VTVE9NRVJTLElOVk9JQ0VTLE1FTUJFUlNISVAsSU5WRU5UT1JZLFZJRVdfSU5WRU5UT1JZLE1BTkFHRV9JTlZFTlRPUlksU0VUVElOR1MsRkVFREJBQ0ssUkVQT1JUUyIsImlzX2FjdGl2ZSI6MSwiaWF0IjoxNzQyOTk1MzA1LCJleHAiOjE3NDU1ODczMDUsImlzcyI6IjIwLjE5My4xMjguMTQ2In0.JpfFI7DXg-eJtst4mLS4FcN4WChzzzTm_JBeBPlhThI','::ffff:183.83.172.201','Apple Mac\nBrowser: Chrome','','2025-03-26 13:21:45','2025-04-25 13:21:45',416,14),('sai_bhavana@uvaproit.com','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5hbnRfaWQiOjE0LCJ1c2VybmFtZSI6InNhaV9iaGF2YW5hQHV2YXByb2l0LmNvbSIsIm5hbWUiOiJTYWkgQmhhdmFuYSBTYW1hbnR1bGEiLCJyb2xlIjoidXNlciIsInNjb3BlIjoiS0lUQ0hFTixSRVNFUlZBVElPTlMsSU5WRU5UT1JZLElOVk9JQ0VTLFJFUE9SVFMsREFTSEJPQVJELFBPUyxDVVNUT01FUl9ESVNQTEFZLEtJVENIRU5fRElTUExBWSxPUkRFUl9TVEFUVVMsT1JERVJfU1RBVFVTX0RJU1BMQVksT1JERVJTLFZJRVdfUkVTRVJWQVRJT05TLENVU1RPTUVSUyxNQU5BR0VfUkVTRVJWQVRJT05TLFZJRVdfQ1VTVE9NRVJTLE1BTkFHRV9DVVNUT01FUlMsTUVNQkVSU0hJUCxWSUVXX0lOVkVOVE9SWSxNQU5BR0VfSU5WRU5UT1JZLFNFVFRJTkdTLEZFRURCQUNLIiwiaXNfYWN0aXZlIjoxLCJpYXQiOjE3NDI5OTg5MDAsImV4cCI6MTc0NTU5MDkwMCwiaXNzIjoiMjAuMTkzLjEyOC4xNDYifQ.6nOuBoM6ahrh5eEJFwudI7C3IA3bTw_VIxVhe2d9b6k','::ffff:82.5.90.66','Apple Mac\nBrowser: Chrome','','2025-03-26 14:21:40','2025-04-25 14:21:40',423,14),('ushaswini_mupparapu@uvaproit.com','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5hbnRfaWQiOjE0LCJ1c2VybmFtZSI6InVzaGFzd2luaV9tdXBwYXJhcHVAdXZhcHJvaXQuY29tIiwibmFtZSI6IlVzaGFzd2luaSBWZXJtYSIsInJvbGUiOiJ1c2VyIiwic2NvcGUiOiJEQVNIQk9BUkQsUE9TLENVU1RPTUVSX0RJU1BMQVksS0lUQ0hFTl9ESVNQTEFZLE9SREVSX1NUQVRVU19ESVNQTEFZLE9SREVSX1NUQVRVUyxPUkRFUlMsS0lUQ0hFTixSRVNFUlZBVElPTlMsVklFV19SRVNFUlZBVElPTlMsTUFOQUdFX1JFU0VSVkFUSU9OUyxDVVNUT01FUlMsVklFV19DVVNUT01FUlMsTUFOQUdFX0NVU1RPTUVSUyxJTlZPSUNFUyxNRU1CRVJTSElQLElOVkVOVE9SWSxWSUVXX0lOVkVOVE9SWSxNQU5BR0VfSU5WRU5UT1JZLFNFVFRJTkdTLEZFRURCQUNLLFJFUE9SVFMiLCJpc19hY3RpdmUiOjEsImlhdCI6MTc0MzAwNzM3MywiZXhwIjoxNzQ1NTk5MzczLCJpc3MiOiIyMC4xOTMuMTI4LjE0NiJ9.lcWvBT3K7CRZBSuTCN7bAgjU26yUu9wDOue1djnqsts','::ffff:86.161.102.60','iPhone\nBrowser: Safari','','2025-03-26 16:42:53','2025-04-25 16:42:54',427,14),('sai_bhavana@uvaproit.com','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5hbnRfaWQiOjE0LCJ1c2VybmFtZSI6InNhaV9iaGF2YW5hQHV2YXByb2l0LmNvbSIsIm5hbWUiOiJTYWkgQmhhdmFuYSBTYW1hbnR1bGEiLCJyb2xlIjoidXNlciIsInNjb3BlIjoiS0lUQ0hFTixSRVNFUlZBVElPTlMsSU5WRU5UT1JZLElOVk9JQ0VTLFJFUE9SVFMsREFTSEJPQVJELFBPUyxDVVNUT01FUl9ESVNQTEFZLEtJVENIRU5fRElTUExBWSxPUkRFUl9TVEFUVVMsT1JERVJfU1RBVFVTX0RJU1BMQVksT1JERVJTLFZJRVdfUkVTRVJWQVRJT05TLENVU1RPTUVSUyxNQU5BR0VfUkVTRVJWQVRJT05TLFZJRVdfQ1VTVE9NRVJTLE1BTkFHRV9DVVNUT01FUlMsTUVNQkVSU0hJUCxWSUVXX0lOVkVOVE9SWSxNQU5BR0VfSU5WRU5UT1JZLFNFVFRJTkdTLEZFRURCQUNLIiwiaXNfYWN0aXZlIjoxLCJpYXQiOjE3NDMwMTE5NzgsImV4cCI6MTc0NTYwMzk3OCwiaXNzIjoiMjAuMTkzLjEyOC4xNDYifQ.2Yek8ZLOn4wYWvdONoKOdNfg3iDMVneocwMh1K6dfus','::ffff:172.226.114.12','Apple Mac\nBrowser: Safari','','2025-03-26 17:59:38','2025-04-25 17:59:38',429,14),('sai_bhavana@uvaproit.com','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5hbnRfaWQiOjE0LCJ1c2VybmFtZSI6InNhaV9iaGF2YW5hQHV2YXByb2l0LmNvbSIsIm5hbWUiOiJTYWkgQmhhdmFuYSBTYW1hbnR1bGEiLCJyb2xlIjoidXNlciIsInNjb3BlIjoiS0lUQ0hFTixSRVNFUlZBVElPTlMsSU5WRU5UT1JZLElOVk9JQ0VTLFJFUE9SVFMsREFTSEJPQVJELFBPUyxDVVNUT01FUl9ESVNQTEFZLEtJVENIRU5fRElTUExBWSxPUkRFUl9TVEFUVVMsT1JERVJfU1RBVFVTX0RJU1BMQVksT1JERVJTLFZJRVdfUkVTRVJWQVRJT05TLENVU1RPTUVSUyxNQU5BR0VfUkVTRVJWQVRJT05TLFZJRVdfQ1VTVE9NRVJTLE1BTkFHRV9DVVNUT01FUlMsTUVNQkVSU0hJUCxWSUVXX0lOVkVOVE9SWSxNQU5BR0VfSU5WRU5UT1JZLFNFVFRJTkdTLEZFRURCQUNLIiwiaXNfYWN0aXZlIjoxLCJpYXQiOjE3NDMwMTQwOTgsImV4cCI6MTc0NTYwNjA5OCwiaXNzIjoiMjAuMTkzLjEyOC4xNDYifQ.4OVPHnwoxBhhFQiT13PgwZETc14EA_5LJfthdltTJGk','::ffff:82.5.90.66','iPhone\nBrowser: Safari','','2025-03-26 18:34:58','2025-04-25 18:34:58',430,14),('vishal_verma@UVAProIT.com','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5hbnRfaWQiOjE0LCJ1c2VybmFtZSI6InZpc2hhbF92ZXJtYUB1dmFwcm9pdC5jb20iLCJuYW1lIjoiVmlzaGFsIFZlcm1hIiwicm9sZSI6InVzZXIiLCJzY29wZSI6IkRBU0hCT0FSRCxQT1MsQ1VTVE9NRVJfRElTUExBWSxLSVRDSEVOX0RJU1BMQVksT1JERVJfU1RBVFVTX0RJU1BMQVksT1JERVJfU1RBVFVTLE9SREVSUyxLSVRDSEVOLFJFU0VSVkFUSU9OUyxWSUVXX1JFU0VSVkFUSU9OUyxNQU5BR0VfUkVTRVJWQVRJT05TLENVU1RPTUVSUyxWSUVXX0NVU1RPTUVSUyxNQU5BR0VfQ1VTVE9NRVJTLElOVk9JQ0VTLE1FTUJFUlNISVAsSU5WRU5UT1JZLFZJRVdfSU5WRU5UT1JZLE1BTkFHRV9JTlZFTlRPUlksU0VUVElOR1MsRkVFREJBQ0ssUkVQT1JUUyIsImlzX2FjdGl2ZSI6MSwiaWF0IjoxNzQzMDE2MTc2LCJleHAiOjE3NDU2MDgxNzYsImlzcyI6IjIwLjE5My4xMjguMTQ2In0.fOj-uGZJpgY2P4darMIEH4MZLWVQ08yAdVDOdQyh90k','::ffff:86.161.102.60','Microsoft Windows\nBrowser: Edge','','2025-03-26 19:09:36','2025-04-25 19:09:36',433,14),('palanikumar0073@gmail.com','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5hbnRfaWQiOjE0LCJ1c2VybmFtZSI6InBhbGFuaWt1bWFyMDA3M0BnbWFpbC5jb20iLCJuYW1lIjoiUGFsYW5pIiwicm9sZSI6InVzZXIiLCJzY29wZSI6IkRBU0hCT0FSRCxQT1MsQ1VTVE9NRVJfRElTUExBWSxLSVRDSEVOX0RJU1BMQVksT1JERVJfU1RBVFVTX0RJU1BMQVksT1JERVJfU1RBVFVTLE9SREVSUyxLSVRDSEVOLFJFU0VSVkFUSU9OUyxWSUVXX1JFU0VSVkFUSU9OUyxNQU5BR0VfUkVTRVJWQVRJT05TLENVU1RPTUVSUyxWSUVXX0NVU1RPTUVSUyxNQU5BR0VfQ1VTVE9NRVJTLElOVk9JQ0VTLE1FTUJFUlNISVAsSU5WRU5UT1JZLFZJRVdfSU5WRU5UT1JZLE1BTkFHRV9JTlZFTlRPUlksU0VUVElOR1MsRkVFREJBQ0ssUkVQT1JUUyIsImlzX2FjdGl2ZSI6MSwiaWF0IjoxNzQzNTAzMTM1LCJleHAiOjE3NDYwOTUxMzUsImlzcyI6IjIwLjE5My4xMjguMTQ2In0.Ti4f2rPiksRHhLN9C6ZO_eHPn9092CcvP8VdP6lcy04','::ffff:49.43.218.127','Linux\nBrowser: Chrome','','2025-04-01 10:25:35','2025-05-01 10:25:36',477,14),('palanikumar0073@gmail.com','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5hbnRfaWQiOjE0LCJ1c2VybmFtZSI6InBhbGFuaWt1bWFyMDA3M0BnbWFpbC5jb20iLCJuYW1lIjoiUGFsYW5pIiwicm9sZSI6InVzZXIiLCJzY29wZSI6IkRBU0hCT0FSRCxQT1MsQ1VTVE9NRVJfRElTUExBWSxLSVRDSEVOX0RJU1BMQVksT1JERVJfU1RBVFVTX0RJU1BMQVksT1JERVJfU1RBVFVTLE9SREVSUyxLSVRDSEVOLFJFU0VSVkFUSU9OUyxWSUVXX1JFU0VSVkFUSU9OUyxNQU5BR0VfUkVTRVJWQVRJT05TLENVU1RPTUVSUyxWSUVXX0NVU1RPTUVSUyxNQU5BR0VfQ1VTVE9NRVJTLElOVk9JQ0VTLE1FTUJFUlNISVAsSU5WRU5UT1JZLFZJRVdfSU5WRU5UT1JZLE1BTkFHRV9JTlZFTlRPUlksU0VUVElOR1MsRkVFREJBQ0ssUkVQT1JUUyIsImlzX2FjdGl2ZSI6MSwiaWF0IjoxNzQzNTEwMDcxLCJleHAiOjE3NDYxMDIwNzEsImlzcyI6IjIwLjE5My4xMjguMTQ2In0.C8v9w9EZc4kpMAN0pw0ueNiwoyfshzOiZByP067pOiw','::ffff:49.43.218.198','Linux\nBrowser: Chrome','','2025-04-01 12:21:11','2025-05-01 12:21:12',480,14),('palanikumar0073@gmail.com','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5hbnRfaWQiOjE0LCJ1c2VybmFtZSI6InBhbGFuaWt1bWFyMDA3M0BnbWFpbC5jb20iLCJuYW1lIjoiUGFsYW5pIiwicm9sZSI6InVzZXIiLCJzY29wZSI6IkRBU0hCT0FSRCxQT1MsQ1VTVE9NRVJfRElTUExBWSxLSVRDSEVOX0RJU1BMQVksT1JERVJfU1RBVFVTX0RJU1BMQVksT1JERVJfU1RBVFVTLE9SREVSUyxLSVRDSEVOLFJFU0VSVkFUSU9OUyxWSUVXX1JFU0VSVkFUSU9OUyxNQU5BR0VfUkVTRVJWQVRJT05TLENVU1RPTUVSUyxWSUVXX0NVU1RPTUVSUyxNQU5BR0VfQ1VTVE9NRVJTLElOVk9JQ0VTLE1FTUJFUlNISVAsSU5WRU5UT1JZLFZJRVdfSU5WRU5UT1JZLE1BTkFHRV9JTlZFTlRPUlksU0VUVElOR1MsRkVFREJBQ0ssUkVQT1JUUyIsImlzX2FjdGl2ZSI6MSwiaWF0IjoxNzQzNTEwNzU2LCJleHAiOjE3NDYxMDI3NTYsImlzcyI6IjIwLjE5My4xMjguMTQ2In0.cKT5cK76gBQcnsGHELYrKq_Gysalv_ZLtLHbv9TFVws','::ffff:49.43.218.198','Linux\nBrowser: Chrome','','2025-04-01 12:32:36','2025-05-01 12:32:36',481,14),('palanikumar0073@gmail.com','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5hbnRfaWQiOjE0LCJ1c2VybmFtZSI6InBhbGFuaWt1bWFyMDA3M0BnbWFpbC5jb20iLCJuYW1lIjoiUGFsYW5pIiwicm9sZSI6InVzZXIiLCJzY29wZSI6IkRBU0hCT0FSRCxQT1MsQ1VTVE9NRVJfRElTUExBWSxLSVRDSEVOX0RJU1BMQVksT1JERVJfU1RBVFVTX0RJU1BMQVksT1JERVJfU1RBVFVTLE9SREVSUyxLSVRDSEVOLFJFU0VSVkFUSU9OUyxWSUVXX1JFU0VSVkFUSU9OUyxNQU5BR0VfUkVTRVJWQVRJT05TLENVU1RPTUVSUyxWSUVXX0NVU1RPTUVSUyxNQU5BR0VfQ1VTVE9NRVJTLElOVk9JQ0VTLE1FTUJFUlNISVAsSU5WRU5UT1JZLFZJRVdfSU5WRU5UT1JZLE1BTkFHRV9JTlZFTlRPUlksU0VUVElOR1MsRkVFREJBQ0ssUkVQT1JUUyIsImlzX2FjdGl2ZSI6MSwiaWF0IjoxNzQzOTIzMDI3LCJleHAiOjE3NDY1MTUwMjcsImlzcyI6IjIwLjE5My4xMjguMTQ2In0.ZSibWXlQqm9fwK_RZtoN7ZaSqLfLvet8k35l0E8iiv4','::ffff:49.43.218.75','Linux\nBrowser: Chrome','','2025-04-06 07:03:47','2025-05-06 07:03:48',516,14),('palanikumar0073@gmail.com','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5hbnRfaWQiOjE0LCJ1c2VybmFtZSI6InBhbGFuaWt1bWFyMDA3M0BnbWFpbC5jb20iLCJuYW1lIjoiUGFsYW5pIiwicm9sZSI6InVzZXIiLCJzY29wZSI6IkRBU0hCT0FSRCxQT1MsQ1VTVE9NRVJfRElTUExBWSxLSVRDSEVOX0RJU1BMQVksT1JERVJfU1RBVFVTX0RJU1BMQVksT1JERVJfU1RBVFVTLE9SREVSUyxLSVRDSEVOLFJFU0VSVkFUSU9OUyxWSUVXX1JFU0VSVkFUSU9OUyxNQU5BR0VfUkVTRVJWQVRJT05TLENVU1RPTUVSUyxWSUVXX0NVU1RPTUVSUyxNQU5BR0VfQ1VTVE9NRVJTLElOVk9JQ0VTLE1FTUJFUlNISVAsSU5WRU5UT1JZLFZJRVdfSU5WRU5UT1JZLE1BTkFHRV9JTlZFTlRPUlksU0VUVElOR1MsRkVFREJBQ0ssUkVQT1JUUyIsImlzX2FjdGl2ZSI6MSwiaWF0IjoxNzQzOTI1MjY5LCJleHAiOjE3NDY1MTcyNjksImlzcyI6IjIwLjE5My4xMjguMTQ2In0.sTQODGqFLWSD8SEMPy01MvQvpYR8lVEmwBKzqg4_PGA','::ffff:49.43.218.75','Linux\nBrowser: Chrome','','2025-04-06 07:41:09','2025-05-06 07:41:10',517,14),('palanikumar0073@gmail.com','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5hbnRfaWQiOjE0LCJ1c2VybmFtZSI6InBhbGFuaWt1bWFyMDA3M0BnbWFpbC5jb20iLCJuYW1lIjoiUGFsYW5pIiwicm9sZSI6InVzZXIiLCJzY29wZSI6IkRBU0hCT0FSRCxQT1MsQ1VTVE9NRVJfRElTUExBWSxLSVRDSEVOX0RJU1BMQVksT1JERVJfU1RBVFVTX0RJU1BMQVksT1JERVJfU1RBVFVTLE9SREVSUyxLSVRDSEVOLFJFU0VSVkFUSU9OUyxWSUVXX1JFU0VSVkFUSU9OUyxNQU5BR0VfUkVTRVJWQVRJT05TLENVU1RPTUVSUyxWSUVXX0NVU1RPTUVSUyxNQU5BR0VfQ1VTVE9NRVJTLElOVk9JQ0VTLE1FTUJFUlNISVAsSU5WRU5UT1JZLFZJRVdfSU5WRU5UT1JZLE1BTkFHRV9JTlZFTlRPUlksU0VUVElOR1MsRkVFREJBQ0ssUkVQT1JUUyIsImlzX2FjdGl2ZSI6MSwiaWF0IjoxNzQzOTI4NzkzLCJleHAiOjE3NDY1MjA3OTMsImlzcyI6IjIwLjE5My4xMjguMTQ2In0.owPjDWjQUIBRclEX-OeJUWuTh1yoO_QKPVyt4bzsZzk','::ffff:49.43.218.75','Linux\nBrowser: Chrome','','2025-04-06 08:39:53','2025-05-06 08:39:54',518,14),('palanikumar0073@gmail.com','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5hbnRfaWQiOjE0LCJ1c2VybmFtZSI6InBhbGFuaWt1bWFyMDA3M0BnbWFpbC5jb20iLCJuYW1lIjoiUGFsYW5pIiwicm9sZSI6InVzZXIiLCJzY29wZSI6IkRBU0hCT0FSRCxQT1MsQ1VTVE9NRVJfRElTUExBWSxLSVRDSEVOX0RJU1BMQVksT1JERVJfU1RBVFVTX0RJU1BMQVksT1JERVJfU1RBVFVTLE9SREVSUyxLSVRDSEVOLFJFU0VSVkFUSU9OUyxWSUVXX1JFU0VSVkFUSU9OUyxNQU5BR0VfUkVTRVJWQVRJT05TLENVU1RPTUVSUyxWSUVXX0NVU1RPTUVSUyxNQU5BR0VfQ1VTVE9NRVJTLElOVk9JQ0VTLE1FTUJFUlNISVAsSU5WRU5UT1JZLFZJRVdfSU5WRU5UT1JZLE1BTkFHRV9JTlZFTlRPUlksU0VUVElOR1MsRkVFREJBQ0ssUkVQT1JUUyIsImlzX2FjdGl2ZSI6MSwiaWF0IjoxNzQzOTMwOTg2LCJleHAiOjE3NDY1MjI5ODYsImlzcyI6IjIwLjE5My4xMjguMTQ2In0.TZq3CSY6tad8_2Tq11CnBUmcpiSIqAtTOrF_UabsNGk','::ffff:49.43.218.75','Linux\nBrowser: Chrome','','2025-04-06 09:16:26','2025-05-06 09:16:26',519,14),('palanikumar0073@gmail.com','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5hbnRfaWQiOjE0LCJ1c2VybmFtZSI6InBhbGFuaWt1bWFyMDA3M0BnbWFpbC5jb20iLCJuYW1lIjoiUGFsYW5pIiwicm9sZSI6InVzZXIiLCJzY29wZSI6IkRBU0hCT0FSRCxQT1MsQ1VTVE9NRVJfRElTUExBWSxLSVRDSEVOX0RJU1BMQVksT1JERVJfU1RBVFVTX0RJU1BMQVksT1JERVJfU1RBVFVTLE9SREVSUyxLSVRDSEVOLFJFU0VSVkFUSU9OUyxWSUVXX1JFU0VSVkFUSU9OUyxNQU5BR0VfUkVTRVJWQVRJT05TLENVU1RPTUVSUyxWSUVXX0NVU1RPTUVSUyxNQU5BR0VfQ1VTVE9NRVJTLElOVk9JQ0VTLE1FTUJFUlNISVAsSU5WRU5UT1JZLFZJRVdfSU5WRU5UT1JZLE1BTkFHRV9JTlZFTlRPUlksU0VUVElOR1MsRkVFREJBQ0ssUkVQT1JUUyIsImlzX2FjdGl2ZSI6MSwiaWF0IjoxNzQzOTM0NTM1LCJleHAiOjE3NDY1MjY1MzUsImlzcyI6IjIwLjE5My4xMjguMTQ2In0.UXfD2rDGsWOb9wFoRkYf0DR5x5lL8yXxtUSp5G6lqO4','::ffff:49.43.218.75','Linux\nBrowser: Chrome','','2025-04-06 10:15:35','2025-05-06 10:15:35',520,14),('palanikumar0073@gmail.com','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5hbnRfaWQiOjE0LCJ1c2VybmFtZSI6InBhbGFuaWt1bWFyMDA3M0BnbWFpbC5jb20iLCJuYW1lIjoiUGFsYW5pIiwicm9sZSI6InVzZXIiLCJzY29wZSI6IkRBU0hCT0FSRCxQT1MsQ1VTVE9NRVJfRElTUExBWSxLSVRDSEVOX0RJU1BMQVksT1JERVJfU1RBVFVTX0RJU1BMQVksT1JERVJfU1RBVFVTLE9SREVSUyxLSVRDSEVOLFJFU0VSVkFUSU9OUyxWSUVXX1JFU0VSVkFUSU9OUyxNQU5BR0VfUkVTRVJWQVRJT05TLENVU1RPTUVSUyxWSUVXX0NVU1RPTUVSUyxNQU5BR0VfQ1VTVE9NRVJTLElOVk9JQ0VTLE1FTUJFUlNISVAsSU5WRU5UT1JZLFZJRVdfSU5WRU5UT1JZLE1BTkFHRV9JTlZFTlRPUlksU0VUVElOR1MsRkVFREJBQ0ssUkVQT1JUUyIsImlzX2FjdGl2ZSI6MSwiaWF0IjoxNzQzOTQ3ODU1LCJleHAiOjE3NDY1Mzk4NTUsImlzcyI6IjIwLjE5My4xMjguMTQ2In0.4XhDwuylx_vVmTG_HZe9wPSolRbQClDpJdFb7ebIX6E','::ffff:49.43.218.75','Linux\nBrowser: Chrome','','2025-04-06 13:57:35','2025-05-06 13:57:36',521,14),('palanikumar0073@gmail.com','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5hbnRfaWQiOjE0LCJ1c2VybmFtZSI6InBhbGFuaWt1bWFyMDA3M0BnbWFpbC5jb20iLCJuYW1lIjoiUGFsYW5pIiwicm9sZSI6InVzZXIiLCJzY29wZSI6IkRBU0hCT0FSRCxQT1MsQ1VTVE9NRVJfRElTUExBWSxLSVRDSEVOX0RJU1BMQVksT1JERVJfU1RBVFVTX0RJU1BMQVksT1JERVJfU1RBVFVTLE9SREVSUyxLSVRDSEVOLFJFU0VSVkFUSU9OUyxWSUVXX1JFU0VSVkFUSU9OUyxNQU5BR0VfUkVTRVJWQVRJT05TLENVU1RPTUVSUyxWSUVXX0NVU1RPTUVSUyxNQU5BR0VfQ1VTVE9NRVJTLElOVk9JQ0VTLE1FTUJFUlNISVAsSU5WRU5UT1JZLFZJRVdfSU5WRU5UT1JZLE1BTkFHRV9JTlZFTlRPUlksU0VUVElOR1MsRkVFREJBQ0ssUkVQT1JUUyIsImlzX2FjdGl2ZSI6MSwiaWF0IjoxNzQzOTQ4Nzk2LCJleHAiOjE3NDY1NDA3OTYsImlzcyI6IjIwLjE5My4xMjguMTQ2In0.JfvCgDgZu7C08cWyBZ2NcV7yK6gCUFr2cyUfr2hx0hA','::ffff:49.43.218.75','Linux\nBrowser: Chrome','','2025-04-06 14:13:16','2025-05-06 14:13:16',523,14),('palanikumar0073@gmail.com','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5hbnRfaWQiOjE0LCJ1c2VybmFtZSI6InBhbGFuaWt1bWFyMDA3M0BnbWFpbC5jb20iLCJuYW1lIjoiUGFsYW5pIiwicm9sZSI6InVzZXIiLCJzY29wZSI6IkRBU0hCT0FSRCxQT1MsQ1VTVE9NRVJfRElTUExBWSxLSVRDSEVOX0RJU1BMQVksT1JERVJfU1RBVFVTX0RJU1BMQVksT1JERVJfU1RBVFVTLE9SREVSUyxLSVRDSEVOLFJFU0VSVkFUSU9OUyxWSUVXX1JFU0VSVkFUSU9OUyxNQU5BR0VfUkVTRVJWQVRJT05TLENVU1RPTUVSUyxWSUVXX0NVU1RPTUVSUyxNQU5BR0VfQ1VTVE9NRVJTLElOVk9JQ0VTLE1FTUJFUlNISVAsSU5WRU5UT1JZLFZJRVdfSU5WRU5UT1JZLE1BTkFHRV9JTlZFTlRPUlksU0VUVElOR1MsRkVFREJBQ0ssUkVQT1JUUyIsImlzX2FjdGl2ZSI6MSwiaWF0IjoxNzQzOTQ5MTQ3LCJleHAiOjE3NDY1NDExNDcsImlzcyI6IjIwLjE5My4xMjguMTQ2In0.XtTZOoQ5G-cZxLUFeHZnHIWjNA4irckhfvA7Y7BH83A','::ffff:49.43.218.75','Linux\nBrowser: Chrome','','2025-04-06 14:19:07','2025-05-06 14:19:07',524,14),('palanikumar0073@gmail.com','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5hbnRfaWQiOjE0LCJ1c2VybmFtZSI6InBhbGFuaWt1bWFyMDA3M0BnbWFpbC5jb20iLCJuYW1lIjoiUGFsYW5pIiwicm9sZSI6InVzZXIiLCJzY29wZSI6IkRBU0hCT0FSRCxQT1MsQ1VTVE9NRVJfRElTUExBWSxLSVRDSEVOX0RJU1BMQVksT1JERVJfU1RBVFVTX0RJU1BMQVksT1JERVJfU1RBVFVTLE9SREVSUyxLSVRDSEVOLFJFU0VSVkFUSU9OUyxWSUVXX1JFU0VSVkFUSU9OUyxNQU5BR0VfUkVTRVJWQVRJT05TLENVU1RPTUVSUyxWSUVXX0NVU1RPTUVSUyxNQU5BR0VfQ1VTVE9NRVJTLElOVk9JQ0VTLE1FTUJFUlNISVAsSU5WRU5UT1JZLFZJRVdfSU5WRU5UT1JZLE1BTkFHRV9JTlZFTlRPUlksU0VUVElOR1MsRkVFREJBQ0ssUkVQT1JUUyIsImlzX2FjdGl2ZSI6MSwiaWF0IjoxNzQzOTQ5NzIzLCJleHAiOjE3NDY1NDE3MjMsImlzcyI6IjIwLjE5My4xMjguMTQ2In0.MNY2r_X_qsY8uO0Aw2CnFCtyW4vFmCbqhxukO6N6QSo','::ffff:49.43.218.75','Linux\nBrowser: Chrome','','2025-04-06 14:28:43','2025-05-06 14:28:43',525,14),('palanikumar0073@gmail.com','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5hbnRfaWQiOjE0LCJ1c2VybmFtZSI6InBhbGFuaWt1bWFyMDA3M0BnbWFpbC5jb20iLCJuYW1lIjoiUGFsYW5pIiwicm9sZSI6InVzZXIiLCJzY29wZSI6IkRBU0hCT0FSRCxQT1MsQ1VTVE9NRVJfRElTUExBWSxLSVRDSEVOX0RJU1BMQVksT1JERVJfU1RBVFVTX0RJU1BMQVksT1JERVJfU1RBVFVTLE9SREVSUyxLSVRDSEVOLFJFU0VSVkFUSU9OUyxWSUVXX1JFU0VSVkFUSU9OUyxNQU5BR0VfUkVTRVJWQVRJT05TLENVU1RPTUVSUyxWSUVXX0NVU1RPTUVSUyxNQU5BR0VfQ1VTVE9NRVJTLElOVk9JQ0VTLE1FTUJFUlNISVAsSU5WRU5UT1JZLFZJRVdfSU5WRU5UT1JZLE1BTkFHRV9JTlZFTlRPUlksU0VUVElOR1MsRkVFREJBQ0ssUkVQT1JUUyIsImlzX2FjdGl2ZSI6MSwiaWF0IjoxNzQzOTUwMTczLCJleHAiOjE3NDY1NDIxNzMsImlzcyI6IjIwLjE5My4xMjguMTQ2In0.M8iz9L_JQzzFlTAAg74_YlsJ0EvxQUnF6Asf7SmPV3g','::ffff:49.43.218.75','Linux\nBrowser: Chrome','','2025-04-06 14:36:13','2025-05-06 14:36:14',526,14),('palanikumar0073@gmail.com','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5hbnRfaWQiOjE0LCJ1c2VybmFtZSI6InBhbGFuaWt1bWFyMDA3M0BnbWFpbC5jb20iLCJuYW1lIjoiUGFsYW5pIiwicm9sZSI6InVzZXIiLCJzY29wZSI6IkRBU0hCT0FSRCxQT1MsQ1VTVE9NRVJfRElTUExBWSxLSVRDSEVOX0RJU1BMQVksT1JERVJfU1RBVFVTX0RJU1BMQVksT1JERVJfU1RBVFVTLE9SREVSUyxLSVRDSEVOLFJFU0VSVkFUSU9OUyxWSUVXX1JFU0VSVkFUSU9OUyxNQU5BR0VfUkVTRVJWQVRJT05TLENVU1RPTUVSUyxWSUVXX0NVU1RPTUVSUyxNQU5BR0VfQ1VTVE9NRVJTLElOVk9JQ0VTLE1FTUJFUlNISVAsSU5WRU5UT1JZLFZJRVdfSU5WRU5UT1JZLE1BTkFHRV9JTlZFTlRPUlksU0VUVElOR1MsRkVFREJBQ0ssUkVQT1JUUyIsImlzX2FjdGl2ZSI6MSwiaWF0IjoxNzQzOTUwODU4LCJleHAiOjE3NDY1NDI4NTgsImlzcyI6IjIwLjE5My4xMjguMTQ2In0._Kl3iugyewJX84bJXdFke91KaHZc4BpRxSMBrzom4iM','::ffff:49.43.218.75','Linux\nBrowser: Chrome','','2025-04-06 14:47:38','2025-05-06 14:47:38',527,14),('palanikumar0073@gmail.com','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5hbnRfaWQiOjE0LCJ1c2VybmFtZSI6InBhbGFuaWt1bWFyMDA3M0BnbWFpbC5jb20iLCJuYW1lIjoiUGFsYW5pIiwicm9sZSI6InVzZXIiLCJzY29wZSI6IkRBU0hCT0FSRCxQT1MsQ1VTVE9NRVJfRElTUExBWSxLSVRDSEVOX0RJU1BMQVksT1JERVJfU1RBVFVTX0RJU1BMQVksT1JERVJfU1RBVFVTLE9SREVSUyxLSVRDSEVOLFJFU0VSVkFUSU9OUyxWSUVXX1JFU0VSVkFUSU9OUyxNQU5BR0VfUkVTRVJWQVRJT05TLENVU1RPTUVSUyxWSUVXX0NVU1RPTUVSUyxNQU5BR0VfQ1VTVE9NRVJTLElOVk9JQ0VTLE1FTUJFUlNISVAsSU5WRU5UT1JZLFZJRVdfSU5WRU5UT1JZLE1BTkFHRV9JTlZFTlRPUlksU0VUVElOR1MsRkVFREJBQ0ssUkVQT1JUUyIsImlzX2FjdGl2ZSI6MSwiaWF0IjoxNzQzOTUxNDk3LCJleHAiOjE3NDY1NDM0OTcsImlzcyI6IjIwLjE5My4xMjguMTQ2In0.85qEnj47HkA6FgtB2d9EVVm3JZcx9NKQLKyu-hMcDOQ','::ffff:49.43.218.75','Linux\nBrowser: Chrome','','2025-04-06 14:58:17','2025-05-06 14:58:18',528,14),('palanikumar0073@gmail.com','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5hbnRfaWQiOjE0LCJ1c2VybmFtZSI6InBhbGFuaWt1bWFyMDA3M0BnbWFpbC5jb20iLCJuYW1lIjoiUGFsYW5pIiwicm9sZSI6InVzZXIiLCJzY29wZSI6IkRBU0hCT0FSRCxQT1MsQ1VTVE9NRVJfRElTUExBWSxLSVRDSEVOX0RJU1BMQVksT1JERVJfU1RBVFVTX0RJU1BMQVksT1JERVJfU1RBVFVTLE9SREVSUyxLSVRDSEVOLFJFU0VSVkFUSU9OUyxWSUVXX1JFU0VSVkFUSU9OUyxNQU5BR0VfUkVTRVJWQVRJT05TLENVU1RPTUVSUyxWSUVXX0NVU1RPTUVSUyxNQU5BR0VfQ1VTVE9NRVJTLElOVk9JQ0VTLE1FTUJFUlNISVAsSU5WRU5UT1JZLFZJRVdfSU5WRU5UT1JZLE1BTkFHRV9JTlZFTlRPUlksU0VUVElOR1MsRkVFREJBQ0ssUkVQT1JUUyIsImlzX2FjdGl2ZSI6MSwiaWF0IjoxNzQzOTUyNjcxLCJleHAiOjE3NDY1NDQ2NzEsImlzcyI6IjIwLjE5My4xMjguMTQ2In0.BELYiIRMoY_pal_Ytz7kCGdh_lO5Uk6FC-x6hnu0nOc','::ffff:49.43.218.75','Linux\nBrowser: Chrome','','2025-04-06 15:17:51','2025-05-06 15:17:51',529,14),('palanikumar0073@gmail.com','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5hbnRfaWQiOjE0LCJ1c2VybmFtZSI6InBhbGFuaWt1bWFyMDA3M0BnbWFpbC5jb20iLCJuYW1lIjoiUGFsYW5pIiwicm9sZSI6InVzZXIiLCJzY29wZSI6IkRBU0hCT0FSRCxQT1MsQ1VTVE9NRVJfRElTUExBWSxLSVRDSEVOX0RJU1BMQVksT1JERVJfU1RBVFVTX0RJU1BMQVksT1JERVJfU1RBVFVTLE9SREVSUyxLSVRDSEVOLFJFU0VSVkFUSU9OUyxWSUVXX1JFU0VSVkFUSU9OUyxNQU5BR0VfUkVTRVJWQVRJT05TLENVU1RPTUVSUyxWSUVXX0NVU1RPTUVSUyxNQU5BR0VfQ1VTVE9NRVJTLElOVk9JQ0VTLE1FTUJFUlNISVAsSU5WRU5UT1JZLFZJRVdfSU5WRU5UT1JZLE1BTkFHRV9JTlZFTlRPUlksU0VUVElOR1MsRkVFREJBQ0ssUkVQT1JUUyIsImlzX2FjdGl2ZSI6MSwiaWF0IjoxNzQzOTUyOTk2LCJleHAiOjE3NDY1NDQ5OTYsImlzcyI6IjIwLjE5My4xMjguMTQ2In0.Z3J9okUAt132bJ0NbhHfSDsGcpG5NWPwPoQ9VrPU6Cg','::ffff:49.43.218.75','Linux\nBrowser: Chrome','','2025-04-06 15:23:16','2025-05-06 15:23:16',530,14),('palanikumar0073@gmail.com','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5hbnRfaWQiOjE0LCJ1c2VybmFtZSI6InBhbGFuaWt1bWFyMDA3M0BnbWFpbC5jb20iLCJuYW1lIjoiUGFsYW5pIiwicm9sZSI6InVzZXIiLCJzY29wZSI6IkRBU0hCT0FSRCxQT1MsQ1VTVE9NRVJfRElTUExBWSxLSVRDSEVOX0RJU1BMQVksT1JERVJfU1RBVFVTX0RJU1BMQVksT1JERVJfU1RBVFVTLE9SREVSUyxLSVRDSEVOLFJFU0VSVkFUSU9OUyxWSUVXX1JFU0VSVkFUSU9OUyxNQU5BR0VfUkVTRVJWQVRJT05TLENVU1RPTUVSUyxWSUVXX0NVU1RPTUVSUyxNQU5BR0VfQ1VTVE9NRVJTLElOVk9JQ0VTLE1FTUJFUlNISVAsSU5WRU5UT1JZLFZJRVdfSU5WRU5UT1JZLE1BTkFHRV9JTlZFTlRPUlksU0VUVElOR1MsRkVFREJBQ0ssUkVQT1JUUyIsImlzX2FjdGl2ZSI6MSwiaWF0IjoxNzQzOTUzNTYzLCJleHAiOjE3NDY1NDU1NjMsImlzcyI6IjIwLjE5My4xMjguMTQ2In0.iuQUgq4KoHXGFoFMRQpPMaakA33J1azrqfQ_pi_rhus','::ffff:49.43.218.75','Linux\nBrowser: Chrome','','2025-04-06 15:32:43','2025-05-06 15:32:43',531,14),('palanikumar0073@gmail.com','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5hbnRfaWQiOjE0LCJ1c2VybmFtZSI6InBhbGFuaWt1bWFyMDA3M0BnbWFpbC5jb20iLCJuYW1lIjoiUGFsYW5pIiwicm9sZSI6InVzZXIiLCJzY29wZSI6IkRBU0hCT0FSRCxQT1MsQ1VTVE9NRVJfRElTUExBWSxLSVRDSEVOX0RJU1BMQVksT1JERVJfU1RBVFVTX0RJU1BMQVksT1JERVJfU1RBVFVTLE9SREVSUyxLSVRDSEVOLFJFU0VSVkFUSU9OUyxWSUVXX1JFU0VSVkFUSU9OUyxNQU5BR0VfUkVTRVJWQVRJT05TLENVU1RPTUVSUyxWSUVXX0NVU1RPTUVSUyxNQU5BR0VfQ1VTVE9NRVJTLElOVk9JQ0VTLE1FTUJFUlNISVAsSU5WRU5UT1JZLFZJRVdfSU5WRU5UT1JZLE1BTkFHRV9JTlZFTlRPUlksU0VUVElOR1MsRkVFREJBQ0ssUkVQT1JUUyIsImlzX2FjdGl2ZSI6MSwiaWF0IjoxNzQzOTUzOTc5LCJleHAiOjE3NDY1NDU5NzksImlzcyI6IjIwLjE5My4xMjguMTQ2In0.97mINqw9yyZ7lhdp9upRnzLMo3CmwCpmogz4HJPWC5c','::ffff:49.43.218.75','Linux\nBrowser: Chrome','','2025-04-06 15:39:39','2025-05-06 15:39:39',532,14),('palanikumar0073@gmail.com','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5hbnRfaWQiOjE0LCJ1c2VybmFtZSI6InBhbGFuaWt1bWFyMDA3M0BnbWFpbC5jb20iLCJuYW1lIjoiUGFsYW5pIiwicm9sZSI6InVzZXIiLCJzY29wZSI6IkRBU0hCT0FSRCxQT1MsQ1VTVE9NRVJfRElTUExBWSxLSVRDSEVOX0RJU1BMQVksT1JERVJfU1RBVFVTX0RJU1BMQVksT1JERVJfU1RBVFVTLE9SREVSUyxLSVRDSEVOLFJFU0VSVkFUSU9OUyxWSUVXX1JFU0VSVkFUSU9OUyxNQU5BR0VfUkVTRVJWQVRJT05TLENVU1RPTUVSUyxWSUVXX0NVU1RPTUVSUyxNQU5BR0VfQ1VTVE9NRVJTLElOVk9JQ0VTLE1FTUJFUlNISVAsSU5WRU5UT1JZLFZJRVdfSU5WRU5UT1JZLE1BTkFHRV9JTlZFTlRPUlksU0VUVElOR1MsRkVFREJBQ0ssUkVQT1JUUyIsImlzX2FjdGl2ZSI6MSwiaWF0IjoxNzQzOTU1MjIzLCJleHAiOjE3NDY1NDcyMjMsImlzcyI6IjIwLjE5My4xMjguMTQ2In0.1BFHjyAh9qmt5odrrmZgo9w3k7nwwJybI92gPglflYQ','::ffff:49.43.218.75','Linux\nBrowser: Chrome','','2025-04-06 16:00:23','2025-05-06 16:00:23',533,14),('palanikumar0073@gmail.com','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5hbnRfaWQiOjE0LCJ1c2VybmFtZSI6InBhbGFuaWt1bWFyMDA3M0BnbWFpbC5jb20iLCJuYW1lIjoiUGFsYW5pIiwicm9sZSI6InVzZXIiLCJzY29wZSI6IkRBU0hCT0FSRCxQT1MsQ1VTVE9NRVJfRElTUExBWSxLSVRDSEVOX0RJU1BMQVksT1JERVJfU1RBVFVTX0RJU1BMQVksT1JERVJfU1RBVFVTLE9SREVSUyxLSVRDSEVOLFJFU0VSVkFUSU9OUyxWSUVXX1JFU0VSVkFUSU9OUyxNQU5BR0VfUkVTRVJWQVRJT05TLENVU1RPTUVSUyxWSUVXX0NVU1RPTUVSUyxNQU5BR0VfQ1VTVE9NRVJTLElOVk9JQ0VTLE1FTUJFUlNISVAsSU5WRU5UT1JZLFZJRVdfSU5WRU5UT1JZLE1BTkFHRV9JTlZFTlRPUlksU0VUVElOR1MsRkVFREJBQ0ssUkVQT1JUUyIsImlzX2FjdGl2ZSI6MSwiaWF0IjoxNzQzOTU2MTAyLCJleHAiOjE3NDY1NDgxMDIsImlzcyI6IjIwLjE5My4xMjguMTQ2In0.CAb_FNi-VJ7OEdnd3ynaCsW1x6AB9k0Nrm5KnBn_FMQ','::ffff:49.43.218.75','Linux\nBrowser: Chrome','','2025-04-06 16:15:02','2025-05-06 16:15:03',534,14),('palanikumar0073@gmail.com','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5hbnRfaWQiOjE0LCJ1c2VybmFtZSI6InBhbGFuaWt1bWFyMDA3M0BnbWFpbC5jb20iLCJuYW1lIjoiUGFsYW5pIiwicm9sZSI6InVzZXIiLCJzY29wZSI6IkRBU0hCT0FSRCxQT1MsQ1VTVE9NRVJfRElTUExBWSxLSVRDSEVOX0RJU1BMQVksT1JERVJfU1RBVFVTX0RJU1BMQVksT1JERVJfU1RBVFVTLE9SREVSUyxLSVRDSEVOLFJFU0VSVkFUSU9OUyxWSUVXX1JFU0VSVkFUSU9OUyxNQU5BR0VfUkVTRVJWQVRJT05TLENVU1RPTUVSUyxWSUVXX0NVU1RPTUVSUyxNQU5BR0VfQ1VTVE9NRVJTLElOVk9JQ0VTLE1FTUJFUlNISVAsSU5WRU5UT1JZLFZJRVdfSU5WRU5UT1JZLE1BTkFHRV9JTlZFTlRPUlksU0VUVElOR1MsRkVFREJBQ0ssUkVQT1JUUyIsImlzX2FjdGl2ZSI6MSwiaWF0IjoxNzQzOTU2NzkxLCJleHAiOjE3NDY1NDg3OTEsImlzcyI6IjIwLjE5My4xMjguMTQ2In0.sAnOI1kGEoGIsr_IkiFRefQVbH6wrLai6HqHuQ1U2Js','::ffff:49.43.218.75','Linux\nBrowser: Chrome','','2025-04-06 16:26:31','2025-05-06 16:26:31',535,14),('palanikumar0073@gmail.com','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5hbnRfaWQiOjE0LCJ1c2VybmFtZSI6InBhbGFuaWt1bWFyMDA3M0BnbWFpbC5jb20iLCJuYW1lIjoiUGFsYW5pIiwicm9sZSI6InVzZXIiLCJzY29wZSI6IkRBU0hCT0FSRCxQT1MsQ1VTVE9NRVJfRElTUExBWSxLSVRDSEVOX0RJU1BMQVksT1JERVJfU1RBVFVTX0RJU1BMQVksT1JERVJfU1RBVFVTLE9SREVSUyxLSVRDSEVOLFJFU0VSVkFUSU9OUyxWSUVXX1JFU0VSVkFUSU9OUyxNQU5BR0VfUkVTRVJWQVRJT05TLENVU1RPTUVSUyxWSUVXX0NVU1RPTUVSUyxNQU5BR0VfQ1VTVE9NRVJTLElOVk9JQ0VTLE1FTUJFUlNISVAsSU5WRU5UT1JZLFZJRVdfSU5WRU5UT1JZLE1BTkFHRV9JTlZFTlRPUlksU0VUVElOR1MsRkVFREJBQ0ssUkVQT1JUUyIsImlzX2FjdGl2ZSI6MSwiaWF0IjoxNzQzOTU3Mjk3LCJleHAiOjE3NDY1NDkyOTcsImlzcyI6IjIwLjE5My4xMjguMTQ2In0._ZQ1MHh54WcahEUgQAj-ghwAllOj-zFfVVOioLS8BDM','::ffff:49.43.218.75','Linux\nBrowser: Chrome','','2025-04-06 16:34:57','2025-05-06 16:34:58',536,14),('palanikumar0073@gmail.com','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5hbnRfaWQiOjE0LCJ1c2VybmFtZSI6InBhbGFuaWt1bWFyMDA3M0BnbWFpbC5jb20iLCJuYW1lIjoiUGFsYW5pIiwicm9sZSI6InVzZXIiLCJzY29wZSI6IkRBU0hCT0FSRCxQT1MsQ1VTVE9NRVJfRElTUExBWSxLSVRDSEVOX0RJU1BMQVksT1JERVJfU1RBVFVTX0RJU1BMQVksT1JERVJfU1RBVFVTLE9SREVSUyxLSVRDSEVOLFJFU0VSVkFUSU9OUyxWSUVXX1JFU0VSVkFUSU9OUyxNQU5BR0VfUkVTRVJWQVRJT05TLENVU1RPTUVSUyxWSUVXX0NVU1RPTUVSUyxNQU5BR0VfQ1VTVE9NRVJTLElOVk9JQ0VTLE1FTUJFUlNISVAsSU5WRU5UT1JZLFZJRVdfSU5WRU5UT1JZLE1BTkFHRV9JTlZFTlRPUlksU0VUVElOR1MsRkVFREJBQ0ssUkVQT1JUUyIsImlzX2FjdGl2ZSI6MSwiaWF0IjoxNzQzOTU4MjY0LCJleHAiOjE3NDY1NTAyNjQsImlzcyI6IjIwLjE5My4xMjguMTQ2In0.NiyriBNZYWKPck4KFCciH8aQGxRaVlGkV1EWgBVV3B0','::ffff:49.43.218.75','Linux\nBrowser: Chrome','','2025-04-06 16:51:04','2025-05-06 16:51:05',537,14),('palanikumar0073@gmail.com','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5hbnRfaWQiOjE0LCJ1c2VybmFtZSI6InBhbGFuaWt1bWFyMDA3M0BnbWFpbC5jb20iLCJuYW1lIjoiUGFsYW5pIiwicm9sZSI6InVzZXIiLCJzY29wZSI6IkRBU0hCT0FSRCxQT1MsQ1VTVE9NRVJfRElTUExBWSxLSVRDSEVOX0RJU1BMQVksT1JERVJfU1RBVFVTX0RJU1BMQVksT1JERVJfU1RBVFVTLE9SREVSUyxLSVRDSEVOLFJFU0VSVkFUSU9OUyxWSUVXX1JFU0VSVkFUSU9OUyxNQU5BR0VfUkVTRVJWQVRJT05TLENVU1RPTUVSUyxWSUVXX0NVU1RPTUVSUyxNQU5BR0VfQ1VTVE9NRVJTLElOVk9JQ0VTLE1FTUJFUlNISVAsSU5WRU5UT1JZLFZJRVdfSU5WRU5UT1JZLE1BTkFHRV9JTlZFTlRPUlksU0VUVElOR1MsRkVFREJBQ0ssUkVQT1JUUyIsImlzX2FjdGl2ZSI6MSwiaWF0IjoxNzQzOTU4Njc3LCJleHAiOjE3NDY1NTA2NzcsImlzcyI6IjIwLjE5My4xMjguMTQ2In0.CS-NJLOnVMXmQh391vVf61MxQgx7nGGEMWQ1KgMUD9Q','::ffff:49.43.218.75','Linux\nBrowser: Chrome','','2025-04-06 16:57:57','2025-05-06 16:57:58',538,14),('palanikumar0073@gmail.com','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5hbnRfaWQiOjE0LCJ1c2VybmFtZSI6InBhbGFuaWt1bWFyMDA3M0BnbWFpbC5jb20iLCJuYW1lIjoiUGFsYW5pIiwicm9sZSI6InVzZXIiLCJzY29wZSI6IkRBU0hCT0FSRCxQT1MsQ1VTVE9NRVJfRElTUExBWSxLSVRDSEVOX0RJU1BMQVksT1JERVJfU1RBVFVTX0RJU1BMQVksT1JERVJfU1RBVFVTLE9SREVSUyxLSVRDSEVOLFJFU0VSVkFUSU9OUyxWSUVXX1JFU0VSVkFUSU9OUyxNQU5BR0VfUkVTRVJWQVRJT05TLENVU1RPTUVSUyxWSUVXX0NVU1RPTUVSUyxNQU5BR0VfQ1VTVE9NRVJTLElOVk9JQ0VTLE1FTUJFUlNISVAsSU5WRU5UT1JZLFZJRVdfSU5WRU5UT1JZLE1BTkFHRV9JTlZFTlRPUlksU0VUVElOR1MsRkVFREJBQ0ssUkVQT1JUUyIsImlzX2FjdGl2ZSI6MSwiaWF0IjoxNzQzOTU5MDAzLCJleHAiOjE3NDY1NTEwMDMsImlzcyI6IjIwLjE5My4xMjguMTQ2In0.aozbQVzatspMBXXD6EcBOZDeQ5_VjhAuKSgY1cWGppg','::ffff:49.43.218.75','Linux\nBrowser: Chrome','','2025-04-06 17:03:23','2025-05-06 17:03:24',539,14),('palanikumar0073@gmail.com','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5hbnRfaWQiOjE0LCJ1c2VybmFtZSI6InBhbGFuaWt1bWFyMDA3M0BnbWFpbC5jb20iLCJuYW1lIjoiUGFsYW5pIiwicm9sZSI6InVzZXIiLCJzY29wZSI6IkRBU0hCT0FSRCxQT1MsQ1VTVE9NRVJfRElTUExBWSxLSVRDSEVOX0RJU1BMQVksT1JERVJfU1RBVFVTX0RJU1BMQVksT1JERVJfU1RBVFVTLE9SREVSUyxLSVRDSEVOLFJFU0VSVkFUSU9OUyxWSUVXX1JFU0VSVkFUSU9OUyxNQU5BR0VfUkVTRVJWQVRJT05TLENVU1RPTUVSUyxWSUVXX0NVU1RPTUVSUyxNQU5BR0VfQ1VTVE9NRVJTLElOVk9JQ0VTLE1FTUJFUlNISVAsSU5WRU5UT1JZLFZJRVdfSU5WRU5UT1JZLE1BTkFHRV9JTlZFTlRPUlksU0VUVElOR1MsRkVFREJBQ0ssUkVQT1JUUyIsImlzX2FjdGl2ZSI6MSwiaWF0IjoxNzQ0MDk0NTg0LCJleHAiOjE3NDY2ODY1ODQsImlzcyI6IjIwLjE5My4xMjguMTQ2In0.fUkgRVrrzePLhJAwyyFniyRWR3XAuIpi_0n50XR0Ha4','::ffff:49.43.217.15','Linux\nBrowser: Chrome','','2025-04-08 06:43:04','2025-05-08 06:43:04',545,14),('palanikumar0073@gmail.com','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5hbnRfaWQiOjE0LCJ1c2VybmFtZSI6InBhbGFuaWt1bWFyMDA3M0BnbWFpbC5jb20iLCJuYW1lIjoiUGFsYW5pIiwicm9sZSI6InVzZXIiLCJzY29wZSI6IkRBU0hCT0FSRCxQT1MsQ1VTVE9NRVJfRElTUExBWSxLSVRDSEVOX0RJU1BMQVksT1JERVJfU1RBVFVTX0RJU1BMQVksT1JERVJfU1RBVFVTLE9SREVSUyxLSVRDSEVOLFJFU0VSVkFUSU9OUyxWSUVXX1JFU0VSVkFUSU9OUyxNQU5BR0VfUkVTRVJWQVRJT05TLENVU1RPTUVSUyxWSUVXX0NVU1RPTUVSUyxNQU5BR0VfQ1VTVE9NRVJTLElOVk9JQ0VTLE1FTUJFUlNISVAsSU5WRU5UT1JZLFZJRVdfSU5WRU5UT1JZLE1BTkFHRV9JTlZFTlRPUlksU0VUVElOR1MsRkVFREJBQ0ssUkVQT1JUUyIsImlzX2FjdGl2ZSI6MSwiaWF0IjoxNzQ0MDk3MTAxLCJleHAiOjE3NDY2ODkxMDEsImlzcyI6IjIwLjE5My4xMjguMTQ2In0.xzsJDk_qrrYjWRf1lWspN6wNeFbDgOBKt6uJHTPWslA','::ffff:49.43.217.15','Linux\nBrowser: Chrome','','2025-04-08 07:25:01','2025-05-08 07:25:01',546,14),('palanikumar0073@gmail.com','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5hbnRfaWQiOjE0LCJ1c2VybmFtZSI6InBhbGFuaWt1bWFyMDA3M0BnbWFpbC5jb20iLCJuYW1lIjoiUGFsYW5pIiwicm9sZSI6InVzZXIiLCJzY29wZSI6IkRBU0hCT0FSRCxQT1MsQ1VTVE9NRVJfRElTUExBWSxLSVRDSEVOX0RJU1BMQVksT1JERVJfU1RBVFVTX0RJU1BMQVksT1JERVJfU1RBVFVTLE9SREVSUyxLSVRDSEVOLFJFU0VSVkFUSU9OUyxWSUVXX1JFU0VSVkFUSU9OUyxNQU5BR0VfUkVTRVJWQVRJT05TLENVU1RPTUVSUyxWSUVXX0NVU1RPTUVSUyxNQU5BR0VfQ1VTVE9NRVJTLElOVk9JQ0VTLE1FTUJFUlNISVAsSU5WRU5UT1JZLFZJRVdfSU5WRU5UT1JZLE1BTkFHRV9JTlZFTlRPUlksU0VUVElOR1MsRkVFREJBQ0ssUkVQT1JUUyIsImlzX2FjdGl2ZSI6MSwiaWF0IjoxNzQ0MDk4NzUxLCJleHAiOjE3NDY2OTA3NTEsImlzcyI6IjIwLjE5My4xMjguMTQ2In0.Qjd4p5FcIfRlrgbtDXKzZPdczZw0uLp2JcxPfKJ44A0','::ffff:49.43.217.15','Linux\nBrowser: Chrome','','2025-04-08 07:52:31','2025-05-08 07:52:32',547,14),('admin@salespulse.com','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5hbnRfaWQiOjE0LCJ1c2VybmFtZSI6ImFkbWluQHNhbGVzcHVsc2UuY29tIiwibmFtZSI6IlNhbGVzcHVsc2UiLCJyb2xlIjoiYWRtaW4iLCJzY29wZSI6bnVsbCwiaXNfYWN0aXZlIjoxLCJpYXQiOjE3NDQyMTc2NjYsImV4cCI6MTc0NjgwOTY2NiwiaXNzIjoiMjAuMTkzLjEyOC4xNDYifQ.fiG_PRMTbfjb6ApLFlWKgn0SF3km1yWpXkkr-ncK5X8','::ffff:183.83.172.201','Apple Mac\nBrowser: Chrome','','2025-04-09 16:54:26','2025-05-09 16:54:26',550,14),('admin@dealpulse360.com','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5hbnRfaWQiOjE4LCJ1c2VybmFtZSI6ImFkbWluQGRlYWxwdWxzZTM2MC5jb20iLCJuYW1lIjoiRGVhbHB1bHNlMzYwIiwicm9sZSI6ImFkbWluIiwic2NvcGUiOm51bGwsImlzX2FjdGl2ZSI6MSwiaWF0IjoxNzQ0Mjc4NjQzLCJleHAiOjE3NDY4NzA2NDMsImlzcyI6IjIwLjE5My4xMjguMTQ2In0.piM8kS_FlIjnmEX9CTcw0P4GnRjXJHmmvNvMgzAV-hc','::ffff:82.5.90.66','Apple Mac\nBrowser: Chrome','','2025-04-10 09:50:43','2025-05-10 09:50:44',552,18),('admin@dealpulse360.com','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5hbnRfaWQiOjE4LCJ1c2VybmFtZSI6ImFkbWluQGRlYWxwdWxzZTM2MC5jb20iLCJuYW1lIjoiRGVhbHB1bHNlMzYwIiwicm9sZSI6ImFkbWluIiwic2NvcGUiOm51bGwsImlzX2FjdGl2ZSI6MSwiaWF0IjoxNzQ0Mjc5OTA3LCJleHAiOjE3NDY4NzE5MDcsImlzcyI6IjIwLjE5My4xMjguMTQ2In0.aVIftoQvVD5M3Ec19u1cizWPz0UzAX3mJrxHh6UhxIw','::ffff:82.5.90.66','Apple Mac\nBrowser: Chrome','','2025-04-10 10:11:47','2025-05-10 10:11:47',556,18),('forum.776@gmail.com','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5hbnRfaWQiOjIxLCJ1c2VybmFtZSI6IkZvcnVtLjc3NkBnbWFpbC5jb20iLCJuYW1lIjoiRm9ydW0iLCJyb2xlIjoiYWRtaW4iLCJzY29wZSI6bnVsbCwiaXNfYWN0aXZlIjowLCJpYXQiOjE3NDQyOTU3NjEsImV4cCI6MTc0Njg4Nzc2MSwiaXNzIjoiMjAuMTkzLjEyOC4xNDYifQ.zGrzzqMVmpEn83YpOE6F_BU2EcC1UxhA-pD1DBjHB1Y','::ffff:82.5.90.66','Apple Mac\nBrowser: Chrome','','2025-04-10 14:36:01','2025-05-10 14:36:01',571,21),('admin@dealpulse360.com','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5hbnRfaWQiOjE4LCJ1c2VybmFtZSI6ImFkbWluQGRlYWxwdWxzZTM2MC5jb20iLCJuYW1lIjoiRGVhbHB1bHNlMzYwIiwicm9sZSI6ImFkbWluIiwic2NvcGUiOm51bGwsImlzX2FjdGl2ZSI6MSwiaWF0IjoxNzQ1MjQ3NDEwLCJleHAiOjE3NDc4Mzk0MTAsImlzcyI6IjIwLjE5My4xMjguMTQ2In0.KqYHBmIXicG-9LsL_g4eEmTVYgnCRO5CZmB7Gc0CpBo','::ffff:82.5.90.66','Apple Mac\nBrowser: Chrome','','2025-04-21 14:56:50','2025-05-21 14:56:50',576,18),('abhishek_kola@uvaproit.com','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5hbnRfaWQiOjIzLCJ1c2VybmFtZSI6ImFiaGlzaGVrX2tvbGFAdXZhcHJvaXQuY29tIiwibmFtZSI6IkRldl9hY2NvdW50X2FrIiwicm9sZSI6ImFkbWluIiwic2NvcGUiOm51bGwsImlzX2FjdGl2ZSI6MCwiaWF0IjoxNzQ2Mjg0NzY0LCJleHAiOjE3NDg4NzY3NjQsImlzcyI6IjIwLjE5My4xMjguMTQ2In0.yKIIFxKtcd9wGQscWltRmMjj-XYiSiQnvNpuLP-4B_k','::ffff:82.5.90.66','Apple Mac\nBrowser: Safari','','2025-05-03 15:06:04','2025-06-02 15:06:04',577,23),('abhishek_kola@uvaproit.com','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5hbnRfaWQiOjIzLCJ1c2VybmFtZSI6ImFiaGlzaGVrX2tvbGFAdXZhcHJvaXQuY29tIiwibmFtZSI6IkRldl9hY2NvdW50X2FrIiwicm9sZSI6ImFkbWluIiwic2NvcGUiOm51bGwsImlzX2FjdGl2ZSI6MCwiaWF0IjoxNzQ2Mjg0NzcyLCJleHAiOjE3NDg4NzY3NzIsImlzcyI6IjIwLjE5My4xMjguMTQ2In0.0qIOqFfxsGQHUQtUTUS2Gu3UO-s4pWNKytzxbRGYlEQ','::ffff:82.5.90.66','Apple Mac\nBrowser: Safari','','2025-05-03 15:06:12','2025-06-02 15:06:12',578,23),('admin@dealpulse360.com','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5hbnRfaWQiOjE4LCJ1c2VybmFtZSI6ImFkbWluQGRlYWxwdWxzZTM2MC5jb20iLCJuYW1lIjoiRGVhbHB1bHNlMzYwIiwicm9sZSI6ImFkbWluIiwic2NvcGUiOm51bGwsImlzX2FjdGl2ZSI6MSwiaWF0IjoxNzQ2Mjg0ODI0LCJleHAiOjE3NDg4NzY4MjQsImlzcyI6IjIwLjE5My4xMjguMTQ2In0.xIQb-jzkyQH3Fp-OtI54Ey3lyFklToHs-JWv-MrTE0I','::ffff:82.5.90.66','Apple Mac\nBrowser: Safari','','2025-05-03 15:07:04','2025-06-02 15:07:05',579,18),('abhishek_kola@uvaproit.com','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5hbnRfaWQiOjIzLCJ1c2VybmFtZSI6ImFiaGlzaGVrX2tvbGFAdXZhcHJvaXQuY29tIiwibmFtZSI6IkRldl9hY2NvdW50X2FrIiwicm9sZSI6ImFkbWluIiwic2NvcGUiOm51bGwsImlzX2FjdGl2ZSI6MCwiaWF0IjoxNzQ2Mjg0ODU1LCJleHAiOjE3NDg4NzY4NTUsImlzcyI6IjIwLjE5My4xMjguMTQ2In0.A22qrH0j7Gkw2rwbBdlAiXEmjfAaH2lGpd-4-PqIQFM','::ffff:82.5.90.66','Apple Mac\nBrowser: Safari','','2025-05-03 15:07:35','2025-06-02 15:07:35',580,23),('abhishek_kola@uvaproit.com','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5hbnRfaWQiOjIzLCJ1c2VybmFtZSI6ImFiaGlzaGVrX2tvbGFAdXZhcHJvaXQuY29tIiwibmFtZSI6IkRldl9hY2NvdW50X2FrIiwicm9sZSI6ImFkbWluIiwic2NvcGUiOm51bGwsImlzX2FjdGl2ZSI6MCwiaWF0IjoxNzQ2Mjg0ODcxLCJleHAiOjE3NDg4NzY4NzEsImlzcyI6IjIwLjE5My4xMjguMTQ2In0.v2XXYbSRa9eOCptxhjTER-8-c3M64_wuXjilLrRGu5s','::ffff:82.5.90.66','Apple Mac\nBrowser: Safari','','2025-05-03 15:07:51','2025-06-02 15:07:52',581,23),('abhishek_kola@uvaproit.com','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5hbnRfaWQiOjIzLCJ1c2VybmFtZSI6ImFiaGlzaGVrX2tvbGFAdXZhcHJvaXQuY29tIiwibmFtZSI6IkRldl9hY2NvdW50X2FrIiwicm9sZSI6ImFkbWluIiwic2NvcGUiOm51bGwsImlzX2FjdGl2ZSI6MCwiaWF0IjoxNzQ2Mjg1NzY3LCJleHAiOjE3NDg4Nzc3NjcsImlzcyI6IjIwLjE5My4xMjguMTQ2In0.gnVFlY76gyb26ugZ_BreljIf2y4fV1SsDUIsEt6dBQ4','::ffff:82.5.90.66','Apple Mac\nBrowser: Safari','','2025-05-03 15:22:47','2025-06-02 15:22:47',583,23),('abhishek_kola@uvaproit.com','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5hbnRfaWQiOjIzLCJ1c2VybmFtZSI6ImFiaGlzaGVrX2tvbGFAdXZhcHJvaXQuY29tIiwibmFtZSI6IkRldl9hY2NvdW50X2FrIiwicm9sZSI6ImFkbWluIiwic2NvcGUiOm51bGwsImlzX2FjdGl2ZSI6MCwiaWF0IjoxNzQ2Mjg1NzgwLCJleHAiOjE3NDg4Nzc3ODAsImlzcyI6IjIwLjE5My4xMjguMTQ2In0._kEcr2nrI20Nk0zF2r2Qz9IJ6-nRXFtVv_vwSSaWY-s','::ffff:82.5.90.66','Apple Mac\nBrowser: Safari','','2025-05-03 15:23:00','2025-06-02 15:23:01',584,23);
/*!40000 ALTER TABLE `refresh_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reservations`
--

DROP TABLE IF EXISTS `reservations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reservations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `customer_id` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  `table_id` int DEFAULT NULL,
  `status` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `notes` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `people_count` int DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `unique_code` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tenant_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug_index` (`unique_code`) USING BTREE,
  KEY `INDEX` (`date`) USING BTREE,
  KEY `INDEX_CUSTOMER_SEARCH` (`customer_id`) USING BTREE,
  KEY `tenant_id` (`tenant_id`),
  CONSTRAINT `reservations_ibfk_1` FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=68 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reservations`
--

LOCK TABLES `reservations` WRITE;
/*!40000 ALTER TABLE `reservations` DISABLE KEYS */;
INSERT INTO `reservations` VALUES (13,'+19873234553','2025-02-20 22:46:00',10,'booked','testing',12,'2025-01-16 13:13:10','2025-01-16 13:13:10','EPxyKSzqoR',14),(14,'93818 73146','2025-01-21 21:43:00',10,'booked','booking ',4,'2025-01-20 16:13:33','2025-01-20 16:13:33','xldZLaZdPr',14),(15,'93818 73146','2025-01-20 21:44:00',10,'cancelled','booking',3,'2025-01-20 16:14:34','2025-01-20 17:56:04','FjB6BfbSXS',14),(16,'9989568206','2025-01-21 18:30:00',10,'booked','reserved',3,'2025-01-20 17:46:40','2025-01-21 11:58:56','qTjQZNdldG',14),(17,'12456','2025-01-21 12:05:00',11,'booked',NULL,7,'2025-01-21 11:59:32','2025-01-21 12:02:13','e0WRw7-C2K',14),(18,'9989568201','2025-01-21 12:05:00',11,'booked',NULL,4,'2025-01-21 12:01:13','2025-01-21 12:01:58','g3TeknABV4',14),(19,'87654321','2025-01-21 13:37:00',14,'booked','Decorate the table for a special occasion.',6,'2025-01-21 13:37:49','2025-01-21 13:37:49','bAZEeXKOV6',14),(20,'07534782280','2025-01-22 16:30:00',11,'paid','Pls save the table for 15 minutes if i am late',2,'2025-01-22 17:11:34','2025-01-22 17:15:14','32tPZVPgJa',14),(23,'+19873234553','2025-01-22 10:09:00',11,'booked',NULL,2,'2025-01-23 22:10:39','2025-01-23 22:10:39','hk-ApTcCnc',14),(25,'87654321','2025-01-28 21:40:00',10,'booked',NULL,3,'2025-01-28 19:38:44','2025-01-28 19:38:44','IMyrgjLxMP',14),(26,'93818 73146','2025-01-28 22:00:00',12,'booked',NULL,2,'2025-01-28 19:39:23','2025-01-28 19:39:23','CT9qHQl99k',14),(27,'8965423212','2025-02-23 10:46:00',10,'booked',NULL,4,'2025-02-23 05:17:02','2025-02-23 05:17:02','D8CfsUeQjs',14),(28,'12456','2025-02-23 10:47:00',10,'booked',NULL,4,'2025-02-23 05:17:31','2025-02-23 05:17:31','H85_AqADqx',14),(29,'45364532543','2025-03-28 15:00:00',11,'booked','sdfsdfasdf',7,'2025-03-11 07:27:19','2025-03-11 07:27:19','ocdPbOhzk9',14),(30,'9989568204','2025-03-11 23:34:00',10,'booked',NULL,4,'2025-03-11 18:05:00','2025-03-11 18:05:00','etx9dNgaRH',14),(31,'00000','2025-03-11 23:35:00',10,'booked',NULL,4,'2025-03-11 18:05:55','2025-03-11 18:05:55','qJS1zH1hwk',14),(35,'017829647','2025-03-19 11:30:00',10,'booked',NULL,4,'2025-03-18 05:36:03','2025-03-18 05:36:03','Vy35_8EMzV',14),(36,'45364532543','2025-03-18 06:00:00',11,'booked',NULL,4,'2025-03-18 05:37:14','2025-03-18 05:37:38','8bBYqPrPKe',14),(41,'00000','2025-03-26 14:15:00',10,'booked',NULL,4,'2025-03-24 15:16:51','2025-03-26 14:15:12','jDQi8ewMXK',14),(42,'8919531591','2025-03-24 22:31:00',17,'booked',NULL,4,'2025-03-24 17:01:48','2025-03-24 17:01:48','dsAotzif1A',14),(43,'9876543245','2025-03-24 18:25:00',13,'booked',NULL,4,'2025-03-24 18:25:36','2025-03-24 18:25:36','IkcRwDDsHa',14),(44,'9876543245','2025-03-26 14:55:00',15,'booked',NULL,8,'2025-03-26 14:55:04','2025-03-26 14:55:04','vC8Km67JJk',14),(45,'9876543245','2025-03-26 14:55:00',15,'booked',NULL,4,'2025-03-26 14:55:22','2025-03-26 14:55:22','lMnbdAlkyI',14),(46,'93818 73146','2025-03-27 18:29:00',12,'booked',NULL,2,'2025-03-27 18:29:05','2025-03-27 18:29:05','Nd58UvITgQ',14),(47,'93818 73146','2025-03-27 18:29:00',12,'booked',NULL,2,'2025-03-27 18:29:11','2025-03-27 18:29:11','5Ff5-Vu1vA',14),(48,'93818 73146','2025-03-27 18:30:00',12,'booked',NULL,2,'2025-03-27 18:29:21','2025-03-27 18:29:21','lZjQZWmMc7',14),(49,'45364532543','2025-03-28 22:03:00',21,'booked','test',5,'2025-03-28 15:08:09','2025-03-28 15:08:09','sf9IDp87qL',14),(50,'987654321','2025-03-30 20:30:00',16,'booked',NULL,4,'2025-03-29 14:05:56','2025-03-29 14:05:56','oyUEPDUvUJ',14),(51,'987654321','2025-03-30 20:30:00',16,'booked',NULL,4,'2025-03-29 14:06:08','2025-03-29 14:06:08','ysVUMUA_wE',14),(52,'345325353543543','2025-04-02 13:02:00',10,'booked',NULL,4,'2025-04-01 09:30:16','2025-04-01 09:30:16','cob1Vm--xC',14),(53,'45364532543','2025-04-09 16:00:00',10,'booked','testt',4,'2025-04-01 09:31:23','2025-04-01 09:31:23','KoAZ2wOaLJ',14),(54,'45364532543','2025-05-02 14:02:00',10,'booked',NULL,4,'2025-04-01 09:34:32','2025-04-01 09:34:32','WMoGDRlqWr',14),(55,'45364532543','2025-04-17 14:00:00',10,'booked','test',4,'2025-04-01 09:36:17','2025-04-01 09:36:17','jGB0oUoM8X',14),(57,'9876543245','2025-04-02 18:50:00',13,'booked',NULL,5,'2025-04-02 17:44:13','2025-04-02 17:49:52','UmDzh5N_fK',14),(60,'987654321','2025-04-02 18:45:00',13,'booked','Table for 5',5,'2025-04-02 17:45:05','2025-04-02 17:45:05','Ti8Z6O7EWS',14),(65,'8172637164132374','2025-04-04 19:52:00',11,'booked',NULL,5,'2025-04-04 14:21:54','2025-04-04 14:22:51','RFQEseqjs9',14),(66,'987654321','2025-04-11 10:00:00',12,'booked',NULL,4,'2025-04-10 10:48:46','2025-04-10 10:48:46','zTooRjWNNI',14),(67,'00000','2025-05-09 16:00:00',12,'booked',NULL,4,'2025-05-08 09:45:13','2025-05-08 09:45:13','MvO0uDuMAK',14);
/*!40000 ALTER TABLE `reservations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reset_password_tokens`
--

DROP TABLE IF EXISTS `reset_password_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reset_password_tokens` (
  `username` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `reset_token` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `expires_at` datetime DEFAULT NULL,
  PRIMARY KEY (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reset_password_tokens`
--

LOCK TABLES `reset_password_tokens` WRITE;
/*!40000 ALTER TABLE `reset_password_tokens` DISABLE KEYS */;
INSERT INTO `reset_password_tokens` VALUES ('sai_bhavana@uvaproit.com','1a642fd463f2eda5cb71c4276ea8dcc9c40d2dd1a9d55952e6c1d50894aff4b4','2025-03-24 18:35:55'),('swethasri_pavuluri@uvaproit.com','947c9e32ac93715b9320520b658594e59b0a898191307534731478f95a9bd566','2025-03-24 12:19:48');
/*!40000 ALTER TABLE `reset_password_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `store_details`
--

DROP TABLE IF EXISTS `store_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `store_details` (
  `store_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `currency` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `image` varchar(2000) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tenant_id` int DEFAULT NULL,
  `is_qr_menu_enabled` tinyint(1) DEFAULT '0',
  `unique_qr_code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_qr_order_enabled` tinyint(1) DEFAULT NULL,
  UNIQUE KEY `tenant_id_pk` (`tenant_id`) USING BTREE,
  CONSTRAINT `store_details_ibfk_1` FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `store_details`
--

LOCK TABLES `store_details` WRITE;
/*!40000 ALTER TABLE `store_details` DISABLE KEYS */;
INSERT INTO `store_details` VALUES ('Millers','Hyderabad, Telangana','9876578965','swetha4sree@gmail.com','GBP',NULL,14,0,'YBHcPnlDtPuPD39_VLUxR',0),('','','','','GBP',NULL,18,0,'LE8rNYSWTGpYKAHBYKAsB',0);
/*!40000 ALTER TABLE `store_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `store_tables`
--

DROP TABLE IF EXISTS `store_tables`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `store_tables` (
  `id` int NOT NULL AUTO_INCREMENT,
  `table_title` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `floor` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `seating_capacity` smallint DEFAULT NULL,
  `tenant_id` int DEFAULT NULL,
  `occupancy_status` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `tenant_id` (`tenant_id`),
  CONSTRAINT `store_tables_ibfk_1` FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `store_tables`
--

LOCK TABLES `store_tables` WRITE;
/*!40000 ALTER TABLE `store_tables` DISABLE KEYS */;
INSERT INTO `store_tables` VALUES (10,'Table-1','1st-Floor',4,14,'occupied'),(11,'Table-2','1st-Floor',4,14,'vacant'),(12,'Table-3','1st-Floor',2,14,'vacant'),(13,'Table-4','1st-Floor',6,14,'vacant'),(15,'Table - 8','2nd Floor',4,14,'vacant'),(16,'Table-3','1st Floor',2,14,'vacant'),(17,'Table-9','1st Floor',4,14,'vacant'),(19,'Table-10','2nd',6,14,'occupied'),(20,'Table- 11','3rd Floor',7,14,'occupied'),(21,'table 20','2',6,14,'vacant'),(22,'Table-20','4th floor',8,18,'vacant');
/*!40000 ALTER TABLE `store_tables` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subscription_history`
--

DROP TABLE IF EXISTS `subscription_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subscription_history` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tenant_id` int DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `starts_on` datetime DEFAULT NULL,
  `expires_on` datetime DEFAULT NULL,
  `status` enum('updated','created','cancelled') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `tenant_id` (`tenant_id`),
  CONSTRAINT `subscription_history_ibfk_1` FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subscription_history`
--

LOCK TABLES `subscription_history` WRITE;
/*!40000 ALTER TABLE `subscription_history` DISABLE KEYS */;
/*!40000 ALTER TABLE `subscription_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `superadmins`
--

DROP TABLE IF EXISTS `superadmins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `superadmins` (
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `superadmins`
--

LOCK TABLES `superadmins` WRITE;
/*!40000 ALTER TABLE `superadmins` DISABLE KEYS */;
INSERT INTO `superadmins` VALUES ('superadmin@salespulse.com','$2a$10$G5qzT6vpzwDNkgK4Q.cwUu0tPpA1R9R19AJwQVaKJXj8DvLxsJ4Zu','Superadmin');
/*!40000 ALTER TABLE `superadmins` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `supplier_items`
--

DROP TABLE IF EXISTS `supplier_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `supplier_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` int DEFAULT NULL,
  `grocery_id` int DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `quantity` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  KEY `grocery_id` (`grocery_id`),
  CONSTRAINT `supplier_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `supplier_orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `supplier_items_ibfk_2` FOREIGN KEY (`grocery_id`) REFERENCES `groceries` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `supplier_items`
--

LOCK TABLES `supplier_items` WRITE;
/*!40000 ALTER TABLE `supplier_items` DISABLE KEYS */;
INSERT INTO `supplier_items` VALUES (1,1,1,1000.00,2),(2,2,1,1000.00,1);
/*!40000 ALTER TABLE `supplier_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `supplier_orders`
--

DROP TABLE IF EXISTS `supplier_orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `supplier_orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `supplier_id` varchar(45) DEFAULT NULL,
  `payment_status` varchar(45) NOT NULL DEFAULT 'pending',
  `amount_paid` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `supplier_id_idx` (`supplier_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `supplier_orders`
--

LOCK TABLES `supplier_orders` WRITE;
/*!40000 ALTER TABLE `supplier_orders` DISABLE KEYS */;
INSERT INTO `supplier_orders` VALUES (1,'2025-02-26 11:33:58','1','paid',1000),(2,'2025-03-04 12:00:00','1','pending',500);
/*!40000 ALTER TABLE `supplier_orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `suppliers`
--

DROP TABLE IF EXISTS `suppliers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `suppliers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `contact` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `suppliers`
--

LOCK TABLES `suppliers` WRITE;
/*!40000 ALTER TABLE `suppliers` DISABLE KEYS */;
INSERT INTO `suppliers` VALUES (1,'ranjith','12344567899');
/*!40000 ALTER TABLE `suppliers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `taxes`
--

DROP TABLE IF EXISTS `taxes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `taxes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `rate` double DEFAULT NULL,
  `type` enum('inclusive','exclusive','other') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'other',
  `tenant_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `tenant_id` (`tenant_id`),
  CONSTRAINT `taxes_ibfk_1` FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `taxes`
--

LOCK TABLES `taxes` WRITE;
/*!40000 ALTER TABLE `taxes` DISABLE KEYS */;
INSERT INTO `taxes` VALUES (2,'VAT',25,'exclusive',14),(4,'Service Tax',10,'exclusive',14),(5,'GST',15,'exclusive',14),(7,'VAT',20,'exclusive',18),(8,'Service Tax',10,'exclusive',18);
/*!40000 ALTER TABLE `taxes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tenants`
--

DROP TABLE IF EXISTS `tenants`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tenants` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(95) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_active` tinyint DEFAULT NULL,
  `subscription_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `payment_customer_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `subscription_start` datetime DEFAULT NULL,
  `subscription_end` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tenants`
--

LOCK TABLES `tenants` WRITE;
/*!40000 ALTER TABLE `tenants` DISABLE KEYS */;
INSERT INTO `tenants` VALUES (14,'Salespulse',1,NULL,NULL,NULL,NULL,'2024-11-28 06:28:38'),(18,'Dealpulse360',1,NULL,NULL,NULL,NULL,'2025-04-01 06:32:19'),(19,'Testaccount_11',0,NULL,NULL,NULL,NULL,'2025-04-04 11:44:13'),(20,'Investic',0,NULL,NULL,NULL,NULL,'2025-04-07 16:39:44'),(21,'Forum',0,NULL,NULL,NULL,NULL,'2025-04-10 14:32:50'),(22,'biryani house',0,NULL,NULL,NULL,NULL,'2025-04-10 14:49:05'),(23,'Dev_account_ak',0,NULL,NULL,NULL,NULL,'2025-05-03 15:05:57'),(24,'Akbusiness',0,NULL,NULL,NULL,NULL,'2025-05-03 19:36:12');
/*!40000 ALTER TABLE `tenants` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `token_sequences`
--

DROP TABLE IF EXISTS `token_sequences`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `token_sequences` (
  `tenant_id` int NOT NULL,
  `sequence_no` int DEFAULT NULL,
  `last_updated` date DEFAULT NULL,
  PRIMARY KEY (`tenant_id`),
  CONSTRAINT `token_sequences_ibfk_1` FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `token_sequences`
--

LOCK TABLES `token_sequences` WRITE;
/*!40000 ALTER TABLE `token_sequences` DISABLE KEYS */;
INSERT INTO `token_sequences` VALUES (14,1,'2025-05-08'),(18,2,'2025-04-10');
/*!40000 ALTER TABLE `token_sequences` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `username` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(95) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `role` enum('admin','user') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'user',
  `photo` varchar(2000) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `designation` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `scope` text COLLATE utf8mb4_unicode_ci,
  `tenant_id` int DEFAULT NULL,
  PRIMARY KEY (`username`),
  KEY `tenant_id` (`tenant_id`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('abhishek_kola@uvaproit.com','$2b$10$.PuLb0l3HGsw5QxC3zzB8emS9lO5mSWyf/iIPyMdDWLasyWnJEV8i','Dev_account_ak','admin',NULL,NULL,NULL,NULL,NULL,23),('admin@biryanihouse.com','$2b$10$IhiqZfbfmHTZAk26I/sw6.egu8fb5Bjclc8V9Wm.sKjHPwEMXGiTC','biryani house','admin',NULL,NULL,NULL,NULL,NULL,22),('admin@dealpulse360.com','$2b$10$7SEnH/d0gcHHiwZ00okv1.MwPtUdfX1Y9SbuveqjdOM99JAZ7WwnC','Dealpulse360','admin',NULL,NULL,NULL,NULL,NULL,18),('admin@salespulse.com','$2b$10$.rYVQdeUi05QVu4DF7sEu.YqWLWA9PMyZAvRWVscZkObFx4mme07e','Salespulse','admin',NULL,NULL,NULL,NULL,NULL,14),('Forum.776@gmail.com','$2b$10$NU4hJZejoAivbZMuR2ULh.KNidpcvXbDe1v2CQHJov1CVVJOqSz/K','Forum','admin',NULL,NULL,NULL,NULL,NULL,21),('kolaabhishek8@gmail.com','$2b$10$Osd9v6TwmqY/TJf67YtSges4iDjiN4iFSFvKZK1w9VLztzr9E5.12','Akbusiness','admin',NULL,NULL,NULL,NULL,NULL,24),('palanikumar0073@gmail.com','$2b$10$HwdsxAlHlf/hzvdz8mxPsOmEbszkdPfl78jcizLXBmTRk6OvC1MI6','Palani','user',NULL,NULL,NULL,NULL,'DASHBOARD,POS,CUSTOMER_DISPLAY,KITCHEN_DISPLAY,ORDER_STATUS_DISPLAY,ORDER_STATUS,ORDERS,KITCHEN,RESERVATIONS,VIEW_RESERVATIONS,MANAGE_RESERVATIONS,CUSTOMERS,VIEW_CUSTOMERS,MANAGE_CUSTOMERS,INVOICES,MEMBERSHIP,INVENTORY,VIEW_INVENTORY,MANAGE_INVENTORY,SETTINGS,FEEDBACK,REPORTS',14),('sai_bhavana@uvaproit.com','$2b$10$tGqlLs3o6fa6D31ng8S3jeFUY6T3n7/Ee8wE8CkLB.fxeAZhx.OBO','Sai Bhavana Samantula','user',NULL,'Tester_2','',NULL,'KITCHEN,RESERVATIONS,INVENTORY,INVOICES,REPORTS,DASHBOARD,POS,CUSTOMER_DISPLAY,KITCHEN_DISPLAY,ORDER_STATUS,ORDER_STATUS_DISPLAY,ORDERS,VIEW_RESERVATIONS,CUSTOMERS,MANAGE_RESERVATIONS,VIEW_CUSTOMERS,MANAGE_CUSTOMERS,MEMBERSHIP,VIEW_INVENTORY,MANAGE_INVENTORY,SETTINGS,FEEDBACK',14),('samantulasaibhavana@gmail.com','$2b$10$4Z9uWN.2K5uCVehxT8nXG.UMjEvGWCcf5IayJCo1E06pVrJz3VzuS','Investic','admin',NULL,NULL,NULL,NULL,NULL,20),('srija_aila@uvaproit.com','$2b$10$2ZIpZOonaVgB9Rz.6bNEZegb.EgfzcMcvxt9sAHWQ4IbYr7yk17Bq','Srija Aila','user',NULL,'Tester_5',NULL,NULL,'DASHBOARD,CUSTOMER_DISPLAY,POS,KITCHEN_DISPLAY,ORDER_STATUS_DISPLAY,ORDER_STATUS,ORDERS,KITCHEN,RESERVATIONS,VIEW_RESERVATIONS,MANAGE_RESERVATIONS,CUSTOMERS,VIEW_CUSTOMERS,MANAGE_CUSTOMERS,INVOICES,MEMBERSHIP,INVENTORY,VIEW_INVENTORY,MANAGE_INVENTORY,SETTINGS,FEEDBACK,REPORTS',14),('swetha11pavuluri@gmail.com','$2b$10$VjzH.vWrL9rx/4ZeJpJEoeiNOWCaaQ1snzogxUR6NAdFiO7h16Xja','Testaccount_11','admin',NULL,NULL,NULL,NULL,NULL,19),('swethasri_pavuluri@uvaproit.com','$2b$10$x0kT2XtcdJ.eFe/ySbkuNOGAGzc1dqv3/67bzb87gb9RxFHRiHQNW','Swetha Pavuluri','user',NULL,'Tester_1','',NULL,'DASHBOARD,POS,CUSTOMER_DISPLAY,KITCHEN_DISPLAY,ORDER_STATUS_DISPLAY,ORDER_STATUS,ORDERS,KITCHEN,RESERVATIONS,VIEW_RESERVATIONS,MANAGE_RESERVATIONS,CUSTOMERS,VIEW_CUSTOMERS,MANAGE_CUSTOMERS,INVOICES,MEMBERSHIP,INVENTORY,VIEW_INVENTORY,MANAGE_INVENTORY,SETTINGS,FEEDBACK,REPORTS',14),('test123@gmail.com','$2b$10$NKEn0cbFlDO7id/HQMPf3eClui5vllXVSJU.nh8ZqN5qgSTpk8Twm','test','user',NULL,'staff','13455645',NULL,'POS,CUSTOMER_DISPLAY,KITCHEN_DISPLAY,ORDER_STATUS_DISPLAY,ORDER_STATUS,ORDERS,KITCHEN',14),('ushaswini_mupparapu@uvaproit.com','$2b$10$q.yITmsayQVpRQQ2hapc3eD7LOKy.Y4Ftt3UVMZXQwKS.HcR0b44m','Ushaswini Verma','user',NULL,'Tester_4',NULL,NULL,'DASHBOARD,POS,CUSTOMER_DISPLAY,KITCHEN_DISPLAY,ORDER_STATUS_DISPLAY,ORDER_STATUS,ORDERS,KITCHEN,RESERVATIONS,VIEW_RESERVATIONS,MANAGE_RESERVATIONS,CUSTOMERS,VIEW_CUSTOMERS,MANAGE_CUSTOMERS,INVOICES,MEMBERSHIP,INVENTORY,VIEW_INVENTORY,MANAGE_INVENTORY,SETTINGS,FEEDBACK,REPORTS',14),('vishal_verma@uvaproit.com','$2b$10$boZ.V9WEbcmkQBqy9hw7mencyxmK6jSPnCY3MP1jzEED7AL/qG8oC','Vishal Verma','user',NULL,'Tester_3',NULL,NULL,'DASHBOARD,POS,CUSTOMER_DISPLAY,KITCHEN_DISPLAY,ORDER_STATUS_DISPLAY,ORDER_STATUS,ORDERS,KITCHEN,RESERVATIONS,VIEW_RESERVATIONS,MANAGE_RESERVATIONS,CUSTOMERS,VIEW_CUSTOMERS,MANAGE_CUSTOMERS,INVOICES,MEMBERSHIP,INVENTORY,VIEW_INVENTORY,MANAGE_INVENTORY,SETTINGS,FEEDBACK,REPORTS',14);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `work_period`
--

DROP TABLE IF EXISTS `work_period`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `work_period` (
  `id` int NOT NULL AUTO_INCREMENT,
  `start_by` varchar(45) DEFAULT NULL,
  `end_by` varchar(45) DEFAULT NULL,
  `start_date` datetime DEFAULT NULL,
  `end_date` datetime DEFAULT NULL,
  `opening_balance` decimal(10,2) DEFAULT NULL,
  `closing_balance` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `work_period`
--

LOCK TABLES `work_period` WRITE;
/*!40000 ALTER TABLE `work_period` DISABLE KEYS */;
INSERT INTO `work_period` VALUES (1,'@admin','@admin','2025-03-05 10:00:00','2025-03-06 12:00:00',100.00,500.00);
/*!40000 ALTER TABLE `work_period` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-09 12:51:34
