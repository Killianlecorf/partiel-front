import React, { useState } from 'react';
import request from '../../utils/request';
import "./register.css";
import { useNavigate } from 'react-router-dom';

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    console.log(isAdmin);
    

    try {
      const response = await request('users/add', 'POST', { name, email, password, isAdmin });

    
      if (response.ok) {
        navigate("/")
      }

      if (!response.ok) {
        throw new Error(response.message);
      }

    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className='LoginPage'>
      <div className="logo-Content">
        <img src="/assets/img/logo.webp" alt="Logo" className='img-register' />
      </div>
      <div className="form-content">
        <div className="form-back-register">
          <form onSubmit={handleSubmit} className='form-register'>
            <h2>Register</h2>
            <div className="input-form">
              <label className='label-register'>
                Name:
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className='input-register'
                required
              />
            </div>
            <div className="input-form">
              <label className='label-register'>
                Email:
              </label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='input-register'
                required
              />
            </div>
            <div className="input-form">
              <label className='label-register'>
                Password:
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='input-register'
                required
              />
            </div>
            <div className="input-form">
              <label className='label-register'>
                Register as Admin for test:
              </label>
              <input
                type="checkbox"
                checked={isAdmin}
                onChange={() => setIsAdmin(!isAdmin)}
                className='input-register'
              />
            </div>
            <button className='button-register' type="submit">Register</button>
          </form>
          <a onClick={() => navigate("/login")}><p>Login</p></a>
        </div>
      </div>
    </div>
  );
};

export default Register;
