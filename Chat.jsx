import React, { useState, useEffect, useRef } from 'react';
import Message from './Message';
import axios from 'axios';

const Chat = ({ username }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const ws = useRef(null);

  useEffect(() => {
    // Connect to WebSocket
    ws.current = new WebSocket('ws://localhost:5000');

    // Load message history
    axios.get('http://localhost:5000/api/messages')
      .then(res => setMessages(res.data))
      .catch(err => console.error('Error fetching messages:', err));

    // Handle incoming messages
    ws.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setMessages(prev => [...prev, message]);
    };

    ws.current.onclose = () => {
      console.log('WebSocket connection closed');
    };

    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      ws.current.close();
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const messageData = {
      sender: username,
      content: newMessage,
      timestamp: new Date().toISOString()
    };

    // Send message via WebSocket
    if (ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(messageData));
    } else {
      console.error('WebSocket is not open');
    }

    // Save message to database
    try {
      await axios.post('http://localhost:5000/api/messages', messageData);
      setNewMessage('');
    } catch (err) {
      console.error('Error saving message:', err);
    }
  };

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((msg, i) => (
          <Message key={i} message={msg} isOwn={msg.sender === username} />
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default Chat;