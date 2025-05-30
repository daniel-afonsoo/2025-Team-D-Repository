// imports
const { Server } = require('socket.io');
const { setSocketIOInstance, logToClient, getBufferedLogs } = require('../utils/logger'); // import logger instance
const pool = require('../db/connection.js');
const { formatAulaRow, addAulaToDB, removeAulaFromDB, updateAulaInDB } = require('../utils/utils.js');

const setupSockets = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "*",                        // accepting requests from all origins for now 
        }
    })

    setSocketIOInstance(io); // set the socket.io instance in the logger

    // array to hold the schedule data
    let schedule = [];

    (async () => {
        logToClient("setup", "Loading registered classes from database...");

        try {
            const [rows] = await pool.promise().query("SELECT * FROM aula");
            schedule = rows.map(formatAulaRow);
            console.log("Classes loaded from database: ", schedule);
            logToClient("setup", "Finished loading classes from database.");
        } catch (err) {
            console.error(err);
            logToClient("error", `Failed to Load Classes (${err.code})`, `Could not load classses from database. Check database connection.`);
        }
    })();

    io.on("connection", (socket) => {

        // Send buffered logs to newly connected client
        getBufferedLogs().forEach(log => {
            socket.emit('console-log', log);
        });

        // log new connection
        console.log(`New socket connection. Socket id: ${socket.id}`)

        // send connection ack to client
        socket.emit("connection-ack-alert", "Real-time connection established.")

        // send server aulas state to client
        socket.emit("update-aulas", { newAulas: schedule })
        console.log("Enviadas pela primeira vez")

        socket.on("refresh-logs", () => {
            console.log(`Refreshing logs for socket ${socket.id}`);
            socket.emit('clear-logs');
            getBufferedLogs().forEach(log => {
                socket.emit('console-log', log);
            });
        });


        // Add aula
        socket.on("add-aula", async (data) => {
            try {
                const newId = schedule.length > 0 ? schedule[schedule.length - 1].Cod_Aula + 1 : 1;
                data.newAula.Cod_Aula = newId;

                ////////////////////////////////////////////////////////////////////////////////////////////////
                /////////////////////// ADDING STATIC DATA ON MISSING FIELDS FOR TESTING ///////////////////////
                ////////////////////////////////////////////////////////////////////////////////////////////////

                data.newAula.docente = 77;
                data.newAula.location = 1;
                data.newAula.turma = 1;
                data.newAula.course = 1;
                data.newAula.anoSem = 1;
                data.newAula.end = "14:00";

                ////////////////////////////////////////////////////////////////////////////////////////////////
                ////////////////////////////////////////////////////////////////////////////////////////////////
                ////////////////////////////////////////////////////////////////////////////////////////////////


                await addAulaToDB(data.newAula);
                schedule.push(data.newAula);

                console.log("Aula added: ", data.newAula);
                io.emit("update-aulas", { newAulas: schedule });
            } catch (err) {
                console.error("Error adding aula:", err);
                socket.emit("add-aula-error", { message: "Erro ao adicionar aula ao banco de dados." });
            }
        });

        // Remove aula
        socket.on("remove-aula", async (data) => {
            const aulaExists = schedule.some(aula => aula.Cod_Aula === data.codAula);
            if (aulaExists) {
                try {
                    schedule = schedule.filter(aula => aula.Cod_Aula !== data.codAula);
                    await removeAulaFromDB(data.codAula);

                    console.log("Aula removed: ", data.codAula);
                    io.emit("update-aulas", { newAulas: schedule });
                } catch (err) {
                    console.error("Error removing aula:", err);
                    socket.emit("remove-aula-error", { message: "Erro ao remover aula do banco de dados." });
                }
            } else {
                console.log("Aula not found: ", data.codAula);
                socket.emit("remove-aula-error", { message: "Esta aula não pode ser removida." });
            }
        });

        // Update aula
        socket.on("update-aula", async (data) => {
            const aulaToUpdate = schedule.find(aula => aula.Cod_Aula === data.codAula);
            if (aulaToUpdate) {
                try {
                    aulaToUpdate.day = data.newDay;
                    aulaToUpdate.start = data.newStart;
                    aulaToUpdate.end = data.newEnd;

                    await updateAulaInDB(data.codAula, data.newDay, data.newStart);

                    console.log("Aula updated: ", aulaToUpdate);
                    io.emit("update-aulas", { newAulas: schedule });
                } catch (err) {
                    console.error("Error updating aula:", err);
                    socket.emit("update-aula-error", { message: "Erro ao atualizar aula no banco de dados." });
                }
            } else {
                console.log("Aula not found for update: ", data.codAula);
                socket.emit("update-aula-error", { message: "Esta aula não pode ser atualizada." });
            }
        });

        socket.on("refresh-aulas", () => {
            socket.emit("update-aulas", { newAulas: schedule });
            console.log("Aulas refreshed: ")
        });
    })

    // log setup
    logToClient("setup", "Socket.io setup complete");

}

// export
module.exports = { setupSockets }