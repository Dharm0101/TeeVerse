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
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', gap: '16px' }}>
        {/* Mobile Hamburger */}
        <button
          className="nav-icon mobile-hamburger"
          onClick={() => setIsMobileNavOpen(true)}
          id="mobile-hamburger"
          aria-label="Open Menu"
        >
          <Menu size={22} />
        </button>

        {/* Logo */}
        <div
          className="navbar__logo"
          onClick={() => navigateTo('home')}
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}
        >
          <span style={{ fontSize: '1.4rem', fontWeight: 900, letterSpacing: '0.15em', fontFamily: 'var(--font-display)', background: 'linear-gradient(135deg, #FFFFFF 0%, #CDFF00 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', whiteSpace: 'nowrap' }}>
            TEEVERSE
          </span>
          <span style={{ fontSize: '0.62rem', fontWeight: 700, padding: '2px 6px', borderRadius: '4px', background: 'rgba(205, 255, 0, 0.12)', color: 'var(--accent-primary)', border: '1px solid rgba(205, 255, 0, 0.3)', textTransform: 'uppercase', letterSpacing: '0.1em', whiteSpace: 'nowrap' }}>
            STREETWEAR
          </span>
        </div>

        {/* Desktop Navigation */}
        <ul className="navbar__links" style={{ display: 'flex', alignItems: 'center', gap: '22px', whiteSpace: 'nowrap', listStyle: 'none', margin: 0, padding: 0 }}>
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
                style={{ color: 'var(--accent-primary)', display: 'inline-flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap' }}
                onClick={() => navigateTo('admin')}
              >
                <ShieldAlert size={16} /> Admin Panel
              </span>
            </li>
          )}
        </ul>

        {/* Action Icons */}
        <div className="navbar-action-icons flex items-center gap-3" style={{ flexShrink: 0, whiteSpace: 'nowrap' }}>
          <button className="nav-icon" onClick={() => setIsSearchOpen(true)} aria-label="Search" title="Search tees">
            <Search size={20} />
          </button>

          {!customerUser ? (
            <button
              className="btn btn-primary btn-sm hover-shine navbar-login-btn"
              onClick={() => setIsAuthModalOpen(true)}
              aria-label="Login"
              title="Login"
            >
              <User size={16} />
              <span className="navbar-login-text">LOGIN</span>
            </button>
          ) : (
            <button
              className="nav-icon navbar-user-btn"
              onClick={() => navigateTo('profile')}
              aria-label="Profile"
              title={`Account: ${customerUser.name}`}
            >
              <User size={16} color="var(--accent-primary)" />
              <span className="navbar-login-text">
                {customerUser.name}
              </span>
            </button>
          )}

          <button className="nav-icon" onClick={() => setIsWishlistOpen(true)} aria-label="Wishlist" title="Wishlist">
            <Heart size={20} />
            {wishlist.length > 0 && (
              <span className="nav-icon__badge">{wishlist.length}</span>
            )}
          </button>

          <button className="nav-icon navbar-cart-btn" onClick={() => setIsCartOpen(true)} aria-label="Cart" title="Shopping Cart">
            <ShoppingBag size={20} />
            {totalCartCount > 0 && (
              <span className="nav-icon__badge">{totalCartCount}</span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};
