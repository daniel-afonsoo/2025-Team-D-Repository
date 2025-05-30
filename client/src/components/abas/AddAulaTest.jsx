import React from "react";
import socket from "../../utils/socket"; // Import your socket instance

function AddAulaTest() {
    const handleAddAula = () => {
      const newAula = {
        Cod_Docente: 1, // Integer
        Cod_Sala: 255, // Integer (e.g., "Sala B255" -> 255)
        Cod_Turma: 2, // Integer (e.g., "Turma A" -> 1)
        Cod_Uc: 1, // Integer (e.g., "MAT101" -> 101)
        Cod_Curso: 1, // Integer (e.g., "Engenharia" -> 1)
        Cod_AnoSemestre: 1, // Integer (e.g., "2025-1" -> 20251)
        Dia: "Segunda", // String
        Inicio: "10:00:00", // String
        Fim: "12:00:00", // String
        Cod_Escola: 1, // Integer (e.g., "Escola A" -> 1)
      };
  
      console.log("Emitting add-aula event with data:", newAula); // Debugging log
      socket.emit("add-aula", { newAula });
  
      // Optionally listen for success or error responses
      socket.on("add-aula-error", (data) => {
        console.error("Error adding aula:", data.message);
      });
  
      socket.on("update-aulas", (data) => {
        console.log("Updated aulas received:", data.newAulas);
      });
    };
  
    return (
      <div>
        <button onClick={handleAddAula}>Test Add Aula</button>
      </div>
    );
  }
  
  export default AddAulaTest;