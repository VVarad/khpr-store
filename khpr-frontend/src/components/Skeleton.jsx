import React from 'react';

export const Skeleton = ({ className = "" }) => {
  return (
    <div className={`bg-[#1A1A1A] animate-pulse rounded ${className}`}></div>
  );
};
