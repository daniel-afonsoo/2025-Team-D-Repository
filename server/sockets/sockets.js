// imports
const { Server } = require('socket.io');

const setupSockets = (server) => {
    const io = new Server(server,{
        cors: {
            origin: "*",                        // accepting requests from all origins for now 
        }
    })

    let schedule = [ // get initial data for DB
        // monday classes
        { id:1, day: "Monday", start: "10:00", end: "12:00", subject: "Math 101", location: "Room A1"}, 
        { id:2, day: "Monday", start: "13:00", end: "15:00", subject: "History 101", location: "Room A2" },
        { id:3, day: "Monday", start: "15:30", end: "17:00", subject: "Biology 101", location: "Room A3" },
        // tuesday classes
        { id:4, day: "Tuesday", start: "09:00", end: "11:00", subject: "English 101", location: "Room B1" },
        { id:5, day: "Tuesday", start: "11:30", end: "13:00", subject: "Computer Science 101", location: "Room B2" },
        { id:6, day: "Tuesday", start: "15:30", end: "17:00", subject: "Music 101", location: "Room B4" },
        // wednesday classes
        { id:7, day: "Wednesday", start: "10:00", end: "12:00", subject: "Physics 101", location: "Room C1" },
        { id:8, day: "Wednesday", start: "14:30", end: "16:00", subject: "Geography 101", location: "Room C3" },
        // thursday classes
        { id:9, day: "Thursday", start: "09:00", end: "11:00", subject: "Philosophy 101", location: "Room D1" },
        { id:10, day: "Thursday", start: "15:30", end: "17:00", subject: "Economics 101", location: "Room D4" },
        // friday classes
        { id:11, day: "Friday", start: "09:00", end: "11:00", subject: "Statistics 101", location: "Room E1" },
        // saturday classes
        { id:12, day: "Saturday", start: "09:00", end: "11:00", subject: "Astronomy 101", location: "Room F1" },
        { id:13, day: "Saturday", start: "11:30", end: "13:00", subject: "Statistics 201", location: "Room F2" },
        { id:14, day: "Saturday", start: "13:30", end: "15:00", subject: "Philosophy 201", location: "Room F3" },
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
                //add id to new aula
                let newId = schedule.length + 1
                data.newAula.id = newId
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

        // remove aula from server
        socket.on("remove-aula", (data) => {
            // check if the class is in the schedule
            let aulaExists = schedule.some((aula) => aula.id === data.aulaId)
            if (aulaExists){ 
                schedule = schedule.filter((aula) => aula.id !== data.aulaId)
                console.log("Aula removed: ", data.aulaId)
                // broadcast to all clients update
                io.emit("update-aulas", { newAulas: schedule})
            }else{
                // error in removing aula
                console.log("Error removing aula: ", data.aulaId)
                socket.emit("remove-aula-error", "Esta aula não pode ser removida.")
            }
        })

    })


    // log setup
    console.log("Socket.io server setup complete. ")

}

// export
module.exports = { setupSockets }