import { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Product {
  id: number;
  name: string;
  price: number;
}

interface OrderItem {
  id: number;
  product: number;
  quantity: number;
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

const OrderAdmin: FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5656/products/all');
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        } else {
          console.error('Failed to fetch products');
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    const fetchOrders = async () => {
      try {
        const response = await fetch('http://localhost:5656/orders/all');
        if (response.ok) {
          const data = await response.json();
          setOrders(data);
        } else {
          console.error('Failed to fetch orders');
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    fetchOrders();
  }, [orders]);

  const updateOrderStatus = async (orderId: number, newStatus: string) => {
    try {
      const response = await fetch(`http://localhost:5656/orders/status/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        const updatedOrder = await response.json();
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === updatedOrder.id ? updatedOrder : order
          )
        );
      } else {
        console.error('Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className=''>
      <h1>Orders</h1>
      <button onClick={() => navigate('/admin')}>Back</button>
      {orders.length > 0 ? (
        <ul>
          {orders.map(order => (
            <li key={order.id} className='border p-2 mb-2 rounded'>
              <h3>Order ID: {order.id}</h3>
              <p>Status: {order.statut}</p>
              <p>Created At: {new Date(order.createdAt).toLocaleString()}</p>
              <p>Updated At: {new Date(order.updateAt).toLocaleString()}</p>
              <p>User: {order.user.email}</p>

              <select
                value={order.statut}
                onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                className="border p-2 mt-2"
              >
                <option value="In progress">In progress</option>
                <option value="Shipped">Shipped</option>
                <option value="Canceled">Canceled</option>
              </select>

              <h4>Order Items</h4>
              <ul>
                {order.orderItems.map(item => {
                  const product = products.find(p => p.id === item.product);
                  return product ? (
                    <li key={item.id} className='ml-4'>
                      <p>Product: {product.name}</p>
                      <p>Price: ${product.price}</p>
                      <p>Quantity: {item.quantity}</p>
                    </li>
                  ) : (
                    <li key={item.id} className='ml-4'>
                      <p>Product: Unknown (ID: {item.product})</p>
                      <p>Quantity: {item.quantity}</p>
                    </li>
                  );
                })}
              </ul>
            </li>
          ))}
        </ul>
      ) : (
        <p>No orders found.</p>
      )}
    </div>
  );
};

export default OrderAdmin;
