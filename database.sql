--
-- Database: `easyscheduleipt`
--
create database if not exists easyscheduleipt;

USE easyscheduleipt;

-- --------------------------------------------------------

--
-- Table structure for table `anosemestre`
--
DROP TABLE IF EXISTS `anosemestre`;
CREATE TABLE `anosemestre` (
  `Cod_AnoSemestre` int(10) NOT NULL,
  `Nome` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `aula`
--
DROP TABLE IF EXISTS `aula`;
CREATE TABLE `aula` (
  `Cod_Aula` int(10) NOT NULL,
  `Cod_Docente` int(10) NOT NULL,
  `Cod_Sala` int(10) NOT NULL,
  `Cod_Turma` int(10) NOT NULL,
  `Cod_Uc` int(10) NOT NULL,
  `Cod_Curso` int(10) NOT NULL,
  `Cod_AnoSemestre` int(10) NOT NULL,
  `Dia` varchar(50) NOT NULL,
  `Inicio` varchar(50) NOT NULL,
  `Fim` varchar(50) NOT NULL,
  `Duration` varchar(4) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `curso`
--
DROP TABLE IF EXISTS `curso`;
CREATE TABLE `curso` (
  `Cod_Curso` int(10) NOT NULL,
  `Nome` varchar(100) NOT NULL,
  `Abreviacao` varchar(5) NOT NULL,
  `Cod_Escola` int(10) NOT NULL,
  `Duracao` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `docente`
--
DROP TABLE IF EXISTS `docente`;
CREATE TABLE `docente` (
  `Cod_Docente` int(10) NOT NULL,
  `Nome` varchar(50) NOT NULL,
  `Email` varchar(100) NOT NULL,
  `Password` varchar(255) NOT NULL,
  `role` enum('prof','comissao','diretor','admin') NOT NULL DEFAULT 'prof'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `docente`
--

INSERT INTO `docente` (`Cod_Docente`, `Nome`, `Email`, `Password`, `role`) VALUES
(1, 'Administrador', 'admin@ipt.pt', '$2b$10$sT42caz4wNx326TTQmZl4e1JvOU6OaslzF/.taw/c1CZx7r21Ojbi', 'admin');

-- --------------------------------------------------------

--
-- Table structure for table `escola`
--
DROP TABLE IF EXISTS `escola`;
CREATE TABLE `escola` (
  `Cod_Escola` int(10) NOT NULL,
  `Nome` varchar(50) NOT NULL,
  `Abreviacao` varchar(5) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sala`
--
DROP TABLE IF EXISTS `sala`;
CREATE TABLE `sala` (
  `Cod_Sala` int(10) NOT NULL,
  `Nome` varchar(50) NOT NULL,
  `Cod_Escola` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `turma`
--
DROP TABLE IF EXISTS `turma`;
CREATE TABLE `turma` (
  `Cod_Turma` int(10) NOT NULL,
  `Cod_Curso` int(10) NOT NULL,
  `Cod_AnoSemestre` int(10) NOT NULL,
  `Turma_Abv` varchar(50) DEFAULT NULL,
  `AnoTurma` int(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `uc`
--
DROP TABLE IF EXISTS `uc`;
CREATE TABLE `uc` (
  `Cod_Uc` int(10) NOT NULL,
  `Nome` varchar(50) NOT NULL,
  `Cod_Curso` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `anosemestre`
--
ALTER TABLE `anosemestre`
  ADD PRIMARY KEY (`Cod_AnoSemestre`);

--
-- Indexes for table `aula`
--
ALTER TABLE `aula`
  ADD PRIMARY KEY (`Cod_Aula`),
  ADD KEY `FKAula91283` (`Cod_Docente`),
  ADD KEY `FKAula204301` (`Cod_Sala`),
  ADD KEY `FKAula438452` (`Cod_Uc`),
  ADD KEY `FKAula234497` (`Cod_Curso`),
  ADD KEY `FKAula886216` (`Cod_Turma`),
  ADD KEY `FKAula568760` (`Cod_AnoSemestre`);

--
-- Indexes for table `curso`
--
ALTER TABLE `curso`
  ADD PRIMARY KEY (`Cod_Curso`),
  ADD KEY `FKCurso288813` (`Cod_Escola`);

--
-- Indexes for table `docente`
--
ALTER TABLE `docente`
  ADD PRIMARY KEY (`Cod_Docente`),
  ADD UNIQUE KEY `Email` (`Email`);

--
-- Indexes for table `escola`
--
ALTER TABLE `escola`
  ADD PRIMARY KEY (`Cod_Escola`);

--
-- Indexes for table `sala`
--
ALTER TABLE `sala`
  ADD PRIMARY KEY (`Cod_Sala`),
  ADD KEY `FKSala383381` (`Cod_Escola`);

--
-- Indexes for table `turma`
--
ALTER TABLE `turma`
  ADD PRIMARY KEY (`Cod_Turma`),
  ADD KEY `FKTurma356620` (`Cod_Curso`),
  ADD KEY `FKTurma690883` (`Cod_AnoSemestre`);

--
-- Indexes for table `uc`
--
ALTER TABLE `uc`
  ADD PRIMARY KEY (`Cod_Uc`),
  ADD KEY `FKUC184900` (`Cod_Curso`);

--
-- AUTO_INCREMENT for table `aula`
--
ALTER TABLE `aula`
  MODIFY `Cod_Aula` int(10) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `curso`
--
ALTER TABLE `curso`
  MODIFY `Cod_Curso` int(10) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `docente`
--
ALTER TABLE `docente`
  MODIFY `Cod_Docente` int(10) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `escola`
--
ALTER TABLE `escola`
  MODIFY `Cod_Escola` int(10) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sala`
--
ALTER TABLE `sala`
  MODIFY `Cod_Sala` int(10) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `turma`
--
ALTER TABLE `turma`
  MODIFY `Cod_Turma` int(10) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `uc`
--
ALTER TABLE `uc`
  MODIFY `Cod_Uc` int(10) NOT NULL AUTO_INCREMENT;

--
-- Constraints for table `aula`
--
ALTER TABLE `aula`
  ADD CONSTRAINT `FKAula204301` FOREIGN KEY (`Cod_Sala`) REFERENCES `sala` (`Cod_Sala`),
  ADD CONSTRAINT `FKAula234497` FOREIGN KEY (`Cod_Curso`) REFERENCES `curso` (`Cod_Curso`),
  ADD CONSTRAINT `FKAula438452` FOREIGN KEY (`Cod_Uc`) REFERENCES `uc` (`Cod_Uc`),
  ADD CONSTRAINT `FKAula568760` FOREIGN KEY (`Cod_AnoSemestre`) REFERENCES `anosemestre` (`Cod_AnoSemestre`),
  ADD CONSTRAINT `FKAula886216` FOREIGN KEY (`Cod_Turma`) REFERENCES `turma` (`Cod_Turma`),
  ADD CONSTRAINT `FKAula91283` FOREIGN KEY (`Cod_Docente`) REFERENCES `docente` (`Cod_Docente`);

--
-- Constraints for table `curso`
--
ALTER TABLE `curso`
  ADD CONSTRAINT `FKCurso288813` FOREIGN KEY (`Cod_Escola`) REFERENCES `escola` (`Cod_Escola`);

--
-- Constraints for table `sala`
--
ALTER TABLE `sala`
  ADD CONSTRAINT `FKSala383381` FOREIGN KEY (`Cod_Escola`) REFERENCES `escola` (`Cod_Escola`);

--
-- Constraints for table `turma`
--
ALTER TABLE `turma`
  ADD CONSTRAINT `FKTurma356620` FOREIGN KEY (`Cod_Curso`) REFERENCES `curso` (`Cod_Curso`),
  ADD CONSTRAINT `FKTurma690883` FOREIGN KEY (`Cod_AnoSemestre`) REFERENCES `anosemestre` (`Cod_AnoSemestre`);

--
-- Constraints for table `uc`
--
ALTER TABLE `uc`
  ADD CONSTRAINT `FKUC184900` FOREIGN KEY (`Cod_Curso`) REFERENCES `curso` (`Cod_Curso`);
COMMIT;

-- --------------------------------------------------------
