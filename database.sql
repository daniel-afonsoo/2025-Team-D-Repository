-- Banco de dados: `easyscheduleipt`
--

-- --------------------------------------------------------

--
-- Estrutura da tabela `anosemestre`
--

USE easyscheduleipt;

CREATE TABLE `anosemestre` (
  `Cod_AnoSemestre` int(10) NOT NULL,
  `Ano` int(5) DEFAULT NULL,
  `Semestre` smallint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Extraindo dados da tabela `anosemestre`
--

INSERT INTO `anosemestre` (`Cod_AnoSemestre`, `Ano`, `Semestre`) VALUES
(1, 2020, 1);

-- --------------------------------------------------------

--
-- Estrutura da tabela `aula`
--

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
  `Cod_Escola` int(10) NOT NULL,
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `curso`
--

CREATE TABLE `curso` (
  `Cod_Curso` int(10) NOT NULL,
  `Nome` varchar(100) NOT NULL,
  `Abreviacao` varchar(5) NOT NULL,
  `Cod_Escola` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Extraindo dados da tabela `curso`
--

INSERT INTO `curso` (`Cod_Curso`, `Nome`, `Abreviacao`, `Cod_Escola`) VALUES
(1, 'LEI', 'LEI', 1);

-- --------------------------------------------------------

--
-- Estrutura da tabela `docente`
--

CREATE TABLE `docente` (
  `Cod_Docente` int(10) NOT NULL,
  `Nome` varchar(50) NOT NULL,
  `Email` varchar(100) NOT NULL,
  `Password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Extraindo dados da tabela `docente`
--

INSERT INTO `docente` (`Cod_Docente`, `Nome`, `Email`, `Password`) VALUES
(1, 'João', 'docente-1@ipt.pt', '1234'),
(2, 'Maria', 'docente-2@ipt.pt', '1234'),
(3, 'Carlos', 'docente-3@ipt.pt', '1234'),
(4, 'Ana', 'docente-4@ipt.pt', '1234'),
(5, 'Pedro', 'docente-5@ipt.pt', '1234'),
(6, 'Sofia', 'docente-6@ipt.pt', '1234'),
(7, 'Rui', 'docente-7@ipt.pt', '1234'),
(8, 'Inês', 'docente-8@ipt.pt', '1234'),
(9, 'Miguel', 'docente-9@ipt.pt', '1234'),
(10, 'Beatriz', 'docente-10@ipt.pt', '1234'),
(11, 'Tiago', 'docente-11@ipt.pt', '1234'),
(12, 'Rita', 'docente-12@ipt.pt', '1234'),
(13, 'André', 'docente-13@ipt.pt', '1234'),
(14, 'Patrícia', 'docente-14@ipt.pt', '1234'),
(15, 'Gonçalo', 'docente-15@ipt.pt', '1234'),
(16, 'Vanessa', 'docente-16@ipt.pt', '1234'),
(17, 'Bruno', 'docente-17@ipt.pt', '1234'),
(18, 'Catarina', 'docente-18@ipt.pt', '1234'),
(19, 'Fábio', 'docente-19@ipt.pt', '1234'),
(20, 'Marta', 'docente-20@ipt.pt', '1234'),
(21, 'Luís', 'docente-21@ipt.pt', '1234'),
(22, 'Helena', 'docente-22@ipt.pt', '1234'),
(23, 'Ricardo', 'docente-23@ipt.pt', '1234'),
(24, 'Cláudia', 'docente-24@ipt.pt', '1234'),
(25, 'Hugo', 'docente-25@ipt.pt', '1234'),
(26, 'Joana', 'docente-26@ipt.pt', '1234'),
(27, 'Daniel', 'docente-27@ipt.pt', '1234'),
(28, 'Teresa', 'docente-28@ipt.pt', '1234'),
(29, 'Eduardo', 'docente-29@ipt.pt', '1234'),
(30, 'Lara', 'docente-30@ipt.pt', '1234'),
(31, 'Vítor', 'docente-31@ipt.pt', '1234'),
(32, 'Carla', 'docente-32@ipt.pt', '1234'),
(33, 'Samuel', 'docente-33@ipt.pt', '1234'),
(34, 'Isabel', 'docente-34@ipt.pt', '1234'),
(35, 'Nuno', 'docente-35@ipt.pt', '1234'),
(36, 'Raquel', 'docente-36@ipt.pt', '1234'),
(37, 'Paulo', 'docente-37@ipt.pt', '1234'),
(38, 'Tânia', 'docente-38@ipt.pt', '1234'),
(39, 'Fernando', 'docente-39@ipt.pt', '1234'),
(40, 'Susana', 'docente-40@ipt.pt', '1234'),
(41, 'Diogo', 'docente-41@ipt.pt', '1234'),
(42, 'Alexandra', 'docente-42@ipt.pt', '1234'),
(43, 'Marco', 'docente-43@ipt.pt', '1234'),
(44, 'Daniela', 'docente-44@ipt.pt', '1234'),
(45, 'Sérgio', 'docente-45@ipt.pt', '1234'),
(46, 'Mariana', 'docente-46@ipt.pt', '1234'),
(47, 'Jorge', 'docente-47@ipt.pt', '1234'),
(48, 'Liliana', 'docente-48@ipt.pt', '1234'),
(49, 'Artur', 'docente-49@ipt.pt', '1234'),
(50, 'Sara', 'docente-50@ipt.pt', '1234'),
(51, 'aahahhahaahahahaha', 'AAHAHAHAHA@gmail.com', '1234'),
(52, 'Guilherme Limões', 'gl@ipt.pt', '1234'),
(53, 'Carlos Queiroz', 'carlos@ipt.pt', '1234');

-- --------------------------------------------------------

--
-- Estrutura da tabela `docente_uc`
--

CREATE TABLE `docente_uc` (
  `Cod_Docente` int(10) NOT NULL,
  `Cod_Uc` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `escola`
--

CREATE TABLE `escola` (
  `Cod_Escola` int(10) NOT NULL,
  `Nome` varchar(50) NOT NULL,
  `Abreviacao` varchar(5) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Extraindo dados da tabela `escola`
--

INSERT INTO `escola` (`Cod_Escola`, `Nome`, `Abreviacao`) VALUES
(1, 'Escola Superior De Tecnologia de Tomar', 'ESTT'),
(2, 'Escola Superior De Tecnologia de Abrantes', 'ESTA'),
(3, 'Escola Superior De Gestão de Tomar', 'ESGT');

-- --------------------------------------------------------

--
-- Estrutura da tabela `sala`
--

CREATE TABLE `sala` (
  `Cod_Sala` int(10) NOT NULL,
  `Nome` varchar(50) NOT NULL,
  `Cod_Escola` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Extraindo dados da tabela `sala`
--

INSERT INTO `sala` (`Cod_Sala`, `Nome`, `Cod_Escola`) VALUES
(1, 'B255', 1),
(2, '6', 1),
(3, 'B256', 1);

-- --------------------------------------------------------

--
-- Estrutura da tabela `turma`
--

CREATE TABLE `turma` (
  `Cod_Turma` int(10) NOT NULL,
  `Cod_Curso` int(10) NOT NULL,
  `Cod_AnoSemestre` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Extraindo dados da tabela `turma`
--

INSERT INTO `turma` (`Cod_Turma`, `Cod_Curso`, `Cod_AnoSemestre`) VALUES
(2, 1, 1);

-- --------------------------------------------------------

--
-- Estrutura da tabela `uc`
--

CREATE TABLE `uc` (
  `Cod_Uc` int(10) NOT NULL,
  `Nome` varchar(50) NOT NULL,
  `Horas` int(10) NOT NULL,
  `Cod_Curso` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Extraindo dados da tabela `uc`
--

INSERT INTO `uc` (`Cod_Uc`, `Nome`, `Horas`, `Cod_Curso`) VALUES
(1, 'AC', 2, 1);

-- --------------------------------------------------------

--
-- Estrutura da tabela `uc_turma`
--

CREATE TABLE `uc_turma` (
  `Cod_Uc` int(10) NOT NULL,
  `Cod_Turma` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Índices para tabelas despejadas
--

--
-- Índices para tabela `anosemestre`
--
ALTER TABLE `anosemestre`
  ADD PRIMARY KEY (`Cod_AnoSemestre`);

--
-- Índices para tabela `aula`
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
-- Índices para tabela `curso`
--
ALTER TABLE `curso`
  ADD PRIMARY KEY (`Cod_Curso`),
  ADD KEY `FKCurso288813` (`Cod_Escola`);

--
-- Índices para tabela `docente`
--
ALTER TABLE `docente`
  ADD PRIMARY KEY (`Cod_Docente`),
  ADD UNIQUE KEY `Email` (`Email`);

--
-- Índices para tabela `docente_uc`
--
ALTER TABLE `docente_uc`
  ADD PRIMARY KEY (`Cod_Docente`,`Cod_Uc`),
  ADD KEY `FKDocente_UC929250` (`Cod_Uc`);

--
-- Índices para tabela `escola`
--
ALTER TABLE `escola`
  ADD PRIMARY KEY (`Cod_Escola`);

--
-- Índices para tabela `sala`
--
ALTER TABLE `sala`
  ADD PRIMARY KEY (`Cod_Sala`),
  ADD KEY `FKSala383381` (`Cod_Escola`);

--
-- Índices para tabela `turma`
--
ALTER TABLE `turma`
  ADD PRIMARY KEY (`Cod_Turma`),
  ADD KEY `FKTurma356620` (`Cod_Curso`),
  ADD KEY `FKTurma690883` (`Cod_AnoSemestre`);

--
-- Índices para tabela `uc`
--
ALTER TABLE `uc`
  ADD PRIMARY KEY (`Cod_Uc`),
  ADD KEY `FKUC184900` (`Cod_Curso`);

--
-- Índices para tabela `uc_turma`
--
ALTER TABLE `uc_turma`
  ADD PRIMARY KEY (`Cod_Uc`,`Cod_Turma`),
  ADD KEY `FKUC_Turma452449` (`Cod_Turma`);

--
-- AUTO_INCREMENT de tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `aula`
--
ALTER TABLE `aula`
  MODIFY `Cod_Aula` int(10) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `curso`
--
ALTER TABLE `curso`
  MODIFY `Cod_Curso` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de tabela `docente`
--
ALTER TABLE `docente`
  MODIFY `Cod_Docente` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=54;

--
-- AUTO_INCREMENT de tabela `escola`
--
ALTER TABLE `escola`
  MODIFY `Cod_Escola` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de tabela `sala`
--
ALTER TABLE `sala`
  MODIFY `Cod_Sala` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de tabela `turma`
--
ALTER TABLE `turma`
  MODIFY `Cod_Turma` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de tabela `uc`
--
ALTER TABLE `uc`
  MODIFY `Cod_Uc` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Restrições para despejos de tabelas
--

--
-- Limitadores para a tabela `aula`
--
ALTER TABLE `aula`
  ADD CONSTRAINT `FKAula204301` FOREIGN KEY (`Cod_Sala`) REFERENCES `sala` (`Cod_Sala`),
  ADD CONSTRAINT `FKAula234497` FOREIGN KEY (`Cod_Curso`) REFERENCES `curso` (`Cod_Curso`),
  ADD CONSTRAINT `FKAula438452` FOREIGN KEY (`Cod_UC`) REFERENCES `uc` (`Cod_UC`),
  ADD CONSTRAINT `FKAula568760` FOREIGN KEY (`Cod_AnoSemestre`) REFERENCES `anosemestre` (`Cod_AnoSemestre`),
  ADD CONSTRAINT `FKAula886216` FOREIGN KEY (`Cod_Turma`) REFERENCES `turma` (`Cod_Turma`),
  ADD CONSTRAINT `FKAula91283` FOREIGN KEY (`Cod_Docente`) REFERENCES `docente` (`Cod_Docente`);

--
-- Limitadores para a tabela `curso`
--
ALTER TABLE `curso`
  ADD CONSTRAINT `FKCurso288813` FOREIGN KEY (`Cod_Escola`) REFERENCES `escola` (`Cod_Escola`);

--
-- Limitadores para a tabela `sala`
--
ALTER TABLE `sala`
  ADD CONSTRAINT `FKSala383381` FOREIGN KEY (`Cod_Escola`) REFERENCES `escola` (`Cod_Escola`);

--
-- Limitadores para a tabela `turma`
--
ALTER TABLE `turma`
  ADD CONSTRAINT `FKTurma356620` FOREIGN KEY (`Cod_Curso`) REFERENCES `curso` (`Cod_Curso`),
  ADD CONSTRAINT `FKTurma690883` FOREIGN KEY (`Cod_AnoSemestre`) REFERENCES `anosemestre` (`Cod_AnoSemestre`);

--
-- Limitadores para a tabela `uc`
--
ALTER TABLE `uc`
  ADD CONSTRAINT `FKUC184900` FOREIGN KEY (`Cod_Curso`) REFERENCES `curso` (`Cod_Curso`);

--
-- Limitadores para a tabela `uc_turma`
--
ALTER TABLE `uc_turma`
  ADD CONSTRAINT `FKUC_Turma319518` FOREIGN KEY (`Cod_UC`) REFERENCES `uc` (`Cod_UC`),
  ADD CONSTRAINT `FKUC_Turma452449` FOREIGN KEY (`Cod_Turma`) REFERENCES `turma` (`Cod_Turma`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
