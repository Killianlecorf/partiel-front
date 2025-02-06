import React, { useState } from 'react';
import request from '../../utils/request';

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await request('users/add', 'POST', { name, email, password });

      if (!response.ok) {
        throw new Error(response.message);
      }

    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', width: '300px' }}>
        <h2>Register</h2>
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ marginBottom: '10px', padding: '8px', fontSize: '16px' }}
          />
        </label>
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
        <button type="submit" style={{ padding: '10px', fontSize: '16px' }}>Register</button>
      </form>
    </div>
  );
};

export default Register;