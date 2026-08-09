import React from 'react';
import { useStore } from '../context/StoreContext';
import { categories } from '../data/mockData';
import { ProductCard } from '../components/ProductCard';
import { Filter, RotateCcw } from 'lucide-react';

export const ShopView = () => {
  const [isMobileFilterOpen, setIsMobileFilterOpen] = React.useState(false);
  const {
    productsList,
    activeCategory,
    setActiveCategory,
    selectedSizes,
    setSelectedSizes,
    priceRange,
    setPriceRange,
    minRating,
    setMinRating,
    sortBy,
    setSortBy,
  } = useStore();

  // Apply filters
  let filtered = productsList.filter((p) => {
    if (activeCategory !== 'all' && p.category !== activeCategory) return false;
    if (selectedSizes.length > 0 && !selectedSizes.some((s) => p.sizes.includes(s))) return false;
    if (p.price < priceRange[0] || p.price > priceRange[1]) return false;
    if (p.rating < minRating) return false;
    return true;
  });

  // Apply sort
  if (sortBy === 'price-low') filtered.sort((a, b) => a.price - b.price);
  if (sortBy === 'price-high') filtered.sort((a, b) => b.price - a.price);
  if (sortBy === 'rating') filtered.sort((a, b) => b.rating - a.rating);

  const toggleSizeFilter = (size) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const clearAllFilters = () => {
    setActiveCategory('all');
    setSelectedSizes([]);
    setPriceRange([0, 2500]);
    setMinRating(0);
    setSortBy('popularity');
  };

  return (
    <div className="section-padding animate-fadeIn" style={{ paddingTop: '100px' }}>
      <div className="container">
        {/* Shop Header */}
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '16px' }}>
          <div>
            <h1 style={{ fontSize: '2.2rem' }}>
              {activeCategory === 'all' ? 'SHOP ALL TEES' : `${activeCategory.toUpperCase()} COLLECTION`}
            </h1>
            <p className="text-muted" style={{ fontSize: '0.85rem' }}>
              Showing {filtered.length} product(s)
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              className="btn btn-secondary btn-sm mobile-filter-toggle"
              onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}
            >
              <Filter size={16} /> Filters {isMobileFilterOpen ? '▲' : '▼'}
            </button>

            <span className="text-muted" style={{ fontSize: '0.85rem' }}>Sort By:</span>
            <select
              className="form-input"
              style={{ width: 'auto', padding: '6px 12px', fontSize: '0.85rem' }}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="popularity">Popularity</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Customer Rating</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="category-scroll-container mb-6">
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`category-pill ${activeCategory === cat.id ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>

        {/* Main Grid + Sidebar */}
        <div className="shop-layout-grid" id="shop-layout-grid">
          {/* Filter Sidebar */}
          <aside className={`shop-filter-sidebar ${isMobileFilterOpen ? 'open' : ''}`} style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border)', height: 'fit-content' }}>
            <div className="flex justify-between items-center mb-4" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
              <div className="flex items-center gap-2" style={{ fontWeight: 'bold', fontFamily: 'var(--font-heading)', letterSpacing: '1px' }}>
                <Filter size={18} className="text-accent" /> FILTERS
              </div>
              <button
                onClick={clearAllFilters}
                style={{ background: 'none', border: 'none', color: 'var(--accent-secondary)', fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <RotateCcw size={12} /> Reset
              </button>
            </div>

            {/* Filter by Size */}
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>SIZE</h4>
              <div className="flex gap-2 flex-wrap">
                {['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'].map((sz) => (
                  <button
                    key={sz}
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '4px',
                      border: selectedSizes.includes(sz) ? '2px solid var(--accent-primary)' : '1px solid var(--border)',
                      background: selectedSizes.includes(sz) ? 'rgba(205, 255, 0, 0.1)' : 'transparent',
                      color: selectedSizes.includes(sz) ? 'var(--accent-primary)' : 'var(--text-primary)',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                    }}
                    onClick={() => toggleSizeFilter(sz)}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter by Max Price */}
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                MAX PRICE: ₹{priceRange[1]}
              </h4>
              <input
                type="range"
                min="499"
                max="2500"
                step="100"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([0, Number(e.target.value)])}
                style={{ width: '100%', accentColor: 'var(--accent-primary)' }}
              />
              <div className="flex justify-between text-muted mt-1" style={{ fontSize: '0.75rem' }}>
                <span>₹499</span>
                <span>₹2,500</span>
              </div>
            </div>

            {/* Filter by Min Rating */}
            <div>
              <h4 style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>RATING</h4>
              {[4, 3].map((stars) => (
                <button
                  key={stars}
                  style={{
                    display: 'block',
                    width: '100%',
                    textAlign: 'left',
                    padding: '6px 0',
                    background: 'none',
                    border: 'none',
                    color: minRating === stars ? 'var(--accent-primary)' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                  }}
                  onClick={() => setMinRating(minRating === stars ? 0 : stars)}
                >
                  ★ {stars}.0 & Above
                </button>
              ))}
            </div>
          </aside>

          {/* Products Grid */}
          <div>
            {filtered.length > 0 ? (
              <div className="product-grid">
                {filtered.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '60px 20px', background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                <h3>No t-shirts match your filters</h3>
                <p className="text-muted mt-2 mb-4" style={{ fontSize: '0.85rem' }}>
                  Try resetting your size, price, or category selections.
                </p>
                <button className="btn btn-primary btn-sm" onClick={clearAllFilters}>
                  CLEAR ALL FILTERS
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
