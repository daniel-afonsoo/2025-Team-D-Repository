// imports
const { Server } = require('socket.io');

const setupSockets = (server) => {
    const io = new Server(server,{
        cors: {
            origin: "*",                        // accepting requests from all origins for now 
        }
    })

    let schedule = [ // get initial data for DB
        { day: "Monday", start: "10:00", end: "12:00", subject: "Math 101", location: "Room A1"}, 
        { day: "Tuesday", start: "14:30", end: "17:00", subject: "Physics 201", location: "Room B2" },
        { day: "Wednesday", start: "09:00", end: "11:30", subject: "Chemistry 101", location: "Room C3" },
      ];

    io.on("connection", (socket) => {
        // log new connection
        console.log(`New socket connection. Socket id: ${socket.id}`)

        // send connection ack to client
        socket.emit("connection-ack-alert", "Real-time connection established.")

        // send server aulas state to client
        socket.emit("update-aulas", { newAulas: schedule})
        console.log(`Data sent ${schedule}`)

        // add aula to server
        socket.on("add-aula", (data) => {
            // check if the class is valid
            let valid = true
            if (valid){  // always true for now, add validation logic later (post to database)
                schedule.push(data.newAula) // add to server schedule
                console.log("Aula added: ", data.newAula)
                // broadcast to all clients update
                io.emit("update-aulas", { newAulas: schedule})
            }else{
                // error in adding aula
                console.log("Error adding aula: ", data.newAulas)
                socket.emit("add-aula-error", "Esta aula não pode ser adicionada.")
            }
        })

    })


    // log setup
    console.log("Socket.io server setup complete. ")

}

// export
module.exports = { setupSockets }