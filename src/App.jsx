import './App.css';
import React, { useState } from 'react';
import List from './components/List';
import Auth from './components/Auth';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (user) => {
    setUser(user);
  };

  return (
    <div className="App">
      <header className="App-header">
        <Router>
          <Routes>
            <Route path="/list" element={<List user={user} />} />
            <Route path="/" element={<Auth onLogin={handleLogin} />} />
          </Routes>
        </Router>
      </header>
    </div>
  );
}

export default App;