import { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import './profil.css';

interface OrderItem {
  id: number;
  userId: number;
  product: number;
  quantity: number;
}

interface Product {
  id: number;
  name: string;
  price: number;
}

interface Order {
  id: number;
  name: string;
  statut: string;
  createdAt: string;
  updateAt: string;
  orderItems: OrderItem[];
  user: { email: string };
}

const Profil: FC = () => {
  const { user, loading: userLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [products, setProducts] = useState<{ [key: number]: Product }>({});
  const navigate = useNavigate();

  useEffect(() => {
    if (!user && !userLoading) {
      navigate('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await fetch(`http://localhost:5656/orders/user/${user?.id}`);
        if (response.ok) {
          const data: Order[] = await response.json();
          
          data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          
          setOrders(data);

          const productIds: number[] = Array.from(
            new Set(data.flatMap((order: Order) => order.orderItems.map((item: OrderItem) => item.product)))
          );
          fetchProductsByIds(productIds);
        } else {
          console.error('Failed to fetch orders');
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false); 
      }
    };

    if (user?.id) {
      fetchOrders();
    }
  }, [user, userLoading, navigate]);

  const fetchProductsByIds = async (productIds: number[]) => {
    try {
      const productPromises = productIds.map((id) =>
        fetch(`http://localhost:5656/products/${id}`).then((res) => res.json())
      );
      const productData: Product[] = await Promise.all(productPromises);
      const productMap = productData.reduce((acc: { [key: number]: Product }, product: Product) => {
        acc[product.id] = product;
        return acc;
      }, {}); 
      setProducts(productMap);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  if (loading || userLoading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="profil-container">
      <div className="profil-header">
        <h1>Profil</h1>
        <button className='btn-primary' onClick={() => navigate("/")}>Back</button>
        <h2>Your Order History</h2>
      </div>
      
      {orders.length > 0 ? (
        <ul className="orders-list">
          {orders.map((order: Order) => (
            <li key={order.id} className="order-item">
              <h3>Order ID: {order.id} - {order.name}</h3>
              <p className={`status ${order.statut.toLowerCase()}`}>Status: {order.statut}</p>
              <p>Created At: {new Date(order.createdAt).toLocaleString()}</p>
              <p>Updated At: {new Date(order.updateAt).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="no-orders-message">You have no orders.</p>
      )}
    </div>
  );
};

export default Profil;
