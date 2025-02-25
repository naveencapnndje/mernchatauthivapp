import React from 'react';

const Message = ({ message, isOwn }) => {
  return (
    <div className={`message ${isOwn ? 'own-message' : ''}`}>
      <div className="message-header">
        <span className="sender">{isOwn ? 'You' : message.sender}</span>
        <span className="timestamp">
          {new Date(message.timestamp).toLocaleTimeString()}
        </span>
      </div>
      <div className="message-content">{message.content}</div>
    </div>
  );
};

export default Message;