import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';

export const AuthModal = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, customerLogin, adminLogin, showToast } = useStore();
  const [tab, setTab] = useState('login'); // login | signup | otp
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '']);
  const [showGooglePicker, setShowGooglePicker] = useState(false);
  const [googleEmailInput, setGoogleEmailInput] = useState('');

  if (!isAuthModalOpen) return null;

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Please enter both email and password', 'error');
      return;
    }

    const cleanInput = email.toLowerCase().trim();
    const adminIdentifiers = ['teenesttt@gmail.com', 'admin@teeverse.in', 'admin'];

    if (adminIdentifiers.includes(cleanInput)) {
      const success = adminLogin(cleanInput, password);
      if (success) {
        setIsAuthModalOpen(false);
      }
      return;
    }

    customerLogin(email, password);
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Please fill all fields', 'error');
      return;
    }
    setTab('otp');
    showToast('OTP sent to your email / mobile (Simulated)', 'info');
  };

  const handleOtpVerify = (e) => {
    e.preventDefault();
    customerLogin(email, 'otp_logged_in');
  };

  const handleGoogleSignIn = (e) => {
    e.preventDefault();
    if (!googleEmailInput || !googleEmailInput.includes('@')) {
      showToast('Please enter your valid Google Email ID', 'error');
      return;
    }

    const cleanEmail = googleEmailInput.toLowerCase().trim();
    const adminIdentifiers = ['teenesttt@gmail.com', 'admin@teeverse.in', 'admin'];

    if (adminIdentifiers.includes(cleanEmail)) {
      setShowGooglePicker(false);
      const success = adminLogin(cleanEmail, 'TeeVerse@2026');
      if (success) {
        setIsAuthModalOpen(false);
      }
      return;
    }

    setShowGooglePicker(false);
    customerLogin(cleanEmail, 'google_oauth');
    showToast(`Signed in with Google as ${cleanEmail} 🚀`, 'success');
  };

  return (
    <div className="modal">
      <div className="modal-content animate-scaleIn" style={{ padding: '32px', position: 'relative' }}>
        <button
          className="modal-close"
          onClick={() => {
            setIsAuthModalOpen(false);
            setShowGooglePicker(false);
          }}
          style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
        >
          <X size={22} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.6rem' }}>
            <span className="text-accent">TEEVERSE</span> ACCOUNT
          </h2>
          <p className="text-muted" style={{ fontSize: '0.85rem' }}>
            Join the streets for exclusive drops & discounts
          </p>
        </div>

        {showGooglePicker ? (
          /* Clean Google Sign-In Input for Customer's own Google ID */
          <div className="animate-fadeIn" style={{ padding: '8px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '16px' }}>
              <svg width="24" height="24" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.26v3.15C3.25 21.3 7.31 24 12 24z"/>
                <path fill="#FBBC05" d="M5.28 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.26C.46 8.23 0 10.06 0 12s.46 3.77 1.26 5.39l4.02-3.15z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.7 1.26 6.61l4.02 3.15c.95-2.85 3.6-4.96 6.72-4.96z"/>
              </svg>
              <h3 style={{ fontSize: '1.2rem' }}>Sign in with Google</h3>
            </div>
            
            <p className="text-muted text-center mb-4" style={{ fontSize: '0.85rem' }}>
              Enter your Google Gmail ID to continue to TeeVerse
            </p>

            <form onSubmit={handleGoogleSignIn}>
              <div className="form-group mb-4">
                <label className="form-label">Your Google Email ID</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="name@gmail.com"
                  value={googleEmailInput}
                  onChange={(e) => setGoogleEmailInput(e.target.value)}
                  autoFocus
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary btn-block">
                SIGN IN WITH GOOGLE <ArrowRight size={18} />
              </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: '16px' }}>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => setShowGooglePicker(false)}
              >
                ← Back to standard login
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Google Sign In Button */}
            <button
              type="button"
              onClick={() => setShowGooglePicker(true)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                padding: '12px',
                background: '#ffffff',
                color: '#333333',
                border: '1px solid #dddddd',
                borderRadius: '8px',
                fontWeight: '600',
                fontSize: '0.9rem',
                cursor: 'pointer',
                marginBottom: '20px',
                transition: 'transform 0.2s ease',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.26v3.15C3.25 21.3 7.31 24 12 24z"/>
                <path fill="#FBBC05" d="M5.28 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.26C.46 8.23 0 10.06 0 12s.46 3.77 1.26 5.39l4.02-3.15z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.7 1.26 6.61l4.02 3.15c.95-2.85 3.6-4.96 6.72-4.96z"/>
              </svg>
              Continue with Google
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
              <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
              <span>OR EMAIL / MOBILE</span>
              <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
            </div>

            {/* Tabs */}
            {tab !== 'otp' && (
              <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', marginBottom: '24px' }}>
                <button
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: 'none',
                    border: 'none',
                    color: tab === 'login' ? 'var(--accent-primary)' : 'var(--text-secondary)',
                    borderBottom: tab === 'login' ? '2px solid var(--accent-primary)' : 'none',
                    fontFamily: 'var(--font-heading)',
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                  }}
                  onClick={() => setTab('login')}
                >
                  LOGIN
                </button>
                <button
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: 'none',
                    border: 'none',
                    color: tab === 'signup' ? 'var(--accent-primary)' : 'var(--text-secondary)',
                    borderBottom: tab === 'signup' ? '2px solid var(--accent-primary)' : 'none',
                    fontFamily: 'var(--font-heading)',
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                  }}
                  onClick={() => setTab('signup')}
                >
                  SIGN UP
                </button>
              </div>
            )}

            {tab === 'login' && (
              <form onSubmit={handleLoginSubmit}>
                <div className="form-group">
                  <label className="form-label">Email Address / Mobile</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. customer@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Password</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="form-input"
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-secondary)',
                        cursor: 'pointer',
                      }}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <button type="submit" className="btn btn-primary btn-block mt-4">
                  LOG IN
                </button>
              </form>
            )}

            {tab === 'signup' && (
              <form onSubmit={handleSignupSubmit}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input type="text" className="form-input" placeholder="e.g. Rohan Sharma" required />
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="e.g. rohan@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Create Password</label>
                  <input
                    type="password"
                    className="form-input"
                    placeholder="At least 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary btn-block mt-4">
                  CONTINUE WITH OTP
                </button>
              </form>
            )}

            {tab === 'otp' && (
              <form onSubmit={handleOtpVerify}>
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                  <Lock size={32} color="var(--accent-primary)" style={{ margin: '0 auto 8px' }} />
                  <h4>Enter 4-Digit OTP</h4>
                  <p className="text-muted" style={{ fontSize: '0.8rem' }}>
                    Sent to {email}
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '24px' }}>
                  {[0, 1, 2, 3].map((idx) => (
                    <input
                      key={idx}
                      type="text"
                      maxLength={1}
                      style={{
                        width: '48px',
                        height: '48px',
                        textAlign: 'center',
                        fontSize: '1.4rem',
                        fontWeight: 'bold',
                        background: 'var(--bg-primary)',
                        border: '1px solid var(--border)',
                        borderRadius: '8px',
                        color: 'var(--text-primary)',
                      }}
                      value={otp[idx]}
                      onChange={(e) => {
                        const val = e.target.value;
                        const next = [...otp];
                        next[idx] = val;
                        setOtp(next);
                      }}
                    />
                  ))}
                </div>

                <button type="submit" className="btn btn-primary btn-block">
                  VERIFY & LOGIN
                </button>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
};
