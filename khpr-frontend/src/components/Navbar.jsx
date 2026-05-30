import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, User, Menu, X } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { useAuth } from '../hooks/useAuth';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [pulseCart, setPulseCart] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';
  
  const { cart } = useContext(CartContext);
  const { isAuthenticated } = useAuth();
  
  const cartItemCount = cart.items.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    const handleCartUpdate = () => {
      setPulseCart(true);
      setTimeout(() => setPulseCart(false), 300);
    };
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('cart_updated', handleCartUpdate);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('cart_updated', handleCartUpdate);
    };
  }, []);

  const navClasses = `fixed top-0 w-full z-50 transition-colors duration-300 ${
    isHome && !isScrolled ? 'bg-transparent' : 'bg-bg shadow-lg shadow-black/20'
  }`;

  const navLinks = [
    { name: 'SHOP', path: '/shop' },
    { name: 'OUR STORY', path: '/story' },
  ];

  return (
    <nav className={navClasses}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex justify-between items-center h-24">
        
        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center">
          <button onClick={() => setMobileMenuOpen(true)} className="text-text-primary hover:text-gold transition">
            <Menu size={24} />
          </button>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-12">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              to={link.path}
              className="font-body text-[13px] uppercase tracking-[0.15em] hover:text-gold transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Logo Center */}
        <div className="absolute left-1/2 transform -translate-x-1/2 text-center">
          <Link to="/">
            <h1 className="font-display font-bold text-3xl md:text-[28px] text-gold tracking-wide leading-none">KHPR</h1>
            <p className="font-body text-[9px] uppercase tracking-[0.35em] text-text-muted mt-1 leading-none">Redefining Legacy</p>
          </Link>
        </div>

        {/* Icons Right */}
        <div className="flex items-center space-x-6">
          <Link to={isAuthenticated ? "/orders" : "/login"} className="text-text-primary hover:text-gold transition-colors">
            <User size={20} />
          </Link>
          <Link to="/cart" className="text-text-primary hover:text-gold transition-colors relative block">
            <motion.div
              animate={pulseCart ? { scale: [1, 1.2, 1] } : { scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <ShoppingBag size={20} />
              {cartItemCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-gold text-bg text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {cartItemCount}
                </span>
              )}
            </motion.div>
          </Link>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 bg-bg/95 backdrop-blur-md z-[60] flex flex-col justify-center items-center"
          >
            <button 
              onClick={() => setMobileMenuOpen(false)} 
              className="absolute top-8 right-6 text-text-primary hover:text-gold"
            >
              <X size={32} />
            </button>
            <div className="flex flex-col items-center space-y-8">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="font-display text-3xl uppercase tracking-widest hover:text-gold transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
