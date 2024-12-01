import express from 'express';
import fs from "fs"
import path from "path"

const PORT = 4001;
const LOG_FILE_PATH = path.resolve("assets/data.log");
const clients = []
console.log(LOG_FILE_PATH)


const app = express();

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
})

app.get('/', async (req, res) => {
    console.log("HOME PAGE API CALLED")
    return res.status(200).json("HOME PAGE API CALLED")
})

// Helper: Get last N lines of the file
const getLastNLines = async (filePath, n) => {
    const stat = await fs.promises.stat(filePath);
    const fileSize = stat.size;
    const bufferSize = 8192; // Read in chunks
    const buffer = Buffer.alloc(bufferSize);
    const fd = await fs.promises.open(filePath, 'r');

    let position = fileSize;
    let lines = [];

    while (lines.length <= n && position > 0) {
        position -= bufferSize;
        if (position < 0) position = 0;

        const { bytesRead } = await fd.read(buffer, 0, bufferSize, position);
        lines = buffer.slice(0, bytesRead).toString('utf8').split('\n').concat(lines);
    }

    await fd.close();
    return lines.slice(-n).join('\n');
};

app.get('/logs', async (req, res) => {

    res.writeHead(200, {
        'content-type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        connection: 'keep-alive'
    })

    // Send last 10 lines upon connection
    const lastLines = await getLastNLines(LOG_FILE_PATH, 10);
    console.log(lastLines)
    res.write(`data: ${lastLines}`);

    // Add client to clients list
    clients.push(res);


    // Remove client on disconnection
    req.on('close', () => {
        clients.splice(clients.indexOf(res), 1);
    });
})

// Watch log file for changes
fs.watchFile(LOG_FILE_PATH, async () => {
    const updates = await getLastNLines(LOG_FILE_PATH, 2); // Get last line
    console.log(updates)
    clients.forEach(client => client.write(`data: ${updates}`)); // Broadcast to all clients
});



app.listen(PORT, () => {
    console.log(`Server is listening at http://localhost:${PORT}`)
})