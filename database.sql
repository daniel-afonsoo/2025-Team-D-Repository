#========== Script para BD - Easy Schedule IPT ==========#

#=== creating the database
CREATE DATABASE IF NOT EXISTS easyscheduleipt;

#=== using the database
USE easyscheduleipt;

#=== creating the tables
CREATE TABLE AnoSemeste (Cod_AnoSemeste int(10) NOT NULL AUTO_INCREMENT, Ano int(5), Semeste smallint(1), PRIMARY KEY (Cod_AnoSemeste)) ENGINE=InnoDB;
CREATE TABLE Aula (ID_Docente int(10) NOT NULL, Cod_Sala int(10) NOT NULL, Cod_turma int(10) NOT NULL, Cod_UC int(10) NOT NULL, Cod_Curso int(10) NOT NULL, Cod_AnoSemeste int(10) NOT NULL, PRIMARY KEY (ID_Docente, Cod_Sala, Cod_turma)) ENGINE=InnoDB;
CREATE TABLE Curso (Cod_Curso int(10) NOT NULL AUTO_INCREMENT, Nome varchar(100) NOT NULL, Abreviacao varchar(5) NOT NULL, Cod_Escola int(10) NOT NULL, PRIMARY KEY (Cod_Curso)) ENGINE=InnoDB;
CREATE TABLE Docente (ID int(10) NOT NULL AUTO_INCREMENT, Nome varchar(50) NOT NULL, Email varchar(100) NOT NULL UNIQUE, Password varchar(255) NOT NULL, PRIMARY KEY (ID)) ENGINE=InnoDB;
CREATE TABLE Docente_UC (ID_Docente int(10) NOT NULL, Cod_UC int(10) NOT NULL, PRIMARY KEY (ID_Docente, Cod_UC)) ENGINE=InnoDB;
CREATE TABLE Escola (Cod_Escola int(10) NOT NULL AUTO_INCREMENT, Nome varchar(50) NOT NULL, Abreviacao varchar(5) NOT NULL, PRIMARY KEY (Cod_Escola)) ENGINE=InnoDB;
CREATE TABLE Sala (Cod_Sala int(10) NOT NULL AUTO_INCREMENT, Nome varchar(50) NOT NULL, Cod_Escola int(10) NOT NULL, PRIMARY KEY (Cod_Sala)) ENGINE=InnoDB;
CREATE TABLE Turma (Cod_Turma int(10) NOT NULL AUTO_INCREMENT, Cod_Curso int(10) NOT NULL, Cod_AnoSemeste int(10) NOT NULL, PRIMARY KEY (Cod_Turma)) ENGINE=InnoDB;
CREATE TABLE UC (Cod_UC int(10) NOT NULL AUTO_INCREMENT, Nome varchar(50) NOT NULL, horas int(10) NOT NULL, Cod_Curso int(10) NOT NULL, PRIMARY KEY (Cod_UC)) ENGINE=InnoDB;
CREATE TABLE UC_Turma (Cod_UC int(10) NOT NULL, Cod_Turma int(10) NOT NULL, PRIMARY KEY (Cod_UC, Cod_Turma)) ENGINE=InnoDB;

#=== creating the foreign keys
ALTER TABLE Sala ADD CONSTRAINT FKSala383381 FOREIGN KEY (Cod_Escola) REFERENCES Escola (Cod_Escola);
ALTER TABLE Aula ADD CONSTRAINT FKAula91283 FOREIGN KEY (ID_Docente) REFERENCES Docente (ID);
ALTER TABLE Aula ADD CONSTRAINT FKAula204301 FOREIGN KEY (Cod_Sala) REFERENCES Sala (Cod_Sala);
ALTER TABLE Aula ADD CONSTRAINT FKAula438452 FOREIGN KEY (Cod_UC) REFERENCES UC (Cod_UC);
ALTER TABLE Aula ADD CONSTRAINT FKAula234497 FOREIGN KEY (Cod_Curso) REFERENCES Curso (Cod_Curso);
ALTER TABLE Aula ADD CONSTRAINT FKAula886216 FOREIGN KEY (Cod_turma) REFERENCES Turma (Cod_Turma);
ALTER TABLE Aula ADD CONSTRAINT FKAula568760 FOREIGN KEY (Cod_AnoSemeste) REFERENCES AnoSemeste (Cod_AnoSemeste);
ALTER TABLE Curso ADD CONSTRAINT FKCurso288813 FOREIGN KEY (Cod_Escola) REFERENCES Escola (Cod_Escola);
ALTER TABLE Turma ADD CONSTRAINT FKTurma356620 FOREIGN KEY (Cod_Curso) REFERENCES Curso (Cod_Curso);
ALTER TABLE Turma ADD CONSTRAINT FKTurma690883 FOREIGN KEY (Cod_AnoSemeste) REFERENCES AnoSemeste (Cod_AnoSemeste);
ALTER TABLE UC_Turma ADD CONSTRAINT FKUC_Turma319518 FOREIGN KEY (Cod_UC) REFERENCES UC (Cod_UC);
ALTER TABLE UC_Turma ADD CONSTRAINT FKUC_Turma452449 FOREIGN KEY (Cod_Turma) REFERENCES Turma (Cod_Turma);
ALTER TABLE UC ADD CONSTRAINT FKUC184900 FOREIGN KEY (Cod_Curso) REFERENCES Curso (Cod_Curso);
ALTER TABLE Docente_UC ADD CONSTRAINT FKDocente_UC600484 FOREIGN KEY (ID_Docente) REFERENCES Docente (ID);
ALTER TABLE Docente_UC ADD CONSTRAINT FKDocente_UC929250 FOREIGN KEY (Cod_UC) REFERENCES UC (Cod_UC);



#======= Temporary data =======#

#=== Docentes
INSERT INTO Docente (ID, Nome, Email, Password) VALUES (1, 'João', 'docente-1@ipt.pt', '1234');
INSERT INTO Docente (ID, Nome, Email, Password) VALUES (2, 'Maria', 'docente-2@ipt.pt', '1234');
INSERT INTO Docente (ID, Nome, Email, Password) VALUES (3, 'Carlos', 'docente-3@ipt.pt', '1234');
INSERT INTO Docente (ID, Nome, Email, Password) VALUES (4, 'Ana', 'docente-4@ipt.pt', '1234');
INSERT INTO Docente (ID, Nome, Email, Password) VALUES (5, 'Pedro', 'docente-5@ipt.pt', '1234');
INSERT INTO Docente (ID, Nome, Email, Password) VALUES (6, 'Sofia', 'docente-6@ipt.pt', '1234');
INSERT INTO Docente (ID, Nome, Email, Password) VALUES (7, 'Rui', 'docente-7@ipt.pt', '1234');
INSERT INTO Docente (ID, Nome, Email, Password) VALUES (8, 'Inês', 'docente-8@ipt.pt', '1234');
INSERT INTO Docente (ID, Nome, Email, Password) VALUES (9, 'Miguel', 'docente-9@ipt.pt', '1234');
INSERT INTO Docente (ID, Nome, Email, Password) VALUES (10, 'Beatriz', 'docente-10@ipt.pt', '1234');
INSERT INTO Docente (ID, Nome, Email, Password) VALUES (11, 'Tiago', 'docente-11@ipt.pt', '1234');
INSERT INTO Docente (ID, Nome, Email, Password) VALUES (12, 'Rita', 'docente-12@ipt.pt', '1234');
INSERT INTO Docente (ID, Nome, Email, Password) VALUES (13, 'André', 'docente-13@ipt.pt', '1234');
INSERT INTO Docente (ID, Nome, Email, Password) VALUES (14, 'Patrícia', 'docente-14@ipt.pt', '1234');
INSERT INTO Docente (ID, Nome, Email, Password) VALUES (15, 'Gonçalo', 'docente-15@ipt.pt', '1234');
INSERT INTO Docente (ID, Nome, Email, Password) VALUES (16, 'Vanessa', 'docente-16@ipt.pt', '1234');
INSERT INTO Docente (ID, Nome, Email, Password) VALUES (17, 'Bruno', 'docente-17@ipt.pt', '1234');
INSERT INTO Docente (ID, Nome, Email, Password) VALUES (18, 'Catarina', 'docente-18@ipt.pt', '1234');
INSERT INTO Docente (ID, Nome, Email, Password) VALUES (19, 'Fábio', 'docente-19@ipt.pt', '1234');
INSERT INTO Docente (ID, Nome, Email, Password) VALUES (20, 'Marta', 'docente-20@ipt.pt', '1234');
INSERT INTO Docente (ID, Nome, Email, Password) VALUES (21, 'Luís', 'docente-21@ipt.pt', '1234');
INSERT INTO Docente (ID, Nome, Email, Password) VALUES (22, 'Helena', 'docente-22@ipt.pt', '1234');
INSERT INTO Docente (ID, Nome, Email, Password) VALUES (23, 'Ricardo', 'docente-23@ipt.pt', '1234');
INSERT INTO Docente (ID, Nome, Email, Password) VALUES (24, 'Cláudia', 'docente-24@ipt.pt', '1234');
INSERT INTO Docente (ID, Nome, Email, Password) VALUES (25, 'Hugo', 'docente-25@ipt.pt', '1234');
INSERT INTO Docente (ID, Nome, Email, Password) VALUES (26, 'Joana', 'docente-26@ipt.pt', '1234');
INSERT INTO Docente (ID, Nome, Email, Password) VALUES (27, 'Daniel', 'docente-27@ipt.pt', '1234');
INSERT INTO Docente (ID, Nome, Email, Password) VALUES (28, 'Teresa', 'docente-28@ipt.pt', '1234');
INSERT INTO Docente (ID, Nome, Email, Password) VALUES (29, 'Eduardo', 'docente-29@ipt.pt', '1234');
INSERT INTO Docente (ID, Nome, Email, Password) VALUES (30, 'Lara', 'docente-30@ipt.pt', '1234');
INSERT INTO Docente (ID, Nome, Email, Password) VALUES (31, 'Vítor', 'docente-31@ipt.pt', '1234');
INSERT INTO Docente (ID, Nome, Email, Password) VALUES (32, 'Carla', 'docente-32@ipt.pt', '1234');
INSERT INTO Docente (ID, Nome, Email, Password) VALUES (33, 'Samuel', 'docente-33@ipt.pt', '1234');
INSERT INTO Docente (ID, Nome, Email, Password) VALUES (34, 'Isabel', 'docente-34@ipt.pt', '1234');
INSERT INTO Docente (ID, Nome, Email, Password) VALUES (35, 'Nuno', 'docente-35@ipt.pt', '1234');
INSERT INTO Docente (ID, Nome, Email, Password) VALUES (36, 'Raquel', 'docente-36@ipt.pt', '1234');
INSERT INTO Docente (ID, Nome, Email, Password) VALUES (37, 'Paulo', 'docente-37@ipt.pt', '1234');
INSERT INTO Docente (ID, Nome, Email, Password) VALUES (38, 'Tânia', 'docente-38@ipt.pt', '1234');
INSERT INTO Docente (ID, Nome, Email, Password) VALUES (39, 'Fernando', 'docente-39@ipt.pt', '1234');
INSERT INTO Docente (ID, Nome, Email, Password) VALUES (40, 'Susana', 'docente-40@ipt.pt', '1234');
INSERT INTO Docente (ID, Nome, Email, Password) VALUES (41, 'Diogo', 'docente-41@ipt.pt', '1234');
INSERT INTO Docente (ID, Nome, Email, Password) VALUES (42, 'Alexandra', 'docente-42@ipt.pt', '1234');
INSERT INTO Docente (ID, Nome, Email, Password) VALUES (43, 'Marco', 'docente-43@ipt.pt', '1234');
INSERT INTO Docente (ID, Nome, Email, Password) VALUES (44, 'Daniela', 'docente-44@ipt.pt', '1234');
INSERT INTO Docente (ID, Nome, Email, Password) VALUES (45, 'Sérgio', 'docente-45@ipt.pt', '1234');
INSERT INTO Docente (ID, Nome, Email, Password) VALUES (46, 'Mariana', 'docente-46@ipt.pt', '1234');
INSERT INTO Docente (ID, Nome, Email, Password) VALUES (47, 'Jorge', 'docente-47@ipt.pt', '1234');
INSERT INTO Docente (ID, Nome, Email, Password) VALUES (48, 'Liliana', 'docente-48@ipt.pt', '1234');
INSERT INTO Docente (ID, Nome, Email, Password) VALUES (49, 'Artur', 'docente-49@ipt.pt', '1234');
INSERT INTO Docente (ID, Nome, Email, Password) VALUES (50, 'Sara', 'docente-50@ipt.pt', '1234');



#========================================================#