import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';
import { resolveImageUrl } from '../utils/imageUrl';
import { Skeleton } from '../components/Skeleton';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export const OrderDetailPage = () => {
  useDocumentTitle('Order Details');
  const { orderId } = useParams();

  const { data: order, isLoading, isError } = useQuery({
    queryKey: ['order', orderId],
    queryFn: async () => {
      const { data } = await api.get(`/api/orders/${orderId}/`);
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="pt-32 pb-24 px-6 lg:px-12 max-w-4xl mx-auto min-h-screen">
        <Skeleton className="h-10 w-1/3 mb-12" />
        <Skeleton className="h-64 w-full mb-12" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="pt-32 min-h-screen text-center">
        <h2 className="text-2xl text-gold mb-4">Order Not Found</h2>
        <Link to="/orders" className="text-text-secondary border-b border-border pb-1">Back to Orders</Link>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 px-6 lg:px-12 max-w-4xl mx-auto min-h-screen">
      <Link to="/orders" className="font-body text-xs text-text-muted uppercase tracking-widest hover:text-gold transition-colors mb-8 inline-block">
        &larr; Back to Orders
      </Link>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 pb-6 border-b border-border gap-4">
        <div>
          <h1 className="font-display text-4xl text-gold mb-2">Order {order.order_id}</h1>
          <p className="font-body text-sm text-text-secondary">
            Placed on {new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
        <div className="text-left md:text-right">
          <p className="font-body text-xs text-text-muted uppercase tracking-widest mb-1">Status</p>
          <p className="font-body font-bold tracking-widest text-gold">{order.status}</p>
        </div>
      </div>

      <div className="bg-surface border border-border p-8 mb-12">
        <h2 className="font-display text-2xl mb-6">Items</h2>
        <div className="space-y-6">
          {order.items.map(item => (
            <div key={item.id} className="flex gap-6 items-center border-b border-border pb-6 last:border-0 last:pb-0">
              <img src={resolveImageUrl(item.front_image)} alt={item.product_name} className="w-16 h-20 object-cover border border-border" />
              <div className="flex-1">
                <p className="font-display text-lg text-text-primary mb-1">{item.product_name}</p>
                <p className="font-body text-xs text-text-secondary uppercase tracking-widest">Size: {item.size} &middot; Qty: {item.quantity}</p>
              </div>
              <p className="font-body text-sm text-gold">₹{item.unit_price * item.quantity}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        <div>
          <h2 className="font-display text-xl mb-4 border-b border-border pb-2">Shipping Details</h2>
          <div className="font-body text-sm text-text-secondary space-y-1">
            <p>{order.shipping_address?.address_line1}</p>
            {order.shipping_address?.address_line2 && <p>{order.shipping_address?.address_line2}</p>}
            <p>{order.shipping_address?.city}, {order.shipping_address?.state} {order.shipping_address?.pincode}</p>
            <p className="pt-2">Phone: {order.shipping_address?.phone}</p>
          </div>
        </div>
        
        <div>
          <h2 className="font-display text-xl mb-4 border-b border-border pb-2">Payment Summary</h2>
          <div className="font-body text-sm text-text-secondary space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{order.total_amount}</span>
            </div>
            <div className="flex justify-between pb-2 border-b border-border">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="flex justify-between pt-2 text-gold font-bold">
              <span>Total</span>
              <span>₹{order.total_amount}</span>
            </div>
            <div className="pt-4 text-xs text-text-muted">
              Payment ID: {order.razorpay_payment_id || 'Pending'}
            </div>
          </div>
        </div>
      </div>

      <div className="text-center pt-12 border-t border-border">
        <p className="font-display italic text-2xl text-gold-light">
          Thank you for supporting Kolhapur's story.
        </p>
      </div>
    </div>
  );
};
