import { useState, useEffect } from 'react';
import request from '../utils/request';

interface User {
  id: number;
  email: string;
  isAdmin: boolean;
  iat: number;
  exp: number;
}

const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await request('users/isauth', 'GET');
        if (response.ok) {
          setUser(response.data.decoded);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return { user, loading };
};

export default useAuth;