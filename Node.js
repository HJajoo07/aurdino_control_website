const express = require('express');
const WebSocket = require('ws');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 8080;
const wss = new WebSocket.Server({ port: 8081 });

app.use(cors());
app.use(bodyParser.text());

// Store connected clients
const clients = new Set();

// WebSocket connection handler
wss.on('connection', (ws) => {
    console.log('New client connected');
    clients.add(ws);

    ws.on('message', (message) => {
        // Broadcast the message to all connected clients
        const data = message.toString();
        broadcastMessage(data, ws);
    });

    ws.on('close', () => {
        console.log('Client disconnected');
        clients.delete(ws);
    });

    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
        clients.delete(ws);
    });
});

// Broadcast message to all connected clients except the sender
function broadcastMessage(message, sender) {
    clients.forEach((client) => {
        if (client !== sender && client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
}

// Regular HTTP endpoints (can be used as fallback)
app.post('/terminal', (req, res) => {
    const terminalData = req.body;
    broadcastMessage(terminalData, null);
    res.sendStatus(200);
});

app.listen(port, () => {
    console.log(`HTTP Server running on http://localhost:${port}`);
    console.log(`WebSocket Server running on ws://localhost:8081`);
});