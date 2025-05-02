// logger.js
let io = null;
let logBuffer = [];

const setSocketIOInstance = (ioInstance) => {
    io = ioInstance;
};

const logToClient = (level, title, message) => {
    const timestamp = new Date().toISOString();
    let formattedMessage = '';

    switch (level) {
        case "separator":
            formattedMessage = `================================================== ${title} ==================================================`;
            break;
        case "setup":
            formattedMessage = `[${timestamp}] ${level.toUpperCase()}: ${title}.`;
            break;
        default:
            formattedMessage = `[${timestamp}] (${level.toUpperCase()}) ${title}: ${message}.`;
            break;
    }
    
    console.log(formattedMessage);
    logBuffer.push(formattedMessage);
    if (logBuffer.length > 1000) logBuffer.shift(); // Keep last 100 logs

    if (io) {
        io.emit('console-log', formattedMessage);
    }
};

const getBufferedLogs = () => logBuffer;

module.exports = {
    setSocketIOInstance,
    logToClient,
    getBufferedLogs
};
