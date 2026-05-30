import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus, X, ShoppingBag } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { resolveImageUrl } from '../utils/imageUrl';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export const CartPage = () => {
  useDocumentTitle('Your Bag');
  const { cart, dispatch } = useContext(CartContext);
  const navigate = useNavigate();

  const updateQuantity = (item, newQuantity) => {
    if (newQuantity < 1) return;
    dispatch({ type: 'UPDATE_QUANTITY', payload: { ...item, quantity: newQuantity } });
  };

  const removeItem = (item) => {
    dispatch({ type: 'REMOVE_ITEM', payload: item });
  };

  const subtotal = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  const total = subtotal; // Free shipping

  if (cart.items.length === 0) {
    return (
      <div className="pt-40 pb-24 px-6 min-h-[80vh] flex flex-col items-center justify-center text-center">
        <ShoppingBag size={48} className="text-gold opacity-50 mb-6" />
        <h2 className="font-display text-3xl text-text-primary mb-4">Your cart is empty</h2>
        <p className="font-body text-text-secondary mb-8">It seems you haven't added any wearable stories yet.</p>
        <Link 
          to="/shop" 
          className="border border-gold text-gold font-body text-xs uppercase tracking-[0.2em] px-8 py-4 hover:bg-gold hover:text-bg transition-colors"
        >
          Explore the Drop
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 px-6 lg:px-12 max-w-7xl mx-auto min-h-screen">
      <h1 className="font-display text-4xl text-gold mb-12">Your Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
        
        {/* Left: Cart Items */}
        <div className="lg:col-span-2">
          <div className="hidden md:grid grid-cols-12 gap-4 pb-4 border-b border-border font-body text-[10px] uppercase tracking-widest text-text-muted mb-6">
            <div className="col-span-6">Product</div>
            <div className="col-span-3 text-center">Quantity</div>
            <div className="col-span-2 text-right">Total</div>
            <div className="col-span-1"></div>
          </div>
          
          <AnimatePresence>
            {cart.items.map((item) => (
              <motion.div
                key={`${item.product_id}-${item.size}`}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center py-6 border-b border-border"
              >
                {/* Product Info */}
                <div className="md:col-span-6 flex gap-4">
                  <Link to={`/product/${item.slug}`} className="w-20 h-24 bg-surface flex-shrink-0">
                    <img src={resolveImageUrl(item.front_image)} alt={item.productName} loading="lazy" className="w-full h-full object-cover" />
                  </Link>
                  <div className="flex flex-col justify-center">
                    <Link to={`/product/${item.slug}`} className="font-display text-lg text-text-primary hover:text-gold transition-colors">
                      {item.productName}
                    </Link>
                    <p className="font-body text-xs text-text-secondary mt-1 uppercase tracking-widest">Size: {item.size}</p>
                    <p className="font-body text-sm text-gold mt-2 md:hidden">₹{item.price}</p>
                  </div>
                </div>
                
                {/* Quantity Controls */}
                <div className="md:col-span-3 flex justify-start md:justify-center items-center mt-4 md:mt-0">
                  <div className="flex items-center border border-border">
                    <button 
                      onClick={() => updateQuantity(item, item.quantity - 1)}
                      className="w-10 h-10 flex items-center justify-center text-text-secondary hover:text-gold transition-colors"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-10 text-center font-body text-sm">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item, item.quantity + 1)}
                      className="w-10 h-10 flex items-center justify-center text-text-secondary hover:text-gold transition-colors"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
                
                {/* Total */}
                <div className="hidden md:block md:col-span-2 text-right">
                  <p className="font-body text-sm text-gold tracking-wide">₹{item.price * item.quantity}</p>
                </div>
                
                {/* Remove */}
                <div className="md:col-span-1 flex justify-end absolute md:relative top-6 right-0 md:top-auto">
                  <button 
                    onClick={() => removeItem(item)}
                    className="text-text-muted hover:text-red-500 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Right: Summary */}
        <div className="lg:col-span-1">
          <div className="bg-surface p-8 border border-border sticky top-32">
            <h2 className="font-display text-2xl mb-6">Order Summary</h2>
            
            <div className="space-y-4 font-body text-sm text-text-secondary border-b border-border pb-6 mb-6">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-gold">Free</span>
              </div>
            </div>
            
            <div className="flex justify-between items-end mb-8">
              <span className="font-body text-sm uppercase tracking-widest">Total</span>
              <span className="font-display text-3xl text-gold">₹{total}</span>
            </div>
            
            <button 
              onClick={() => navigate('/checkout')}
              className="w-full bg-gold text-bg py-4 font-body text-xs uppercase tracking-widest hover:bg-gold-light transition-colors"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
        
      </div>
    </div>
  );
};
