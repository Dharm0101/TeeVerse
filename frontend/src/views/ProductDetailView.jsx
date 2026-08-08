import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { reviews, pincodeData } from '../data/mockData';
import { ProductCard } from '../components/ProductCard';
import { Star, Truck, ShieldCheck, Heart, Ruler, CheckCircle2 } from 'lucide-react';

export const ProductDetailView = () => {
  const {
    selectedProductId,
    productsList,
    addToCart,
    toggleWishlist,
    isInWishlist,
    setIsSizeGuideOpen,
    navigateTo,
    showToast,
  } = useStore();

  const product = productsList.find((p) => p.id === selectedProductId) || productsList[0];

  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || 'M');
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name || '');
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const [pincodeInput, setPincodeInput] = useState('');
  const [pincodeStatus, setPincodeStatus] = useState(null);

  const isWish = isInWishlist(product.id);

  const handlePincodeCheck = (e) => {
    e.preventDefault();
    if (!pincodeInput || pincodeInput.length < 3) {
      showToast('Enter valid 6-digit Pincode', 'error');
      return;
    }
    const prefix = pincodeInput.substring(0, 3);
    const found = pincodeData[prefix];
    if (found) {
      const date = new Date();
      date.setDate(date.getDate() + found.deliveryDays);
      const formattedDate = date.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' });
      setPincodeStatus({
        city: found.city,
        state: found.state,
        date: formattedDate,
        cod: found.codAvailable,
      });
    } else {
      setPincodeStatus({
        city: 'Standard Location',
        state: 'India',
        date: '5-7 Business Days',
        cod: true,
      });
    }
  };

  const productReviews = reviews.filter((r) => r.productId === product.id);

  return (
    <div className="section-padding animate-fadeIn" style={{ paddingTop: '100px' }}>
      <div className="container">
        {/* Breadcrumb */}
        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>
          <span style={{ cursor: 'pointer' }} onClick={() => navigateTo('home')}>Home</span> /{' '}
          <span style={{ cursor: 'pointer' }} onClick={() => navigateTo('shop')}>Shop</span> /{' '}
          <span style={{ color: 'var(--text-primary)' }}>{product.name}</span>
        </div>

        <div className="product-detail-grid mb-6">
          {/* Multi-Image Interactive Gallery Area */}
          <div>
            {/* Main Image Display */}
            <div
              className="hover-shine mb-4"
              style={{
                aspectRatio: '3/4',
                background: 'var(--bg-card)',
                borderRadius: '16px',
                border: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {(() => {
                // Keep only valid URLs or existing Base64 strings, discarding placeholder text labels
                const realImages = (product.images || []).filter((img) => typeof img === 'string' && (img.startsWith('http') || img.startsWith('data:image')));
                const imagesToShow = realImages.length > 0 ? realImages : ['Front View', 'Back Print'];
                const currentImg = imagesToShow[activeImageIndex] || imagesToShow[0] || 'Front View';
                const isUrl = typeof currentImg === 'string' && (currentImg.startsWith('http') || currentImg.startsWith('data:image'));
                
                if (isUrl) {
                  return (
                    <img
                      src={currentImg}
                      alt={`${product.name} view ${activeImageIndex + 1}`}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  );
                }

                return (
                  <div className="product-image-placeholder card-img-placeholder" style={{ '--placeholder-accent': product.colors[0]?.hex || '#333' }}>
                    <span className="product-image-placeholder__initial">{product.name.charAt(0)}</span>
                    <span className="product-image-placeholder__name">{product.name}</span>
                    <span style={{ fontSize: '0.75rem', marginTop: '4px', opacity: 0.8, background: 'rgba(0,0,0,0.5)', padding: '2px 8px', borderRadius: '4px' }}>
                      {typeof currentImg === 'string' && currentImg !== 'placeholder' ? currentImg : `ANGLE ${activeImageIndex + 1}`}
                    </span>
                  </div>
                );
              })()}

              {(() => {
                const realImages = (product.images || []).filter((img) => typeof img === 'string' && (img.startsWith('http') || img.startsWith('data:image')));
                const imagesToShow = realImages.length > 0 ? realImages : ['Front View', 'Back Print'];
                if (imagesToShow.length <= 1) return null;
                return (
                  <span
                    style={{
                      position: 'absolute',
                      bottom: '12px',
                      right: '12px',
                      background: 'rgba(13, 13, 13, 0.8)',
                      color: 'var(--accent-primary)',
                      fontSize: '0.75rem',
                      padding: '4px 10px',
                      borderRadius: '20px',
                      border: '1px solid var(--border)',
                      fontWeight: 'bold',
                    }}
                  >
                    {activeImageIndex + 1} / {imagesToShow.length}
                  </span>
                );
              })()}
            </div>

            {/* Multi-Image Thumbnail Selector Strip */}
            {(() => {
              const realImages = (product.images || []).filter((img) => typeof img === 'string' && (img.startsWith('http') || img.startsWith('data:image')));
              const imagesToShow = realImages.length > 0 ? realImages : ['Front View', 'Back Print'];
              if (imagesToShow.length <= 1) return null;
              return (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {imagesToShow.map((img, idx) => {
                    const isSelected = activeImageIndex === idx;
                    const isUrl = typeof img === 'string' && (img.startsWith('http') || img.startsWith('data:image'));

                    return (
                      <div
                        key={idx}
                        onClick={() => setActiveImageIndex(idx)}
                        style={{
                          width: '72px',
                          height: '90px',
                          borderRadius: '8px',
                          border: isSelected ? '2px solid var(--accent-primary)' : '1px solid var(--border)',
                          background: 'var(--bg-card)',
                          cursor: 'pointer',
                          overflow: 'hidden',
                          flexShrink: 0,
                          position: 'relative',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.2s ease',
                          opacity: isSelected ? 1 : 0.6,
                        }}
                      >
                        {isUrl ? (
                          <img src={img} alt="thumb" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <div style={{ textAlign: 'center', padding: '4px', fontSize: '0.65rem' }}>
                            <div style={{ fontWeight: 'bold', color: 'var(--accent-primary)' }}>{product.name.charAt(0)}</div>
                            <div className="text-muted" style={{ fontSize: '0.6rem', marginTop: '2px' }}>
                              {typeof img === 'string' && img !== 'placeholder' ? img : `View ${idx + 1}`}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </div>

          {/* Details & Purchase Actions */}
          <div>
            <span className="category-pill" style={{ fontSize: '0.75rem', display: 'inline-block', marginBottom: '12px' }}>{product.category.toUpperCase()}</span>
            <h1 style={{ fontSize: '2.2rem', marginBottom: '12px' }}>{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <span className="flex text-warning">
                <Star size={16} fill="var(--warning)" color="var(--warning)" />
                <strong style={{ marginLeft: '4px' }}>{product.rating}</strong>
              </span>
              <span className="text-muted">({product.reviewCount} customer reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3 mb-6">
              <span style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--accent-primary)', fontFamily: 'var(--font-heading)' }}>
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.mrp && product.mrp > product.price && (
                <>
                  <span style={{ textDecoration: 'line-through', color: 'var(--text-secondary)', fontSize: '1.2rem', fontFamily: 'var(--font-heading)' }}>
                    ₹{product.mrp.toLocaleString('en-IN')}
                  </span>
                  <span className="category-pill" style={{ background: 'rgba(205,255,0,0.15)', color: 'var(--accent-primary)', border: '1px solid var(--accent-primary)', fontWeight: 'bold', fontSize: '0.8rem', padding: '4px 10px' }}>
                    {product.discount}% OFF
                  </span>
                </>
              )}
            </div>

            {/* Color Swatches */}
            <div style={{ marginBottom: '20px' }}>
              <div className="flex justify-between items-center mb-2">
                <span style={{ fontSize: '0.85rem', fontWeight: 'bold', textTransform: 'uppercase' }}>
                  COLOR: <span style={{ color: 'var(--accent-primary)' }}>{selectedColor}</span>
                </span>
              </div>
              <div className="flex gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: c.hex,
                      border: selectedColor === c.name ? '3px solid var(--accent-primary)' : '1px solid var(--border)',
                      cursor: 'pointer',
                    }}
                    title={c.name}
                    onClick={() => setSelectedColor(c.name)}
                  />
                ))}
              </div>
            </div>

            {/* Size Selector */}
            <div style={{ marginBottom: '24px' }}>
              <div className="flex justify-between items-center mb-2">
                <span style={{ fontSize: '0.85rem', fontWeight: 'bold', textTransform: 'uppercase' }}>
                  SELECT SIZE: <span style={{ color: 'var(--accent-primary)' }}>{selectedSize}</span>
                </span>
                <button
                  style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                  onClick={() => setIsSizeGuideOpen(true)}
                >
                  <Ruler size={14} /> Size Guide
                </button>
              </div>

              <div className="flex gap-2 flex-wrap">
                {product.sizes.map((sz) => (
                  <button
                    key={sz}
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '6px',
                      border: selectedSize === sz ? '2px solid var(--accent-primary)' : '1px solid var(--border)',
                      background: selectedSize === sz ? 'rgba(205, 255, 0, 0.1)' : 'transparent',
                      color: selectedSize === sz ? 'var(--accent-primary)' : 'var(--text-primary)',
                      fontWeight: 'bold',
                      fontSize: '0.95rem',
                      cursor: 'pointer',
                    }}
                    onClick={() => setSelectedSize(sz)}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mb-6">
              <button
                className="btn btn-primary btn-lg"
                style={{ flex: 1 }}
                onClick={() => addToCart(product.id, selectedSize, selectedColor, quantity)}
              >
                ADD TO CART
              </button>

              <button
                className="btn btn-secondary btn-lg"
                onClick={() => toggleWishlist(product.id)}
                title="Wishlist"
              >
                <Heart size={20} fill={isWish ? 'var(--accent-secondary)' : 'none'} color={isWish ? 'var(--accent-secondary)' : 'currentColor'} />
              </button>
            </div>

            {/* Pincode Estimator */}
            <div style={{ background: 'var(--bg-card)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '8px' }}>
                DELIVERY ESTIMATOR
              </div>
              <form onSubmit={handlePincodeCheck} className="flex gap-2 mb-2">
                <input
                  type="text"
                  className="form-input"
                  placeholder="Enter 6-digit Indian Pincode"
                  style={{ padding: '8px 12px', fontSize: '0.85rem' }}
                  maxLength={6}
                  value={pincodeInput}
                  onChange={(e) => setPincodeInput(e.target.value)}
                />
                <button type="submit" className="btn btn-secondary btn-sm">
                  CHECK
                </button>
              </form>

              {pincodeStatus && (
                <div style={{ fontSize: '0.8rem', color: 'var(--success)', marginTop: '8px' }}>
                  <CheckCircle2 size={14} style={{ display: 'inline', marginRight: '4px' }} />
                  Estimated Delivery by <strong>{pincodeStatus.date}</strong> to {pincodeStatus.city}.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Product Spec Accordion */}
        <div style={{ background: 'var(--bg-card)', padding: '32px', borderRadius: '16px', border: '1px solid var(--border)', marginBottom: '64px' }}>
          <h3 style={{ marginBottom: '16px', fontSize: '1.4rem' }}>PRODUCT SPECIFICATIONS & FABRIC</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px', fontSize: '0.9rem' }}>
            <div>
              <strong style={{ color: 'var(--accent-primary)' }}>Fabric:</strong> {product.fabric}
            </div>
            <div>
              <strong style={{ color: 'var(--accent-primary)' }}>Fit Type:</strong> {product.fit}
            </div>
            <div>
              <strong style={{ color: 'var(--accent-primary)' }}>Wash Care:</strong> {product.washCare}
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div style={{ marginBottom: '64px' }}>
          <h3 style={{ fontSize: '1.8rem', marginBottom: '24px' }}>CUSTOMER REVIEWS ({productReviews.length})</h3>
          {productReviews.length > 0 ? (
            <div className="flex flex-col gap-4">
              {productReviews.map((rev) => (
                <div key={rev.id} style={{ background: 'var(--bg-card)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                  <div className="flex justify-between items-center mb-2">
                    <strong style={{ fontSize: '0.95rem' }}>{rev.userName}</strong>
                    <span className="text-muted" style={{ fontSize: '0.75rem' }}>{rev.date}</span>
                  </div>
                  <div className="flex text-warning mb-2" style={{ color: 'var(--warning)' }}>
                    {'★'.repeat(rev.rating)}
                  </div>
                  <h4 style={{ fontSize: '0.9rem', marginBottom: '4px' }}>{rev.title}</h4>
                  <p className="text-muted" style={{ fontSize: '0.85rem' }}>{rev.text}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted" style={{ fontSize: '0.9rem' }}>Be the first to review this t-shirt after delivery!</p>
          )}
        </div>
      </div>
    </div>
  );
};
