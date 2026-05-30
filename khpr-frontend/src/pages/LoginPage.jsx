import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export const LoginPage = () => {
  useDocumentTitle('Login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await login(email, password);
      toast.success('Welcome back.');
      navigate(from, { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Invalid email or password');
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-[420px] bg-surface p-10 border border-border">
        <div className="text-center mb-10">
          <Link to="/">
            <h1 className="font-display font-bold text-4xl text-gold tracking-wide mb-2">KHPR</h1>
          </Link>
          <p className="font-body text-xs text-text-muted uppercase tracking-widest">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input 
              type="email" 
              required
              placeholder="Email Address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-bg border border-border p-4 font-body text-sm text-text-primary focus:outline-none focus:border-gold transition-colors"
            />
          </div>
          <div>
            <input 
              type="password" 
              required
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-bg border border-border p-4 font-body text-sm text-text-primary focus:outline-none focus:border-gold transition-colors"
            />
          </div>
          
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-gold text-bg py-4 font-body text-xs uppercase tracking-widest hover:bg-gold-light transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-border pt-6">
          <p className="font-body text-sm text-text-secondary">
            Don't have an account? <Link to="/register" className="text-gold hover:text-gold-light transition-colors">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
