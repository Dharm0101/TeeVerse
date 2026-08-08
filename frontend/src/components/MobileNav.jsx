import React from 'react';
import { useStore } from '../context/StoreContext';
import { X, ShieldAlert, ChevronRight } from 'lucide-react';

export const MobileNav = () => {
  const { isMobileNavOpen, setIsMobileNavOpen, navigateTo, setActiveCategory, isAdminLoggedIn } = useStore();

  if (!isMobileNavOpen) return null;

  const handleNav = (page, category = null) => {
    if (category) {
      setActiveCategory(category);
    }
    navigateTo(page);
    setIsMobileNavOpen(false);
  };

  return (
    <>
      <div className="drawer-overlay" onClick={() => setIsMobileNavOpen(false)} />
      <div className="drawer mobile-nav-drawer" style={{ left: 0, right: 'auto', transform: 'none', width: '85vw', maxWidth: '320px' }}>
        <div className="drawer__header" style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.3rem', fontWeight: 900, letterSpacing: '0.15em', fontFamily: 'var(--font-display)', background: 'linear-gradient(135deg, #FFF 0%, #CDFF00 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              TEEVERSE
            </span>
          </div>
          <button className="drawer__close" onClick={() => setIsMobileNavOpen(false)} aria-label="Close menu">
            <X size={22} />
          </button>
        </div>

        <div className="drawer__body" style={{ padding: '24px' }}>
          <ul className="flex flex-col gap-2" style={{ fontSize: '0.95rem', textTransform: 'uppercase', fontFamily: 'var(--font-heading)' }}>
            <li className="mobile-nav-item" onClick={() => handleNav('home')}>
              <span>Home</span> <ChevronRight size={16} opacity={0.5} />
            </li>
            <li className="mobile-nav-item" onClick={() => handleNav('shop', 'all')}>
              <span>Shop All Collection</span> <ChevronRight size={16} opacity={0.5} />
            </li>
            <li className="mobile-nav-item" onClick={() => handleNav('shop', 'graphic')}>
              <span>Graphic Tees</span> <ChevronRight size={16} opacity={0.5} />
            </li>
            <li className="mobile-nav-item" onClick={() => handleNav('shop', 'oversized')}>
              <span>Oversized Fits 🔥</span> <ChevronRight size={16} opacity={0.5} />
            </li>
            <li className="mobile-nav-item" onClick={() => handleNav('shop', 'plain')}>
              <span>Plain & Heavyweight</span> <ChevronRight size={16} opacity={0.5} />
            </li>
            <li className="mobile-nav-item" onClick={() => handleNav('shop', 'anime')}>
              <span>Anime Tees</span> <ChevronRight size={16} opacity={0.5} />
            </li>
            <li className="mobile-nav-item" onClick={() => handleNav('shop', 'typography')}>
              <span>Typography</span> <ChevronRight size={16} opacity={0.5} />
            </li>
            <li className="mobile-nav-item" onClick={() => handleNav('about')}>
              <span>About Us</span> <ChevronRight size={16} opacity={0.5} />
            </li>
            <li className="mobile-nav-item" onClick={() => handleNav('contact')}>
              <span>Contact & Support</span> <ChevronRight size={16} opacity={0.5} />
            </li>
            
            {isAdminLoggedIn && (
              <li
                className="mobile-nav-item"
                onClick={() => handleNav('admin')}
                style={{ color: 'var(--accent-primary)', marginTop: '12px', border: '1px solid rgba(205, 255, 0, 0.3)', borderRadius: '8px', padding: '12px 14px' }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldAlert size={18} /> Owner Admin Panel
                </span>
                <ChevronRight size={16} />
              </li>
            )}
          </ul>
        </div>
      </div>
    </>
  );
};
