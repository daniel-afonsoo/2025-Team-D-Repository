// imports
const express = require('express')
const http = require('http')
const { setupSockets } = require('./sockets/sockets')
const cors = require('cors')

// express instance & server port
const app = express()
const backendPort = 5170

app.use(cors())
app.use(express.json()) // enable json parsing

// setup http server
const server = http.createServer(app)

// base endpoint
app.get('/', (req, res) => {
    console.log(`Base endpoint hit. Client's ip: ${req.ip}`)
    res.json({ message: "Hello from the server's backend!" })
})

// setup socket.io
setupSockets(server)

// starting the server
server.listen(backendPort, () => {
    console.log("\n=============== Easy Schedule IPT - Backend ===============")
    console.log(`Server started. Listening on port ${backendPort}.`)
})