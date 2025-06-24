// imports
import { io } from 'socket.io-client';

// socket connection
const socket = io('http://localhost:5170');

socket.on("connection-ack-alert", (data) => {
    alert(data)
})

socket.on("add-aula-error", (data) => {
    alert(data.message)
})

socket.on("remove-aula-error", (data) => {
    alert(data.message)
})

export const onUpdateAulas = (callback) => {
    socket.on("update-aulas", (data) => {
      console.log("Received update-aulas event:", data); // Debugging log
      callback(data);
    });
  };

export default socket;