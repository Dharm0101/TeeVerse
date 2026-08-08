import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { User, Package, LogOut, MapPin, Plus, Trash2, CheckCircle2, Home, Briefcase } from 'lucide-react';
import { indianStates } from '../data/mockData';

export const ProfileView = () => {
  const {
    customerUser,
    customerLogout,
    orders,
    navigateTo,
    savedAddresses,
    addSavedAddress,
    removeSavedAddress,
    setDefaultAddress,
  } = useStore();

  const [showAddModal, setShowAddModal] = useState(false);
  const [newAddr, setNewAddr] = useState({
    tag: 'Home 🏠',
    name: customerUser?.name || '',
    phone: customerUser?.phone || '',
    email: customerUser?.email || '',
    address: '',
    city: '',
    state: 'Gujarat',
    pincode: '',
  });

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newAddr.name || !newAddr.phone || !newAddr.address || !newAddr.pincode || !newAddr.city) {
      return;
    }
    addSavedAddress(newAddr);
    setNewAddr({
      tag: 'Home 🏠',
      name: customerUser?.name || '',
      phone: customerUser?.phone || '',
      email: customerUser?.email || '',
      address: '',
      city: '',
      state: 'Gujarat',
      pincode: '',
    });
    setShowAddModal(false);
  };

  if (!customerUser) {
    return (
      <div className="section-padding text-center animate-fadeIn" style={{ paddingTop: '140px' }}>
        <h2>Please Log In</h2>
        <p className="text-muted mt-2 mb-6">Log in to view your profile and saved delivery addresses.</p>
        <button className="btn btn-primary" onClick={() => navigateTo('home')}>
          GO TO HOME
        </button>
      </div>
    );
  }

  return (
    <div className="section-padding animate-fadeIn" style={{ paddingTop: '100px' }}>
      <div className="container" style={{ maxWidth: '850px' }}>
        {/* User Profile Card */}
        <div style={{ background: 'var(--bg-card)', padding: '32px', borderRadius: '16px', border: '1px solid var(--border)', marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div className="flex items-center gap-4">
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'var(--accent-primary)',
                color: 'var(--bg-primary)',
                fontSize: '1.8rem',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {customerUser.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 style={{ fontSize: '1.5rem' }}>{customerUser.name}</h2>
              <div className="text-muted" style={{ fontSize: '0.9rem' }}>{customerUser.email}</div>
              <div className="text-muted" style={{ fontSize: '0.85rem' }}>+91 {customerUser.phone}</div>
            </div>
          </div>

          <button className="btn btn-danger btn-sm" onClick={customerLogout}>
            <LogOut size={16} /> LOGOUT
          </button>
        </div>

        {/* Saved Delivery Addresses Section (Amazon Style) */}
        <div style={{ background: 'var(--bg-card)', padding: '32px', borderRadius: '16px', border: '1px solid var(--border)', marginBottom: '32px' }}>
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <MapPin size={22} className="text-accent" />
              <h3 style={{ fontSize: '1.3rem', margin: 0 }}>SAVED ADDRESSES ({savedAddresses.length})</h3>
            </div>
            <button className="btn btn-primary btn-sm" onClick={() => setShowAddModal(!showAddModal)}>
              <Plus size={16} /> {showAddModal ? 'CANCEL' : 'ADD NEW ADDRESS'}
            </button>
          </div>

          {showAddModal && (
            <form onSubmit={handleAddSubmit} style={{ background: 'var(--bg-primary)', padding: '24px', borderRadius: '12px', border: '1px solid var(--accent-primary)', marginBottom: '24px' }}>
              <h4 style={{ marginBottom: '16px', color: 'var(--accent-primary)' }}>+ ADD A NEW DELIVERY ADDRESS</h4>
              
              <div className="flex gap-4 mb-4">
                {['Home 🏠', 'Work 💼', 'Other 📍'].map((t) => (
                  <label key={t} style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.85rem' }}>
                    <input
                      type="radio"
                      name="addrTag"
                      checked={newAddr.tag === t}
                      onChange={() => setNewAddr({ ...newAddr, tag: t })}
                    />
                    {t}
                  </label>
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="mb-3">
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={newAddr.name}
                    onChange={(e) => setNewAddr({ ...newAddr, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Mobile Number *</label>
                  <input
                    type="tel"
                    className="form-input"
                    maxLength={10}
                    value={newAddr.phone}
                    onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group mb-3">
                <label className="form-label">Flat, House No., Building, Street Address *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Address Line 1"
                  value={newAddr.address}
                  onChange={(e) => setNewAddr({ ...newAddr, address: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }} className="mb-4">
                <div className="form-group">
                  <label className="form-label">Pincode *</label>
                  <input
                    type="text"
                    className="form-input"
                    maxLength={6}
                    value={newAddr.pincode}
                    onChange={(e) => setNewAddr({ ...newAddr, pincode: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">City *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={newAddr.city}
                    onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">State *</label>
                  <select
                    className="form-input"
                    value={newAddr.state}
                    onChange={(e) => setNewAddr({ ...newAddr, state: e.target.value })}
                  >
                    {indianStates.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button type="submit" className="btn btn-primary btn-sm">
                SAVE ADDRESS
              </button>
            </form>
          )}

          {savedAddresses.length === 0 ? (
            <div className="text-muted" style={{ fontSize: '0.9rem' }}>No saved addresses found. Add one above!</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '16px' }}>
              {savedAddresses.map((addr) => (
                <div
                  key={addr.id}
                  style={{
                    padding: '20px',
                    borderRadius: '12px',
                    border: addr.isDefault ? '2px solid var(--accent-primary)' : '1px solid var(--border)',
                    background: addr.isDefault ? 'rgba(205, 255, 0, 0.03)' : 'var(--bg-primary)',
                    position: 'relative',
                  }}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="category-pill" style={{ fontSize: '0.75rem', padding: '4px 10px' }}>
                      {addr.tag}
                    </span>
                    {addr.isDefault && (
                      <span style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: 'bold' }}>
                        ✓ DEFAULT ADDRESS
                      </span>
                    )}
                  </div>

                  <strong style={{ fontSize: '1rem' }}>{addr.name}</strong>
                  <div className="text-muted mt-1" style={{ fontSize: '0.85rem', lineHeight: '1.4' }}>
                    {addr.address}, {addr.city}, {addr.state} - {addr.pincode}
                  </div>
                  <div className="text-muted mt-1" style={{ fontSize: '0.85rem' }}>
                    Mobile: +91 {addr.phone}
                  </div>

                  <div className="flex gap-2 mt-4 pt-3" style={{ borderTop: '1px solid var(--border)' }}>
                    {!addr.isDefault && (
                      <button
                        className="btn btn-ghost btn-sm"
                        style={{ fontSize: '0.75rem', padding: '4px 8px' }}
                        onClick={() => setDefaultAddress(addr.id)}
                      >
                        Set as Default
                      </button>
                    )}
                    <button
                      className="btn btn-danger btn-sm"
                      style={{ fontSize: '0.75rem', padding: '4px 8px', marginLeft: 'auto' }}
                      onClick={() => removeSavedAddress(addr.id)}
                    >
                      <Trash2 size={14} /> Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* My Orders Section */}
        <div style={{ background: 'var(--bg-card)', padding: '32px', borderRadius: '16px', border: '1px solid var(--border)' }}>
          <div className="flex items-center gap-2 mb-6">
            <Package size={22} className="text-accent" />
            <h3 style={{ fontSize: '1.3rem' }}>MY ORDERS ({orders.length})</h3>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-muted">You haven't placed any orders yet.</p>
              <button className="btn btn-secondary mt-4" onClick={() => navigateTo('shop')}>
                START SHOPPING
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {orders.map((ord) => (
                <div
                  key={ord.orderId}
                  style={{
                    padding: '20px',
                    borderRadius: '12px',
                    border: '1px solid var(--border)',
                    background: 'var(--bg-primary)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '12px',
                  }}
                >
                  <div>
                    <strong className="text-accent" style={{ fontSize: '1.1rem' }}>#{ord.orderId}</strong>
                    <div className="text-muted" style={{ fontSize: '0.8rem' }}>
                      {new Date(ord.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} · {ord.items.length} item(s)
                    </div>
                  </div>
                  <div>
                    <span
                      style={{
                        padding: '4px 12px',
                        borderRadius: '20px',
                        background: 'rgba(0, 230, 118, 0.1)',
                        color: 'var(--success)',
                        fontSize: '0.8rem',
                        fontWeight: 'bold',
                        textTransform: 'uppercase',
                      }}
                    >
                      {ord.status}
                    </span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>₹{ord.total.toLocaleString('en-IN')}</div>
                    <button
                      className="btn btn-ghost btn-sm mt-1"
                      onClick={() => navigateTo('tracking', ord.orderId)}
                    >
                      Track Order →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
