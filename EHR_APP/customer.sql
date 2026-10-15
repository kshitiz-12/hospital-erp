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
-- Table structure for table `customer`
--

DROP TABLE IF EXISTS `customer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customer` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `NAME` varchar(255) DEFAULT NULL,
  `ADDRESS` varchar(255) DEFAULT NULL,
  `CITYID` int DEFAULT NULL,
  `STATEID` int DEFAULT NULL,
  `COUNTRYID` int DEFAULT NULL,
  `PINCODE` varchar(10) DEFAULT NULL,
  `PHONENUMBER` varchar(15) DEFAULT NULL,
  `MOBILENUMBER` varchar(15) DEFAULT NULL,
  `EMAILID` varchar(255) DEFAULT NULL,
  `DATEOFBIRTH` date DEFAULT NULL,
  `SPOUSEDATEOFBIRTH` date DEFAULT NULL,
  `MARRIAGEANNIVERSARY` date DEFAULT NULL,
  `CREATEDBY` int NOT NULL,
  `UPDATEDBY` int DEFAULT NULL,
  `STATUS` int DEFAULT NULL,
  `PANCARD` varchar(10) DEFAULT NULL,
  `AADHARCARD` varchar(12) DEFAULT NULL,
  `CUSTOMERTYPE` int DEFAULT '0',
  `GSTNUMBER` varchar(30) DEFAULT NULL,
  `COMPANYID` int DEFAULT NULL,
  `TRANSACTIONDATE` int DEFAULT '0',
  `ISREP` int DEFAULT '1',
  `ISDEFAULT` int DEFAULT '0',
  `REFERREDBY` int DEFAULT '0',
  `GENDERID` int DEFAULT '0',
  `UHID` int DEFAULT '0',
  `AGE` varchar(255) DEFAULT NULL,
  `FATHERNAME` varchar(255) DEFAULT NULL,
  `HEIGHT` decimal(10,2) DEFAULT '0.00',
  `WEIGHT` decimal(10,3) DEFAULT '0.000',
  `TEMPERATURE` decimal(10,2) DEFAULT '0.00',
  `CREATEDDATE` date DEFAULT NULL,
  `BLOODGROUP` varchar(45) DEFAULT NULL,
  `INSURANCECOMPANYID` int DEFAULT '0',
  `PRETITLE` varchar(45) DEFAULT NULL,
  `POSTTITLE` varchar(45) DEFAULT NULL,
  `HOWDIDYOUHEARABOUTUS` varchar(512) DEFAULT NULL,
  `WHATSAPP` varchar(45) DEFAULT NULL,
  `DELETECOMMENTS` varchar(512) DEFAULT NULL,
  `DELETEDBY` int DEFAULT '0',
  `DELETEDATE` date DEFAULT NULL,
  `DELETETIME` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `UHID_UNIQUE` (`UHID`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customer`
--

LOCK TABLES `customer` WRITE;
/*!40000 ALTER TABLE `customer` DISABLE KEYS */;
INSERT INTO `customer` VALUES (1,'WALK-IN','',1,30,1,'','','','',NULL,NULL,NULL,0,0,1,'','',0,'',1,0,1,1,0,0,0,NULL,NULL,0.00,0.000,0.00,NULL,NULL,0,'','',NULL,NULL,NULL,0,NULL,NULL),(2,'Parth Verma','A-220 civil lines',1,30,1,NULL,NULL,'9829819204',NULL,'2014-02-12',NULL,NULL,0,NULL,1,NULL,NULL,0,NULL,1,20250827,1,0,0,1,1,'10','Lokesh Verma',4.50,45.000,96.00,'2025-08-27','a+',0,'baby','sonoff','google',NULL,NULL,0,NULL,NULL),(3,'Poonam Sharma','NK Public Scool Jaipur',1,30,1,NULL,NULL,'9930939903',NULL,'2025-08-04',NULL,NULL,0,NULL,1,NULL,NULL,0,NULL,1,20250827,1,0,0,1,2,'15','Sachin Sharma',6.50,60.000,98.00,'2025-08-27','a+',0,'baby','sonoff','',NULL,NULL,0,NULL,NULL),(4,'Kapil','Alaok nagar Home no 36',2,30,1,NULL,NULL,'9825641245',NULL,'2023-12-01',NULL,NULL,0,NULL,1,NULL,NULL,0,NULL,1,20250827,1,0,0,1,3,'','',5.20,55.000,98.00,'2025-08-27','a+',0,'baby','sonoff','Google',NULL,NULL,0,NULL,NULL),(5,'Komal Mathur','The height of the text field should be sufficient to accommodate the text even after potential line wrapping (though the primary goal of ScaleFont is horizontal fit, wrapping can still occur if words are long',1,30,1,NULL,NULL,'9856412457',NULL,'2023-10-01',NULL,NULL,0,0,1,NULL,NULL,0,NULL,1,20260122,1,0,32,1,4,'','Umesh Mathur',5.50,55.000,90.00,'2025-08-27','a+',0,'miss','dotroff','Face Book',NULL,NULL,0,NULL,NULL),(6,'Sandeep Kumar','Siv Colony Alka Road',1,30,1,NULL,NULL,'9825645125',NULL,'2015-08-04',NULL,NULL,0,NULL,1,NULL,NULL,0,NULL,1,20250827,1,0,32,1,5,'10','Mohan Kumar',5.50,74.000,98.00,'2025-08-27','a+',34,'baby','sonoff','Face Book',NULL,NULL,0,NULL,NULL),(7,'Nitin Gupta','',1,30,1,NULL,NULL,'9845152524',NULL,'2019-08-13',NULL,NULL,0,NULL,1,NULL,NULL,0,NULL,1,20250827,1,0,0,1,6,'6','Manoj Gupta',0.00,0.000,98.00,'2025-08-27','a+',0,'baby','sonoff','',NULL,NULL,0,NULL,NULL),(8,'Umesh','sec 12 home no 44',1,30,1,NULL,NULL,'9825412458',NULL,'2025-01-03',NULL,NULL,0,NULL,1,NULL,NULL,0,NULL,1,20251020,1,0,0,1,7,'','manoj thakur',2.40,9.000,98.00,'2025-10-20','a+',0,'mr','sonoff','Google',NULL,NULL,0,NULL,NULL),(9,'umang garg','',1,30,1,NULL,NULL,'9856485458',NULL,'2024-11-06',NULL,NULL,0,NULL,1,NULL,NULL,0,NULL,1,20251020,1,0,0,1,8,'','',0.00,0.000,0.00,'2025-10-20','a+',0,'mr','sonoff','',NULL,NULL,0,NULL,NULL),(10,'Manish','',1,30,1,NULL,NULL,'9829819204',NULL,NULL,NULL,NULL,0,NULL,1,NULL,NULL,0,NULL,1,20260119,1,0,0,1,9,'','Punit',0.00,0.000,0.00,'2026-01-19','a+',35,'master','sonoff','',NULL,NULL,0,NULL,NULL),(11,'Sugam singh','',1,30,1,NULL,NULL,'',NULL,NULL,NULL,NULL,0,NULL,1,NULL,NULL,0,NULL,1,20260119,1,0,0,1,10,'','manoj',0.00,0.000,0.00,'2026-01-19','a+',35,'master','sonoff','',NULL,NULL,0,NULL,NULL),(12,'Neha','',1,30,1,NULL,NULL,'',NULL,NULL,NULL,NULL,0,NULL,1,NULL,NULL,0,NULL,1,20260119,1,0,0,1,11,'','Manoj',0.00,0.000,0.00,'2026-01-19','a+',35,'master','sonoff','',NULL,NULL,0,NULL,NULL),(13,'kapil','',1,30,1,NULL,NULL,'',NULL,NULL,NULL,NULL,0,NULL,1,NULL,NULL,0,NULL,1,20260119,1,0,0,1,12,'','',0.00,0.000,0.00,'2026-01-19','a+',0,'master','sonoff','',NULL,NULL,0,NULL,NULL),(14,'Harish','',1,30,1,NULL,NULL,'',NULL,NULL,NULL,NULL,0,NULL,1,NULL,NULL,0,NULL,1,20260119,1,0,0,1,13,'','',0.00,0.000,0.00,'2026-01-19','a+',0,'master','sonoff','',NULL,NULL,0,NULL,NULL),(15,'Umesh','',1,30,1,NULL,NULL,'',NULL,NULL,NULL,NULL,0,NULL,1,NULL,NULL,0,NULL,1,20260119,1,0,0,1,14,'','',0.00,0.000,0.00,'2026-01-19','a+',0,'master','sonoff','',NULL,NULL,0,NULL,NULL),(16,'Sandeep','',1,30,1,NULL,NULL,'',NULL,NULL,NULL,NULL,0,NULL,1,NULL,NULL,0,NULL,1,20260119,1,0,0,1,15,'','',0.00,0.000,0.00,'2026-01-19','a+',35,'master','sonoff','',NULL,NULL,0,NULL,NULL),(17,'OP verma','',1,30,1,NULL,NULL,'',NULL,NULL,NULL,NULL,0,NULL,1,NULL,NULL,0,NULL,1,20260119,1,0,0,1,16,'','',0.00,0.000,0.00,'2026-01-19','a+',35,'master','sonoff','',NULL,NULL,0,NULL,NULL),(18,'tarun','',1,30,1,NULL,NULL,'',NULL,NULL,NULL,NULL,0,NULL,1,NULL,NULL,0,NULL,1,20260119,1,0,0,1,17,'','',0.00,0.000,0.00,'2026-01-19','a+',35,'master','sonoff','',NULL,NULL,0,NULL,NULL),(19,'Kalpit','',1,30,1,NULL,NULL,'',NULL,NULL,NULL,NULL,0,NULL,1,NULL,NULL,0,NULL,1,20260119,1,0,0,1,18,'','',0.00,0.000,0.00,'2026-01-19','a+',35,'master','sonoff','',NULL,NULL,0,NULL,NULL),(20,'kima','',1,30,1,NULL,NULL,'',NULL,NULL,NULL,NULL,0,0,1,NULL,NULL,0,NULL,1,20260122,1,0,0,1,19,'','',0.00,0.000,0.00,'2026-01-22','0',0,'mr','sonoff','',NULL,NULL,0,NULL,NULL),(21,'lokesh whatup','',1,30,1,NULL,NULL,'9829819204','lokesh.27mca@gmail.com',NULL,NULL,NULL,0,1,1,NULL,NULL,0,NULL,1,20260122,2,0,0,1,20,'',NULL,0.00,0.000,0.00,'2026-01-22','0',0,'mr','sonoff',NULL,'9930939903',NULL,0,NULL,NULL),(22,'komal ','',1,30,1,NULL,NULL,'',NULL,'2016-05-01',NULL,NULL,0,0,1,NULL,NULL,0,NULL,1,20260122,1,0,0,1,21,'9 Y, 8 M, 21 Days','',0.00,0.000,0.00,'2026-01-22','0',0,'mr','sonoff','',NULL,NULL,0,NULL,NULL),(23,'Esha Sharma','',1,30,1,NULL,NULL,'',NULL,NULL,NULL,NULL,0,NULL,1,NULL,NULL,0,NULL,1,20260401,1,0,0,1,22,'','',0.00,0.000,0.00,'2026-04-01','0',0,'mr','sonoff','',NULL,NULL,0,NULL,NULL),(24,'Sandesh Desai','Sec 12 sfs Colony ',1,30,1,NULL,NULL,'9645874578',NULL,'1978-06-20',NULL,NULL,0,NULL,1,NULL,NULL,0,NULL,1,20260417,1,0,0,1,23,'48','Vinod Desai',0.00,0.000,0.00,'2026-04-17','0',35,'master','sonoff','Google',NULL,NULL,0,NULL,NULL),(25,'Simran Sharma','',1,30,1,NULL,NULL,'9245785424',NULL,NULL,NULL,NULL,0,NULL,1,NULL,NULL,0,NULL,1,20260624,1,0,0,2,24,'','',0.00,0.000,0.00,'2026-06-24','a+',0,'mr','sonoff','',NULL,NULL,0,NULL,NULL),(26,'monu singh','',1,30,1,NULL,NULL,'',NULL,NULL,NULL,NULL,0,NULL,1,NULL,NULL,0,NULL,1,20260727,1,0,0,1,25,'','',0.00,0.000,0.00,'2026-07-27','0',35,'master','sonoff','',NULL,NULL,0,NULL,NULL),(27,'mona','',1,30,1,NULL,NULL,'',NULL,NULL,NULL,NULL,0,NULL,1,NULL,NULL,0,NULL,1,20260727,1,0,0,1,26,'','',0.00,0.000,0.00,'2026-07-27','0',0,'master','sonoff','',NULL,NULL,0,NULL,NULL);
/*!40000 ALTER TABLE `customer` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb3 */ ;
/*!50003 SET character_set_results = utf8mb3 */ ;
/*!50003 SET collation_connection  = utf8mb3_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`counterest`@`%`*/ /*!50003 TRIGGER `CUSTOMER_IDS_VALIDATION_BEFORE_INSERT_TRIGGER` BEFORE INSERT ON `customer` FOR EACH ROW BEGIN
     IF(new.CITYID = 0) THEN
     SIGNAL SQLSTATE '45000'
     SET MESSAGE_TEXT = 'CAN NOT INSERT ZERO CITYID ';
     END IF;
     IF(new.STATEID = 0 ) THEN
     SIGNAL SQLSTATE '45000'
     SET MESSAGE_TEXT = 'CAN NOT INSERT ZERO COMPANYID';
     END IF;
      IF(new.COUNTRYID = 0) THEN
     SIGNAL SQLSTATE '45000'
     SET MESSAGE_TEXT = 'CAN NOT INSERT ZERO FINANCIALYEARID';
     END IF; 
      
     END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `CUSTOMER_BEFORE_INSERT` BEFORE INSERT ON `customer` FOR EACH ROW BEGIN
    INSERT INTO CUSTOMER_AUDIT
    SET ACTIONTYPE = 3,
	ID = NEW.ID, 
  	NEW_NAME  = NEW.NAME,
  	NEW_ADDRESS  = NEW.ADDRESS,
  	NEW_CITYID = NEW.CITYID,
  	NEW_STATEID = NEW.STATEID,
  	NEW_COUNTRYID = NEW.COUNTRYID,
  	NEW_PINCODE = NEW.PINCODE,
  	PHONENUMBER = NEW.PHONENUMBER,
  	NEW_MOBILENUMBER = NEW.MOBILENUMBER,
  	NEW_EMAILID  =NEW.EMAILID,
  	NEW_DATEOFBIRTH = NEW.DATEOFBIRTH,
  	NEW_SPOUSEDATEOFBIRTH = NEW.SPOUSEDATEOFBIRTH,
  	NEW_MARRIAGEANNIVERSARY = NEW.MARRIAGEANNIVERSARY,
  	NEW_CREATEDBY = NEW.CREATEDBY,
  	NEW_UPDATEDBY = NEW.UPDATEDBY,
  	NEW_STATUS = NEW.STATUS,
  	NEW_PANCARD = NEW.PANCARD,
  	NEW_AADHARCARD = NEW.AADHARCARD,
  	CUSTOMERTYPE = NEW.CUSTOMERTYPE,
  	NEW_GSTNUMBER = NEW.GSTNUMBER,
  	COMPANYID = NEW.COMPANYID,
  	ISREP = NEW.ISREP,
  	ISDEFAULT = NEW.ISDEFAULT,
  	TRANSACTIONDATE = NEW.TRANSACTIONDATE,
    NEW_GENDERID = NEW.GENDERID,  	
	NEW_UHID = NEW.UHID,
	NEW_AGE = NEW.AGE,
	NEW_FATHERNAME = NEW.FATHERNAME,
	NEW_HEIGHT = NEW.HEIGHT,
	NEW_WEIGHT = NEW.WEIGHT,
	NEW_TEMPERATURE = NEW.TEMPERATURE,  	
  	AUDITDATE = curdate(),
  	AUDITTIME = curtime(),
  	OLD_CREATEDBY = NEW.CREATEDBY,
  	OLD_UPDATEDBY = NEW.UPDATEDBY;

	INSERT INTO AUDITLOGS(TABLENAME,INVOICEID,VOUCHERID,AUDITDATE,AUDITTIME,USERID,ACTIONTYPE)
	VALUES ('CUSTOMER',0,0,curdate(),curtime(),new.UPDATEDBY,3);
 
    END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb3 */ ;
/*!50003 SET character_set_results = utf8mb3 */ ;
/*!50003 SET collation_connection  = utf8mb3_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`counterest`@`%`*/ /*!50003 TRIGGER `CUSTOMER_IDS_VALIDATION_BEFORE_UPDATE_TRIGGER` BEFORE UPDATE ON `customer` FOR EACH ROW BEGIN
     IF(new.CITYID = 0) THEN
     SIGNAL SQLSTATE '45000'
     SET MESSAGE_TEXT = 'CAN NOT INSERT ZERO CITYID ';
     END IF;
     IF(new.STATEID = 0 ) THEN
     SIGNAL SQLSTATE '45000'
     SET MESSAGE_TEXT = 'CAN NOT INSERT ZERO STATEID';
     END IF;
      IF(new.COUNTRYID = 0) THEN
     SIGNAL SQLSTATE '45000'
     SET MESSAGE_TEXT = 'CAN NOT INSERT ZERO COUNTRYID';
     END IF; 
      
     END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `CUSTOMER_BEFORE_UPDATE` BEFORE UPDATE ON `customer` FOR EACH ROW BEGIN
    INSERT INTO CUSTOMER_AUDIT
    SET ACTIONTYPE = 3,
	ID = OLD.ID, 
  	OLD_NAME  = OLD.NAME,
  	NEW_NAME  = NEW.NAME,
  	OLD_ADDRESS  = OLD.ADDRESS,
  	NEW_ADDRESS  = NEW.ADDRESS,
  	OLD_CITYID = OLD.CITYID,
  	NEW_CITYID = NEW.CITYID,
  	OLD_STATEID = OLD.STATEID,
  	NEW_STATEID = NEW.STATEID,
  	OLD_COUNTRYID = OLD.COUNTRYID,
  	NEW_COUNTRYID = NEW.COUNTRYID,
  	OLD_PINCODE = OLD.PINCODE,
  	NEW_PINCODE = NEW.PINCODE,
  	PHONENUMBER = OLD.PHONENUMBER,
  	OLD_MOBILENUMBER = OLD.MOBILENUMBER,
  	NEW_MOBILENUMBER = NEW.MOBILENUMBER,
  	OLD_EMAILID  = OLD.EMAILID,
  	NEW_EMAILID  =NEW.EMAILID,
  	OLD_DATEOFBIRTH = OLD.DATEOFBIRTH,
  	NEW_DATEOFBIRTH = NEW.DATEOFBIRTH,
  	OLD_SPOUSEDATEOFBIRTH = OLD.SPOUSEDATEOFBIRTH,
  	NEW_SPOUSEDATEOFBIRTH = NEW.SPOUSEDATEOFBIRTH,
  	OLD_MARRIAGEANNIVERSARY = OLD.MARRIAGEANNIVERSARY,
  	NEW_MARRIAGEANNIVERSARY = NEW.MARRIAGEANNIVERSARY,
  	OLD_CREATEDBY = OLD.CREATEDBY,
  	NEW_CREATEDBY = NEW.CREATEDBY,
  	OLD_UPDATEDBY = OLD.UPDATEDBY,
  	NEW_UPDATEDBY = NEW.UPDATEDBY,
  	OLD_STATUS = OLD.STATUS,
  	NEW_STATUS = NEW.STATUS,
  	OLD_PANCARD = OLD.PANCARD,
  	NEW_PANCARD = NEW.PANCARD,
	OLD_AADHARCARD = OLD.AADHARCARD,
  	NEW_AADHARCARD = NEW.AADHARCARD,
  	CUSTOMERTYPE = OLD.CUSTOMERTYPE,
  	OLD_GSTNUMBER = OLD.GSTNUMBER,
  	NEW_GSTNUMBER = NEW.GSTNUMBER,
  	COMPANYID = OLD.COMPANYID,
  	ISREP = OLD.ISREP,
  	ISDEFAULT = OLD.ISDEFAULT,
  	TRANSACTIONDATE = OLD.TRANSACTIONDATE,
  	OLD_GENDERID = OLD.GENDERID,  	
    NEW_GENDERID = NEW.GENDERID,  	
  	OLD_UHID = OLD.UHID,
	NEW_UHID = NEW.UHID,
	OLD_AGE = OLD.AGE,
	NEW_AGE = NEW.AGE,
	OLD_FATHERNAME = OLD.FATHERNAME,
	NEW_FATHERNAME = NEW.FATHERNAME,
	OLD_HEIGHT = OLD.HEIGHT,
	NEW_HEIGHT = NEW.HEIGHT,
	OLD_WEIGHT = OLD.WEIGHT,
	NEW_WEIGHT = NEW.WEIGHT,
	OLD_TEMPERATURE = OLD.TEMPERATURE,
	NEW_TEMPERATURE = NEW.TEMPERATURE,  	
  	AUDITDATE = curdate(),
  	AUDITTIME = curtime();

	INSERT INTO AUDITLOGS(TABLENAME,INVOICEID,VOUCHERID,AUDITDATE,AUDITTIME,USERID,ACTIONTYPE)
	VALUES ('CUSTOMER',0,0,curdate(),curtime(),new.UPDATEDBY,3);
 
    END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

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

-- Dump completed on 2026-10-14 18:19:36
