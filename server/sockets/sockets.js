// imports
const { Server } = require('socket.io');

const setupSockets = (server) => {
    const io = new Server(server,{
        cors: {
            origin: "*",                        // accepting requests from all origins for now 
        }
    })

    io.on("connection", (socket) => {
        // log new connection
        console.log(`New socket connection. Socket id: ${socket.id}`)
        // send connection ack to client
        socket.emit("connection-ack-alert", "Real-time connection with server established.")
        socket.emit("connection-ack-msg", "Real-time connection with server established.")
    })

    // log setup
    console.log("Socket.io server setup complete. ")

}

// export
module.exports = { setupSockets }