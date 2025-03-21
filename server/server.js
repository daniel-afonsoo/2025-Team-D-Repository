// imports
const express = require('express')
const http = require('http')
const { Server } = require('socket.io')
const cors = require('cors')

//import routes
const loginRoutes = require('./endpoints/auth-endpoints')


// express instance & server port
const app = express()
const backendPort = 5170
app.use(cors())


// socket.io server
const server = http.createServer(app)
const io = new Server(server,{
    cors: {
        origin: "*",                        // accepting requests from all origins for now 
    }
})

// base endpoint
app.get('/', (req, res) => {
    console.log(`Base endpoint hit. Client's ip: ${req.ip}`)
    res.json({ message: "Hello from the server's backend!" })
})

//routes
app.use('/', loginRoutes)


// socket.io connection event
io.on("connection", (socket) => {
    console.log(`A new user has connected. User ID: ${socket.id}`)
})

// starting the server
server.listen(backendPort, () => {
    console.log("\n=============== Easy Schedule IPT - Backend ===============")
    console.log(`Server started. Listening on port ${backendPort}.`)
    console.log("Socket.io server is running...")
    console.log("\n")
})