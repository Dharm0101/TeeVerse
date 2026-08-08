import React from 'react';
import { useStore } from '../context/StoreContext';
import {
  X,
  ShieldAlert,
  ChevronRight,
  Home,
  ShoppingBag,
  Sparkles,
  Flame,
  Shirt,
  Tv,
  Type,
  Info,
  Headphones,
  User,
  MessageCircle,
} from 'lucide-react';

export const MobileNav = () => {
  const {
    isMobileNavOpen,
    setIsMobileNavOpen,
    navigateTo,
    setActiveCategory,
    isAdminLoggedIn,
    customerUser,
    setIsAuthModalOpen,
  } = useStore();

  if (!isMobileNavOpen) return null;

  const handleNav = (page, category = null) => {
    if (category) {
      setActiveCategory(category);
    }
    navigateTo(page);
    setIsMobileNavOpen(false);
  };

  const navItems = [
    { label: 'Home', page: 'home', category: null, icon: Home, badge: null },
    { label: 'Shop All Collection', page: 'shop', category: 'all', icon: ShoppingBag, badge: 'HOT' },
    { label: 'Graphic Tees', page: 'shop', category: 'graphic', icon: Sparkles, badge: null },
    { label: 'Oversized Fits', page: 'shop', category: 'oversized', icon: Flame, badge: 'POPULAR' },
    { label: 'Plain & Heavyweight', page: 'shop', category: 'plain', icon: Shirt, badge: null },
    { label: 'Anime Collection', page: 'shop', category: 'anime', icon: Tv, badge: null },
    { label: 'Typography Drops', page: 'shop', category: 'typography', icon: Type, badge: null },
    { label: 'About Us', page: 'about', category: null, icon: Info, badge: null },
    { label: 'Contact & Support', page: 'contact', category: null, icon: Headphones, badge: null },
  ];

  return (
    <>
      <div className="drawer-overlay" onClick={() => setIsMobileNavOpen(false)} />
      <div className="drawer mobile-nav-drawer" style={{ left: 0, right: 'auto', width: '85vw', maxWidth: '340px' }}>
        {/* Header */}
        <div className="drawer__header" style={{ padding: '16px 18px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', boxSizing: 'border-box' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 1, minWidth: 0 }}>
            <span style={{ fontSize: '1.15rem', fontWeight: 900, letterSpacing: '0.12em', fontFamily: 'var(--font-display)', background: 'linear-gradient(135deg, #FFF 0%, #CDFF00 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', whiteSpace: 'nowrap' }}>
              TEEVERSE
            </span>
            <span style={{ fontSize: '0.52rem', fontWeight: 800, padding: '2px 5px', borderRadius: '4px', background: 'rgba(205, 255, 0, 0.15)', color: 'var(--accent-primary)', border: '1px solid rgba(205, 255, 0, 0.3)', textTransform: 'uppercase', letterSpacing: '0.08em', whiteSpace: 'nowrap' }}>
              STREETWEAR
            </span>
          </div>
          <button
            className="drawer__close nav-icon"
            onClick={() => setIsMobileNavOpen(false)}
            aria-label="Close menu"
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '50%',
              padding: '6px',
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              marginLeft: '8px',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Body Items List */}
        <div className="drawer__body" style={{ padding: '20px 16px', overflowY: 'auto', flex: 1 }}>
          <ul className="flex flex-col gap-2" style={{ textTransform: 'uppercase' }}>
            {navItems.map((item, idx) => {
              const IconComp = item.icon;
              return (
                <li
                  key={idx}
                  className="mobile-nav-item"
                  style={{ animationDelay: `${idx * 0.035}s` }}
                  onClick={() => handleNav(item.page, item.category)}
                >
                  <div className="flex items-center gap-3">
                    <div className="mobile-nav-icon">
                      <IconComp size={16} />
                    </div>
                    <span style={{ fontWeight: 700 }}>{item.label}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {item.badge && (
                      <span style={{ fontSize: '0.6rem', fontWeight: 800, padding: '2px 6px', borderRadius: '10px', background: item.badge === 'HOT' ? 'rgba(255, 45, 45, 0.2)' : 'rgba(205, 255, 0, 0.2)', color: item.badge === 'HOT' ? '#FF2D2D' : 'var(--accent-primary)', border: item.badge === 'HOT' ? '1px solid rgba(255, 45, 45, 0.4)' : '1px solid rgba(205, 255, 0, 0.4)' }}>
                        {item.badge}
                      </span>
                    )}
                    <ChevronRight size={16} className="mobile-nav-arrow" />
                  </div>
                </li>
              );
            })}

            {isAdminLoggedIn && (
              <li
                className="mobile-nav-item"
                onClick={() => handleNav('admin')}
                style={{
                  animationDelay: `${navItems.length * 0.035}s`,
                  color: 'var(--accent-primary)',
                  marginTop: '10px',
                  background: 'rgba(205, 255, 0, 0.08)',
                  border: '1px solid rgba(205, 255, 0, 0.3)',
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="mobile-nav-icon" style={{ background: 'var(--accent-primary)', color: '#000' }}>
                    <ShieldAlert size={16} />
                  </div>
                  <span style={{ fontWeight: 800 }}>Owner Admin Panel</span>
                </div>
                <ChevronRight size={16} className="mobile-nav-arrow" style={{ color: 'var(--accent-primary)' }} />
              </li>
            )}
          </ul>
        </div>

        {/* Footer Quick Actions */}
        <div style={{ padding: '16px 20px 24px', borderTop: '1px solid rgba(255,255,255,0.08)', background: 'rgba(0,0,0,0.3)' }}>
          {!customerUser ? (
            <button
              className="btn btn-primary w-full hover-shine"
              style={{ width: '100%', fontSize: '0.82rem', padding: '12px', borderRadius: '10px', justifyContent: 'center', marginBottom: '12px' }}
              onClick={() => {
                setIsAuthModalOpen(true);
                setIsMobileNavOpen(false);
              }}
            >
              <User size={16} /> LOGIN / SIGNUP
            </button>
          ) : (
            <div
              onClick={() => handleNav('profile')}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'rgba(205, 255, 0, 0.1)', border: '1px solid rgba(205, 255, 0, 0.25)', borderRadius: '10px', cursor: 'pointer', marginBottom: '12px' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--accent-primary)', color: '#000', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem' }}>
                  {customerUser.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>{customerUser.name}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>View My Profile & Orders</div>
                </div>
              </div>
              <ChevronRight size={16} color="var(--accent-primary)" />
            </div>
          )}

          <a
            href="https://wa.me/919558613440?text=Hi%20TeeVerse,%20I%20have%20a%20question%20regarding%20my%20order:"
            target="_blank"
            rel="noreferrer"
            className="btn btn-secondary btn-sm"
            style={{ width: '100%', fontSize: '0.78rem', padding: '8px 12px', borderRadius: '8px', justifyContent: 'center', gap: '6px' }}
          >
            <MessageCircle size={15} color="#25D366" /> 💬 Live WhatsApp Support
          </a>
        </div>
      </div>
    </>
  );
};
