// imports
import { io } from 'socket.io-client';

// socket connection
const socket = io('http://localhost:5170');

socket.on("connection-ack-alert", (data) => {
    alert(data)
})


export default socket;