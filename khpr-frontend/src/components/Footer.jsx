import React from 'react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-surface border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
          
          {/* Column 1: Brand */}
          <div className="flex flex-col items-center md:items-start">
            <h2 className="font-display font-bold text-2xl text-gold mb-4">KHPR</h2>
            <p className="font-body text-sm text-text-secondary leading-relaxed max-w-xs">
              Every stitch carries a story that Kolhapur has been telling for centuries. Heritage streetwear for the modern era.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="flex flex-col items-center md:items-start space-y-4">
            <h3 className="font-body text-xs uppercase tracking-[0.2em] text-text-muted mb-2">Explore</h3>
            <Link to="/shop" className="font-body text-sm text-text-secondary hover:text-gold transition">The Collection</Link>
            <Link to="/story" className="font-body text-sm text-text-secondary hover:text-gold transition">Our Story</Link>
            <Link to="/login" className="font-body text-sm text-text-secondary hover:text-gold transition">Account</Link>
          </div>

          {/* Column 3: Made in Kolhapur */}
          <div className="flex flex-col items-center md:items-start md:items-end">
            <h3 className="font-body text-xs uppercase tracking-[0.2em] text-text-muted mb-4">Connect</h3>
            <a href="https://instagram.com/khpr_co" target="_blank" rel="noreferrer" className="flex items-center space-x-2 text-text-secondary hover:text-gold transition">
              <span className="font-display italic text-lg mr-1">IG</span>
              <span className="font-body text-sm tracking-wide">@khpr_co</span>
            </a>
            <p className="mt-8 font-display italic text-lg text-gold-light opacity-80">Made in Kolhapur</p>
          </div>

        </div>
      </div>
      
      {/* Bottom Bar */}
      <div className="border-t border-border py-6 text-center">
        <p className="font-body text-xs text-text-muted uppercase tracking-widest">
          &copy; {new Date().getFullYear()} KHPR. Rooted in Kolhapur.
        </p>
      </div>
    </footer>
  );
};
