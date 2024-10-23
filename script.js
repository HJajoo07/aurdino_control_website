const ws = new WebSocket('ws://localhost:8081'); // Use your server's WebSocket URL

ws.onopen = () => {
    console.log('WebSocket connection established.');
};

ws.onmessage = (event) => {
    const message = event.data;
    console.log('Message from server:', message);

    // Display terminal data
    const terminalDisplay = document.getElementById('terminalDisplay'); 
    terminalDisplay.innerText += message + '\n'; // Append message to the display
};

ws.onclose = () => {
    console.log('WebSocket connection closed.');
};

ws.onerror = (error) => {
    console.error('WebSocket error:', error);
};
