import React, { useEffect, useState } from 'react';

function App() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:4001');
    ws.onmessage = (event) => {
      setLogs(event.data.split('\n').slice(-10)); // Keep only the last 10 lines
    };

    return () => ws.close();
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>Real-Time Log Viewer</h1>
      <div style={{ background: '#f4f4f4', padding: '10px', borderRadius: '5px', overflowY: 'auto', height: '300px' }}>
        {logs.map((line, index) => (
          <div key={index}>{line}</div>
        ))}
      </div>
    </div>
  );
}

export default App;
