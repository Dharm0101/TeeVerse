import React from 'react';
import { useStore } from '../context/StoreContext';
import { ShieldCheck, Flame, Compass, ArrowRight, Heart } from 'lucide-react';

export const AboutView = () => {
  const { navigateTo, setActiveCategory } = useStore();

  return (
    <div className="section-padding animate-fadeIn" style={{ paddingTop: '110px' }}>
      <div className="container" style={{ maxWidth: '1000px' }}>
        {/* Page Header */}
        <div style={{ textAlign: 'center', marginBottom: '56px' }} className="scroll-reveal">
          <span className="btn btn-sm btn-primary mb-3" style={{ pointerEvents: 'none' }}>
            <Flame size={14} /> THE STORY OF TEEVERSE
          </span>
          <h1 className="glitch-hover" style={{ fontSize: '3rem', marginBottom: '16px' }}>
            WEAR THE <span className="text-accent">STREETS</span>
          </h1>
          <p className="text-muted" style={{ fontSize: '1.05rem', maxWidth: '700px', margin: '0 auto', lineHeight: '1.6' }}>
            TeeVerse was born in 2026 out of frustration with thin, ill-fitting generic t-shirts. We wanted heavyweight boxy fits, drop-shoulder silhouettes, and premium graphics that actually survive the wash. Designed for India's growing youth and streetwear culture.
          </p>
        </div>

        {/* Brand Core Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px', marginBottom: '64px' }}>
          {/* Card 1: 240 GSM */}
          <div className="scroll-reveal-left" style={{ background: 'var(--bg-card)', padding: '32px', borderRadius: '16px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '10px', background: 'rgba(205, 255, 0, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldCheck size={24} color="var(--accent-primary)" />
            </div>
            <h3 style={{ fontSize: '1.3rem', fontFamily: 'var(--font-heading)', letterSpacing: '1px' }}>250 GSM HEAVYWEIGHT</h3>
            <p className="text-muted" style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
              We custom weave our fabrics. Our t-shirts use premium 220-250 GSM combed cotton that feels structured, thick, and premium to hold its boxy shape all day long.
            </p>
          </div>

          {/* Card 2: Boxy Cuts */}
          <div className="scroll-reveal-scale" style={{ background: 'var(--bg-card)', padding: '32px', borderRadius: '16px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '10px', background: 'rgba(205, 255, 0, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Compass size={24} color="var(--accent-primary)" />
            </div>
            <h3 style={{ fontSize: '1.3rem', fontFamily: 'var(--font-heading)', letterSpacing: '1px' }}>DROP SHOULDER CUTS</h3>
            <p className="text-muted" style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
              No standard tight fits. We specialize in custom loose-hanging oversized silhouettes that offer ultimate comfort while looking incredibly clean in urban environments.
            </p>
          </div>

          {/* Card 3: Screen Print */}
          <div className="scroll-reveal-right" style={{ background: 'var(--bg-card)', padding: '32px', borderRadius: '16px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '10px', background: 'rgba(205, 255, 0, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Flame size={24} color="var(--accent-primary)" />
            </div>
            <h3 style={{ fontSize: '1.3rem', fontFamily: 'var(--font-heading)', letterSpacing: '1px' }}>HIGH-DENSITY PRINTS</h3>
            <p className="text-muted" style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
              From neon detailing to grunge designs, we use high-density screen, puff, and digital prints that remain vibrant without cracking or peeling over time.
            </p>
          </div>
        </div>

        {/* Narrative Section */}
        <div style={{ background: 'var(--bg-secondary)', padding: '40px', borderRadius: '16px', border: '1px solid var(--border)', marginBottom: '64px' }} className="scroll-reveal">
          <h2 style={{ fontSize: '1.8rem', marginBottom: '16px', fontFamily: 'var(--font-heading)' }}>CRAFTED IN GUJARAT FOR INDIA</h2>
          <p className="text-muted" style={{ fontSize: '0.95rem', lineHeight: '1.8', marginBottom: '20px' }}>
            Our headquarters in Gujarat acts as our design studio and development laboratory. Every graphic is custom drawn by independent Indian street artists, and every fabric blend undergoes strict test drops to measure shrinkage, fade-resistance, and wash durability.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '500', color: 'var(--text-primary)' }}>
            Made with <Heart size={16} fill="var(--accent-secondary)" color="var(--accent-secondary)" /> by the TeeVerse Collective.
          </div>
        </div>

        {/* Call To Action */}
        <div style={{ textAlign: 'center' }} className="scroll-reveal">
          <h2 style={{ fontSize: '2rem', marginBottom: '12px' }}>READY TO UPGRADE YOUR WARDROBE?</h2>
          <p className="text-muted mb-6" style={{ fontSize: '0.95rem' }}>
            Check out our latest graphic drop or oversized collections.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <button className="btn btn-primary btn-lg hover-shine" onClick={() => { setActiveCategory('all'); navigateTo('shop'); }}>
              SHOP THE CODES <ArrowRight size={18} />
            </button>
            <button className="btn btn-secondary btn-lg" onClick={() => { setActiveCategory('oversized'); navigateTo('shop'); }}>
              OVERSIZED TEES
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
