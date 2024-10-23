const express = require('express');
const WebSocket = require('ws');
const bodyParser = require('body-parser');

const app = express();
const port = 8080;
const wss = new WebSocket.Server({ port: 8081 });

let controlData = '';
let terminalData = '';

app.use(bodyParser.text());

// Endpoint to receive Control data
app.post('/control', (req, res) => {
    controlData = req.body;
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(`Control Data: ${controlData}`);
        }
    });
    res.sendStatus(200);
});

// Endpoint to receive Terminal data
app.post('/terminal', (req, res) => {
    terminalData = req.body;
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(`Terminal Data: ${terminalData}`);
        }
    });
    res.sendStatus(200);
});

// WebSocket for real-time updates
wss.on('connection', (ws) => {
    console.log('Client connected');
    ws.send(`Initial Control Data: ${controlData}`);
    ws.send(`Initial Terminal Data: ${terminalData}`);
    
    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
