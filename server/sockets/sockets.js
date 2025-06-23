const { Server } = require("socket.io");
const {
  setSocketIOInstance: setLoggerSocketIOInstance,
  logToClient,
  getBufferedLogs,
} = require("../utils/logger");

const {
  setSocketIOInstance: setAppSocketIOInstance,
} = require("../utils/socketInstance");

const setupSockets = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  setLoggerSocketIOInstance(io);
  setAppSocketIOInstance(io);

  io.on("connection", (socket) => {
    getBufferedLogs().forEach((log) => {
      socket.emit("console-log", log);
    });

    console.log(`New socket connection. Socket id: ${socket.id}`);
    socket.emit("connection-ack-alert", "Real-time connection established.");

    socket.on("refresh-aulas", (data) => {
      if (data?.Cod_Turma) {
        io.emit("update-aulas", { Cod_Turma: data.Cod_Turma });
      }
    });

    socket.on("refresh-logs", () => {
      console.log(`Refreshing logs for socket ${socket.id}`);
      socket.emit('clear-logs');
      getBufferedLogs().forEach(log => {
        socket.emit('console-log', log);
      });
    });
    
  });

  logToClient("setup", "Socket.io setup complete");
};

module.exports = { setupSockets };

module.exports = { setupSockets };