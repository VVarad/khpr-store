import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export const RegisterPage = () => {
  useDocumentTitle('Register');
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    password: '',
    confirm_password: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirm_password) {
      return toast.error('Passwords do not match');
    }
    
    setIsSubmitting(true);
    try {
      await register(formData);
      toast.success('Account created successfully');
      navigate(from, { replace: true });
    } catch (error) {
      toast.error('Failed to create account. Email may already be in use.');
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-24">
      <div className="w-full max-w-[420px] bg-surface p-10 border border-border">
        <div className="text-center mb-10">
          <Link to="/">
            <h1 className="font-display font-bold text-4xl text-gold tracking-wide mb-2">KHPR</h1>
          </Link>
          <p className="font-body text-xs text-text-muted uppercase tracking-widest">Create an account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input 
              name="first_name" type="text" required placeholder="First Name" 
              value={formData.first_name} onChange={handleChange}
              className="w-full bg-bg border border-border p-4 font-body text-sm text-text-primary focus:outline-none focus:border-gold transition-colors"
            />
            <input 
              name="last_name" type="text" required placeholder="Last Name" 
              value={formData.last_name} onChange={handleChange}
              className="w-full bg-bg border border-border p-4 font-body text-sm text-text-primary focus:outline-none focus:border-gold transition-colors"
            />
          </div>
          <input 
            name="email" type="email" required placeholder="Email Address" 
            value={formData.email} onChange={handleChange}
            className="w-full bg-bg border border-border p-4 font-body text-sm text-text-primary focus:outline-none focus:border-gold transition-colors"
          />
          <input 
            name="phone" type="text" required placeholder="Phone Number" 
            value={formData.phone} onChange={handleChange}
            className="w-full bg-bg border border-border p-4 font-body text-sm text-text-primary focus:outline-none focus:border-gold transition-colors"
          />
          <input 
            name="password" type="password" required placeholder="Password" 
            value={formData.password} onChange={handleChange}
            className="w-full bg-bg border border-border p-4 font-body text-sm text-text-primary focus:outline-none focus:border-gold transition-colors"
          />
          <input 
            name="confirm_password" type="password" required placeholder="Confirm Password" 
            value={formData.confirm_password} onChange={handleChange}
            className="w-full bg-bg border border-border p-4 font-body text-sm text-text-primary focus:outline-none focus:border-gold transition-colors"
          />
          
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-gold text-bg py-4 mt-4 font-body text-xs uppercase tracking-widest hover:bg-gold-light transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Creating...' : 'Create Account'}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-border pt-6">
          <p className="font-body text-sm text-text-secondary">
            Already have an account? <Link to="/login" className="text-gold hover:text-gold-light transition-colors">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
