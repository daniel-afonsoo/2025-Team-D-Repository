#========== Script para BD - Eazy Schedule IPT ==========#

#=== creating the database
CREATE DATABASE IF NOT EXISTS eazyscheduleipt;

#=== using the database
USE eazyscheduleipt;

#=== creating the tables
CREATE TABLE AnoSemeste (Cod_AnoSemeste int(10) NOT NULL AUTO_INCREMENT, Ano int(10), Semeste int(10), PRIMARY KEY (Cod_AnoSemeste)) ENGINE=InnoDB;
CREATE TABLE Aula (DocenteID int(10) NOT NULL, Cod_Sala int(10) NOT NULL, Cod_turma int(10) NOT NULL, Cod_UC int(10) NOT NULL, Cod_Curso int(10) NOT NULL, Cod_AnoSemeste int(10) NOT NULL, PRIMARY KEY (DocenteID, Cod_Sala, Cod_turma)) ENGINE=InnoDB;
CREATE TABLE Curso (Cod_Curso int(10) NOT NULL AUTO_INCREMENT, Nome int(10) NOT NULL, Abreviacao int(10) NOT NULL, Cod_Escola int(10) NOT NULL, PRIMARY KEY (Cod_Curso)) ENGINE=InnoDB;
CREATE TABLE Docente (ID int(10) NOT NULL AUTO_INCREMENT, Nome int(10) NOT NULL, Email int(10) NOT NULL UNIQUE, Password int(10) NOT NULL, PRIMARY KEY (ID)) ENGINE=InnoDB;
CREATE TABLE Docente_UC (ID_Docente int(10) NOT NULL, Cod_UC int(10) NOT NULL, PRIMARY KEY (ID_Docente, Cod_UC)) ENGINE=InnoDB;
CREATE TABLE Escola (Cod_Escola int(10) NOT NULL AUTO_INCREMENT, Nome int(10) NOT NULL, Abreviacao int(10) NOT NULL, PRIMARY KEY (Cod_Escola)) ENGINE=InnoDB;
CREATE TABLE Sala (Cod_Sala int(10) NOT NULL AUTO_INCREMENT, Nome int(10) NOT NULL, Cod_Escola int(10) NOT NULL, PRIMARY KEY (Cod_Sala)) ENGINE=InnoDB;
CREATE TABLE Turma (Cod_turma int(10) NOT NULL AUTO_INCREMENT, Cod_Curso int(10) NOT NULL, Cod_AnoSemeste int(10) NOT NULL, PRIMARY KEY (Cod_turma)) ENGINE=InnoDB;
CREATE TABLE UC (Cod_UC int(10) NOT NULL AUTO_INCREMENT, Nome int(10) NOT NULL, carga_horaria int(10) NOT NULL, Cod_Curso int(10) NOT NULL, PRIMARY KEY (Cod_UC)) ENGINE=InnoDB;
CREATE TABLE UC_Turma (UCCod_UC int(10) NOT NULL, TurmaCod_turma int(10) NOT NULL, PRIMARY KEY (UCCod_UC, TurmaCod_turma)) ENGINE=InnoDB;

#=== creating the foreign keys
ALTER TABLE UC_Turma ADD CONSTRAINT FKUC_Turma876818 FOREIGN KEY (UCCod_UC) REFERENCES UC (Cod_UC);
ALTER TABLE UC_Turma ADD CONSTRAINT FKUC_Turma691803 FOREIGN KEY (TurmaCod_turma) REFERENCES Turma (Cod_turma);
ALTER TABLE Turma ADD CONSTRAINT FKTurma356620 FOREIGN KEY (Cod_Curso) REFERENCES Curso (Cod_Curso);
ALTER TABLE Turma ADD CONSTRAINT FKTurma690883 FOREIGN KEY (Cod_AnoSemeste) REFERENCES AnoSemeste (Cod_AnoSemeste);
ALTER TABLE Curso ADD CONSTRAINT FKCurso288813 FOREIGN KEY (Cod_Escola) REFERENCES Escola (Cod_Escola);
ALTER TABLE Sala ADD CONSTRAINT FKSala383381 FOREIGN KEY (Cod_Escola) REFERENCES Escola (Cod_Escola);
ALTER TABLE Aula ADD CONSTRAINT FKAula984701 FOREIGN KEY (DocenteID) REFERENCES Docente (ID);
ALTER TABLE Aula ADD CONSTRAINT FKAula204301 FOREIGN KEY (Cod_Sala) REFERENCES Sala (Cod_Sala);
ALTER TABLE Aula ADD CONSTRAINT FKAula438452 FOREIGN KEY (Cod_UC) REFERENCES UC (Cod_UC);
ALTER TABLE Aula ADD CONSTRAINT FKAula234497 FOREIGN KEY (Cod_Curso) REFERENCES Curso (Cod_Curso);
ALTER TABLE Aula ADD CONSTRAINT FKAula438918 FOREIGN KEY (Cod_turma) REFERENCES Turma (Cod_turma);
ALTER TABLE Aula ADD CONSTRAINT FKAula568760 FOREIGN KEY (Cod_AnoSemeste) REFERENCES AnoSemeste (Cod_AnoSemeste);
ALTER TABLE UC ADD CONSTRAINT FKUC184900 FOREIGN KEY (Cod_Curso) REFERENCES Curso (Cod_Curso);
ALTER TABLE Docente_UC ADD CONSTRAINT FKDocente_UC600484 FOREIGN KEY (ID_Docente) REFERENCES Docente (ID);
ALTER TABLE Docente_UC ADD CONSTRAINT FKDocente_UC929250 FOREIGN KEY (Cod_UC) REFERENCES UC (Cod_UC);
#========================================================#