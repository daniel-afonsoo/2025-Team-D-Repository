// imports
import { io } from 'socket.io-client';

// socket connection
const socket = io('http://localhost:5170');

export const onUpdateAulas = (callback) => {
    socket.on("update-aulas", (data) => {
      console.log("Received update-aulas event:", data); // Debugging log
      callback(data);
    });
  };

export default socket;