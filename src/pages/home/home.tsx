import { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import request from '../../utils/request';
import { Product } from '../../types/Product';

const Home: FC = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [loading, user, navigate]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await request('products/all', 'GET');
        if (response.ok) {
          setProducts(response.data);
        } else {
          console.error('Failed to fetch products:', response.message);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await request('users/logout', 'POST');
      if (response.ok) {
        navigate('/login');
      } else {
        console.error('Failed to logout:', response.message);
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  if (loading || loadingProducts) {
    return <div>Loading...</div>;
  }

  return (
    <div className=''>
      <h1>Home</h1>
      {user && <p>Welcome, {user.email}</p>}
      {user && user.isAdmin && <button onClick={() => navigate('/admin')}>Admin</button>}
      <button onClick={handleLogout}>Logout</button>
      <h2>Products</h2>
      <ul>
        {products.map(product => (
          <li key={product.id}>
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <p>Price: ${product.price}</p>
            <p>Stock Available: {product.stockAvailable}</p>
            <img src={product.image} alt={product.name} style={{ width: '100px', height: '100px' }} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Home;