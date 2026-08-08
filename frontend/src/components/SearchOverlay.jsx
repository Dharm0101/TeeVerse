import React from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';
import { X, Search } from 'lucide-react';

export const SearchOverlay = () => {
  const { isSearchOpen, setIsSearchOpen, searchQuery, setSearchQuery, productsList } = useStore();

  if (!isSearchOpen) return null;

  const filteredProducts = searchQuery.trim()
    ? productsList.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const popularTerms = ['Cyberpunk', 'Oversized', 'Heavyweight', 'Graphic', 'Plain', 'Anime'];

  return (
    <div className="drawer-overlay animate-fadeIn" style={{ opacity: 1, zIndex: 5000, background: 'rgba(13,13,13,0.96)', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '80px' }}>
      <button
        onClick={() => setIsSearchOpen(false)}
        style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer' }}
      >
        <X size={28} />
      </button>

      <div style={{ width: '100%', maxWidth: '640px', padding: '0 20px' }}>
        <div style={{ position: 'relative', marginBottom: '24px' }}>
          <Search size={22} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '50px', fontSize: '1.2rem', height: '56px', borderRadius: '12px' }}
            placeholder="Search anime, graphic, oversized tees..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="flex gap-2 flex-wrap justify-center mb-6">
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', alignSelf: 'center', marginRight: '8px' }}>Trending:</span>
          {popularTerms.map((term, i) => (
            <button
              key={i}
              className="category-pill"
              style={{ fontSize: '0.75rem', padding: '4px 12px' }}
              onClick={() => setSearchQuery(term)}
            >
              {term}
            </button>
          ))}
        </div>

        {/* Results */}
        <div style={{ maxHeight: '60vh', overflowY: 'auto', paddingRight: '8px' }}>
          {searchQuery.trim() !== '' && (
            <p className="text-muted mb-4" style={{ fontSize: '0.85rem' }}>
              Found {filteredProducts.length} result(s) for "{searchQuery}"
            </p>
          )}

          {filteredProducts.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
              {filteredProducts.map((product) => (
                <div key={product.id} onClick={() => setIsSearchOpen(false)}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            searchQuery.trim() !== '' && (
              <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-secondary)' }}>
                No products found matching "{searchQuery}"
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};
