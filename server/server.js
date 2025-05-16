// imports
const express = require('express')
const http = require('http')
const { setupSockets } = require('./sockets/sockets')
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
const {logToClient} = require('./utils/logger');
const turmaRoutes = require('./endpoints/turma-endpoints.js')
const filterRoutes = require('./endpoints/filter-endpoints.js')


// express instance & server port
const app = express()
const backendPort = 5170

logToClient("setup", `Starting server...`)
app.use(cors())
app.use(express.json()) // enable json parsing

// setup http server
logToClient("setup", `Setting up HTTP server...`)
const server = http.createServer(app)
logToClient("setup", `HTTP server setup complete`)

// base endpoint
app.get("/", (req, res) => {
    console.log(`Base endpoint hit. Client's IP: ${req.ip}`);
    res.json({ message: "Hello from the server's backend!" });
});


//routes
logToClient("setup", `Setting up routes...`)
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

logToClient("setup", `Routes setup complete`)

// setup socket.io
logToClient("setup", `Setting up Sockets...`)
setupSockets(server)

// starting the server
server.listen(backendPort, () => {

    logToClient("info","Setup Complete", `Server started successfully`)
    logToClient("info","Server Port", `Server is listening on port ${backendPort}`)
    logToClient("separator", "Easy Schedule IPT - Backend")

})
