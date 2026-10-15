-- MySQL dump 10.13  Distrib 8.0.32, for Win64 (x86_64)
--
-- Host: localhost    Database: ehr
-- ------------------------------------------------------
-- Server version	8.0.34

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
-- Table structure for table `doctorvisitdetails`
--

DROP TABLE IF EXISTS `doctorvisitdetails`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `doctorvisitdetails` (
  `DOCTORID` int unsigned NOT NULL,
  `SPECIALITYID` int DEFAULT NULL,
  `APPOINTMENTFEE` decimal(10,2) DEFAULT NULL,
  `OPDDAYS` varchar(512) DEFAULT NULL,
  `FROMMORNINGTIME` varchar(45) DEFAULT NULL,
  `TOMORNINGTIME` varchar(45) DEFAULT NULL,
  `FROMEVENINGTIME` varchar(45) DEFAULT NULL,
  `TOEVENINGTIME` varchar(45) DEFAULT NULL,
  `EMERGENCYFEE` decimal(10,2) DEFAULT NULL,
  `FOLLOWUPFEE` decimal(10,2) DEFAULT '0.00',
  `ONLINEFEE` decimal(10,2) DEFAULT '0.00',
  `FROMAFTERNOONTIME` varchar(45) DEFAULT NULL,
  `TOAFTERNOONTIME` varchar(45) DEFAULT NULL,
  `ONCALLAPPOINTMENTFEE` decimal(10,2) DEFAULT '0.00',
  `DEGREEONE` varchar(1024) DEFAULT NULL,
  `DEGREETWO` varchar(1024) DEFAULT NULL,
  `DEGREETHREE` varchar(1024) DEFAULT NULL,
  `DEGREEFOUR` varchar(1024) DEFAULT NULL,
  PRIMARY KEY (`DOCTORID`),
  UNIQUE KEY `DOCTORID_UNIQUE` (`DOCTORID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `doctorvisitdetails`
--

LOCK TABLES `doctorvisitdetails` WRITE;
/*!40000 ALTER TABLE `doctorvisitdetails` DISABLE KEYS */;
INSERT INTO `doctorvisitdetails` VALUES (2,21,500.00,'MON,TUE,WED,THU,FRI,SAT,SUN','9:00 AM','1:00 PM','1:00 PM','7:00 PM',1200.00,650.00,120.00,NULL,NULL,0.00,NULL,NULL,NULL,NULL),(3,21,100.00,'MON,TUE,WED,THU,FRI,SAT,SUN','5:06 AM','5:06 PM','6:06 AM','7:06 PM',300.00,150.00,600.00,'','',0.00,'Primary Medical Degree','Postgraduate  Specialization 1','Postgraduate  Specialization 2','Postgraduate  Specialization 3');
/*!40000 ALTER TABLE `doctorvisitdetails` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'ehr'
--

--
-- Dumping routines for database 'ehr'
--
/*!50003 DROP PROCEDURE IF EXISTS `sp_CHECK_STOCK_ACCOUNT` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb3 */ ;
/*!50003 SET character_set_results = utf8mb3 */ ;
/*!50003 SET collation_connection  = utf8mb3_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`counterest`@`%` PROCEDURE `sp_CHECK_STOCK_ACCOUNT`(IN accountID int(4), OUT ISSTOCK INT)
BEGIN
   SELECT COUNT(*) INTO ISSTOCK FROM ACCOUNT WHERE id = accountID and groupid = 17;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_FSTFINANCIALYEAR` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`counterest`@`%` PROCEDURE `sp_FSTFINANCIALYEAR`(IN fy int(4))
BEGIN
   
    SELECT STARTDATE FROM FINANCIALYEARTBL ORDER BY ID ASC LIMIT 1;
     if (fy = 1) then
        SELECT ENDDATE  FROM FINANCIALYEARTBL ORDER BY ID ASC LIMIT 1;
    else 
        SELECT ENDDATE  FROM FINANCIALYEARTBL where Id < fy ORDER BY ID   DESC LIMIT 1;
    end if;
    
   
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-10-14 18:14:31
