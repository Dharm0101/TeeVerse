import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { IndianRupee, Package, Users, LogOut, ArrowLeft, Plus, Edit2, Trash2, X } from 'lucide-react';
import { categories } from '../data/mockData';
import { API_BASE_URL } from '../services/emailService';

export const AdminDashboardView = () => {
  const {
    isAdminLoggedIn,
    adminLogout,
    orders,
    updateOrderStatus,
    productsList,
    addProduct,
    updateProduct,
    deleteProduct,
    contactQueries,
    updateQueryStatus,
    deleteContactQuery,
    navigateTo,
    setIsAuthModalOpen,
    showToast,
  } = useStore();

  const [adminTab, setAdminTab] = useState('orders'); // orders | products | queries
  const [upiIdSetting, setUpiIdSetting] = useState(() => localStorage.getItem('teeverse_store_upi_id') || '9558613440@paytm');
  const [customQrSetting, setCustomQrSetting] = useState(() => localStorage.getItem('teeverse_custom_qr_code') || null);

  // CRUD Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [form, setForm] = useState({
    name: '',
    category: 'graphic',
    price: '',
    mrp: '',
    description: '',
    fit: 'Regular Fit',
    imageUrlsText: '',
    inStock: true,
    isNew: true,
    isBestseller: false,
  });

  if (!isAdminLoggedIn) {
    setIsAuthModalOpen(true);
    navigateTo('home');
    return null;
  }

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setForm({
      name: '',
      category: 'graphic',
      price: '',
      mrp: '',
      description: 'Premium heavyweight cotton streetwear tee.',
      fit: 'Regular Fit',
      imageUrlsText: 'Front View\nBack Print View',
      inStock: true,
      isNew: true,
      isBestseller: false,
    });
    setShowModal(true);
  };

  const handleOpenEdit = (prod) => {
    setEditingProduct(prod);
    const existingImgs = (prod.images && prod.images.length > 0) ? prod.images.join('\n') : 'Front View\nBack Print View';
    setForm({
      name: prod.name,
      category: prod.category,
      price: prod.price,
      mrp: prod.mrp || '',
      description: prod.description || '',
      fit: prod.fit || 'Regular Fit',
      imageUrlsText: existingImgs,
      inStock: prod.inStock !== undefined ? prod.inStock : true,
      isNew: prod.isNew || false,
      isBestseller: prod.isBestseller || false,
    });
    setShowModal(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.price || !form.category) {
      showToast('Name, Category, and Price are required!', 'error');
      return;
    }

    const parsedImages = form.imageUrlsText
      ? form.imageUrlsText.split('\n').map((s) => s.trim()).filter(Boolean)
      : ['Front View', 'Back Print View'];

    const price = Number(form.price);
    const mrp = form.mrp ? Number(form.mrp) : price;
    const discount = mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;

    const payload = {
      ...form,
      price,
      mrp,
      discount,
      images: parsedImages,
    };

    if (editingProduct) {
      // UPDATE Product
      updateProduct(editingProduct.id, payload);
      try {
        await fetch(`${API_BASE_URL}/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } catch (err) {
        console.log('SQLite Sync Note:', err.message);
      }
    } else {
      // CREATE Product
      addProduct(payload);
      try {
        await fetch(`${API_BASE_URL}/products`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } catch (err) {
        console.log('SQLite Sync Note:', err.message);
      }
    }

    setShowModal(false);
  };

  const handleDeleteProduct = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}" (#${id}) from the catalog?`)) {
      deleteProduct(id);
      try {
        await fetch(`${API_BASE_URL}/products/${id}`, {
          method: 'DELETE',
        });
      } catch (err) {
        console.log('SQLite Sync Note:', err.message);
      }
    }
  };

  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);

  return (
    <div className="section-padding animate-fadeIn" style={{ paddingTop: '100px' }}>
      <div className="container">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 flex-wrap gap-4" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '20px' }}>
          <div>
            <span className="text-accent" style={{ fontFamily: 'var(--font-heading)', letterSpacing: '2px', fontSize: '0.85rem' }}>
              STORE OWNER CONTROL PANEL
            </span>
            <h1 style={{ fontSize: '2.2rem' }}>BUSINESS DASHBOARD</h1>
          </div>

          <div className="flex items-center gap-3">
            <button className="btn btn-ghost btn-sm" onClick={() => navigateTo('home')}>
              <ArrowLeft size={16} /> View Storefront
            </button>
            <button className="btn btn-danger btn-sm" onClick={adminLogout}>
              <LogOut size={16} /> LOGOUT ADMIN
            </button>
          </div>
        </div>

        {/* Analytics Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '40px' }}>
          <div className="admin-stat-card">
            <div style={{ padding: '12px', background: 'rgba(205,255,0,0.1)', borderRadius: '10px', color: 'var(--accent-primary)' }}>
              <IndianRupee size={28} />
            </div>
            <div>
              <div className="text-muted" style={{ fontSize: '0.75rem' }}>TOTAL REVENUE</div>
              <h3 style={{ fontSize: '1.6rem', color: 'var(--accent-primary)' }}>₹{totalRevenue.toLocaleString('en-IN')}</h3>
            </div>
          </div>

          <div className="admin-stat-card">
            <div style={{ padding: '12px', background: 'rgba(41,182,246,0.1)', borderRadius: '10px', color: 'var(--info)' }}>
              <Package size={28} />
            </div>
            <div>
              <div className="text-muted" style={{ fontSize: '0.75rem' }}>TOTAL ORDERS</div>
              <h3 style={{ fontSize: '1.6rem' }}>{orders.length}</h3>
            </div>
          </div>

          <div className="admin-stat-card">
            <div style={{ padding: '12px', background: 'rgba(0,230,118,0.1)', borderRadius: '10px', color: 'var(--success)' }}>
              <Users size={28} />
            </div>
            <div>
              <div className="text-muted" style={{ fontSize: '0.75rem' }}>CATALOG PRODUCTS</div>
              <h3 style={{ fontSize: '1.6rem' }}>{productsList.length}</h3>
            </div>
          </div>
        </div>

        {/* Admin Navigation Tabs */}
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
          <div className="flex gap-2">
            <button
              className={`category-pill ${adminTab === 'orders' ? 'active' : ''}`}
              onClick={() => setAdminTab('orders')}
            >
              📦 Customer Orders ({orders.length})
            </button>
            <button
              className={`category-pill ${adminTab === 'products' ? 'active' : ''}`}
              onClick={() => setAdminTab('products')}
            >
              👕 Product Catalog CRUD ({productsList.length})
            </button>
            <button
              className={`category-pill ${adminTab === 'queries' ? 'active' : ''}`}
              onClick={() => setAdminTab('queries')}
            >
              💬 Contact Queries ({contactQueries.length})
            </button>
          </div>

          {adminTab === 'products' && (
            <button className="btn btn-primary btn-sm" onClick={handleOpenAdd}>
              <Plus size={16} /> ADD NEW PRODUCT
            </button>
          )}
        </div>

        {/* Tab 1: Orders Management */}
        {adminTab === 'orders' && (
          <div>
            {/* Merchant Payment Settings */}
            <div style={{ background: 'var(--bg-card)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border)', marginBottom: '24px' }}>
              <h4 style={{ margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem', letterSpacing: '0.5px' }}>
                ⚙️ STORE PAYMENT SETTINGS
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', alignItems: 'flex-start' }}>
                {/* UPI ID field */}
                <div>
                  <label className="form-label" style={{ fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>Store UPI VPA ID</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      className="form-input"
                      style={{ padding: '6px 12px', fontSize: '0.9rem', flex: 1 }}
                      value={upiIdSetting}
                      onChange={(e) => {
                        setUpiIdSetting(e.target.value);
                        localStorage.setItem('teeverse_store_upi_id', e.target.value);
                      }}
                      placeholder="e.g. 9558613440@paytm"
                    />
                    <button className="btn btn-primary btn-sm" onClick={() => showToast('UPI VPA Saved!', 'success')} style={{ padding: '6px 16px' }}>SAVE</button>
                  </div>
                </div>

                {/* QR Code Upload field */}
                <div>
                  <label className="form-label" style={{ fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>Custom Payment QR Code Image</label>
                  <div className="flex items-center gap-3 flex-wrap">
                    <label
                      className="btn btn-secondary btn-sm"
                      style={{
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        padding: '8px 16px',
                        borderRadius: '6px',
                        border: '1px dashed var(--accent-primary)',
                      }}
                    >
                      {customQrSetting ? 'Change QR Image' : 'Upload QR Image'}
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setCustomQrSetting(reader.result);
                              localStorage.setItem('teeverse_custom_qr_code', reader.result);
                              showToast('Custom Payment QR Code uploaded successfully!', 'success');
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                    {customQrSetting && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '40px', height: '40px', border: '1px solid var(--border)', borderRadius: '4px', overflow: 'hidden' }}>
                          <img src={customQrSetting} alt="qr preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <button
                          className="btn btn-danger btn-sm"
                          style={{ padding: '4px 8px', fontSize: '0.7rem' }}
                          onClick={() => {
                            setCustomQrSetting(null);
                            localStorage.removeItem('teeverse_custom_qr_code');
                            showToast('Custom QR removed. Reverted to dynamic auto-generation.', 'info');
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {orders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                <Package size={48} style={{ opacity: 0.3, margin: '0 auto 12px' }} />
                <h3>No Orders Placed Yet</h3>
                <p className="text-muted mt-1" style={{ fontSize: '0.85rem' }}>
                  Orders placed by customers will show up here in real time.
                </p>
              </div>
            ) : (
              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Delivery Partner & OTP</th>
                      <th>Total</th>
                      <th>Payment</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((ord) => (
                      <tr key={ord.orderId}>
                        <td><strong>{ord.orderId}</strong></td>
                        <td>
                          <div>{ord.shipping.name}</div>
                          <div className="text-muted" style={{ fontSize: '0.75rem' }}>{ord.shipping.phone} · {ord.shipping.city}</div>
                        </td>
                        <td>
                          <div style={{ fontSize: '0.85rem' }}>
                            🚚 <strong>{ord.partnerName || 'Ramesh Kumar'}</strong>
                          </div>
                          <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                            Phone: +91 {ord.partnerPhone || '9558613440'}
                          </div>
                          <div style={{ marginTop: '2px' }}>
                            <span style={{ background: 'rgba(205,255,0,0.15)', color: 'var(--accent-primary)', padding: '2px 6px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                              🔒 OTP: {ord.deliveryOtp || '4921'}
                            </span>
                          </div>
                        </td>
                        <td className="text-accent" style={{ fontWeight: 'bold' }}>₹{ord.total.toLocaleString('en-IN')}</td>
                        <td>
                          <div>{ord.paymentMethod.toUpperCase()}</div>
                          {ord.paymentScreenshot && (
                            <div style={{ marginTop: '6px' }}>
                              <a
                                href={ord.paymentScreenshot}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  color: 'var(--accent-primary)',
                                  fontSize: '0.75rem',
                                  textDecoration: 'underline',
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  fontWeight: 'bold',
                                }}
                              >
                                📸 VIEW PROOF
                              </a>
                            </div>
                          )}
                        </td>
                        <td>
                          <select
                            className="form-input"
                            style={{ padding: '4px 8px', fontSize: '0.8rem', width: 'auto' }}
                            value={ord.status}
                            onChange={(e) => updateOrderStatus(ord.orderId, e.target.value)}
                          >
                            <option value="confirmed">Confirmed</option>
                            <option value="shipped">Shipped</option>
                            <option value="out-for-delivery">Out for Delivery</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Products Catalog CRUD Management */}
        {adminTab === 'products' && (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Product Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Fit</th>
                  <th>Stock Status</th>
                  <th>Actions (CRUD)</th>
                </tr>
              </thead>
              <tbody>
                {productsList.map((p) => (
                  <tr key={p.id}>
                    <td>#{p.id}</td>
                    <td>
                      <strong>{p.name}</strong>
                      {p.isNew && <span style={{ marginLeft: '6px', fontSize: '0.65rem', background: 'var(--accent-primary)', color: '#000', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>NEW</span>}
                    </td>
                    <td>
                      <span className="category-pill" style={{ fontSize: '0.7rem', padding: '2px 8px' }}>
                        {p.category}
                      </span>
                    </td>
                    <td className="text-accent" style={{ fontWeight: 'bold', fontSize: '1rem' }}>
                      ₹{p.price.toLocaleString('en-IN')}
                    </td>
                    <td className="text-muted" style={{ fontSize: '0.8rem' }}>{p.fit || 'Regular Fit'}</td>
                    <td>
                      {p.inStock ? (
                        <span style={{ color: 'var(--success)', fontSize: '0.8rem', fontWeight: 'bold' }}>✓ In Stock</span>
                      ) : (
                        <span style={{ color: 'var(--accent-secondary)', fontSize: '0.8rem', fontWeight: 'bold' }}>✕ Out of Stock</span>
                      )}
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <button
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                          onClick={() => handleOpenEdit(p)}
                        >
                          <Edit2 size={13} /> Edit
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                          onClick={() => handleDeleteProduct(p.id, p.name)}
                        >
                          <Trash2 size={13} /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 3: Customer Contact Queries */}
        {adminTab === 'queries' && (
          <div>
            {contactQueries.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                <Users size={48} style={{ opacity: 0.3, margin: '0 auto 12px' }} />
                <h3>No Customer Queries Received Yet</h3>
                <p className="text-muted mt-1" style={{ fontSize: '0.85rem' }}>
                  Messages submitted on the "Contact Us" page will show up here in real time.
                </p>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '16px' }}>
                {contactQueries.map((q) => (
                  <div
                    key={q.id}
                    style={{
                      background: 'var(--bg-card)',
                      padding: '20px 24px',
                      borderRadius: '12px',
                      border: q.status === 'unread' ? '1px solid var(--accent-primary)' : '1px solid var(--border)',
                      position: 'relative',
                    }}
                  >
                    <div className="flex justify-between items-start mb-3 flex-wrap gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <strong style={{ fontSize: '1.05rem' }}>{q.name}</strong>
                          {q.status === 'unread' && (
                            <span style={{ background: 'var(--accent-primary)', color: '#000', fontSize: '0.65rem', fontWeight: 'bold', padding: '2px 8px', borderRadius: '10px' }}>
                              NEW QUERY
                            </span>
                          )}
                        </div>
                        <div className="text-muted" style={{ fontSize: '0.8rem', marginTop: '2px' }}>
                          📧 {q.email} &nbsp;·&nbsp; 📞 +91 {q.phone || '9558613440'} &nbsp;·&nbsp; 🕒 {new Date(q.date).toLocaleString('en-IN')}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <select
                          className="form-input"
                          style={{ padding: '4px 8px', fontSize: '0.75rem', width: 'auto' }}
                          value={q.status}
                          onChange={(e) => updateQueryStatus(q.id, e.target.value)}
                        >
                          <option value="unread">🔴 Unread</option>
                          <option value="replied">🟢 Replied</option>
                          <option value="resolved">⚪ Resolved</option>
                        </select>
                        <button
                          className="btn btn-danger btn-sm"
                          style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                          onClick={() => deleteContactQuery(q.id)}
                          title="Delete Query"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>

                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px 16px', borderRadius: '8px', marginBottom: '12px' }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--accent-primary)', marginBottom: '4px' }}>
                        Subject: {q.subject}
                      </div>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', margin: 0, lineHeight: '1.4' }}>
                        "{q.message}"
                      </p>
                    </div>

                    {/* Quick Response Actions */}
                    <div className="flex gap-2 flex-wrap">
                      <a
                        href={`mailto:${q.email}?subject=Re: ${encodeURIComponent(q.subject)} — TeeVerse Support`}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-secondary btn-sm"
                        style={{ fontSize: '0.75rem', padding: '4px 12px' }}
                      >
                        ✉️ Reply via Email ({q.email})
                      </a>

                      {q.phone && (
                        <a
                          href={`https://wa.me/91${q.phone.replace(/[^0-9]/g, '')}?text=Hi%20${encodeURIComponent(q.name)},%20regarding%20your%20query%20on%20TeeVerse:%20`}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-secondary btn-sm"
                          style={{ fontSize: '0.75rem', padding: '4px 12px' }}
                        >
                          💬 Reply via WhatsApp (+91 {q.phone})
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Modal: Create & Edit Product */}
        {showModal && (
          <div className="modal-overlay animate-fadeIn" style={{ display: 'flex' }}>
            <div className="modal-content animate-scaleIn" style={{ maxWidth: '600px', width: '100%', padding: '32px' }}>
              <div className="flex justify-between items-center mb-4">
                <h3 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--accent-primary)' }}>
                  {editingProduct ? `✏️ EDIT PRODUCT #${editingProduct.id}` : '➕ CREATE NEW PRODUCT'}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSaveProduct}>
                <div className="form-group mb-3">
                  <label className="form-label">Product Name *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Cyberpunk Samurai Drop Shoulder Tee"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }} className="mb-3">
                  <div className="form-group">
                    <label className="form-label">Category *</label>
                    <select
                      className="form-input"
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                    >
                      {categories.filter((c) => c.id !== 'all').map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Selling Price (₹) *</label>
                    <input
                      type="number"
                      className="form-input"
                      placeholder="899"
                      value={form.price}
                      onChange={(e) => setForm({ ...form, price: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Original MRP (₹)</label>
                    <input
                      type="number"
                      className="form-input"
                      placeholder="1499"
                      value={form.mrp}
                      onChange={(e) => setForm({ ...form, mrp: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-input"
                    rows={3}
                    placeholder="220 GSM combed cotton..."
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                  />
                </div>

                <div className="form-group mb-3">
                  <label className="form-label">
                    Product Image URLs / View Angles * (1 URL or View Label per line)
                  </label>
                  <textarea
                    className="form-input"
                    rows={3}
                    placeholder="https://example.com/front.jpg&#10;https://example.com/back.jpg&#10;https://example.com/detail.jpg"
                    value={form.imageUrlsText}
                    onChange={(e) => setForm({ ...form, imageUrlsText: e.target.value })}
                  />

                  {/* Multiple Local Photo Uploads */}
                  <div style={{ marginTop: '12px', marginBottom: '12px' }}>
                    <label className="form-label" style={{ fontSize: '0.8rem', color: 'var(--accent-primary)' }}>
                      📤 UPLOAD LOCAL PHOTOS (Multiple supported)
                    </label>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="form-input"
                      style={{ padding: '8px', fontSize: '0.8rem', background: 'rgba(255,255,255,0.03)' }}
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        if (files.length === 0) return;
                        
                        const promises = files.map((file) => {
                          return new Promise((resolve) => {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              resolve(reader.result);
                            };
                            reader.readAsDataURL(file);
                          });
                        });

                        Promise.all(promises).then((base64Strings) => {
                          setForm((prev) => {
                            const lines = prev.imageUrlsText.split('\n').map((s) => s.trim()).filter(Boolean);
                            // Keep only valid URLs or existing Base64 strings, discarding placeholder text labels
                            const realImages = lines.filter((line) => line.startsWith('http') || line.startsWith('data:image'));
                            const newText = [...realImages, ...base64Strings].join('\n');
                            return {
                              ...prev,
                              imageUrlsText: newText,
                            };
                          });
                          showToast(`${files.length} photo(s) converted & loaded! 📸`, 'success');
                        });
                      }}
                    />
                  </div>

                  {/* Render Thumbnail Previews of Loaded/Uploaded Photos */}
                  {(() => {
                    const urls = form.imageUrlsText.split('\n').map((s) => s.trim()).filter((s) => s.startsWith('http') || s.startsWith('data:image'));
                    if (urls.length === 0) return null;
                    return (
                      <div style={{ marginTop: '12px' }}>
                        <div className="form-label" style={{ fontSize: '0.75rem', marginBottom: '6px' }}>Uploaded Photo Previews:</div>
                        <div className="flex gap-2 flex-wrap" style={{ maxHeight: '180px', overflowY: 'auto', padding: '4px', border: '1px solid var(--border)', borderRadius: '8px', background: 'rgba(0,0,0,0.1)' }}>
                          {urls.map((url, idx) => (
                            <div key={idx} style={{ width: '60px', height: '75px', borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--border)', position: 'relative' }}>
                              <img src={url} alt="upload preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              <button
                                type="button"
                                onClick={() => {
                                  const lines = form.imageUrlsText.split('\n').map((s) => s.trim());
                                  let matchIdx = 0;
                                  const filtered = lines.filter((line) => {
                                    if (line.startsWith('http') || line.startsWith('data:image')) {
                                      const match = matchIdx === idx;
                                      matchIdx++;
                                      return !match;
                                    }
                                    return true;
                                  });
                                  setForm({ ...form, imageUrlsText: filtered.join('\n') });
                                }}
                                style={{
                                  position: 'absolute',
                                  top: '2px',
                                  right: '2px',
                                  background: 'rgba(255, 0, 0, 0.8)',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '50%',
                                  width: '18px',
                                  height: '18px',
                                  fontSize: '10px',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontWeight: 'bold',
                                }}
                                title="Remove photo"
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })()}

                  <div className="text-muted mt-1" style={{ fontSize: '0.75rem' }}>
                    💡 Enter web image URLs or upload local files. Multiple images will enable a product slider!
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="mb-4">
                  <div className="form-group">
                    <label className="form-label">Fit Style</label>
                    <select
                      className="form-input"
                      value={form.fit}
                      onChange={(e) => setForm({ ...form, fit: e.target.value })}
                    >
                      <option value="Regular Fit">Regular Fit</option>
                      <option value="Relaxed Fit">Relaxed Fit</option>
                      <option value="Oversized Fit">Oversized Fit</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Stock Status</label>
                    <select
                      className="form-input"
                      value={form.inStock ? 'true' : 'false'}
                      onChange={(e) => setForm({ ...form, inStock: e.target.value === 'true' })}
                    >
                      <option value="true">✓ In Stock</option>
                      <option value="false">✕ Out of Stock</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 justify-end mt-6">
                  <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>
                    CANCEL
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingProduct ? 'UPDATE PRODUCT' : 'CREATE PRODUCT'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
