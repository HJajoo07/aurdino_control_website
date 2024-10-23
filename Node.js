const https = require('https');
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 443;

// Load certificates
const privateKey = fs.readFileSync('key.pem', 'utf8');
const certificate = fs.readFileSync('cert.pem', 'utf8');
const credentials = { key: privateKey, cert: certificate };

// Store data received from POST requests
let receivedData = [];

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint to receive data from Android app
app.post('/data', (req, res) => {
    const { data } = req.body;
    if (data) {
        receivedData.push(data);
        console.log('Data received:', data);
        res.status(200).send('Data received successfully');
    } else {
        res.status(400).send('No data received');
    }
});

// Endpoint to retrieve data for the frontend
app.get('/data', (req, res) => {
    res.json({ data: receivedData });
});

// Start the HTTPS server
const httpsServer = https.createServer(credentials, app);
httpsServer.listen(PORT, () => {
    console.log(`Server running at https://localhost:${PORT}`);
});
