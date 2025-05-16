// imports
const { Server } = require('socket.io');
const pool = require("../db/connection"); // Import the database connection pool


const setupSockets = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "*", // accepting requests from all origins for now
        }
    });

    let schedule = [ // get initial data for DB
        // Segunda classes
        { Cod_Aula: 1, day: "Segunda", start: "10:00", end: "12:00", subject: "Análise Matemática I", location: "Sala B255", assigned: true },
        { Cod_Aula: 2, day: "Segunda", start: "13:00", end: "15:00", subject: "Álgebra", location: "Sala B257", assigned: true },
        { Cod_Aula: 3, day: "Segunda", start: "15:30", end: "17:00", subject: "Redes de Dados I", location: "Sala I157", assigned: true },
        // terça classes
        { Cod_Aula: 4, day: "Terça", start: "09:00", end: "11:00", subject: "Gestão", location: "Sala O120", assigned: true },
        { Cod_Aula: 5, day: "Terça", start: "11:30", end: "13:00", subject: "Química", location: "Sala Q255", assigned: true },
        { Cod_Aula: 6, day: "Terça", start: "15:30", end: "17:00", subject: "Materiais", location: "Sala H105", assigned: false },
        // Quarta classes
        { Cod_Aula: 7, day: "Quarta", start: "10:00", end: "12:00", subject: "Design", location: "Sala H120 ", assigned: false },
        { Cod_Aula: 8, day: "Quarta", start: "14:30", end: "16:00", subject: "Impressão", location: "Sala H180", assigned: false },
        // thursday classes
        { Cod_Aula: 9, day: "Quinta", start: "09:00", end: "11:00", subject: "GP", location: "Sala B155", assigned: true },
        { Cod_Aula: 10, day: "Quinta", start: "15:30", end: "17:00", subject: "DEVOPS", location: "Sala I180", assigned: false },
        // friday classes
        { Cod_Aula: 11, day: "Sexta", start: "09:00", end: "11:00", subject: "Estatística", location: "Sala G132", assigned: true },
        // saturday classes
        { Cod_Aula: 12, day: "Sábado", start: "09:00", end: "11:00", subject: "Artes", location: "Sala J130", assigned: false },
        { Cod_Aula: 13, day: "Sábado", start: "11:30", end: "13:00", subject: "História", location: "Sala G180", assigned: false },
        { Cod_Aula: 14, day: "Sábado", start: "13:30", end: "15:00", subject: "Introdução á Engenharia", location: "Sala Q255", assigned: false },
    ];

    io.on("connection", (socket) => {
        // log new connection
        console.log(`New socket connection. Socket id: ${socket.id}`);

        // send connection ack to client
        socket.emit("connection-ack-alert", "Real-time connection established.");

        // send server aulas state to client
        //socket.emit("update-aulas", { newAulas: schedule });
        //console.log(`Data sent ${schedule}`);

        // handle request for assigned classes
        socket.on("get-aulas", () => {
            socket.emit("update-aulas", { newAulas: schedule });
        });

        // handle request for unassigned classes
        socket.on("get-unassigned-aulas", () => {
            const unassignedAulas = schedule.filter((aula) => !aula.assigned); // Filter unassigned classes
            socket.emit("update-unassigned-aulas", { unassignedAulas });
        });

        socket.on("add-aula", async (data) => {
            try {
                console.log("Received add-aula event with data:", data); // Debugging log
        
                // Extract the aula details from the data
                const {
                    Cod_Docente,
                    Cod_Sala,
                    Cod_Turma,
                    Cod_Uc,
                    Cod_Curso,
                    Cod_AnoSemestre,
                    Dia,
                    Inicio,
                    Fim,
                    Cod_Escola,
                } = data.newAula;
        
                // Validate the input data
                if (!Cod_Docente || !Cod_Sala || !Cod_Turma || !Cod_Uc || !Cod_Curso || !Cod_AnoSemestre || !Dia || !Inicio || !Fim || !Cod_Escola) {
                    console.error("Invalid data for new aula:", data.newAula);
                    socket.emit("add-aula-error", { message: "Dados inválidos para adicionar aula." });
                    return;
                }
        
                // Insert the new aula into the database
                const [result] = await pool.query(
                    `INSERT INTO aula (Cod_Docente, Cod_Sala, Cod_Turma, Cod_Uc, Cod_Curso, Cod_AnoSemestre, Dia, Inicio, Fim, Cod_Escola)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [Cod_Docente, Cod_Sala, Cod_Turma, Cod_Uc, Cod_Curso, Cod_AnoSemestre, Dia, Inicio, Fim, Cod_Escola]
                );
        
                // Get the inserted aula's ID
                const newId = result.insertId;
        
                // Add the new aula to the in-memory schedule
                const newAula = {
                    Cod_Aula: newId,
                    Cod_Docente,
                    Cod_Sala,
                    Cod_Turma,
                    Cod_Uc,
                    Cod_Curso,
                    Cod_AnoSemestre,
                    Dia,
                    Inicio,
                    Fim,
                    Cod_Escola,
                    assigned: true,
                };
                console.log("Current schedule before push:", schedule);
                schedule.push(newAula);
        
                console.log("Aula added to database and schedule: ", newAula);
        
                // Broadcast the updated schedule to all clients
                console.log("Broadcasting updated schedule:", schedule);
                io.emit("update-aulas", { newAulas: schedule });
            } catch (error) {
                console.error("Error adding aula to database:", error); // Log the full error
                socket.emit("add-aula-error", { message: "Erro ao adicionar aula ao banco de dados." });
            }
        });

        // add aula to server
        // socket.on("add-aula", (data) => {
        //     check if the class is valid
        //     let valid = true;
        //     if (valid) {  // always true for now, add validation logic later (post to database)
        //         add id to new aula
        //         let newId = schedule.length + 1;
        //         data.newAula.Cod_Aula = newId;
        //         data.newAula.assigned = true; // Mark as assigned
        //         schedule.push(data.newAula); // add to server schedule
        //         console.log("Aula added: ", data.newAula);
        //         broadcast to all clients update
        //         io.emit("update-aulas", { newAulas: schedule });
        //     } else {
        //         error in adding aula
        //         console.log("Error adding aula: ", data.newAulas);
        //         socket.emit("add-aula-error", { message: "Esta aula não pode ser adicionada." });
        //     }
        // });

        // remove aula from server
        socket.on("remove-aula", (data) => {
            // check if the class is in the schedule
            let aulaExists = schedule.some((aula) => aula.Cod_Aula === data.codAula);
            if (aulaExists) {
                schedule = schedule.filter((aula) => aula.Cod_Aula !== data.codAula);
                console.log("Aula removed: ", data.codAula);
                // broadcast to all clients update
                io.emit("update-aulas", { newAulas: schedule });
            } else {
                // error in removing aula
                console.log("Error removing aula: ", data.codAula);
                socket.emit("remove-aula-error", { message: "Esta aula não pode ser removida." });
            }
        });

        // update aula in server
        socket.on("update-aula", (data) => {
            console.log(data.newDay);
            console.log(data.newStart);
            // update aula in schedule
            let aulaToUpdate = schedule.find((aula) => aula.Cod_Aula === data.codAula);
            if (aulaToUpdate) {
                aulaToUpdate.day = data.newDay;
                aulaToUpdate.start = data.newStart;
                console.log("Aula updated: ", aulaToUpdate);
                // broadcast to all clients update
                io.emit("update-aulas", { newAulas: schedule });
            } else {
                console.log("Error updating aula: ", data.codAula);
                socket.emit("update-aula-error", { message: "Esta aula não pode ser atualizada." });
            }
        });
    });

    // log setup
    console.log("Socket.io server setup complete.");


    
};

// export
module.exports = { setupSockets };