import React from 'react';
import { useStore } from '../context/StoreContext';
import { X, Heart, Trash2, ShoppingBag } from 'lucide-react';

export const WishlistDrawer = () => {
  const { isWishlistOpen, setIsWishlistOpen, wishlist, toggleWishlist, productsList, navigateTo } = useStore();

  if (!isWishlistOpen) return null;

  const wishlistProducts = productsList.filter((p) => wishlist.includes(p.id));

  return (
    <>
      <div className="drawer-overlay" onClick={() => setIsWishlistOpen(false)} />
      <div className="drawer animate-scaleIn">
        <div className="drawer__header">
          <div className="flex items-center gap-2">
            <Heart size={20} color="var(--accent-secondary)" fill="var(--accent-secondary)" />
            <h3 className="drawer__title">Wishlist ({wishlistProducts.length})</h3>
          </div>
          <button className="drawer__close" onClick={() => setIsWishlistOpen(false)}>
            <X size={22} />
          </button>
        </div>

        <div className="drawer__body">
          {wishlistProducts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <Heart size={64} style={{ opacity: 0.2, margin: '0 auto 16px' }} />
              <h3>Your wishlist is empty</h3>
              <p className="text-muted mt-2 mb-4" style={{ fontSize: '0.9rem' }}>
                Save items you love by tapping the heart icon.
              </p>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => {
                  setIsWishlistOpen(false);
                  navigateTo('shop');
                }}
              >
                EXPLORE TEES
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {wishlistProducts.map((product) => (
                <div
                  key={product.id}
                  style={{
                    display: 'flex',
                    gap: '12px',
                    paddingBottom: '16px',
                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                    alignItems: 'center',
                  }}
                >
                  <div
                    style={{
                      width: '60px',
                      height: '75px',
                      borderRadius: '6px',
                      background: 'var(--bg-card)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      color: 'var(--text-secondary)',
                      flexShrink: 0,
                    }}
                  >
                    {product.name.charAt(0)}
                  </div>

                  <div className="flex flex-col flex-1">
                    <h4 style={{ fontSize: '0.85rem', fontWeight: '600' }}>{product.name}</h4>
                    <div style={{ fontWeight: 'bold', color: 'var(--accent-primary)', fontSize: '0.9rem' }}>
                      ₹{product.price.toLocaleString('en-IN')}
                    </div>
                    <button
                      className="btn btn-ghost btn-sm"
                      style={{ padding: '4px 0', justifyContent: 'flex-start', color: 'var(--accent-primary)', marginTop: '4px' }}
                      onClick={() => {
                        setIsWishlistOpen(false);
                        navigateTo('product', product.id);
                      }}
                    >
                      View Options →
                    </button>
                  </div>

                  <button
                    onClick={() => toggleWishlist(product.id)}
                    style={{ background: 'none', border: 'none', color: 'var(--accent-secondary)', cursor: 'pointer' }}
                    title="Remove"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
