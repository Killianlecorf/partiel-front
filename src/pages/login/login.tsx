import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import request from '../../utils/request';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await request('users/login', 'POST', { email, password });

      if (!response.ok) {
        throw new Error(response.message);
      }

      navigate('/');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', width: '300px' }}>
        <h2>Login</h2>
        <label>
          Email:
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ marginBottom: '10px', padding: '8px', fontSize: '16px' }}
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ marginBottom: '20px', padding: '8px', fontSize: '16px' }}
          />
        </label>
        <button type="submit" style={{ padding: '10px', fontSize: '16px' }}>Login</button>
      </form>
    </div>
  );
};

export default Login;