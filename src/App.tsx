import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/login';
import Register from './pages/register/register';
import Home from './pages/home';
import Admin from './pages/admin';
import AdminProduct from './pages/adminProduct';
import Cart from './pages/Cart';
import OrderAdmin from './pages/OrderAdmin/OrderAdmin';
import Profil from './pages/profil';

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/product" element={<AdminProduct />} />
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/admin/orders" element={<OrderAdmin />} />
          <Route path="/profil" element={<Profil />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;