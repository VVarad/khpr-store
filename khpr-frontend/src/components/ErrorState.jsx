import React from 'react';

export const ErrorState = ({ message = "Something went wrong.", onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <p className="font-body text-text-secondary mb-6">{message}</p>
      {onRetry && (
        <button 
          onClick={onRetry}
          className="border border-border text-text-secondary font-body text-xs uppercase tracking-widest px-6 py-3 hover:text-gold hover:border-gold transition-colors min-h-[44px]"
        >
          Try Again
        </button>
      )}
    </div>
  );
};
