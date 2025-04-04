import { useState, useEffect } from "react";
import socket from './socket' 

export function useSocket() {
    const [socketMsg, setSocketMsg] = useState("fetching socket connection...")
    const [schedule, setAulas] = useState([])

    useEffect(() => {
        socket.on("connection-ack-msg", (data) => {
            setSocketMsg(data)
        })
    }, [])

    useEffect(() => {
        socket.on("update-aulas", (data) => {
            setAulas(data.newAulas);
        })
    }, [])

    return { socketMsg , schedule, setAulas }
}
