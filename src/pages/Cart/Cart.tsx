import { FC, useEffect, useState } from 'react';
import useAuth from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Product } from '../../types/Product';
import request from '../../utils/request';

interface CartItem {
    id: number;
    product: Product;
    quantity: number;
    userId: number;
}

const Cart: FC = () => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [priceTotal, setPriceTotal] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const { user, loading: userLoading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!userLoading && !user) {
            navigate('/login');
        }
    }, [userLoading, user, navigate]);

    useEffect(() => {
        if (user?.id) {
            setLoading(true);
            fetchCartItems(user.id);
        }
    }, [user?.id]);

    const fetchCartItems = async (userId: number) => {
        const response = await request(`ordersitems/user/${userId}`, 'GET');
        if (response.ok && Array.isArray(response.data)) {
            setCartItems(response.data);
        } else {
            console.error('Failed to fetch cart items');
        }
        setLoading(false);
    };

    const handleRemoveFromCart = async (itemId: number) => {
        const response = await request(`ordersitems/${itemId}`, 'DELETE');
        if (response.ok) {
            setCartItems(cartItems.filter(item => item.id !== itemId));
        } else {
            console.error('Failed to remove item');
        }
    };

    const handleQuantityChange = async (itemId: number, newQuantity: number) => {
        if (newQuantity < 1) return;
        const updatedCartItems = cartItems.map(item => 
            item.id === itemId ? { ...item, quantity: newQuantity } : item
        );
        setCartItems(updatedCartItems);

        const response = await request(`ordersitems/${itemId}`, 'PUT', {
            productId: updatedCartItems.find(item => item.id === itemId)?.product.id,
            quantity: newQuantity,
        });

        if (!response.ok) {
            console.error('Failed to update quantity');
        }
    };

    const handleCreateOrder = async () => {
        console.log("Commande - " + new Date().toLocaleDateString());
    
        const order = {
            userId: user?.id,
            name: "Commande - " + new Date().toLocaleDateString(),
            status: "In progress",
        };
    
        try {
            const response = await fetch('http://localhost:5656/orders/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(order),
            });
    
            if (response.ok) {
                const data = await response.json();
                navigate('/profil');
                console.log("Order created successfully:", data);
            } else {
                console.error("Error creating order:", response.status, response.statusText);
            }
        } catch (error) {
            console.error("Request failed", error);
        }
    };
    


    useEffect(() => {
        let total = 0;
        for (const item of cartItems) {
            total += item.product.price * item.quantity;
        }
        setPriceTotal(total);
    }, [cartItems]);

    if (loading || userLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Cart</h1>
            <button onClick={() => navigate('/')}>Back</button>
            {cartItems.length > 0 ? (
                <ul>
                    {cartItems.map(item => (
                        <li key={item.id} className='border p-2 mb-2 rounded'>
                            <p className='font-semibold'>{item.product.name}</p>
                            <p>Price: ${item.product.price}</p>
                            <div>
                                <label htmlFor={`quantity-${item.id}`}>Quantity:</label>
                                <input
                                    type="number"
                                    id={`quantity-${item.id}`}
                                    value={item.quantity}
                                    min="1"
                                    onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                                />
                            </div>
                            <button
                                onClick={() => handleRemoveFromCart(item.id)}
                                className='text-red-500 ml-2'
                            >
                                &#10005;
                            </button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Your cart is empty.</p>
            )}
            <p>Total: ${priceTotal.toFixed(2)}</p>
            <button onClick={handleCreateOrder} className="mt-4 bg-blue-500 text-white p-2 rounded">
                Create Order
            </button>
        </div>
    );
};

export default Cart;
