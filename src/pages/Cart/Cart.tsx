import { FC, useEffect, useState } from 'react';
import useAuth from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Product } from '../../types/Product';
import request from '../../utils/request';
import "./Cart.css";

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
        return <div className="loading">Loading...</div>;
    }

    return (
        <div className="cart-container">
            <div className="cart-header">
                <h1>Cart</h1>
                <button onClick={() => navigate('/')}>Back</button>
            </div>

            {cartItems.length > 0 ? (
                <div className="cart-items">
                    <ul>
                        {cartItems.map(item => (
                            <li key={item.id}>
                                <div>
                                    <p className="product-name">{item.product.name}</p>
                                    <p className="product-price">Price: ${item.product.price}</p>
                                </div>
                                <div className="quantity-container">
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
                                    className="remove-btn"
                                >
                                    &#10005;
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <p>Your cart is empty.</p>
            )}

            <div className="cart-total">
                <p>Total: ${priceTotal.toFixed(2)}</p>
                <button onClick={handleCreateOrder} className="create-order-btn">
                    Create Order
                </button>
            </div>
        </div>
    );
};

export default Cart;
