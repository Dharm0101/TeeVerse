import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Package, Search, CheckCircle2, Truck, MapPin } from 'lucide-react';

export const OrderTrackingView = () => {
  const { trackingOrderId, orders, navigateTo } = useStore();
  const [inputVal, setInputVal] = useState(trackingOrderId || '');

  const order = orders.find((o) => o.orderId.toUpperCase() === inputVal.trim().toUpperCase());

  const steps = [
    { label: 'Order Placed', done: true },
    { label: 'Confirmed', done: true },
    { label: 'Shipped', done: order?.status === 'shipped' || order?.status === 'out-for-delivery' || order?.status === 'delivered' },
    { label: 'Out for Delivery', done: order?.status === 'out-for-delivery' || order?.status === 'delivered' },
    { label: 'Delivered', done: order?.status === 'delivered' },
  ];

  return (
    <div className="section-padding animate-fadeIn" style={{ paddingTop: '100px' }}>
      <div className="container" style={{ maxWidth: '750px' }}>
        <div style={{ textAlignment: 'center', marginBottom: '32px', textAlign: 'center' }}>
          <Package size={48} className="text-accent" style={{ margin: '0 auto 12px' }} />
          <h2>TRACK YOUR ORDER</h2>
          <p className="text-muted" style={{ fontSize: '0.9rem' }}>Enter your Order ID (e.g. TV-ABC123) to see live delivery status</p>
        </div>

        {/* Input Bar */}
        <div className="flex gap-2 mb-8" style={{ maxWidth: '480px', margin: '0 auto 32px' }}>
          <input
            type="text"
            className="form-input"
            placeholder="Enter Order ID..."
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value.toUpperCase())}
          />
        </div>

        {order ? (
          <div style={{ background: 'var(--bg-card)', padding: '32px', borderRadius: '16px', border: '1px solid var(--border)' }}>
            <div className="flex justify-between items-center mb-6 flex-wrap gap-2">
              <div>
                <h3 style={{ fontSize: '1.2rem' }}>Order ID: {order.orderId}</h3>
                <div className="text-muted" style={{ fontSize: '0.85rem' }}>
                  Placed on: {new Date(order.date).toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })}
                </div>
              </div>
              <span className="category-pill" style={{ color: 'var(--success)', background: 'rgba(0,230,118,0.1)' }}>
                {order.status.toUpperCase()}
              </span>
            </div>

            {/* Visual Timeline */}
            <div style={{ display: 'flex', justifySelf: 'center', justifyContent: 'space-between', margin: '32px 0', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '16px', left: 0, right: 0, height: '2px', background: 'var(--border)', zIndex: 0 }} />

              {steps.map((st, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', zIndex: 1 }}>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: st.done ? 'var(--accent-primary)' : 'var(--bg-card)',
                      border: st.done ? '2px solid var(--accent-primary)' : '1px solid var(--border)',
                      color: st.done ? 'var(--bg-primary)' : 'var(--text-secondary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      fontSize: '0.8rem',
                    }}
                  >
                    {st.done ? '✓' : i + 1}
                  </div>
                  <span style={{ fontSize: '0.75rem', color: st.done ? 'var(--text-primary)' : 'var(--text-secondary)', textAlign: 'center', maxWidth: '80px' }}>
                    {st.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Delivery Partner Details & Delivery OTP Section */}
            {(order.status === 'out-for-delivery' || order.status === 'delivered' || true) && (
              <div
                style={{
                  background: 'linear-gradient(135deg, #1f2400 0%, #1a1a1a 100%)',
                  border: '1px solid var(--accent-primary)',
                  padding: '24px',
                  borderRadius: '12px',
                  marginBottom: '20px',
                }}
              >
                <div className="flex justify-between items-center mb-3 flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <Truck color="var(--accent-primary)" size={24} />
                    <h4 style={{ fontSize: '1.05rem', margin: 0 }}>DELIVERY PARTNER ASSIGNED</h4>
                  </div>
                  <span className="category-pill" style={{ fontSize: '0.7rem', padding: '2px 8px' }}>
                    {order.status === 'out-for-delivery' ? 'OUT FOR DELIVERY 🚚' : 'PARCEL IN TRANSIT 📦'}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="mb-4">
                  <div>
                    <div className="text-muted" style={{ fontSize: '0.75rem' }}>DELIVERY EXECUTIVE</div>
                    <strong style={{ fontSize: '0.95rem' }}>{order.partnerName || 'Ramesh Kumar'}</strong>
                    <div style={{ marginTop: '4px' }}>
                      <a
                        href={`tel:${order.partnerPhone || '9558613440'}`}
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '2px 8px', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                      >
                        📞 Call Driver (+91 {order.partnerPhone || '9558613440'})
                      </a>
                    </div>
                  </div>

                  <div>
                    <div className="text-muted" style={{ fontSize: '0.75rem' }}>COURIER & AWB CODE</div>
                    <strong style={{ fontSize: '0.95rem' }}>{order.courier || 'BlueDart Express'}</strong>
                    <div className="text-muted" style={{ fontSize: '0.8rem' }}>AWB: {order.awb || 'BLUEDART-88492019'}</div>
                  </div>
                </div>

                {/* Secure Delivery OTP Box */}
                <div style={{ background: 'rgba(0,0,0,0.5)', padding: '16px', borderRadius: '8px', border: '1px dashed var(--accent-primary)', textAlign: 'center' }}>
                  <div className="text-accent" style={{ fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    🔒 SECURE PARCEL VERIFICATION OTP FOR DELIVERY
                  </div>
                  <div style={{ fontSize: '2.2rem', fontFamily: 'var(--font-heading)', color: 'var(--accent-primary)', letterSpacing: '6px', margin: '4px 0' }}>
                    {order.deliveryOtp || '4921'}
                  </div>
                  <div className="text-muted" style={{ fontSize: '0.78rem' }}>
                    Share this 4-digit OTP with your delivery executive (<strong>{order.partnerName || 'Ramesh Kumar'}</strong>) upon parcel arrival at your doorstep to receive your shipment.
                  </div>
                </div>
              </div>
            )}

            <div style={{ background: 'var(--bg-primary)', padding: '16px', borderRadius: '8px', fontSize: '0.85rem' }}>
              <div><strong>Recipient:</strong> {order.shipping.name}</div>
              <div className="text-muted">{order.shipping.address}, {order.shipping.city}, {order.shipping.state} - {order.shipping.pincode}</div>
            </div>
          </div>
        ) : (
          inputVal.trim() !== '' && (
            <div style={{ textAlign: 'center', padding: '32px', background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
              No order found matching "{inputVal}". Check the ID or place a new order.
            </div>
          )
        )}
      </div>
    </div>
  );
};
