import React, { useState } from 'react';
import request from '../../utils/request';
import "./register.css";

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
    <div  className='LoginPage'>
      <div className="logo-Content">
        <img src="/assets/img/logo.webp" alt="Logo" />
      </div>
      <div className="form-content">
        <div className="form-back-register">
          <form onSubmit={handleSubmit} className='form-register'>
            <h2>Register</h2>
              <div className="input-form">
              <label>
                Name:
              </label>
              <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
            </div>
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
            <button type="submit">Register</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;