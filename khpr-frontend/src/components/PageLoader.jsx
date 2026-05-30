import React from 'react';
import { motion } from 'framer-motion';

export const PageLoader = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg">
      <motion.div
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <h1 className="font-display font-bold text-4xl text-gold tracking-wide">KHPR</h1>
      </motion.div>
    </div>
  );
};
