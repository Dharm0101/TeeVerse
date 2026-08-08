import React from 'react';
import { useStore } from '../context/StoreContext';
import { Globe, Lock, Share2 } from 'lucide-react';

export const Footer = () => {
  const { navigateTo, setActiveCategory } = useStore();

  return (
    <footer className="section-padding" style={{ background: 'var(--bg-primary)', borderTop: '1px solid var(--border)', paddingTop: '64px', paddingBottom: '32px' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '32px', marginBottom: '40px' }}>
          <div>
            <h3 className="navbar__logo" style={{ fontSize: '1.8rem', marginBottom: '8px' }}>TEEVERSE</h3>
            <p className="text-accent" style={{ fontFamily: 'var(--font-heading)', letterSpacing: '2px', fontSize: '0.85rem' }}>
              WEAR THE STREETS
            </p>
            <p className="text-muted mt-3" style={{ fontSize: '0.85rem', lineHeight: '1.6' }}>
              India's premium B2C streetwear destination. Crafted with high GSM combed cotton, custom oversized cuts, and durable urban prints.
            </p>
            <div className="flex gap-3 mt-4">
              <a href="#" className="social-icon" aria-label="Website"><Globe size={18} /></a>
              <a href="#" className="social-icon" aria-label="Share"><Share2 size={18} /></a>
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: '0.9rem', marginBottom: '16px', letterSpacing: '1px' }}>CATEGORIES</h4>
            <ul className="flex flex-col gap-2" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <li style={{ cursor: 'pointer' }} onClick={() => { setActiveCategory('graphic'); navigateTo('shop'); }}>Graphic Tees</li>
              <li style={{ cursor: 'pointer' }} onClick={() => { setActiveCategory('oversized'); navigateTo('shop'); }}>Oversized Streetwear</li>
              <li style={{ cursor: 'pointer' }} onClick={() => { setActiveCategory('plain'); navigateTo('shop'); }}>Plain Heavyweight</li>
              <li style={{ cursor: 'pointer' }} onClick={() => { setActiveCategory('anime'); navigateTo('shop'); }}>Anime Drop</li>
              <li style={{ cursor: 'pointer' }} onClick={() => { setActiveCategory('typography'); navigateTo('shop'); }}>Typography Series</li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: '0.9rem', marginBottom: '16px', letterSpacing: '1px' }}>CUSTOMER CARE</h4>
            <ul className="flex flex-col gap-2" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <li style={{ cursor: 'pointer' }} onClick={() => navigateTo('about')}>About TeeVerse</li>
              <li style={{ cursor: 'pointer' }} onClick={() => navigateTo('tracking')}>Track Your Order</li>
              <li>Shipping & Delivery Policy</li>
              <li>7-Day Returns & Exchange</li>
              <li>Terms of Service</li>
              <li style={{ cursor: 'pointer' }} onClick={() => navigateTo('contact')}>Contact Us (support@teeverse.in)</li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: '0.9rem', marginBottom: '16px', letterSpacing: '1px' }}>WE ACCEPT</h4>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="category-pill" style={{ fontSize: '0.7rem', padding: '4px 10px' }}>UPI (GPay / PhonePe / Paytm)</span>
              <span className="category-pill" style={{ fontSize: '0.7rem', padding: '4px 10px' }}>Credit / Debit Cards</span>
              <span className="category-pill" style={{ fontSize: '0.7rem', padding: '4px 10px' }}>NetBanking</span>
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'center', paddingTop: '20px', borderTop: '1px solid var(--border)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          © 2026 TeeVerse India. All rights reserved. Built for street culture.
        </div>
      </div>
    </footer>
  );
};
