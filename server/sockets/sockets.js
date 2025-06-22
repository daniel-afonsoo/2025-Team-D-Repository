const { Server } = require("socket.io");
const {
  setSocketIOInstance,
  logToClient,
  getBufferedLogs,
} = require("../utils/logger");

const setupSockets = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  setSocketIOInstance(io);

  io.on("connection", (socket) => {
    // Logs
    getBufferedLogs().forEach((log) => {
      socket.emit("console-log", log);
    });

    console.log(`New socket connection. Socket id: ${socket.id}`);
    socket.emit("connection-ack-alert", "Real-time connection established.");

    // Broadcast refresh for specific turma
    socket.on("refresh-aulas", (data) => {
      if (data?.Cod_Turma) {
        io.emit("update-aulas", { Cod_Turma: data.Cod_Turma });
      }
    });
  });

  logToClient("setup", "Socket.io setup complete");
};

module.exports = { setupSockets };
