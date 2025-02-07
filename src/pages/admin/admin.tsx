import { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import './admin.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const Admin: FC = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const [orderCount, setOrderCount] = useState<number>(0);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [stockLevels, setStockLevels] = useState<any[]>([]); 
  const [loadingData, setLoadingData] = useState<boolean>(true);

  useEffect(() => {
    if (!loading) {
      if (!user || !user.isAdmin) {
        navigate('/login');
      }
    }
  }, [loading, user, navigate]);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const ordersResponse = await fetch('http://localhost:5656/orders/all');
        const ordersData = await ordersResponse.json();
        setOrderCount(ordersData.length);

        const productSalesCount: { [key: number]: number } = {};
        ordersData.forEach((order: any) => {
          order.orderItems.forEach((item: any) => {
            if (productSalesCount[item.product]) {
              productSalesCount[item.product] += item.quantity;
            } else {
              productSalesCount[item.product] = item.quantity;
            }
          });
        });

        const productsResponse = await fetch('http://localhost:5656/products/all');
        const productsData = await productsResponse.json();

        const topProductsData = productsData.map((product: any) => ({
          name: product.name,
          sales: productSalesCount[product.id] || 0,
        }));
        setTopProducts(topProductsData);

        setStockLevels(productsData);

      } catch (error) {
        console.error('Error fetching admin data:', error);
      } finally {
        setLoadingData(false);
      }
    };

    fetchAdminData();
  }, []);

  if (loading || loadingData) {
    return <div>Loading...</div>;
  }

  const productsSoldChartData = {
    labels: topProducts.map((product) => product.name),
    datasets: [
      {
        label: 'Products Sold',
        data: topProducts.map((product) => product.sales),
        backgroundColor: '#42A5F5',
        borderColor: '#1E88E5',
        borderWidth: 1,
      },
    ],
  };

  const stockLevelsChartData = {
    labels: stockLevels.map((product) => product.name),
    datasets: [
      {
        label: 'Stock Remaining',
        data: stockLevels.map((product) => product.stockAvailable),
        backgroundColor: [
          '#FF6384',  
          '#36A2EB',
          '#FFCE56',
          '#FF5733',
          '#42A5F5',
          '#66BB6A',
          '#FFA726',
          '#FF4081',
          '#8E24AA',
          '#7E57C2',
        ],
        hoverBackgroundColor: [
          '#FF4384',
          '#36A2DB',
          '#FFB556',
          '#FF5733',
          '#4299F5',
          '#66C75F',
          '#FF8A47',
          '#FF64A2',
          '#9C4DD4',
          '#6C4DC6',
        ],
        borderColor: '#D32F2F',
        borderWidth: 1,
      },
    ],
  };
  

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <button className="btn-back" onClick={() => navigate('/')}>Back</button>
      </div>

      <div className="dashboard-statistics">
        <div className="statistics-item">
          <h3>Number of Orders</h3>
          <p>{orderCount}</p>
        </div>

        <div className="statistics-item">
          <h3>Top Selling Products</h3>
          <Bar data={productsSoldChartData} options={{ responsive: true }} />
        </div>
        <div className="statistics-item">
          <h3>Stock Levels</h3>
          <Doughnut data={stockLevelsChartData} options={{ responsive: true }} />
        </div>
      </div>

      <div className="admin-actions">
        <button onClick={() => navigate('/admin/product')} className="btn-action">Add Product</button>
        <button onClick={() => navigate('/admin/orders')} className="btn-action">View Orders</button>
      </div>
    </div>
  );
};

export default Admin;
