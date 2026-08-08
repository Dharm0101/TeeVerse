import React from 'react';
import { useStore } from '../context/StoreContext';
import { X, ShieldAlert } from 'lucide-react';

export const MobileNav = () => {
  const { isMobileNavOpen, setIsMobileNavOpen, navigateTo, setActiveCategory, isAdminLoggedIn } = useStore();

  if (!isMobileNavOpen) return null;

  return (
    <>
      <div className="drawer-overlay" onClick={() => setIsMobileNavOpen(false)} />
      <div className="drawer" style={{ left: 0, right: 'auto', transform: 'none', maxWidth: '300px' }}>
        <div className="drawer__header">
          <h3 className="navbar__logo">TEEVERSE</h3>
          <button className="drawer__close" onClick={() => setIsMobileNavOpen(false)}>
            <X size={22} />
          </button>
        </div>

        <div className="drawer__body">
          <ul className="flex flex-col gap-4" style={{ fontSize: '1rem', textTransform: 'uppercase', fontFamily: 'var(--font-heading)' }}>
            <li onClick={() => navigateTo('home')}>Home</li>
            <li onClick={() => { setActiveCategory('all'); navigateTo('shop'); }}>Shop All</li>
            <li onClick={() => { setActiveCategory('graphic'); navigateTo('shop'); }}>Graphic Tees</li>
            <li onClick={() => { setActiveCategory('oversized'); navigateTo('shop'); }}>Oversized Tees</li>
            <li onClick={() => { setActiveCategory('plain'); navigateTo('shop'); }}>Plain Tees</li>
            <li onClick={() => { setActiveCategory('anime'); navigateTo('shop'); }}>Anime Collection</li>
            <li onClick={() => { setActiveCategory('typography'); navigateTo('shop'); }}>Typography</li>
            <li onClick={() => navigateTo('about')}>About Us</li>
            <li onClick={() => navigateTo('contact')}>Contact Us</li>
            
            {isAdminLoggedIn && (
              <li onClick={() => navigateTo('admin')} style={{ color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShieldAlert size={18} /> Owner Admin Panel
              </li>
            )}
          </ul>
        </div>
      </div>
    </>
  );
};
