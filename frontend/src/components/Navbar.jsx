import React from 'react';
import { useStore } from '../context/StoreContext';
import { ShoppingBag, Heart, User, Search, Menu, ShieldAlert } from 'lucide-react';

export const Navbar = () => {
  const {
    currentPage,
    navigateTo,
    cartItems,
    wishlist,
    setIsCartOpen,
    setIsWishlistOpen,
    setIsAuthModalOpen,
    setIsSearchOpen,
    setIsMobileNavOpen,
    customerUser,
    isAdminLoggedIn,
    setActiveCategory,
  } = useStore();

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="navbar">
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* Mobile Hamburger */}
        <button
          className="nav-icon"
          onClick={() => setIsMobileNavOpen(true)}
          style={{ display: 'none' }}
          id="mobile-hamburger"
        >
          <Menu size={22} />
        </button>

        {/* Logo */}
        <div
          className="navbar__logo"
          onClick={() => navigateTo('home')}
          style={{ cursor: 'pointer' }}
        >
          <span className="glitch" data-text="TEEVERSE">
            TEEVERSE
          </span>
        </div>

        {/* Desktop Navigation */}
        <ul className="navbar__links">
          <li>
            <span
              className={`nav-link ${currentPage === 'home' ? 'active' : ''}`}
              onClick={() => navigateTo('home')}
            >
              Home
            </span>
          </li>
          <li>
            <span
              className={`nav-link ${currentPage === 'shop' ? 'active' : ''}`}
              onClick={() => {
                setActiveCategory('all');
                navigateTo('shop');
              }}
            >
              Shop
            </span>
          </li>
          <li>
            <span
              className="nav-link"
              onClick={() => {
                setActiveCategory('graphic');
                navigateTo('shop');
              }}
            >
              Graphic Tees
            </span>
          </li>
          <li>
            <span
              className="nav-link"
              onClick={() => {
                setActiveCategory('oversized');
                navigateTo('shop');
              }}
            >
              Oversized
            </span>
          </li>
          <li>
            <span
              className={`nav-link ${currentPage === 'about' ? 'active' : ''}`}
              onClick={() => navigateTo('about')}
            >
              About Us
            </span>
          </li>
          <li>
            <span
              className={`nav-link ${currentPage === 'contact' ? 'active' : ''}`}
              onClick={() => navigateTo('contact')}
            >
              Contact Us
            </span>
          </li>
          {isAdminLoggedIn && (
            <li>
              <span
                className="nav-link"
                style={{ color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '4px' }}
                onClick={() => navigateTo('admin')}
              >
                <ShieldAlert size={16} /> Admin Panel
              </span>
            </li>
          )}
        </ul>

        {/* Action Icons */}
        <div className="flex items-center gap-3">
          <button className="nav-icon" onClick={() => setIsSearchOpen(true)} aria-label="Search">
            <Search size={20} />
          </button>
          <button className="nav-icon" onClick={() => setIsWishlistOpen(true)} aria-label="Wishlist">
            <Heart size={20} />
            {wishlist.length > 0 && (
              <span className="nav-icon__badge">{wishlist.length}</span>
            )}
          </button>
          {!isAdminLoggedIn && currentPage !== 'admin' && currentPage !== 'admin-login' && (
            <button className="nav-icon" onClick={() => setIsCartOpen(true)} aria-label="Cart">
              <ShoppingBag size={20} />
              {totalCartCount > 0 && (
                <span className="nav-icon__badge">{totalCartCount}</span>
              )}
            </button>
          )}
          <button
            className="nav-icon"
            onClick={() => {
              if (customerUser) {
                navigateTo('profile');
              } else {
                setIsAuthModalOpen(true);
              }
            }}
            aria-label="Account"
          >
            <User size={20} />
          </button>
        </div>
      </div>
    </nav>
  );
};
