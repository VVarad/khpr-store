import React from 'react';
import { Link } from 'react-router-dom';

export const NotFoundPage = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="font-display text-9xl text-gold mb-6">404</h1>
      <p className="font-display italic text-2xl text-text-secondary mb-12">
        This page doesn't exist.
      </p>
      <Link 
        to="/" 
        className="border border-gold text-gold font-body text-xs uppercase tracking-[0.2em] px-8 py-4 hover:bg-gold hover:text-bg transition-colors"
      >
        Return to Kolhapur
      </Link>
    </div>
  );
};
