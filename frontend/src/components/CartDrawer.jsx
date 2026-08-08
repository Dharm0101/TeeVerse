import React from 'react';
import { useStore } from '../context/StoreContext';
import { X, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';

export const CartDrawer = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cartItems,
    removeFromCart,
    updateCartQuantity,
    getCartTotals,
    navigateTo,
  } = useStore();

  const totals = getCartTotals();

  if (!isCartOpen) return null;

  return (
    <>
      <div className="drawer-overlay" onClick={() => setIsCartOpen(false)} />
      <div className="drawer animate-scaleIn">
        <div className="drawer__header">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} className="text-accent" />
            <h3 className="drawer__title">Your Cart ({totals.totalItems})</h3>
          </div>
          <button className="drawer__close" onClick={() => setIsCartOpen(false)}>
            <X size={22} />
          </button>
        </div>

        <div className="drawer__body">
          {cartItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <ShoppingBag size={64} style={{ opacity: 0.2, margin: '0 auto 16px' }} />
              <h3>Your cart is empty</h3>
              <p className="text-muted mt-2 mb-4" style={{ fontSize: '0.9rem' }}>
                Looks like you haven't added any streetwear tees yet.
              </p>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => {
                  setIsCartOpen(false);
                  navigateTo('shop');
                }}
              >
                START SHOPPING
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {cartItems.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    gap: '12px',
                    paddingBottom: '16px',
                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                    position: 'relative',
                  }}
                >
                  <div
                    style={{
                      width: '70px',
                      height: '90px',
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
                    {item.name.charAt(0)}
                  </div>

                  <div className="flex flex-col flex-1" style={{ gap: '4px' }}>
                    <h4 style={{ fontSize: '0.85rem', fontWeight: '600' }}>{item.name}</h4>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      Size: <strong>{item.size}</strong> · Color: <strong>{item.color}</strong>
                    </div>
                    <div style={{ fontWeight: 'bold', color: 'var(--accent-primary)', fontSize: '0.95rem' }}>
                      ₹{item.price.toLocaleString('en-IN')}
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                      <div
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          border: '1px solid var(--border)',
                          borderRadius: '4px',
                        }}
                      >
                        <button
                          style={{
                            width: '26px',
                            height: '26px',
                            background: 'none',
                            border: 'none',
                            color: 'var(--text-primary)',
                            cursor: 'pointer',
                          }}
                          onClick={() => updateCartQuantity(idx, item.quantity - 1)}
                        >
                          -
                        </button>
                        <span style={{ padding: '0 8px', fontSize: '0.85rem', fontWeight: '600' }}>
                          {item.quantity}
                        </span>
                        <button
                          style={{
                            width: '26px',
                            height: '26px',
                            background: 'none',
                            border: 'none',
                            color: 'var(--text-primary)',
                            cursor: 'pointer',
                          }}
                          onClick={() => updateCartQuantity(idx, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(idx)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--accent-secondary)',
                          cursor: 'pointer',
                          marginLeft: 'auto',
                        }}
                        title="Remove"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}


            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="drawer__footer">
            <div style={{ fontSize: '0.85rem', marginBottom: '12px' }}>
              <div className="flex justify-between mb-1">
                <span className="text-muted">Subtotal:</span>
                <span>₹{totals.subtotal.toLocaleString('en-IN')}</span>
              </div>
              {totals.discountAmount > 0 && (
                <div className="flex justify-between mb-1" style={{ color: 'var(--success)' }}>
                  <span>Discount:</span>
                  <span>-₹{totals.discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between mb-1 text-muted">
                <span>Taxes (CGST 2.5% + SGST 2.5%):</span>
                <span>+₹{totals.totalTax.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between mb-1">
                <span className="text-muted">Shipping:</span>
                <span>{totals.shipping === 0 ? <strong style={{ color: 'var(--success)' }}>FREE</strong> : `₹${totals.shipping}`}</span>
              </div>
              <div
                className="flex justify-between"
                style={{
                  fontSize: '1.15rem',
                  fontWeight: 'bold',
                  borderTop: '1px solid var(--border)',
                  paddingTop: '8px',
                  marginTop: '8px',
                }}
              >
                <span>Total:</span>
                <span className="text-accent">₹{totals.total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button
              className="btn btn-primary btn-block"
              onClick={() => {
                setIsCartOpen(false);
                navigateTo('checkout');
              }}
            >
              PROCEED TO CHECKOUT <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </>
  );
};
