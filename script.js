const dataList = document.getElementById('dataList');

// Establish WebSocket connection to server
const socket = new WebSocket('ws://localhost:8081');

// Handle incoming messages
socket.onmessage = function (event) {
    const newItem = document.createElement('li');
    newItem.textContent = event.data; // Data sent from the server
    dataList.appendChild(newItem);
};

// Handle WebSocket errors
socket.onerror = function (error) {
    console.log('WebSocket Error: ' + error);
};

// Handle WebSocket connection close
socket.onclose = function () {
    console.log('WebSocket connection closed');
};
