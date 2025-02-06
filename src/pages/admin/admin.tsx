import { FC, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const Admin: FC = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!user || !user.isAdmin) {
        navigate('/login');
      }
    }
  }, [loading, user, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className=''>
      <h1>Administrateur page</h1>
      <button onClick={() => navigate('/admin/product')}>Add product</button>
      <button onClick={() => navigate('/')}>back</button>

    </div>
  );
}

export default Admin;