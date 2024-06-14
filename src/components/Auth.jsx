import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Auth.css';

function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();
  const [statusMessage, setStatusMessage] = useState('');  // new state variable for status message

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      console.error("Passwords do not match");
      return;
    }
    try {
      await axios.post('http://localhost:5000/register', { email, password });
      navigate('/list');
      setStatusMessage('Registration successful');  // set status message on successful 
    } catch (error) {
      console.error(error);
      setStatusMessage('Registration failed');  // set status message on failed 
    }
  };

  const handleLogin = async () => {
    try {
      await axios.post('http://localhost:5000/login', { email, password });
      navigate('/list');
      setStatusMessage('Login successful');  
    } catch (error) {
      console.error(error);
      setStatusMessage('Login failed');  
    }
  };
  return (
    <div className="auth">
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
      {isRegistering && <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm Password" />}
      {isRegistering ? <button onClick={handleRegister}>Register</button> : <button onClick={handleLogin}>Login</button>}
      <button onClick={() => setIsRegistering(!isRegistering)}>{isRegistering ? 'Switch to Login' : 'Switch to Register'}</button>
      <div className='message'>
      <p>{statusMessage}</p>
      </div>
     
    </div>
  );
}

export default Auth;