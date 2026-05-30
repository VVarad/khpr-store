import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import api from '../api/axios';
import { ProductCard } from '../components/ProductCard';
import { Skeleton } from '../components/Skeleton';
import { ErrorState } from '../components/ErrorState';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export const ShopPage = () => {
  useDocumentTitle('The Collection');
  const { data: products, isLoading, isError, refetch } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data } = await api.get('/api/products/');
      return data;
    },
  });

  return (
    <div className="pt-32 pb-24 px-6 lg:px-12 max-w-7xl mx-auto min-h-screen">
      <div className="text-center mb-16">
        <h1 className="font-display text-5xl md:text-6xl text-gold mb-4">The Collection</h1>
        <p className="font-display italic text-xl text-text-secondary">
          Each design tells a story Kolhapur has held for centuries.
        </p>
      </div>

      {isError && (
        <ErrorState message="Failed to load the collection." onRetry={refetch} />
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {[1, 2, 3, 4, 5, 6].map(n => (
            <div key={n} className="flex flex-col">
              <Skeleton className="aspect-[4/5] mb-4 w-full" />
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/4" />
            </div>
          ))}
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12"
        >
          {products?.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </motion.div>
      )}
    </div>
  );
};
