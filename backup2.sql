-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: valorant_tracker
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `favoritos`
--

DROP TABLE IF EXISTS `favoritos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `favoritos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `usuario_id` int(11) NOT NULL,
  `jogador_id` int(11) NOT NULL,
  `criado_em` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_favorite` (`usuario_id`,`jogador_id`),
  KEY `jogador_id` (`jogador_id`),
  CONSTRAINT `favoritos_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  CONSTRAINT `favoritos_ibfk_2` FOREIGN KEY (`jogador_id`) REFERENCES `jogadores` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `favoritos`
--

LOCK TABLES `favoritos` WRITE;
/*!40000 ALTER TABLE `favoritos` DISABLE KEYS */;
/*!40000 ALTER TABLE `favoritos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jogadores`
--

DROP TABLE IF EXISTS `jogadores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `jogadores` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `riot_name` varchar(100) NOT NULL,
  `riot_tag` varchar(50) NOT NULL,
  `puuid` varchar(120) DEFAULT NULL,
  `atualizado_em` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `criado_em` datetime DEFAULT current_timestamp(),
  `rank` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_player` (`riot_name`,`riot_tag`),
  UNIQUE KEY `puuid` (`puuid`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jogadores`
--

LOCK TABLES `jogadores` WRITE;
/*!40000 ALTER TABLE `jogadores` DISABLE KEYS */;
INSERT INTO `jogadores` VALUES (1,'kenJI','eeeh','884cc8f6-e692-58b9-81a9-d7ee7594feaa','2026-05-04 11:29:15','2026-05-04 11:29:15',NULL);
/*!40000 ALTER TABLE `jogadores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `partidas`
--

DROP TABLE IF EXISTS `partidas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `partidas` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `jogador_id` int(11) NOT NULL,
  `match_id` varchar(100) NOT NULL,
  `mapa` varchar(100) DEFAULT NULL,
  `modo` varchar(50) DEFAULT NULL,
  `agente` varchar(100) DEFAULT NULL,
  `kills` int(11) DEFAULT NULL,
  `deaths` int(11) DEFAULT NULL,
  `assists` int(11) DEFAULT NULL,
  `kdr` decimal(4,2) DEFAULT NULL,
  `resultado` varchar(20) DEFAULT NULL,
  `data_partida` datetime DEFAULT NULL,
  `criado_em` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `match_id` (`match_id`),
  KEY `jogador_id` (`jogador_id`),
  CONSTRAINT `partidas_ibfk_1` FOREIGN KEY (`jogador_id`) REFERENCES `jogadores` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `partidas`
--

LOCK TABLES `partidas` WRITE;
/*!40000 ALTER TABLE `partidas` DISABLE KEYS */;
INSERT INTO `partidas` VALUES (1,1,'a8c95dbf-afea-474c-b1f3-676f96a408e1','Ascent','Competitive','Chamber',17,16,5,1.06,'Derrota','2026-05-02 18:15:53','2026-05-04 11:29:15'),(2,1,'bd686c2e-3a49-4777-98e0-0988fa9fef57','Fracture','Competitive','Deadlock',5,20,8,0.25,'Derrota','2026-05-02 17:29:49','2026-05-04 11:29:15'),(3,1,'4273f604-4225-4de9-9fa8-c4abae1709f0','Breeze','Competitive','Gekko',6,18,3,0.33,'Derrota','2026-05-02 16:45:58','2026-05-04 11:29:15'),(4,1,'6141b7a6-5170-4c66-9445-44ad2562ea7f','Split','Competitive','Omen',12,18,11,0.67,'Vitória','2026-05-01 22:51:16','2026-05-04 11:29:15'),(5,1,'88950f63-5f6a-4705-a51b-05bc18eec473','Split','Competitive','Omen',13,14,6,0.93,'Derrota','2026-05-01 22:17:26','2026-05-04 11:29:15'),(6,1,'53dc85c2-1a2c-4e7f-871c-314d8edc13cb','Lotus','Competitive','Chamber',12,12,3,1.00,'Vitória','2026-04-30 18:43:00','2026-05-04 11:29:15'),(7,1,'38270f24-7e0d-4f74-950b-00e0b74e11e0','Breeze','Competitive','Omen',11,16,5,0.69,'Derrota','2026-04-30 17:50:51','2026-05-04 11:29:15'),(8,1,'17b8f954-0bf5-4dad-9cad-f762e480a51d','Fracture','Competitive','KAY/O',24,20,8,1.20,'Vitória','2026-04-30 16:42:09','2026-05-04 11:29:15'),(9,1,'b448ed0b-97a0-474f-be42-f06f6981eefb','Haven','Competitive','Sova',7,17,8,0.41,'Derrota','2026-04-29 22:11:23','2026-05-04 11:29:15'),(10,1,'42eb6561-2325-414b-b368-765f15790236','Ascent','Competitive','Fade',12,5,8,2.40,'Vitória','2026-04-29 21:41:10','2026-05-04 11:29:15');
/*!40000 ALTER TABLE `partidas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rank_snapshots`
--

DROP TABLE IF EXISTS `rank_snapshots`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `rank_snapshots` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `jogador_id` int(11) NOT NULL,
  `rank` varchar(50) DEFAULT NULL,
  `rr` int(11) DEFAULT NULL,
  `data_coleta` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `jogador_id` (`jogador_id`),
  CONSTRAINT `rank_snapshots_ibfk_1` FOREIGN KEY (`jogador_id`) REFERENCES `jogadores` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rank_snapshots`
--

LOCK TABLES `rank_snapshots` WRITE;
/*!40000 ALTER TABLE `rank_snapshots` DISABLE KEYS */;
/*!40000 ALTER TABLE `rank_snapshots` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `senha` varchar(255) NOT NULL,
  `criado_em` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-04 11:31:14
