require('dotenv').config();
const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const mongoose = require('mongoose');
const cors = require('cors');
const messageRouter = require('./routes/messages');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Database connection
mongoose.connect(process.env.MONGODB_URI).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('Error connecting to MongoDB:', err.message);
});

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api/messages', messageRouter);

// WebSocket Server
wss.on('connection', (ws) => {
  console.log('Client connected');
  
  ws.on('message', (message) => {
    // Broadcast message to all clients
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});