import { useEffect, useState, useRef } from 'react';
import socket from '../../utils/socket'
import '../../styles/ConsoleViewer.css'; 

const ConsoleViewer = () => {
  const [logs, setLogs] = useState([]);
  const scrollRef = useRef(null);

  useEffect(() => {
    const handler = (log) => {
      setLogs((prevLogs) => [...prevLogs.slice(-999), log]);
    };

    socket.on('console-log', handler);

    return () => {
      socket.off('console-log', handler);
    };
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className="console-container">
      <div className="console-header"> Backend Console - Live</div>
      <div className="console-logs">
        {logs.map((log, idx) => (
          <div key={idx} className="console-line">{log}</div>
        ))}
        <div ref={scrollRef} />
      </div>
    </div>
  );
};

export default ConsoleViewer;
