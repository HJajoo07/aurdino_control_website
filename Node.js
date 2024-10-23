const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(cors());
app.use(bodyParser.text());
app.use(bodyParser.json());

// Store connected clients
const clients = new Set();

// WebSocket connection handler
wss.on('connection', (ws) => {
    console.log('New client connected');
    clients.add(ws);

    // Send initial connection confirmation
    ws.send(JSON.stringify({
        type: 'connection',
        status: 'connected'
    }));

    ws.on('message', (message) => {
        try {
            console.log('Received:', message.toString());
            // Broadcast to all clients
            clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(message.toString());
                }
            });
        } catch (error) {
            console.error('Error processing message:', error);
        }
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

// HTTP fallback endpoint
app.post('/terminal', (req, res) => {
    const data = req.body;
    console.log('Received HTTP data:', data);
    
    // Broadcast to WebSocket clients
    clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(typeof data === 'string' ? data : JSON.stringify(data));
        }
    });
    
    res.sendStatus(200);
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});