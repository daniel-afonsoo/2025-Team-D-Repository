// imports
const { Server } = require('socket.io');

const setupSockets = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "*",                        // accepting requests from all origins for now 
        }
    })

    let schedule = [ // get initial data for DB
        // monday classes
        { Cod_Aula: 1, day: "Monday", start: "10:00", end: "12:00", subject: "Math 101", location: "Room A1" },
        { Cod_Aula: 2, day: "Monday", start: "13:00", end: "15:00", subject: "History 101", location: "Room A2" },
        { Cod_Aula: 3, day: "Monday", start: "15:30", end: "17:00", subject: "Biology 101", location: "Room A3" },
        // tuesday classes
        { Cod_Aula: 4, day: "Tuesday", start: "09:00", end: "11:00", subject: "English 101", location: "Room B1" },
        { Cod_Aula: 5, day: "Tuesday", start: "11:30", end: "13:00", subject: "Computer Science 101", location: "Room B2" },
        { Cod_Aula: 6, day: "Tuesday", start: "15:30", end: "17:00", subject: "Music 101", location: "Room B4" },
        // wednesday classes
        { Cod_Aula: 7, day: "Wednesday", start: "10:00", end: "12:00", subject: "Physics 101", location: "Room C1" },
        { Cod_Aula: 8, day: "Wednesday", start: "14:30", end: "16:00", subject: "Geography 101", location: "Room C3" },
        // thursday classes
        { Cod_Aula: 9, day: "Thursday", start: "09:00", end: "11:00", subject: "Philosophy 101", location: "Room D1" },
        { Cod_Aula: 10, day: "Thursday", start: "15:30", end: "17:00", subject: "Economics 101", location: "Room D4" },
        // friday classes
        { Cod_Aula: 11, day: "Friday", start: "09:00", end: "11:00", subject: "Statistics 101", location: "Room E1" },
        // saturday classes
        { Cod_Aula: 12, day: "Saturday", start: "09:00", end: "11:00", subject: "Astronomy 101", location: "Room F1" },
        { Cod_Aula: 13, day: "Saturday", start: "11:30", end: "13:00", subject: "Statistics 201", location: "Room F2" },
        { Cod_Aula: 14, day: "Saturday", start: "13:30", end: "15:00", subject: "Philosophy 201", location: "Room F3" },
    ];

    io.on("connection", (socket) => {
        // log new connection
        console.log(`New socket connection. Socket id: ${socket.id}`)

        // send connection ack to client
        socket.emit("connection-ack-alert", "Real-time connection established.")

        // send server aulas state to client
        socket.emit("update-aulas", { newAulas: schedule })
        console.log(`Data sent ${schedule}`)

        // add aula to server
        socket.on("add-aula", (data) => {
            // check if the class is valid
            let valid = true
            if (valid) {  // always true for now, add validation logic later (post to database)
                //add id to new aula
                let newId = schedule.length + 1
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


    })


    // log setup
    console.log("Socket.io server setup complete. ")

}

// export
module.exports = { setupSockets }