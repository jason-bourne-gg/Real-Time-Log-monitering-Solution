# Real-Time Log Viewer

## Project Overview

A real-time log file monitoring and streaming application using Express.js backend and React frontend.

## Features

- Real-time log file monitoring
- WebSocket-based streaming
- Shows last 10 lines on initial connection
- Efficient file reading without full file transmission
- Multiple client support

## Prerequisites

- Node.js (v16+)
- npm

## Setup Instructions

1. Clone the repository

```bash
git clone <your-repo-url>
cd real-time-log-viewer
```

2. Install dependencies

```bash
npm run install:all
```

3. Configure Log File Path

- Open `server.js`
- Replace `'/path/to/your/logfile.log'` with actual log file path

4. Run the Application

```bash
npm run dev
```

5. Access the Application

- Backend: `http://localhost:3001`
- Frontend: `http://localhost:3000`

## Optimization Strategies

- Uses efficient file reading techniques
- Tracks file position to avoid re-reading
- Streams only new log entries
- Limits initial and displayed log lines

## Limitations

- Assumes log file is on the same machine
- Not suitable for extremely high-frequency log updates
