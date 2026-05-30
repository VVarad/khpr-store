import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowDown } from 'lucide-react';
import api from '../api/axios';
import { ProductCard } from '../components/ProductCard';
import { Skeleton } from '../components/Skeleton';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

const fetchProducts = async () => {
  const { data } = await api.get('/api/products/');
  return data;
};

export const HomePage = () => {
  useDocumentTitle('');
  const { data: products, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex flex-col justify-center items-center text-center px-4 overflow-hidden">
        {/* CSS Noise Texture (simulate with a faint radial gradient on dark bg) */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-surface to-bg opacity-50 pointer-events-none"></div>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, staggerChildren: 0.2 }}
          className="relative z-10 flex flex-col items-center"
        >
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="font-body text-[10px] md:text-xs text-gold uppercase tracking-[0.4em] mb-6"
          >
            KOLHAPUR &middot; SINCE 2024
          </motion.p>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="font-display text-[clamp(3rem,10vw,6rem)] leading-[0.9] mb-6"
          >
            REDEFINING <br className="md:hidden" /> <span className="text-gold italic">LEGACY</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="font-body text-sm md:text-base text-text-secondary mb-12 max-w-md"
          >
            Wearable stories from the heart of Kolhapur.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <Link 
              to="/shop" 
              className="inline-block border border-gold text-gold font-body text-xs uppercase tracking-[0.2em] px-8 py-4 hover:bg-gold hover:text-bg transition-colors duration-300"
            >
              Explore the Drop
            </Link>
          </motion.div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 10, 0] }}
          transition={{ delay: 1.2, duration: 2, repeat: Infinity }}
          className="absolute bottom-12 text-gold opacity-50"
        >
          <ArrowDown size={24} />
        </motion.div>
      </section>

      {/* The Drop Section */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-24">
        <div className="flex justify-between items-end mb-12 border-b border-border pb-4">
          <h2 className="font-body text-sm text-gold uppercase tracking-[0.2em]">01 / The Drop</h2>
          <Link to="/shop" className="font-body text-xs text-text-muted hover:text-gold uppercase tracking-widest transition">
            View All
          </Link>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map(n => (
              <div key={n} className="flex flex-col">
                <Skeleton className="aspect-[4/5] mb-4 w-full" />
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/4" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products?.slice(0, 4).map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Brand Story Strip */}
      <section className="bg-surface border-y border-border py-24 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <p className="font-display italic text-3xl md:text-4xl lg:text-5xl text-text-primary leading-tight mb-16">
            "Every stitch carries a story that Kolhapur has been telling for centuries."
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full border border-gold flex items-center justify-center mb-4 text-gold">I</div>
              <h3 className="font-body text-xs uppercase tracking-widest text-text-secondary">Heritage Design</h3>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full border border-gold flex items-center justify-center mb-4 text-gold">II</div>
              <h3 className="font-body text-xs uppercase tracking-widest text-text-secondary">Made Locally</h3>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full border border-gold flex items-center justify-center mb-4 text-gold">III</div>
              <h3 className="font-body text-xs uppercase tracking-widest text-text-secondary">Premium Quality</h3>
            </div>
          </div>
        </div>
      </section>

      {/* Instagram CTA */}
      <section className="py-32 text-center px-4">
        <h2 className="font-body text-xs uppercase tracking-[0.3em] text-text-muted mb-4">Follow the Story</h2>
        <a 
          href="https://instagram.com/khpr_co" 
          target="_blank" 
          rel="noreferrer"
          className="inline-block font-display text-5xl md:text-7xl text-gold hover:text-gold-light transition-colors mb-8"
        >
          @khpr_co
        </a>
        <div>
          <a 
            href="https://instagram.com/khpr_co" 
            target="_blank" 
            rel="noreferrer"
            className="inline-block border-b border-gold text-gold font-body text-xs uppercase tracking-widest pb-1 hover:text-text-primary hover:border-text-primary transition-colors"
          >
            Join the Community
          </a>
        </div>
      </section>
    </div>
  );
};
