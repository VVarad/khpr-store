import { useState, useEffect } from 'react';
import api from '../api/axios';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('khpr_access_token');
      if (token) {
        try {
          const res = await api.get('/api/auth/profile/');
          setUser(res.data.user || res.data);
        } catch (error) {
          localStorage.removeItem('khpr_access_token');
          localStorage.removeItem('khpr_refresh_token');
          setUser(null);
        }
      }
      setLoading(false);
    };
    fetchProfile();
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/api/auth/login/', { username: email, password });
    localStorage.setItem('khpr_access_token', res.data.access);
    localStorage.setItem('khpr_refresh_token', res.data.refresh);
    
    const profileRes = await api.get('/api/auth/profile/');
    setUser(profileRes.data.user || profileRes.data);
  };

  const register = async (userData) => {
    const res = await api.post('/api/auth/register/', userData);
    localStorage.setItem('khpr_access_token', res.data.access);
    localStorage.setItem('khpr_refresh_token', res.data.refresh);
    setUser(res.data.user);
  };

  const logout = () => {
    localStorage.removeItem('khpr_access_token');
    localStorage.removeItem('khpr_refresh_token');
    setUser(null);
  };

  return { user, loading, isAuthenticated: !!user, login, register, logout };
};
