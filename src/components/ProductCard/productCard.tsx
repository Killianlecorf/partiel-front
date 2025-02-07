import { FC } from 'react';
import { Product } from '../../types/Product';
import './productCard.css';

interface ProductCardProps {
  product: Product;
  quantity: number;
  onQuantityChange: (productId: number, value: number) => void;
  onAddToCart: (productId: number) => void;
}

const ProductCard: FC<ProductCardProps> = ({ product, quantity, onQuantityChange, onAddToCart }) => {
  return (
    <div className="product-card">
      <img src={product.Image} alt={product.name} className="product-image" />

      <h3 className="product-name">{product.name}</h3>
      <p className="product-description">{product.description}</p>
      <p className="product-price">💰 ${product.price}</p>
      <p className="product-stock">Stock: {product.stockAvailable}</p>

      <div className="quantity-container">
        <label htmlFor={`quantity-${product.id}`} className="quantity-label">
          Quantity:
        </label>
        <input
          type="number"
          id={`quantity-${product.id}`}
          value={quantity}
          min="1"
          max={product.stockAvailable}
          onChange={(e) => onQuantityChange(product.id, parseInt(e.target.value, 10))}
          className="quantity-input"
        />
      </div>

      <button onClick={() => onAddToCart(product.id)} className="add-to-cart-btn">
        🛒 Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;
