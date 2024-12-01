import express from 'express';
import { WebSocketServer } from 'ws';
import { createReadStream, watch } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import WebSocket from 'ws';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 4001;
const LOG_FILE_PATH = path.join(__dirname, 'assets/data.log'); // Path to your log file

// Serve static files (React client build)
app.use(express.static(path.join(__dirname, 'client/build')));

app.get('/log', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build/index.html'));
});

// Start WebSocket Server
const server = app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
const wss = new WebSocketServer({ server });

// Function to fetch the last N lines of a file
const getLastNLines = (filePath, n) => {
    const readStream = createReadStream(filePath, { encoding: 'utf8' });
    const lines = [];
    return new Promise((resolve, reject) => {
        readStream.on('data', (chunk) => {
            lines.push(...chunk.split('\n'));
            if (lines.length > n) lines.splice(0, lines.length - n);
        });
        readStream.on('end', () => resolve(lines.slice(-n).join('\n')));
        readStream.on('error', reject);
    });
};

// Broadcast to all connected clients
const broadcastUpdate = (message) => {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
};

// Watch for file changes
watch(LOG_FILE_PATH, async (eventType) => {
    if (eventType === 'change') {
        const content = await getLastNLines(LOG_FILE_PATH, 10);
        broadcastUpdate(content);
    }
});

wss.on('connection', async (ws) => {
    // Send last 10 lines on new connection
    const content = await getLastNLines(LOG_FILE_PATH, 10);
    ws.send(content);
});
