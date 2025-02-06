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
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});
  const [message, setMessage] = useState<string | null>(null);

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

  const handleAddOrderItems = async (productId: number) => {
    const quantity = quantities[productId] || 1;

    if (user == null) {
      console.error('User is not logged in');
      return;
    }

    const product = products.find((p) => p.id === productId);
    if (product && quantity > product.stockAvailable) {
      setMessage('Not enough stock available');
      return;
    }

    try {
      const response = await request('ordersitems', 'POST', { userId: user.id, productId, quantity });
      if (response.ok) {
        setMessage('Item added to cart successfully');
        console.log('Order added:', response.data);
      } else {
        console.error('Failed to add order:', response.message);
      }
    } catch (error) {
      console.error('Error adding order:', error);
    }
  };

  const handleQuantityChange = (productId: number, value: number) => {
    if (value >= 1 && value <= (products.find(p => p.id === productId)?.stockAvailable || 0)) {
      setQuantities((prevQuantities) => ({
        ...prevQuantities,
        [productId]: value,
      }));
    }
  };

  if (loading || loadingProducts) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Home</h1>
      {user && <p>Welcome, {user.email}</p>}
      {user && user.isAdmin && <button onClick={() => navigate('/admin')}>Admin</button>}
      {user && <button onClick={() => navigate('/profil')}>profil</button>}
      <button onClick={handleLogout}>Logout</button>
      <button onClick={() => navigate('/cart')}>Cart</button>
      <h2>Products</h2>
      {message && <p>{message}</p>}
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <p>Price: ${product.price}</p>
            <p>Stock Available: {product.stockAvailable}</p>
            <img
              src={product.image}
              alt={product.name}
              style={{ width: '100px', height: '100px' }}
            />
            <div>
              <label htmlFor={`quantity-${product.id}`}>Quantity:</label>
              <input
                type="number"
                id={`quantity-${product.id}`}
                value={quantities[product.id] || 1}
                min="1"
                max={product.stockAvailable}
                onChange={(e) =>
                  handleQuantityChange(product.id, parseInt(e.target.value, 10))
                }
              />
            </div>
            <button onClick={() => handleAddOrderItems(product.id)}>
              Add to Cart
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
