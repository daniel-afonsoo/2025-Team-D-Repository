import { useState, useEffect } from "react";
import socket from './socket' 

export function useSocket() {
    const [socketMsg, setSocketMsg] = useState("fetching socket connection...")
    const [aulas, setAulas] = useState({})

    useEffect(() => {
        socket.on("connection-ack-msg", (data) => {
            setSocketMsg(data)
        })
    }, [])

    return { socketMsg , aulas, setAulas }
}
