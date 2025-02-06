import { FC, useEffect, useState } from 'react';
import useAuth from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Product } from '../../types/Product';

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
            fetch(`http://localhost:5656/ordersitems/user/${user.id}`)
                .then(response => response.json())
                .then(data => {
                    if (Array.isArray(data)) {
                        setCartItems(data);
                    } else {
                        console.error('La réponse n\'est pas un tableau');
                    }
                })
                .catch(error => console.error('Error fetching cart items:', error))
                .finally(() => setLoading(false));
        }
    }, [user?.id]);

    const handleRemoveFromCart = (itemId: number) => {
        fetch(`http://localhost:5656/ordersitems/${itemId}`, {
            method: 'DELETE',
        })
        .then(response => {
            if (response.ok) {
                setCartItems(cartItems.filter(item => item.id !== itemId));
            } else {
                console.error('Failed to remove item');
            }
        })
        .catch(error => console.error('Error deleting item:', error));
    };

    const handleQuantityChange = (itemId: number, newQuantity: number) => {
        // Si la nouvelle quantité est valide
        if (newQuantity < 1) return; // Ne permet pas une quantité inférieure à 1
        const updatedCartItems = cartItems.map(item => 
            item.id === itemId ? { ...item, quantity: newQuantity } : item
        );
        setCartItems(updatedCartItems);

        // Envoie de la requête PUT pour mettre à jour la quantité dans la base de données
        fetch(`http://localhost:5656/ordersitems/${itemId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                productId: updatedCartItems.find(item => item.id === itemId)?.product.id,
                quantity: newQuantity,
            })
        })
        .then(response => {
            if (!response.ok) {
                console.error('Failed to update quantity');
            }
        })
        .catch(error => console.error('Error updating quantity:', error));
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
        </div>
    );
};

export default Cart;
