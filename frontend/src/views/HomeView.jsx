import React from 'react';
import { useStore } from '../context/StoreContext';
import { categories, testimonials } from '../data/mockData';
import { ProductCard } from '../components/ProductCard';
import { Truck, ShieldCheck, RefreshCw, Flame, ArrowRight, Sparkles } from 'lucide-react';

export const HomeView = () => {
  const { navigateTo, productsList, setActiveCategory } = useStore();

  const trendingProducts = productsList.filter((p) => p.tags.includes('trending')).slice(0, 4);
  const bestsellerProducts = productsList.filter((p) => p.isBestseller).slice(0, 4);

  return (
    <div className="animate-fadeIn">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero__content animate-fadeInUp">
          <div className="flex items-center justify-center gap-2 mb-2 animate-float">
            <Flame color="var(--accent-primary)" size={20} />
            <span className="text-accent" style={{ fontFamily: 'var(--font-heading)', letterSpacing: '3px', fontSize: '0.85rem' }}>
              INDIA'S EDGIEST STREETWEAR BRAND
            </span>
          </div>

          <h1 className="hero__title glitch-hover">
            WEAR THE <span className="hero__title--accent">STREETS</span>
          </h1>

          <p className="hero__desc animate-fadeInUp stagger-2">
            Heavyweight combed cotton, custom drop shoulder oversized cuts, and durable high-density urban prints. Crafted for India's youth culture.
          </p>

          <div className="flex gap-4 justify-center flex-wrap mb-6 animate-fadeInUp stagger-3">
            <button className="btn btn-primary btn-lg hover-shine" onClick={() => navigateTo('shop')}>
              EXPLORE COLLECTION <ArrowRight size={20} />
            </button>
            <button
              className="btn btn-secondary btn-lg"
              onClick={() => {
                setActiveCategory('oversized');
                navigateTo('shop');
              }}
            >
              OVERSIZED DROPS
            </button>
          </div>

        </div>
      </section>

      {/* Categories Strip */}
      <section className="section-padding">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h2>SHOP BY CATEGORY</h2>
            <div style={{ width: '50px', height: '3px', background: 'var(--accent-primary)', margin: '8px auto 0' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '16px' }}>
            {categories.map((cat, idx) => (
              <div
                key={cat.id}
                className={`category-card hover-lift hover-shine animate-fadeInUp stagger-${(idx % 6) + 1}`}
                onClick={() => {
                  setActiveCategory(cat.id);
                  navigateTo('shop');
                }}
              >
                <span className="animate-float" style={{ fontSize: '2.2rem' }}>{cat.icon}</span>
                <span style={{ fontFamily: 'var(--font-heading)', fontSize: '0.9rem', letterSpacing: '1px' }}>
                  {cat.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Products */}
      <section className="section-padding scroll-reveal" style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div className="flex justify-between items-center mb-6 flex-wrap gap-4 scroll-reveal-left">
            <div>
              <h2 style={{ fontSize: '2rem' }}>TRENDING DROPS 🔥</h2>
              <p className="text-muted" style={{ fontSize: '0.9rem' }}>The hottest t-shirts ruling the streets right now</p>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={() => navigateTo('shop')}>
              VIEW ALL <ArrowRight size={16} />
            </button>
          </div>

          <div className="product-grid scroll-reveal-scale">
            {trendingProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Limited Drop Banner */}
      <section className="section-padding scroll-reveal">
        <div className="container">
          <div
            className="hover-shine"
            style={{
              background: 'linear-gradient(135deg, #1f2400 0%, #1a1a1a 100%)',
              border: '1px solid var(--accent-primary)',
              borderRadius: '16px',
              padding: '48px 32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '32px',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div style={{ maxWidth: '550px' }}>
              <span className="btn btn-sm btn-primary mb-4" style={{ pointerEvents: 'none' }}>
                <Sparkles size={14} /> LIMITED DROP OF THE WEEK
              </span>
              <h2 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>
                URBAN RENEGADE <span className="text-accent">260 GSM</span> HEAVYWEIGHT
              </h2>
              <p className="text-muted mb-6" style={{ fontSize: '0.95rem' }}>
                Acid-washed luxury streetwear with 3D rubber puff print accents. Limited to 150 pieces nationwide.
              </p>
              <button
                className="btn btn-primary btn-lg"
                onClick={() => {
                  navigateTo('product', 10);
                }}
              >
                SNAG YOUR SIZE — ₹1,099
              </button>
            </div>

            <div style={{ textAlign: 'center', width: '220px', height: '260px', background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '3.5rem', opacity: 0.3, letterSpacing: '4px' }}>
                LIMITED
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Bestsellers */}
      <section className="section-padding scroll-reveal" style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '32px' }} className="scroll-reveal">
            <h2 style={{ fontSize: '2rem' }}>BESTSELLERS ⭐</h2>
            <p className="text-muted" style={{ fontSize: '0.9rem' }}>Tried, tested, and loved by 50,000+ street culture enthusiasts</p>
          </div>

          <div className="product-grid scroll-reveal-scale">
            {bestsellerProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Features Strip */}
      <section className="section-padding scroll-reveal">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px', textAlign: 'center' }}>
            <div className="scroll-reveal-left hover-lift" style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border)' }}>
              <Truck size={36} color="var(--accent-primary)" style={{ margin: '0 auto 12px' }} />
              <h4>FREE EXPRESS SHIPPING</h4>
              <p className="text-muted mt-2" style={{ fontSize: '0.85rem' }}>Free shipping on all orders above ₹1299 pan India.</p>
            </div>
            <div className="scroll-reveal-scale hover-lift" style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border)' }}>
              <ShieldCheck size={36} color="var(--accent-primary)" style={{ margin: '0 auto 12px' }} />
              <h4>100% INSTANT PAYMENTS</h4>
              <p className="text-muted mt-2" style={{ fontSize: '0.85rem' }}>Verified UPI, GPay, PhonePe & Credit/Debit Card payments.</p>
            </div>
            <div className="scroll-reveal-right hover-lift" style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border)' }}>
              <RefreshCw size={36} color="var(--accent-primary)" style={{ margin: '0 auto 12px' }} />
              <h4>7-DAY EASY RETURNS</h4>
              <p className="text-muted mt-2" style={{ fontSize: '0.85rem' }}>Hassle-free size exchange and direct home pickup.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding scroll-reveal" style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '32px' }} className="scroll-reveal">
            <h2>WHAT THE STREETS SAY</h2>
            <div style={{ width: '50px', height: '3px', background: 'var(--accent-primary)', margin: '8px auto 0' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            {testimonials.map((t, i) => (
              <div key={i} className={`scroll-reveal-scale hover-lift stagger-${(i % 4) + 1}`} style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                <div className="flex items-center gap-3 mb-3">
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: 'var(--accent-primary)',
                      color: 'var(--bg-primary)',
                      fontWeight: 'bold',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {t.avatarInitial}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.95rem' }}>{t.name}</h4>
                    <span className="text-muted" style={{ fontSize: '0.8rem' }}>{t.city}</span>
                  </div>
                </div>
                <p style={{ fontStyle: 'italic', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>"{t.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Trust Badges Row */}
      <section style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)', padding: '24px 0' }}>
        <div className="container">
          <div className="flex gap-8 justify-center flex-wrap text-muted" style={{ fontSize: '0.9rem', letterSpacing: '0.5px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
              <span style={{ color: 'var(--accent-primary)', fontWeight: 'bold' }}>✓</span> Premium 220-280 GSM Cotton
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
              <span style={{ color: 'var(--accent-primary)', fontWeight: 'bold' }}>✓</span> Free Pan-India Delivery Above ₹1299
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
              <span style={{ color: 'var(--accent-primary)', fontWeight: 'bold' }}>✓</span> Instant UPI & Card Payments
            </span>
          </div>
        </div>
      </section>

      {/* Sliding Highlights Ticker */}
      <section style={{ background: 'var(--accent-primary)', color: 'var(--bg-primary)', padding: '16px 0', overflow: 'hidden', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', fontFamily: 'var(--font-heading)', fontWeight: 'bold', letterSpacing: '2px', fontSize: '1rem', textTransform: 'uppercase' }}>
        <div className="marquee-track">
          <span style={{ marginRight: '64px' }}>🔥 FREE EXPRESS SHIPPING ACROSS INDIA ON ORDERS ABOVE ₹999</span>
          <span style={{ marginRight: '64px' }}>⚡ HEAVYWEIGHT 240 GSM PURE COMBED COTTON STREETWEAR</span>
          <span style={{ marginRight: '64px' }}>🏙️ 100% AUTHENTIC LIMITED EDITION GRAPHIC TEES</span>

          <span style={{ marginRight: '64px' }}>🔥 FREE EXPRESS SHIPPING ACROSS INDIA ON ORDERS ABOVE ₹999</span>
          <span style={{ marginRight: '64px' }}>⚡ HEAVYWEIGHT 240 GSM PURE COMBED COTTON STREETWEAR</span>
          <span style={{ marginRight: '64px' }}>🏙️ 100% AUTHENTIC LIMITED EDITION GRAPHIC TEES</span>
        </div>
      </section>
    </div>
  );
};
