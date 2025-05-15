// imports
const express = require('express')
const http = require('http')
const { Server } = require('socket.io')
const cors = require('cors')

const loginRoutes = require('./endpoints/auth-endpoints')
const dbRoutes = require('./endpoints/database-endpoints')
const sqlRoutes = require('./endpoints/sqlgen-endpoints')
const docenteRoutes = require('./endpoints/docentes-endpoints')
const salaRoutes = require('./endpoints/sala-endpoints')
const escolaRoutes = require('./endpoints/escola-endpoints')
const aulaRoutes = require('./endpoints/aula-endpoints')
const anosemestreRoutes = require('./endpoints/anosemestre-endpoints')
const cursoRoutes = require('./endpoints/curso-endpoints')
const ucRouter = require('./endpoints/uc-endpoint.js')
const turmaRoutes = require('./endpoints/turma-endpoints.js')
const filterRoutes = require('./endpoints/filter-endpoints.js')


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


// socket.io connection event
io.on("connection", (socket) => {
    console.log(`A new user has connected. User ID: ${socket.id}`)
})

//routes
app.use('/', loginRoutes)
app.use('/', dbRoutes)
app.use('/', sqlRoutes)
app.use('/', docenteRoutes)
app.use('/', salaRoutes)
app.use('/', escolaRoutes)
app.use('/', aulaRoutes)
app.use('/', anosemestreRoutes)
app.use('/', cursoRoutes)
app.use('/', ucRouter)
app.use('/', turmaRoutes)
app.use('/', filterRoutes)

// setup socket.io
setupSockets(server)

// starting the server
server.listen(backendPort, () => {
    console.log("\n=============== Easy Schedule IPT - Backend ===============")
    console.log(`Server started. Listening on port ${backendPort}.`)
    console.log("Socket.io server is running...")
    console.log("\n")
})