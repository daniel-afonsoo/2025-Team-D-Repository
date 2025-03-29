// imports
const { Server } = require('socket.io');

const setupSockets = (server) => {
    const io = new Server(server,{
        cors: {
            origin: "*",                        // accepting requests from all origins for now 
        }
    })

    let serverAulas = {} // server aulas state

    io.on("connection", (socket) => {
        // log new connection
        console.log(`New socket connection. Socket id: ${socket.id}`)
        // send connection ack to client
        socket.emit("connection-ack-alert", "Real-time connection with server established.")
        socket.emit("connection-ack-msg", "Real-time connection with server established.")
        // send server aulas state to client
        socket.emit("update-aulas", serverAulas)
        console.log(`Data sent ${serverAulas}`)

        // update aulas
        socket.on("update-aulas", (data) => {
            console.log("update-aulas event received. Data: ", data)
            // update server aulas state
            // add new aulas to server state
            serverAulas = { ...serverAulas, ...data } 
            io.emit("update-aulas", data)
        })

    })


    // log setup
    console.log("Socket.io server setup complete. ")

}

// export
module.exports = { setupSockets }