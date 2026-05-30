import { Link } from 'react-router-dom';
import { resolveImageUrl } from '../utils/imageUrl';

export const ProductCard = ({ product }) => {
  return (
    <Link to={`/product/${product.slug}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden bg-surface mb-4 border border-border">
        {product.front_image ? (
          <img 
            src={resolveImageUrl(product.front_image)} 
            alt={product.name} 
            loading="lazy"
            className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-text-muted">Image Coming Soon</div>
        )}
      </div>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-display text-xl text-text-primary group-hover:text-gold transition-colors">{product.name}</h3>
          <p className="font-body text-[10px] text-text-secondary mt-1 uppercase tracking-widest">{product.category}</p>
        </div>
        <p className="font-body text-sm font-medium text-gold-light tracking-wide">₹{product.price}</p>
      </div>
    </Link>
  );
};
