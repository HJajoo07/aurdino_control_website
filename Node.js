const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Store received data in memory (you can use a database for persistent storage)
let receivedData = [];

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files (HTML, CSS, JS)

// Endpoint to receive data from the Android app
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

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
