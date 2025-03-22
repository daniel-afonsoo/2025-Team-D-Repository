#========== Script para BD - Eazy Schedule IPT ==========#

#=== creating the database
CREATE DATABASE IF NOT EXISTS eazyscheduleipt;

#=== using the database
USE eazyscheduleipt;

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
#========================================================#