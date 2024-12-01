import './App.css';
import React, { useState, useEffect } from 'react';


function App() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    // Establish connection to the server
    const eventSource = new EventSource('http://localhost:4001/logs');

    eventSource.onmessage = (event) => {
      setLogs((prevLogs) => {
        console.log(prevLogs)
        const newLogs = [...prevLogs, event.data];
        // Keep only the last 10 logs
        return newLogs.slice(-10);
      });
    };

    eventSource.onerror = (error) => {
      console.error('Error connecting to the logs stream:', error);
      eventSource.close();
    };

    return () => {
      eventSource.close(); // Cleanup on component unmount
    };
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Log Viewer</h1>
        <div className="logs">
          {logs.map((log, index) => (
            <pre key={index}>{log}</pre>
          ))}
        </div>
      </header>
    </div>
  );
}

export default App;
