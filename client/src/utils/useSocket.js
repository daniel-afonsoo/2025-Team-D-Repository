import { useState, useEffect } from "react";
import socket from './socket' 

export function useSocket() {
    const [socketMsg, setSocketMsg] = useState("fetching socket connection...")
    const [aulasMarcadas, setAulasMarcadas] = useState([])

    useEffect(() => {
        socket.on("connection-ack-msg", (data) => {
            setSocketMsg(data)
        })
    }, [])

    useEffect(() => {
        socket.on("update-aulas", (data) => {
            setAulasMarcadas(data.newAulas);
        })
    }, [])

    return { socketMsg , aulasMarcadas }
}
