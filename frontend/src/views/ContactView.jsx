import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, MessageSquare } from 'lucide-react';
import { API_BASE_URL } from '../services/emailService';

export const ContactView = () => {
  const { showToast, addContactQuery } = useStore();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Order Status Inquiry',
    message: '',
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      showToast('Please complete all required fields (*)', 'error');
      return;
    }

    setLoading(true);
    addContactQuery(formData);

    try {
      await fetch(`${API_BASE_URL}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
    } catch (err) {
      console.log('Contact API Note:', err.message);
    }

    setLoading(false);
    setIsSubmitted(true);
    showToast('Message Sent! Email alert sent to teenesttt@gmail.com 📧', 'success');
  };

  return (
    <div className="section-padding animate-fadeIn" style={{ paddingTop: '110px' }}>
      <div className="container" style={{ maxWidth: '1000px' }}>
        {/* Page Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }} className="scroll-reveal">
          <span className="btn btn-sm btn-primary mb-3" style={{ pointerEvents: 'none' }}>
            <MessageSquare size={14} /> WE ARE HERE TO HELP
          </span>
          <h1 className="glitch-hover" style={{ fontSize: '2.8rem', marginBottom: '12px' }}>
            GET IN <span className="text-accent">TOUCH</span>
          </h1>
          <p className="text-muted" style={{ fontSize: '1rem', maxWidth: '600px', margin: '0 auto' }}>
            Have a question about sizing, custom streetwear orders, or your current package? Drop us a message below!
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: '36px' }} id="contact-grid">
          {/* Contact Details Card */}
          <div className="scroll-reveal-left">
            <div
              style={{
                background: 'var(--bg-card)',
                padding: '32px',
                borderRadius: '16px',
                border: '1px solid var(--border)',
                height: '100%',
              }}
            >
              <h3 style={{ fontSize: '1.4rem', marginBottom: '24px' }}>CONTACT INFORMATION</h3>

              <div className="flex flex-col gap-5">
                <div className="flex items-start gap-4">
                  <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(205, 255, 0, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Mail size={20} color="var(--accent-primary)" />
                  </div>
                  <div>
                    <strong style={{ fontSize: '0.95rem' }}>Customer Support Email</strong>
                    <div className="text-muted" style={{ fontSize: '0.85rem' }}>support@teeverse.in</div>
                    <div className="text-muted" style={{ fontSize: '0.85rem' }}>teenesttt@gmail.com (Owner)</div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(205, 255, 0, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Phone size={20} color="var(--accent-primary)" />
                  </div>
                  <div>
                    <strong style={{ fontSize: '0.95rem' }}>Phone & WhatsApp Support</strong>
                    <div className="text-muted" style={{ fontSize: '0.85rem' }}>+91 95586 13440 (Mon-Sat)</div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(205, 255, 0, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Clock size={20} color="var(--accent-primary)" />
                  </div>
                  <div>
                    <strong style={{ fontSize: '0.95rem' }}>Support Hours</strong>
                    <div className="text-muted" style={{ fontSize: '0.85rem' }}>Monday – Saturday: 10:00 AM – 8:00 PM IST</div>
                    <div className="text-muted" style={{ fontSize: '0.85rem' }}>Sunday: Closed (Email response within 24h)</div>
                  </div>
                </div>
              </div>

              {/* Direct WhatsApp Pill */}
              <div className="mt-6 pt-6" style={{ borderTop: '1px solid var(--border)' }}>
                <a
                  href="https://wa.me/919558613440"
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-secondary btn-block"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  💬 CHAT ON WHATSAPP (+91 95586 13440)
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="scroll-reveal-right">
            <div style={{ background: 'var(--bg-card)', padding: '32px', borderRadius: '16px', border: '1px solid var(--border)' }}>
              {isSubmitted ? (
                <div style={{ textAlign: 'center', padding: '40px 16px' }} className="animate-scaleIn">
                  <CheckCircle2 size={64} color="var(--success)" style={{ margin: '0 auto 16px' }} />
                  <h3 style={{ fontSize: '1.8rem', marginBottom: '8px' }}>MESSAGE SENT!</h3>
                  <p className="text-muted mb-6" style={{ fontSize: '0.95rem' }}>
                    Thank you for reaching out to TeeVerse. Our team has received your query and will reply to <strong>{formData.email}</strong> within 2-4 hours.
                  </p>
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      setIsSubmitted(false);
                      setFormData({ name: '', email: '', phone: '', subject: 'Order Status Inquiry', message: '' });
                    }}
                  >
                    SEND ANOTHER MESSAGE
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <h3 style={{ fontSize: '1.4rem', marginBottom: '20px' }}>SEND US A MESSAGE</h3>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div className="form-group">
                      <label className="form-label">Full Name *</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g. Aarav Patel"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Mobile Number</label>
                      <input
                        type="tel"
                        className="form-input"
                        placeholder="10-digit number"
                        maxLength={10}
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Email Address *</label>
                    <input
                      type="email"
                      className="form-input"
                      placeholder="aarav@gmail.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Query Subject *</label>
                    <select
                      className="form-input"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    >
                      <option value="Order Status Inquiry">Order Status & Tracking</option>
                      <option value="Size & Fit Assistance">Size & Fit Assistance</option>
                      <option value="Return & Exchange Request">Return & Exchange Request</option>
                      <option value="Business & Bulk Orders">Business & Wholesale Orders</option>
                      <option value="General Inquiry">General Inquiry</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Your Message *</label>
                    <textarea
                      className="form-input"
                      rows={5}
                      placeholder="Tell us how we can help you..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                      style={{ resize: 'vertical' }}
                    />
                  </div>

                  <button type="submit" className="btn btn-primary btn-block btn-lg hover-shine mt-4" disabled={loading}>
                    {loading ? 'SENDING...' : 'SEND MESSAGE'} <Send size={18} />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
