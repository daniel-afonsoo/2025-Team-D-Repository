// imports
const { Server } = require('socket.io');
const { setSocketIOInstance, logToClient, getBufferedLogs } = require('../utils/logger'); // import logger instance
const pool = require('../db/connection.js'); 
const { formatAulaRow } = require('../utils/utils.js'); 

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
            logToClient("error",`Failed to Load Classes (${err.code})`, `Could not load classses from database. Check database connection.`);
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
        

        // add aula to server
        socket.on("add-aula", (data) => {
            // check if the class is valid
            let valid = true
            if (valid) {  // always true for now, add validation logic later (post to database)
                //add id to new aula
                let newId = schedule[schedule.length - 1].Cod_Aula + 1   
                data.newAula.Cod_Aula = newId
                schedule.push(data.newAula) // add to server schedule
                console.log("Aula added: ", data.newAula)
                // broadcast to all clients update
                io.emit("update-aulas", { newAulas: schedule })
            } else {
                // error in adding aula
                console.log("Error adding aula: ", data.newAulas)
                socket.emit("add-aula-error", { message: "Esta aula não pode ser adicionada." })
            }
        })

        // remove aula from server
        socket.on("remove-aula", (data) => {
            // check if the class is in the schedule
            let aulaExists = schedule.some((aula) => aula.Cod_Aula === data.codAula)
            if (aulaExists) {
                schedule = schedule.filter((aula) => aula.Cod_Aula !== data.codAula)
                console.log("Aula removed: ", data.codAula)
                // broadcast to all clients update
                io.emit("update-aulas", { newAulas: schedule })
            } else {
                // error in removing aula
                console.log("Error removing aula: ", data.codAula)
                socket.emit("remove-aula-error", { message: "Esta aula não pode ser removida." })
            }
        })

        socket.on("update-aula", (data) => {
            console.log(data.newDay)
            console.log(data.newStart)
            // update aula in schedule
            let aulaToUpdate = schedule.find((aula) => aula.Cod_Aula === data.codAula);
            if (aulaToUpdate) {
                aulaToUpdate.day = data.newDay
                aulaToUpdate.start = data.newStart
                console.log("Aula updated: ", aulaToUpdate)
                // broadcast to all clients update
                io.emit("update-aulas", { newAulas: schedule })
            } else {
                console.log("Error updating aula: ", codaula)
                socket.emit("update-aula-error", { message: "Esta aula não pode ser atualizada." })
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