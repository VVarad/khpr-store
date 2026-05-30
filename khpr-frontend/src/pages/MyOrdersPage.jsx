import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../hooks/useAuth';
import { resolveImageUrl } from '../utils/imageUrl';
import { Skeleton } from '../components/Skeleton';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export const MyOrdersPage = () => {
  useDocumentTitle('My Orders');
  const { logout } = useAuth();
  const navigate = useNavigate();

  const { data: orders, isLoading } = useQuery({
    queryKey: ['my-orders'],
    queryFn: async () => {
      const { data } = await api.get('/api/orders/my-orders/');
      return data;
    },
  });

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getStatusColor = (status) => {
    const colors = {
      PENDING: 'text-yellow-500',
      CONFIRMED: 'text-green-500',
      SHIPPED: 'text-blue-500',
      DELIVERED: 'text-green-400',
      CANCELLED: 'text-red-500'
    };
    return colors[status] || 'text-text-secondary';
  };

  return (
    <div className="pt-32 pb-24 px-6 lg:px-12 max-w-7xl mx-auto min-h-screen">
      <div className="flex justify-between items-end mb-12 border-b border-border pb-6">
        <div>
          <h1 className="font-display text-4xl text-gold mb-2">My Orders</h1>
          <p className="font-body text-sm text-text-secondary">Track and manage your past purchases.</p>
        </div>
        <button 
          onClick={handleLogout}
          className="font-body text-xs text-text-muted hover:text-red-500 transition-colors uppercase tracking-widest border-b border-transparent hover:border-red-500 pb-1"
        >
          Logout
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-6">
          {[1, 2, 3].map(n => (
            <Skeleton key={n} className="h-32 w-full" />
          ))}
        </div>
      ) : orders?.length === 0 ? (
        <div className="text-center py-20 bg-surface border border-border">
          <p className="font-body text-text-secondary mb-6">You haven't placed any orders yet.</p>
          <Link to="/shop" className="border border-gold text-gold font-body text-xs uppercase tracking-widest px-8 py-3 hover:bg-gold hover:text-bg transition-colors">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders?.map(order => (
            <div key={order.id} className="bg-surface border border-border p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 transition-colors hover:border-gold/50">
              <div className="flex gap-6 items-center">
                {order.items?.length > 0 && (
                  <div className="w-20 h-24 bg-bg border border-border flex-shrink-0">
                    <img src={resolveImageUrl(order.items[0].front_image)} alt="Product" className="w-full h-full object-cover" />
                  </div>
                )}
                <div>
                  <h3 className="font-display text-xl text-gold mb-1">{order.order_id}</h3>
                  <p className="font-body text-xs text-text-muted uppercase tracking-widest mb-2">
                    {new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                  <p className={`font-body text-xs uppercase tracking-widest font-bold ${getStatusColor(order.status)}`}>
                    {order.status}
                  </p>
                </div>
              </div>
              
              <div className="flex flex-row md:flex-col justify-between w-full md:w-auto items-center md:items-end gap-4 md:gap-2">
                <p className="font-body text-lg text-text-primary">₹{order.total_amount}</p>
                <Link 
                  to={`/orders/${order.order_id}`}
                  className="font-body text-xs text-gold uppercase tracking-widest border-b border-gold pb-1 hover:text-gold-light hover:border-gold-light transition-colors"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
