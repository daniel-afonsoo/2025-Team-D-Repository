import { useEffect } from "react";
import socket from "../socket";

export function useSocket() {
  useEffect(() => {
    socket.on("connection-ack-alert", (data) => {
      console.log("[Socket connected]:", data);
    });

    return () => {
      socket.off("connection-ack-alert");
    };
  }, []);

}
