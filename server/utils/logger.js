// logger.js
let io = null;
let logBuffer = [];

const setSocketIOInstance = (ioInstance) => {
    io = ioInstance;
};

const logToClient = (level, title, message) => {
    const timestamp = new Date().toISOString().replace('T', ' ').replace('Z', '');
    let formattedMessage = '';

    switch (level) {
        case "separator":
            formattedMessage = `==================== ${title} ====================`;
            break;
        case "setup":
            formattedMessage = `[${timestamp}] ${level.toUpperCase()}: ${title}.`;
            break;
        case "debug":
            formattedMessage = `[${timestamp}] [${level.toUpperCase()}] ${title.toUpperCase()}: ${message.toUpperCase()}.`;
            break;
        default:
            formattedMessage = `[${timestamp}] (${level.toUpperCase()}) ${title}: ${message}.`;
            break;
    }
    
    console.log(formattedMessage);
    logBuffer.push([formattedMessage, level]); // Store the log with its level
    if (logBuffer.length > 100) logBuffer.shift(); // Keep last 100 logs

    if (io) {
        io.emit('console-log', [formattedMessage, level]);
    }
};

const getBufferedLogs = () => logBuffer;

module.exports = {
    setSocketIOInstance,
    logToClient,
    getBufferedLogs
};
