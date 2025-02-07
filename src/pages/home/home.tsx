import { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import request from '../../utils/request';
import { Product } from '../../types/Product';
import ProductCard from '../../components/ProductCard/productCard';
import "./home.css"

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

    if (!user) {
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
    if (value >= 1 && value <= (products.find((p) => p.id === productId)?.stockAvailable || 0)) {
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
    <div className="home-container">
      <header className="home-header">
        <h1>Home</h1>
        <div>
          {user && user.isAdmin && <button className="btn btn-primary" onClick={() => navigate('/admin')}>Admin</button>}
          {user && <button className="btn btn-primary" onClick={() => navigate('/profil')}>Profile</button>}
          <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
          <button className="btn btn-success" onClick={() => navigate('/cart')}>🛒 Cart</button>
        </div>
      </header>

      {message && <p className="message">{message}</p>}

      <section className="products-container">
        <h2 className="products-title">Products</h2>
        <div className="products-grid">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              quantity={quantities[product.id] || 1}
              onQuantityChange={handleQuantityChange}
              onAddToCart={handleAddOrderItems}
            />
          ))}
        </div>
      </section>
    </div>

  );
};

export default Home;
