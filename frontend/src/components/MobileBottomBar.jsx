import React from 'react';
import { useStore } from '../context/StoreContext';
import { Home, ShoppingBag, Heart, Search, Grid } from 'lucide-react';

export const MobileBottomBar = () => {
  const {
    currentPage,
    navigateTo,
    cartItems,
    wishlist,
    setIsCartOpen,
    setIsWishlistOpen,
    setIsSearchOpen,
    setActiveCategory,
    isAdminLoggedIn,
  } = useStore();

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Hide only on admin portal dashboard pages
  if (currentPage === 'admin' || currentPage === 'admin-login') {
    return null;
  }

  return (
    <div className="mobile-bottom-bar">
      <button
        className={`mobile-bottom-bar-item ${currentPage === 'home' ? 'active' : ''}`}
        onClick={() => navigateTo('home')}
        aria-label="Home"
      >
        <Home size={20} />
        <span>Home</span>
      </button>

      <button
        className={`mobile-bottom-bar-item ${currentPage === 'shop' ? 'active' : ''}`}
        onClick={() => {
          setActiveCategory('all');
          navigateTo('shop');
        }}
        aria-label="Shop"
      >
        <Grid size={20} />
        <span>Shop</span>
      </button>

      <button
        className="mobile-bottom-bar-item"
        onClick={() => setIsSearchOpen(true)}
        aria-label="Search"
      >
        <Search size={20} />
        <span>Search</span>
      </button>

      <button
        className="mobile-bottom-bar-item"
        onClick={() => setIsWishlistOpen(true)}
        aria-label="Wishlist"
      >
        <div style={{ position: 'relative', display: 'inline-flex' }}>
          <Heart size={20} />
          {wishlist.length > 0 && (
            <span className="mobile-bottom-badge">{wishlist.length}</span>
          )}
        </div>
        <span>Wishlist</span>
      </button>

      <button
        className="mobile-bottom-bar-item cart-highlight"
        onClick={() => setIsCartOpen(true)}
        aria-label="Shopping Cart"
      >
        <div style={{ position: 'relative', display: 'inline-flex' }}>
          <ShoppingBag size={22} color="var(--accent-primary)" />
          {totalCartCount > 0 && (
            <span className="mobile-bottom-badge cart-badge-pulse">{totalCartCount}</span>
          )}
        </div>
        <span style={{ color: 'var(--accent-primary)', fontWeight: 800 }}>Cart</span>
      </button>
    </div>
  );
};
