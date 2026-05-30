import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { CartContext } from '../context/CartContext';
import { useAuth } from '../hooks/useAuth';
import api from '../api/axios';
import { resolveImageUrl } from '../utils/imageUrl';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

const loadRazorpay = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const CheckoutPage = () => {
  useDocumentTitle('Checkout');
  const { cart, dispatch } = useContext(CartContext);
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment
  const [isProcessing, setIsProcessing] = useState(false);
  const [shippingData, setShippingData] = useState({
    phone: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    pincode: '',
  });

  const subtotal = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);

  useEffect(() => {
    if (cart.items.length === 0) {
      navigate('/cart');
    }
    if (user) {
      setShippingData({
        phone: user.phone || '',
        address_line1: user.address_line1 || '',
        address_line2: user.address_line2 || '',
        city: user.city || '',
        state: user.state || '',
        pincode: user.pincode || '',
      });
    }
  }, [user, cart, navigate]);

  const handleShippingSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put('/api/auth/profile/', {
        ...user,
        ...shippingData
      });
      setStep(2);
    } catch (error) {
      toast.error('Failed to save shipping details');
    }
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      // 1. Create order on backend
      const orderData = {
        items: cart.items.map(item => ({
          product_id: item.product_id,
          size: item.size,
          quantity: item.quantity
        }))
      };
      
      const res = await api.post('/api/orders/create/', orderData);
      const { order_id, razorpay_order_id, amount, currency, key_id } = res.data;

      // Skip actual razorpay load if keys are empty (for testing)
      if (!razorpay_order_id) {
        dispatch({ type: 'CLEAR_CART' });
        toast.success('Order placed successfully (Test Mode)');
        navigate(`/orders/${order_id}`);
        return;
      }

      // 2. Load Razorpay
      const resRazorpay = await loadRazorpay();
      if (!resRazorpay) {
        toast.error('Razorpay SDK failed to load');
        setIsProcessing(false);
        return;
      }

      // 3. Open Modal
      const options = {
        key: key_id,
        amount: amount * 100,
        currency: currency,
        name: 'KHPR',
        description: 'Purchase from KHPR Kolhapur',
        order_id: razorpay_order_id,
        handler: async function (response) {
          try {
            await api.post('/api/orders/verify-payment/', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            
            dispatch({ type: 'CLEAR_CART' });
            toast.success('Payment successful!');
            navigate(`/orders/${order_id}`);
          } catch (err) {
            toast.error('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: `${user?.user?.first_name} ${user?.user?.last_name}`,
          email: user?.user?.email,
          contact: shippingData.phone
        },
        theme: {
          color: '#C9A96E'
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.on('payment.failed', function (response) {
        toast.error("Payment failed. Please try again.");
      });
      paymentObject.open();
      
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Please login to continue");
        navigate('/login');
      } else {
        toast.error(error.response?.data?.error || 'Failed to initialize payment');
      }
    }
    setIsProcessing(false);
  };

  if (loading) return null;

  return (
    <div className="pt-32 pb-24 px-6 lg:px-12 max-w-4xl mx-auto min-h-screen">
      <h1 className="font-display text-4xl text-gold mb-12 text-center">Checkout</h1>
      
      <div className="flex justify-center mb-12">
        <div className="flex items-center space-x-4 font-body text-xs uppercase tracking-widest">
          <span className={step >= 1 ? 'text-gold' : 'text-text-muted'}>Shipping</span>
          <span className="w-12 h-px bg-border"></span>
          <span className={step >= 2 ? 'text-gold' : 'text-text-muted'}>Payment</span>
        </div>
      </div>

      {step === 1 && (
        <form onSubmit={handleShippingSubmit} className="bg-surface p-8 border border-border">
          <h2 className="font-display text-2xl mb-6">Shipping Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 font-body">
            <input 
              required
              type="text" 
              placeholder="Phone Number" 
              value={shippingData.phone}
              onChange={e => setShippingData({...shippingData, phone: e.target.value})}
              className="bg-bg border border-border p-3 focus:outline-none focus:border-gold transition-colors col-span-1 md:col-span-2"
            />
            <input 
              required
              type="text" 
              placeholder="Address Line 1" 
              value={shippingData.address_line1}
              onChange={e => setShippingData({...shippingData, address_line1: e.target.value})}
              className="bg-bg border border-border p-3 focus:outline-none focus:border-gold transition-colors col-span-1 md:col-span-2"
            />
            <input 
              type="text" 
              placeholder="Address Line 2 (Optional)" 
              value={shippingData.address_line2}
              onChange={e => setShippingData({...shippingData, address_line2: e.target.value})}
              className="bg-bg border border-border p-3 focus:outline-none focus:border-gold transition-colors col-span-1 md:col-span-2"
            />
            <input 
              required
              type="text" 
              placeholder="City" 
              value={shippingData.city}
              onChange={e => setShippingData({...shippingData, city: e.target.value})}
              className="bg-bg border border-border p-3 focus:outline-none focus:border-gold transition-colors"
            />
            <input 
              required
              type="text" 
              placeholder="State" 
              value={shippingData.state}
              onChange={e => setShippingData({...shippingData, state: e.target.value})}
              className="bg-bg border border-border p-3 focus:outline-none focus:border-gold transition-colors"
            />
            <input 
              required
              type="text" 
              placeholder="Pincode" 
              value={shippingData.pincode}
              onChange={e => setShippingData({...shippingData, pincode: e.target.value})}
              className="bg-bg border border-border p-3 focus:outline-none focus:border-gold transition-colors col-span-1 md:col-span-2"
            />
          </div>
          <button 
            type="submit"
            className="w-full bg-gold text-bg py-4 font-body text-xs uppercase tracking-widest hover:bg-gold-light transition-colors"
          >
            Continue to Payment
          </button>
        </form>
      )}

      {step === 2 && (
        <div className="bg-surface p-8 border border-border">
          <h2 className="font-display text-2xl mb-6">Order Summary</h2>
          
          <div className="space-y-4 mb-8 max-h-[300px] overflow-y-auto pr-4">
            {cart.items.map(item => (
              <div key={`${item.product_id}-${item.size}`} className="flex justify-between items-center text-sm font-body">
                <div className="flex items-center gap-4">
                  <img src={resolveImageUrl(item.front_image)} alt={item.productName} className="w-12 h-16 object-cover border border-border" />
                  <div>
                    <p className="text-text-primary">{item.productName}</p>
                    <p className="text-text-secondary text-xs mt-1">Size: {item.size} x {item.quantity}</p>
                  </div>
                </div>
                <p className="text-gold">₹{item.price * item.quantity}</p>
              </div>
            ))}
          </div>

          <div className="border-t border-border pt-6 mb-8 flex justify-between items-end">
            <span className="font-body text-sm uppercase tracking-widest text-text-secondary">Total to Pay</span>
            <span className="font-display text-3xl text-gold">₹{subtotal}</span>
          </div>

          <div className="flex gap-4">
            <button 
              onClick={() => setStep(1)}
              className="flex-1 border border-border text-text-secondary py-4 font-body text-xs uppercase tracking-widest hover:text-text-primary hover:border-text-primary transition-colors"
            >
              Back
            </button>
            <button 
              onClick={handlePayment}
              disabled={isProcessing}
              className="flex-1 bg-gold text-bg py-4 font-body text-xs uppercase tracking-widest hover:bg-gold-light transition-colors disabled:opacity-50"
            >
              {isProcessing ? 'Processing...' : `Pay ₹${subtotal} with Razorpay`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
