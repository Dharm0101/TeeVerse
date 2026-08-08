import React from 'react';
import { useStore } from '../context/StoreContext';
import { Heart, Star } from 'lucide-react';

export const ProductCard = ({ product }) => {
  const { navigateTo, toggleWishlist, isInWishlist } = useStore();
  const isWish = isInWishlist(product.id);
  const initialLetter = product.name.charAt(0).toUpperCase();

  return (
    <div className="product-card animate-fadeInUp" onClick={() => navigateTo('product', product.id)}>
      <div className="product-card__image hover-shine">
        {(() => {
          const mainImg = product.images?.find((img) => typeof img === 'string' && (img.startsWith('http') || img.startsWith('data:image'))) || 'placeholder';
          const isUrl = mainImg.startsWith('http') || mainImg.startsWith('data:image');
          if (isUrl) {
            return (
              <img
                src={mainImg}
                alt={product.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            );
          }
          return (
            <div className="product-image-placeholder card-img-placeholder" style={{ '--placeholder-accent': product.colors[0]?.hex || '#333' }}>
              <span className="product-image-placeholder__initial">{initialLetter}</span>
              <span className="product-image-placeholder__name">{product.name}</span>
            </div>
          );
        })()}

        {product.isNew && (
          <span className="product-card__badge new-badge" style={{ top: '12px' }}>
            NEW
          </span>
        )}

        {product.discount > 0 && (
          <span className="product-card__badge discount-badge" style={{ top: product.isNew ? '42px' : '12px', backgroundColor: 'var(--accent-primary)', color: '#000', fontWeight: 'bold' }}>
            -{product.discount}%
          </span>
        )}

        <button
          className={`product-card__wishlist ${isWish ? 'active' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          aria-label="Wishlist"
        >
          <Heart size={18} fill={isWish ? 'var(--accent-secondary)' : 'none'} color={isWish ? 'var(--accent-secondary)' : 'currentColor'} />
        </button>
      </div>

      <div className="product-card__info">
        <div className="flex gap-1 mb-2">
          {product.colors.map((c, idx) => (
            <span
              key={idx}
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: c.hex,
                border: '1px solid var(--border)',
                display: 'inline-block',
              }}
              title={c.name}
            />
          ))}
        </div>

        <h3 className="product-card__name">{product.name}</h3>

        <div className="flex items-center gap-1 mb-2" style={{ fontSize: '0.8rem' }}>
          <span className="flex items-center text-warning" style={{ color: 'var(--warning)' }}>
            <Star size={14} fill="var(--warning)" />
            <strong style={{ marginLeft: '4px', color: 'var(--text-primary)' }}>{product.rating}</strong>
          </span>
          <span className="text-muted">({product.reviewCount})</span>
        </div>

        <div className="product-card__price">
          <span className="price-current">₹{product.price.toLocaleString('en-IN')}</span>
          {product.mrp && product.mrp > product.price && (
            <>
              <span className="price-mrp">₹{product.mrp.toLocaleString('en-IN')}</span>
              <span className="price-discount">{product.discount}% OFF</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
