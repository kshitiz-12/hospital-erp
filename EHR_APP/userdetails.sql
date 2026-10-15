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
-- Table structure for table `userdetails`
--

DROP TABLE IF EXISTS `userdetails`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `userdetails` (
  `EMPID` int NOT NULL AUTO_INCREMENT,
  `FIRSTNAME` varchar(100) DEFAULT NULL,
  `LASTNAME` varchar(50) DEFAULT NULL,
  `MIDDLENAME` varchar(50) DEFAULT NULL,
  `AGE` varchar(3) DEFAULT NULL,
  `DOB` date DEFAULT NULL,
  `STATUS` int DEFAULT NULL,
  `ADDRESS` varchar(500) DEFAULT NULL,
  `PHONENUMBER` varchar(10) DEFAULT NULL,
  `EMAILID` varchar(255) DEFAULT NULL,
  `GENDER` varchar(1) DEFAULT NULL,
  `EMPLOYMENTDATE` date DEFAULT NULL,
  `MOBILENUMBER` varchar(10) DEFAULT NULL,
  `ACCOUNTNUMBER` varchar(45) DEFAULT NULL,
  `BANKNAME` varchar(50) DEFAULT NULL,
  `CREATEDBY` int DEFAULT '0',
  `UPDATEDBY` int DEFAULT '0',
  `USERID` varchar(45) NOT NULL,
  `USERROLE` int DEFAULT NULL,
  `SALTVALUE` varchar(45) DEFAULT NULL,
  `COMPANYID` int DEFAULT NULL,
  `MARITALSTATUS` int DEFAULT '0',
  `PANCARDNUMBER` varchar(45) DEFAULT NULL,
  `AADHAARCARDNUMBER` varchar(45) DEFAULT NULL,
  `BANKID` int DEFAULT '0',
  `GUARANTOR` varchar(255) DEFAULT NULL,
  `SQID` int DEFAULT NULL,
  `SQANS` varchar(255) DEFAULT NULL,
  `IFSCCODE` varchar(45) DEFAULT NULL,
  `COMMISSION` varchar(45) DEFAULT NULL,
  `SALARY` varchar(45) DEFAULT NULL,
  `TRANSACTIONDATE` int DEFAULT '0',
  `ISREP` int DEFAULT '1',
  `SPECIALTYID` int DEFAULT '0',
  `REGISTRATIONNUMBER` varchar(125) DEFAULT NULL,
  `QUALIFICATION` varchar(512) DEFAULT NULL,
  `DEFAULTUSER` int DEFAULT NULL,
  `BUSINESSNAME` varchar(45) DEFAULT NULL,
  `DOCTORTYPES` varchar(90) DEFAULT NULL,
  PRIMARY KEY (`EMPID`),
  UNIQUE KEY `USERID_UNIQUE` (`USERID`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `userdetails`
--

LOCK TABLES `userdetails` WRITE;
/*!40000 ALTER TABLE `userdetails` DISABLE KEYS */;
INSERT INTO `userdetails` VALUES (1,'Lokesh',NULL,NULL,NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,'9829819204',NULL,NULL,0,0,'9829819204',6,'587936066',1,0,NULL,NULL,0,NULL,1,'demo',NULL,NULL,NULL,20250827,2,21,'8224',NULL,0,'EHR','ayurveda'),(2,'Dr. Mukesh',NULL,NULL,NULL,'2025-08-12',3,'Sample',NULL,'','1','2025-08-06','9636834940','',NULL,0,0,'9636834940',7,'-1731513302',1,0,'','',0,'',1,'Demo','','','',0,1,21,'8224','',0,NULL,'ayurveda'),(3,'Dr. Mamta',NULL,NULL,NULL,'2025-08-27',3,'sample',NULL,'','2','2025-08-27','9930939903','',NULL,0,0,'9930939903',7,'1058042209',1,0,'','',0,'',1,'demo','','','',0,1,21,'8224','',1,NULL,'ayurveda');
/*!40000 ALTER TABLE `userdetails` ENABLE KEYS */;
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

-- Dump completed on 2026-10-14 18:16:12
