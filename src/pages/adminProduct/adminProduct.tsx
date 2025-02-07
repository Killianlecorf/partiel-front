import { FC, useEffect, useState } from 'react';
import request from '../../utils/request';
import './adminProduct.css';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stockAvailable: number;
  Image: string;
}

const AdminProduct: FC = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentProductId, setCurrentProductId] = useState<number | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [stockAvailable, setStockAvailable] = useState(0);
  const [image, setImage] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => {
    setModalIsOpen(false);
    setIsEditMode(false);
    setCurrentProductId(null);
    setName('');
    setDescription('');
    setPrice(0);
    setStockAvailable(0);
    setImage('');
  };

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

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const url = isEditMode && currentProductId ? `products/${currentProductId}` : 'products';
    const method = isEditMode && currentProductId ? 'PUT' : 'POST';
    try {
      const response = await request(url, method, {
        name,
        description,
        price,
        stockAvailable,
        image
      });

      if (response.ok) {
        console.log('Product saved successfully:', response.data);
        closeModal();
        fetchProducts();
      } else {
        console.error('Failed to save product:', response.message);
      }
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const handleEdit = (product: Product) => {
    setIsEditMode(true);
    setCurrentProductId(product.id);
    setName(product.name);
    setDescription(product.description);
    setPrice(product.price);
    setStockAvailable(product.stockAvailable);
    setImage(product.Image);
    openModal();
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await request(`products/${id}`, 'DELETE');
      if (response.ok) {
        console.log('Product deleted successfully');
        fetchProducts();
      } else {
        console.error('Failed to delete product:', response.message);
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  useEffect(() => {
    if (!loading) {
      if (!user || !user.isAdmin) {
        navigate('/login');
      }
    }
  }, [loading, user, navigate]);

  if (loading || loadingProducts) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="admin-product">
      <h1>Admin Dashboard</h1>
      <button className="btn btn-primary" onClick={() => navigate("/admin")}>Back</button>
      <button className="btn btn-primary" onClick={openModal}>Add Product</button>
      
      {modalIsOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>&times;</span>
            <h2>{isEditMode ? 'Edit Product' : 'Add Product'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name:</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>Description:</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>Price:</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  required
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>Stock Available:</label>
                <input
                  type="number"
                  value={stockAvailable}
                  onChange={(e) => setStockAvailable(Number(e.target.value))}
                  required
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>Image URL:</label>
                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  required
                  className="form-control"
                />
              </div>
              <button type="submit" className="btn btn-success">{isEditMode ? 'Save Changes' : 'Add Product'}</button>
              <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button>
            </form>
          </div>
        </div>
      )}

      <h2>Products List</h2>
      <table className="product-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Price</th>
            <th>Stock Available</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>{product.description}</td>
              <td>${product.price}</td>
              <td>{product.stockAvailable}</td>
              <td>
                <img src={product.Image} alt={product.name} className="product-image" />
              </td>
              <td>
                <button className="btn btn-warning" onClick={() => handleEdit(product)}>✏️</button>
                {/* <button className="btn btn-danger" onClick={() => handleDelete(product.id)}>❌</button> */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminProduct;
