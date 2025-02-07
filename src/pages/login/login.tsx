import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import request from '../../utils/request';
import "./login.css";

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
    <div className='LoginPage'>
      <div className="logo-Content">
        <img src="/assets/img/logo.webp" alt="Logo" />
      </div>
      <div className="form-content">
        <div className="form-back">
          <form onSubmit={handleSubmit} className='form-login'>
            <h2>Login</h2>
            <div className="input-form">
              <label>
                Email:
              </label>
              <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
            </div>
            <div className="input-form">
              <label>
                Password:
              </label>
              <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
            </div>
            <button type="submit">Login</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;