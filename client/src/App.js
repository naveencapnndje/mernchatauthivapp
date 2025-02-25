import React, { useState, useEffect } from 'react';
import Chat from './components/Chat';
import './styles.css';

function App() {
  const [username, setUsername] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    if (username.trim()) {
      setLoggedIn(true);
    }
  };

  return (
    <div className="app">
      {!loggedIn ? (
        <div className="login-container">
          <form onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <button type="submit">Join Chat</button>
          </form>
        </div>
      ) : (
        <Chat username={username} />
      )}
    </div>
  );
}

export default App;