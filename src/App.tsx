import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import Login from './pages/login';
import Register from './pages/register/register';
import Home from './pages/home';
import Admin from './pages/admin';
import AdminProduct from './pages/adminProduct';
import Cart from './pages/Cart';
import OrderAdmin from './pages/OrderAdmin/OrderAdmin';
import Profil from './pages/profil';
import useAuth from './hooks/useAuth';
import ProtectedRoute from './utils/ProtectedRoute';

const App: React.FC = () => {

  return (
    <Router>
      <div className="App">
        <Routes>=
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/product" element={<AdminProduct />} />
            <Route path="/admin/orders" element={<OrderAdmin />} />
            <Route path="/" element={<Home />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/profil" element={<Profil />} />
          </Route>

          <Route element={<ProtectedRoute isAdmin />}>
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/product" element={<AdminProduct />} />
            <Route path="/admin/orders" element={<OrderAdmin />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
};

export default App;
