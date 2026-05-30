import React, { useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { CartContext } from '../context/CartContext';
import { resolveImageUrl } from '../utils/imageUrl';
import { Skeleton } from '../components/Skeleton';
import { ErrorState } from '../components/ErrorState';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export const ProductDetailPage = () => {
  const { slug } = useParams();
  const { dispatch } = useContext(CartContext);
  
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);

  const { data: product, isLoading, isError, refetch } = useQuery({
    queryKey: ['product', slug],
    queryFn: async () => {
      const { data } = await api.get(`/api/products/${slug}/`);
      return data;
    },
  });

  useDocumentTitle(product ? product.name : 'Product');

  if (isLoading) {
    return (
      <div className="pt-32 pb-24 px-6 lg:px-12 max-w-7xl mx-auto min-h-screen">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <Skeleton className="aspect-[4/5] w-full" />
          <div className="space-y-6 pt-8">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-24 w-full mt-12" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="pt-32 min-h-screen">
        <ErrorState message="Product Not Found" onRetry={isError ? refetch : undefined} />
        <div className="text-center mt-4">
          <Link to="/shop" className="text-text-secondary hover:text-gold transition font-body text-sm tracking-widest uppercase border-b border-transparent hover:border-gold pb-1">
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  const images = [product.front_image, product.back_image, product.detail_image].filter(Boolean).map(resolveImageUrl);
  
  const handleAddToCart = () => {
    if (!selectedSize) return;
    const sizeData = product.sizes.find(s => s.size === selectedSize);
    if (sizeData && sizeData.stock === 0) {
      toast.error('This size is sold out');
      return;
    }
    
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        product_id: product.id,
        productName: product.name,
        slug: product.slug,
        size: selectedSize,
        price: parseFloat(product.price),
        quantity: 1,
        front_image: product.front_image,
      }
    });
    
    toast.success(`${product.name} added to cart`, {
      style: { background: '#111111', color: '#F5F0E8', border: '1px solid #C9A96E' }
    });
    window.dispatchEvent(new Event('cart_updated'));
    setSelectedSize(null);
  };

  return (
    <div className="pt-32 pb-24 px-6 lg:px-12 max-w-7xl mx-auto min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
        
        {/* Left: Image Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-[4/5] bg-surface border border-border overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.img
                key={activeImageIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                src={images[activeImageIndex]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </AnimatePresence>
          </div>
          <div className="flex gap-4">
            {images.map((img, idx) => (
              <button 
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`relative aspect-[4/5] w-20 overflow-hidden border transition-colors ${activeImageIndex === idx ? 'border-gold' : 'border-border opacity-60 hover:opacity-100'}`}
              >
                <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Right: Product Info */}
        <div className="flex flex-col lg:pt-8">
          <p className="font-body text-[10px] text-gold uppercase tracking-[0.3em] mb-4">
            {product.category?.name || 'Category'}
          </p>
          <h1 className="font-display text-4xl md:text-5xl leading-tight mb-4">{product.name}</h1>
          <p className="font-body text-2xl text-gold mb-10">₹{product.price}</p>
          
          {/* Sizes */}
          <div className="mb-10">
            <div className="flex justify-between items-end mb-4">
              <span className="font-body text-xs uppercase tracking-widest text-text-secondary">Select Size</span>
            </div>
            <div className="flex flex-wrap gap-3">
              {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => {
                const sizeData = product.sizes?.find(s => s.size === size);
                const isOutOfStock = !sizeData || sizeData.stock === 0;
                const isSelected = selectedSize === size;
                
                return (
                  <button
                    key={size}
                    disabled={isOutOfStock}
                    onClick={() => setSelectedSize(size)}
                    className={`
                      w-12 h-12 rounded-full font-body text-sm flex items-center justify-center transition-all duration-300
                      ${isOutOfStock ? 'text-text-muted border border-border cursor-not-allowed opacity-50 relative overflow-hidden before:absolute before:w-full before:h-px before:bg-border before:rotate-45' : 
                        isSelected ? 'border border-gold text-gold bg-gold/10' : 'border border-border hover:border-gold hover:text-gold'}
                    `}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>
          
          {/* Add to Cart */}
          <button 
            onClick={handleAddToCart}
            disabled={!selectedSize}
            className={`w-full py-4 min-h-[44px] font-body text-xs uppercase tracking-widest transition-all duration-300 mb-16
              ${!selectedSize 
                ? 'bg-surface text-text-muted cursor-not-allowed border border-border' 
                : 'bg-gold text-bg hover:bg-gold-light'}
            `}
          >
            {selectedSize ? 'Add to Cart' : 'Select a Size'}
          </button>

          {/* The Story */}
          <div className="border-t border-border pt-12 mb-12">
            <h3 className="font-body text-[10px] uppercase tracking-[0.3em] text-text-muted mb-6">The Story Behind This Design</h3>
            <p className="font-display italic text-xl md:text-2xl text-gold-light leading-relaxed mb-8">
              {product.story}
            </p>
            <div className="font-body text-sm text-text-secondary leading-relaxed space-y-4 whitespace-pre-wrap">
              {product.description}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};
