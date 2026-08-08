import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ShieldAlert, Lock, Eye, EyeOff } from 'lucide-react';

export const AdminLoginView = () => {
  const { adminLogin, isAdminLoggedIn, navigateTo } = useStore();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  if (isAdminLoggedIn) {
    navigateTo('admin');
    return null;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    adminLogin(username, password);
  };

  return (
    <div className="section-padding animate-fadeIn" style={{ paddingTop: '120px', minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
      <div className="container" style={{ maxWidth: '420px' }}>
        <div style={{ background: 'var(--bg-card)', padding: '36px 28px', borderRadius: '16px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-lg)' }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <ShieldAlert size={48} color="var(--accent-primary)" style={{ margin: '0 auto 12px' }} />
            <h2 style={{ fontSize: '1.6rem' }}>STORE OWNER LOGIN</h2>
            <p className="text-muted mt-1" style={{ fontSize: '0.85rem' }}>
              Restricted area for TeeVerse business admin only.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Owner Admin Email</label>
              <input
                type="email"
                className="form-input"
                placeholder="teenesttt@gmail.com"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Admin Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div style={{ background: 'rgba(255, 45, 45, 0.08)', padding: '10px', borderRadius: '6px', border: '1px solid rgba(255,45,45,0.2)', fontSize: '0.75rem', color: 'var(--accent-secondary)', marginBottom: '16px' }}>
              🔒 Customers cannot login here. Access is restricted exclusively to the website owner.
            </div>

            <button type="submit" className="btn btn-primary btn-block">
              LOGIN TO ADMIN DASHBOARD
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <span className="text-muted" style={{ fontSize: '0.8rem', cursor: 'pointer' }} onClick={() => navigateTo('home')}>
              ← Back to Store Front
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
