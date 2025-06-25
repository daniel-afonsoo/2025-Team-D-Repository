let ioInstance = null;

function setSocketIOInstance(io) {
  ioInstance = io;
}

function getSocketIOInstance() {
  return ioInstance;
}

module.exports = {
  setSocketIOInstance,
  getSocketIOInstance,
};
