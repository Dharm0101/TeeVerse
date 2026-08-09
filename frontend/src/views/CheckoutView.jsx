import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { indianStates, pincodeData } from '../data/mockData';
import { API_BASE_URL, emailService } from '../services/emailService';
import { CheckCircle2, ShieldCheck, Truck, CreditCard, QrCode, Mail, Clock, RefreshCw, Copy, Check, Plus, MapPin, Trash2 } from 'lucide-react';

const STORE_UPI_ID = localStorage.getItem('teeverse_store_upi_id') || '9558613440@paytm';
const CUSTOM_QR_IMAGE = localStorage.getItem('teeverse_custom_qr_code') || null;

export const CheckoutView = () => {
  const {
    cartItems,
    getCartTotals,
    setOrders,
    navigateTo,
    showToast,
    savedAddresses,
    addSavedAddress,
    removeSavedAddress,
    clearCart,
  } = useStore();

  const [step, setStep] = useState(1); // 1: Shipping, 2: Delivery, 3: Payment, 4: Confirmation
  
  // Saved Address selection state (Amazon Style)
  const [selectedAddressId, setSelectedAddressId] = useState(() => {
    const def = savedAddresses.find((a) => a.isDefault) || savedAddresses[0];
    return def ? def.id : 'new';
  });

  const [isAddingNewAddr, setIsAddingNewAddr] = useState(savedAddresses.length === 0);
  const [addressTag, setAddressTag] = useState('Home 🏠');
  const [saveForFuture, setSaveForFuture] = useState(true);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    pincode: '',
    city: '',
    state: 'Gujarat',
  });

  // Sync selected saved address into formData
  useEffect(() => {
    if (selectedAddressId && selectedAddressId !== 'new') {
      const found = savedAddresses.find((a) => a.id === selectedAddressId);
      if (found) {
        setFormData({
          name: found.name,
          phone: found.phone,
          email: found.email || '',
          address: found.address,
          pincode: found.pincode,
          city: found.city,
          state: found.state,
        });
        setIsAddingNewAddr(false);
      }
    } else if (selectedAddressId === 'new') {
      setIsAddingNewAddr(true);
    }
  }, [selectedAddressId, savedAddresses]);

  const handleRemoveAddress = (e, addrId) => {
    e.stopPropagation();
    removeSavedAddress(addrId);
    if (selectedAddressId === addrId) {
      const remaining = savedAddresses.filter((a) => a.id !== addrId);
      if (remaining.length > 0) {
        const nextDef = remaining.find((a) => a.isDefault) || remaining[0];
        setSelectedAddressId(nextDef.id);
      } else {
        setSelectedAddressId('new');
        setIsAddingNewAddr(true);
        setFormData({ name: '', phone: '', email: '', address: '', pincode: '', city: '', state: 'Gujarat' });
      }
    }
  };

  const [deliveryOption, setDeliveryOption] = useState('standard'); // standard | express
  const [paymentMethod, setPaymentMethod] = useState('upi'); // upi | card | netbanking
  const [upiId, setUpiId] = useState('');
  const [paymentScreenshot, setPaymentScreenshot] = useState(null);

  // 4-Minute UPI Timer State
  const [upiTimer, setUpiTimer] = useState(240); // 240 seconds = 4 minutes
  const [isUpiExpired, setIsUpiExpired] = useState(false);
  const [isVerifyingUpi, setIsVerifyingUpi] = useState(false);
  const [copiedVpa, setCopiedVpa] = useState(false);

  const [createdOrder, setCreatedOrder] = useState(null);

  const totals = getCartTotals(formData.state);
  const extraExpressFee = deliveryOption === 'express' ? 149 : 0;
  const finalShipping = totals.shipping + extraExpressFee;
  const grandTotal = totals.subtotal - totals.discountAmount + finalShipping;

  // 4-Minute Timer Effect
  useEffect(() => {
    let interval = null;
    if (step === 3 && paymentMethod === 'upi' && upiTimer > 0 && !isUpiExpired) {
      interval = setInterval(() => {
        setUpiTimer((prev) => {
          if (prev <= 1) {
            setIsUpiExpired(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [step, paymentMethod, upiTimer, isUpiExpired]);

  const resetUpiTimer = () => {
    setUpiTimer(240);
    setIsUpiExpired(false);
    setIsVerifyingUpi(false);
    showToast('UPI QR Code Refreshed — 4 Minute Timer Restarted', 'info');
  };

  const handleCopyVpa = () => {
    navigator.clipboard.writeText(STORE_UPI_ID);
    setCopiedVpa(true);
    showToast(`UPI VPA copied: ${STORE_UPI_ID}`, 'success');
    setTimeout(() => setCopiedVpa(false), 2500);
  };

  const handlePincodeAutoFill = (val) => {
    setFormData((prev) => ({ ...prev, pincode: val }));
    if (val.length >= 3) {
      const prefix = val.substring(0, 3);
      const found = pincodeData[prefix];
      if (found) {
        setFormData((prev) => ({ ...prev, city: found.city, state: found.state }));
      }
    }
  };

  const handleStep1Submit = (e) => {
    e.preventDefault();
    if (
      !formData.name.trim() ||
      !formData.phone.trim() ||
      !formData.email.trim() ||
      !formData.address.trim() ||
      !formData.pincode.trim() ||
      !formData.city.trim() ||
      !formData.state.trim()
    ) {
      showToast('All shipping & delivery fields are mandatory! Please complete all fields.', 'error');
      return;
    }

    if (formData.phone.trim().length < 10) {
      showToast('Please enter a valid 10-digit mobile number', 'error');
      return;
    }

    if (!formData.email.includes('@')) {
      showToast('Please enter a valid email address', 'error');
      return;
    }

    // Save new address if requested
    if (isAddingNewAddr && saveForFuture) {
      addSavedAddress({
        tag: addressTag,
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        pincode: formData.pincode,
        city: formData.city,
        state: formData.state,
      });
    }

    setStep(2);
  };

  const handlePlaceOrder = async () => {
    if (
      !formData.name ||
      !formData.phone ||
      !formData.email ||
      !formData.address ||
      !formData.pincode ||
      !formData.city ||
      !formData.state
    ) {
      showToast('All shipping & delivery fields are mandatory', 'error');
      setStep(1);
      return;
    }

    if (paymentMethod === 'upi' && isUpiExpired) {
      showToast('UPI session expired. Please refresh the QR code before placing order.', 'error');
      return;
    }

    if (!paymentScreenshot) {
      showToast('Please upload a screenshot of your payment / debited money transfer first!', 'error');
      return;
    }

    setIsVerifyingUpi(true);
    showToast('Submitting order details...', 'info');

    const orderId = 'TV-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    const deliveryOtp = Math.floor(1000 + Math.random() * 9000).toString();
    const newOrder = {
      orderId,
      date: new Date().toISOString(),
      items: cartItems,
      shipping: formData,
      deliveryOption,
      paymentMethod: paymentMethod === 'upi' ? 'UPI (Manual Review)' : 'CARD (Manual Review)',
      total: grandTotal,
      status: 'confirmed',
      deliveryOtp,
      paymentScreenshot: paymentScreenshot,
      partnerName: 'Ramesh Kumar',
      partnerPhone: '9558613440',
      courier: 'BlueDart Express',
      awb: 'BLUEDART-' + Math.floor(10000000 + Math.random() * 90000000),
    };

    try {
      // Save order to backend SQLite database
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder),
      });
      const json = await response.json();
      
      if (json.success) {
        setOrders((prev) => [json.order, ...prev]);
        setCreatedOrder(json.order);
        clearCart();
        setStep(4);
        showToast('Order confirmed! Proof of payment sent to verification 📧', 'success');
      } else {
        throw new Error(json.message);
      }
    } catch (err) {
      console.warn('Backend sync failed, saving locally:', err);
      setOrders((prev) => [newOrder, ...prev]);
      setCreatedOrder(newOrder);
      clearCart();
      setStep(4);
      showToast('Order placed successfully!', 'success');
    } finally {
      setIsVerifyingUpi(false);
    }
  };

  const compressImage = (file, maxWidth = 800, quality = 0.7) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', quality));
        };
        img.onerror = () => resolve(e.target.result);
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (cartItems.length === 0 && step !== 4) {
    return (
      <div className="section-padding text-center animate-fadeIn" style={{ paddingTop: '140px' }}>
        <h2>Your cart is empty</h2>
        <p className="text-muted mt-2 mb-6">Add items to your cart before proceeding to checkout.</p>
        <button className="btn btn-primary" onClick={() => navigateTo('shop')}>
          RETURN TO SHOP
        </button>
      </div>
    );
  }

  // Default to the custom uploaded QR code, otherwise fallback to the uploaded payment_qr.jpg file
  const qrImageUrl = CUSTOM_QR_IMAGE || '/payment_qr.jpg';

  return (
    <div className="section-padding animate-fadeIn" style={{ paddingTop: '100px' }}>
      <div className="container">
        {/* Step Progress Bar */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginBottom: '40px' }}>
          {['1. Shipping', '2. Delivery', '3. Payment'].map((label, idx) => {
            const stepNum = idx + 1;
            const isDone = step > stepNum || step === 4;
            const isActive = step === stepNum;
            return (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: isDone ? 'var(--accent-primary)' : isActive ? 'transparent' : 'var(--bg-card)',
                    border: isDone || isActive ? '2px solid var(--accent-primary)' : '1px solid var(--border)',
                    color: isDone ? 'var(--bg-primary)' : isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.85rem',
                  }}
                >
                  {isDone ? '✓' : stepNum}
                </span>
                <span style={{ fontSize: '0.85rem', fontWeight: isActive ? 'bold' : 'normal', color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                  {label}
                </span>
              </div>
            );
          })}
        </div>

        {step === 4 ? (
          /* Confirmation Screen */
          <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center', background: 'var(--bg-card)', padding: '48px 32px', borderRadius: '16px', border: '1px solid var(--border)' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(0, 230, 118, 0.1)', border: '2px solid var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <CheckCircle2 size={48} color="var(--success)" />
            </div>

            <span className="category-pill mb-2" style={{ background: 'rgba(205, 255, 0, 0.15)', color: 'var(--accent-primary)', border: '1px solid var(--accent-primary)', fontSize: '0.8rem', padding: '6px 16px' }}>
              ✓ PAYMENT SUBMITTED FOR REVIEW
            </span>

            <h1 style={{ fontSize: '2.2rem', margin: '12px 0 8px' }}>ORDER CONFIRMED!</h1>
            <p className="text-accent" style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '16px' }}>
              Order ID: {createdOrder?.orderId}
            </p>

            {/* Delivery Verification OTP Card */}
            <div
              style={{
                background: 'linear-gradient(135deg, #1f2400 0%, #1a1a1a 100%)',
                border: '1px solid var(--accent-primary)',
                padding: '20px',
                borderRadius: '12px',
                marginBottom: '20px',
                textAlign: 'center',
              }}
            >
              <div className="text-accent" style={{ fontSize: '0.85rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>
                🔒 SECURE PARCEL DELIVERY OTP
              </div>
              <div style={{ fontSize: '2.5rem', fontFamily: 'var(--font-heading)', color: 'var(--accent-primary)', letterSpacing: '8px', margin: '6px 0' }}>
                {createdOrder?.deliveryOtp || '4921'}
              </div>
              <div className="text-muted" style={{ fontSize: '0.8rem' }}>
                ⚠️ <strong>SHARE WITH DELIVERY EXECUTIVE ONLY AT DOORSTEP:</strong> Give this 4-digit OTP to your delivery partner (<strong>{createdOrder?.partnerName || 'Ramesh Kumar'}</strong>) upon parcel arrival to verify and receive your shipment.
              </div>
            </div>

            <div style={{ background: 'rgba(205, 255, 0, 0.08)', border: '1px solid rgba(205, 255, 0, 0.2)', padding: '12px 16px', borderRadius: '8px', fontSize: '0.85rem', color: 'var(--accent-primary)', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <Mail size={16} /> Order details & payment proof sent to owner (<strong>teenesttt@gmail.com</strong>) for review.
            </div>

            <div style={{ textAlign: 'left', background: 'var(--bg-primary)', padding: '20px', borderRadius: '10px', marginBottom: '24px', fontSize: '0.85rem' }}>
              <div className="flex justify-between mb-2" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>
                <span className="text-muted">Payment Status:</span>
                <span style={{ color: 'var(--warning)', fontWeight: 'bold' }}>PENDING MANUAL VERIFICATION</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-muted">Payment Method:</span>
                <strong>{createdOrder?.paymentMethod.toUpperCase()}</strong>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-muted">Total Paid:</span>
                <strong style={{ color: 'var(--accent-primary)', fontSize: '1rem' }}>₹{createdOrder?.total.toLocaleString('en-IN')}</strong>
              </div>
              <div className="mt-3 pt-2" style={{ borderTop: '1px solid var(--border)' }}>
                <strong>Deliver To:</strong> {createdOrder?.shipping.name}
                <div className="text-muted">{createdOrder?.shipping.address}, {createdOrder?.shipping.city}, {createdOrder?.shipping.state} - {createdOrder?.shipping.pincode}</div>
                <div className="text-muted">Mobile: +91 {createdOrder?.shipping.phone}</div>
              </div>
            </div>

            <div className="flex gap-3 justify-center">
              <button className="btn btn-primary" onClick={() => navigateTo('tracking', createdOrder?.orderId)}>
                TRACK ORDER
              </button>
              <button className="btn btn-secondary" onClick={() => navigateTo('shop')}>
                CONTINUE SHOPPING
              </button>
            </div>
          </div>
        ) : (
          /* Checkout Layout: Forms + Order Summary */
          <div className="checkout-layout-grid" id="checkout-layout-grid">
            <div>
              {step === 1 && (
                <div style={{ background: 'var(--bg-card)', padding: '32px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                  {/* Amazon Style Saved Address Selection */}
                  {savedAddresses.length > 0 && (
                    <div className="mb-6 pb-6" style={{ borderBottom: '1px solid var(--border)' }}>
                      <div className="flex justify-between items-center mb-4">
                        <h3 style={{ margin: 0, fontSize: '1.1rem' }}>SELECT A SAVED DELIVERY ADDRESS</h3>
                        <button
                          type="button"
                          className="btn btn-ghost btn-sm"
                          style={{ color: 'var(--accent-primary)', fontSize: '0.8rem' }}
                          onClick={() => {
                            setSelectedAddressId('new');
                            setIsAddingNewAddr(true);
                            setFormData({ name: '', phone: '', email: '', address: '', pincode: '', city: '', state: 'Gujarat' });
                          }}
                        >
                          <Plus size={14} /> Add New Address
                        </button>
                      </div>

                      <div className="flex flex-col gap-3">
                        {savedAddresses.map((addr) => {
                          const isSelected = selectedAddressId === addr.id && !isAddingNewAddr;
                          return (
                            <div
                              key={addr.id}
                              style={{
                                padding: '16px 20px',
                                borderRadius: '10px',
                                border: isSelected ? '2px solid var(--accent-primary)' : '1px solid var(--border)',
                                background: isSelected ? 'rgba(205, 255, 0, 0.03)' : 'var(--bg-primary)',
                                cursor: 'pointer',
                              }}
                              onClick={() => {
                                setSelectedAddressId(addr.id);
                                setIsAddingNewAddr(false);
                              }}
                            >
                              <div className="flex items-start gap-3">
                                <input
                                  type="radio"
                                  name="savedAddrRadio"
                                  checked={isSelected}
                                  onChange={() => {
                                    setSelectedAddressId(addr.id);
                                    setIsAddingNewAddr(false);
                                  }}
                                  style={{ marginTop: '4px' }}
                                />
                                <div style={{ flex: 1 }}>
                                  <div className="flex items-center gap-2 mb-1 justify-between">
                                    <div className="flex items-center gap-2">
                                      <strong style={{ fontSize: '0.95rem' }}>{addr.name}</strong>
                                      <span className="category-pill" style={{ fontSize: '0.7rem', padding: '2px 8px' }}>
                                        {addr.tag}
                                      </span>
                                      {addr.isDefault && (
                                        <span style={{ fontSize: '0.7rem', color: 'var(--accent-primary)', fontWeight: 'bold' }}>
                                          ✓ Default
                                        </span>
                                      )}
                                    </div>
                                    <button
                                      type="button"
                                      title="Remove address"
                                      style={{
                                        background: 'transparent',
                                        border: 'none',
                                        color: '#ff4d4d',
                                        cursor: 'pointer',
                                        padding: '4px 8px',
                                        borderRadius: '4px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px',
                                        fontSize: '0.75rem',
                                        fontWeight: 'bold',
                                      }}
                                      onClick={(e) => handleRemoveAddress(e, addr.id)}
                                    >
                                      <Trash2 size={13} /> Remove
                                    </button>
                                  </div>
                                  <div className="text-muted" style={{ fontSize: '0.85rem' }}>
                                    {addr.address}, {addr.city}, {addr.state} - {addr.pincode}
                                  </div>
                                  <div className="text-muted" style={{ fontSize: '0.8rem' }}>
                                    Phone: +91 {addr.phone}
                                  </div>

                                  {isSelected && (
                                    <button
                                      type="button"
                                      className="btn btn-primary btn-sm mt-3"
                                      onClick={() => setStep(2)}
                                    >
                                      DELIVER TO THIS ADDRESS →
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Add / Edit Custom Delivery Address Form */}
                  <form onSubmit={handleStep1Submit}>
                    <div className="flex justify-between items-center mb-4">
                      <h3 style={{ margin: 0, fontSize: '1.1rem' }}>
                        {isAddingNewAddr ? 'ADD A NEW DELIVERY ADDRESS' : 'OR EDIT SELECTED ADDRESS'}
                      </h3>
                      <span style={{ fontSize: '0.75rem', color: 'var(--accent-secondary)' }}>* ALL FIELDS MANDATORY</span>
                    </div>

                    {isAddingNewAddr && (
                      <div className="flex gap-4 mb-4">
                        {['Home 🏠', 'Work 💼', 'Other 📍'].map((t) => (
                          <label key={t} style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.85rem' }}>
                            <input
                              type="radio"
                              name="checkoutTag"
                              checked={addressTag === t}
                              onChange={() => setAddressTag(t)}
                            />
                            {t}
                          </label>
                        ))}
                      </div>
                    )}

                    <div className="form-group">
                      <label className="form-label">Full Name *</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g. Full Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div className="form-group">
                        <label className="form-label">Mobile Number *</label>
                        <input
                          type="tel"
                          className="form-input"
                          placeholder="10-digit number"
                          maxLength={10}
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Email Address *</label>
                        <input
                          type="email"
                          className="form-input"
                          placeholder="your.email@example.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Flat, House No., Building, Street Address *</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Address line 1, Building, Street"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        required
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                      <div className="form-group">
                        <label className="form-label">Pincode *</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="e.g. 400001"
                          maxLength={6}
                          value={formData.pincode}
                          onChange={(e) => handlePincodeAutoFill(e.target.value)}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">City *</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="City"
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">State *</label>
                        <select
                          className="form-input"
                          value={formData.state}
                          onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                          required
                        >
                          {indianStates.map((st) => (
                            <option key={st} value={st}>{st}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {isAddingNewAddr && (
                      <div className="mt-3 mb-3" style={{ fontSize: '0.85rem' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                          <input
                            type="checkbox"
                            checked={saveForFuture}
                            onChange={(e) => setSaveForFuture(e.target.checked)}
                          />
                          Save this delivery address to my address book for future orders
                        </label>
                      </div>
                    )}

                    <button type="submit" className="btn btn-primary btn-block mt-4">
                      CONTINUE TO DELIVERY OPTIONS
                    </button>
                  </form>
                </div>
              )}

              {step === 2 && (
                <div style={{ background: 'var(--bg-card)', padding: '32px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                  <h3 style={{ marginBottom: '20px' }}>SELECT DELIVERY SPEED</h3>

                  <div
                    style={{
                      padding: '20px',
                      borderRadius: '8px',
                      border: deliveryOption === 'standard' ? '2px solid var(--accent-primary)' : '1px solid var(--border)',
                      marginBottom: '16px',
                      cursor: 'pointer',
                      background: deliveryOption === 'standard' ? 'rgba(205, 255, 0, 0.03)' : 'transparent',
                    }}
                    onClick={() => setDeliveryOption('standard')}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <Truck size={24} color="var(--accent-primary)" />
                        <div>
                          <strong>Standard Pan-India Delivery</strong>
                          <div className="text-muted" style={{ fontSize: '0.8rem' }}>Delivery in 4-6 business days</div>
                        </div>
                      </div>
                      <span className="text-accent" style={{ fontWeight: 'bold' }}>
                        {totals.shipping === 0 ? 'FREE' : `₹${totals.shipping}`}
                      </span>
                    </div>
                  </div>

                  <div
                    style={{
                      padding: '20px',
                      borderRadius: '8px',
                      border: deliveryOption === 'express' ? '2px solid var(--accent-primary)' : '1px solid var(--border)',
                      marginBottom: '24px',
                      cursor: 'pointer',
                      background: deliveryOption === 'express' ? 'rgba(205, 255, 0, 0.03)' : 'transparent',
                    }}
                    onClick={() => setDeliveryOption('express')}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <Truck size={24} color="var(--warning)" />
                        <div>
                          <strong>Express Priority Air Shipping</strong>
                          <div className="text-muted" style={{ fontSize: '0.8rem' }}>Delivery in 2-3 business days</div>
                        </div>
                      </div>
                      <span style={{ fontWeight: 'bold' }}>₹149</span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button className="btn btn-ghost" onClick={() => setStep(1)}>Back</button>
                    <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => setStep(3)}>
                      CONTINUE TO PAYMENT
                    </button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div style={{ background: 'var(--bg-card)', padding: '32px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                  <h3 style={{ marginBottom: '20px' }}>SELECT PAYMENT METHOD</h3>

                  <div className="flex flex-col gap-3 mb-6">
                    {/* UPI Option */}
                    <div
                      style={{
                        padding: '16px',
                        borderRadius: '8px',
                        border: paymentMethod === 'upi' ? '2px solid var(--accent-primary)' : '1px solid var(--border)',
                        cursor: 'pointer',
                        background: paymentMethod === 'upi' ? 'rgba(205, 255, 0, 0.03)' : 'transparent',
                      }}
                      onClick={() => setPaymentMethod('upi')}
                    >
                      <div className="flex items-center gap-3">
                        <QrCode size={24} color="var(--accent-primary)" />
                        <div>
                          <strong>UPI Instant (GPay / PhonePe / Paytm / BHIM)</strong>
                          <div className="text-muted" style={{ fontSize: '0.8rem' }}>Scan QR Code or Enter UPI VPA · 4-Minute Session</div>
                        </div>
                      </div>

                      {paymentMethod === 'upi' && (
                        <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border)' }} onClick={(e) => e.stopPropagation()}>
                          {/* 4-Minute Timer Bar */}
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              background: isUpiExpired ? 'rgba(255, 45, 45, 0.1)' : (upiTimer < 60 ? 'rgba(255, 45, 45, 0.15)' : 'rgba(205, 255, 0, 0.1)'),
                              border: `1px solid ${isUpiExpired ? 'var(--accent-secondary)' : (upiTimer < 60 ? '#ff3333' : 'var(--accent-primary)')}`,
                              padding: '10px 16px',
                              borderRadius: '8px',
                              marginBottom: '20px',
                              animation: upiTimer < 60 && !isUpiExpired ? 'pulse 1.2s infinite alternate' : 'none',
                            }}
                          >
                            <div className="flex items-center gap-2">
                              <Clock size={18} color={isUpiExpired || upiTimer < 60 ? '#ff3333' : 'var(--accent-primary)'} className={upiTimer < 60 && !isUpiExpired ? 'animate-bounce' : ''} />
                              <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: isUpiExpired || upiTimer < 60 ? '#ff3333' : 'var(--text-primary)' }}>
                                {isUpiExpired ? 'UPI Session Expired' : (upiTimer < 60 ? '⚠️ Transfer Quickly! Timer expiring:' : 'UPI Payment Session Timer:')}
                              </span>
                            </div>
                            <span
                              style={{
                                fontFamily: 'var(--font-heading)',
                                fontSize: '1.2rem',
                                fontWeight: 'bold',
                                color: isUpiExpired || upiTimer < 60 ? '#ff3333' : 'var(--accent-primary)',
                              }}
                            >
                              {formatTime(upiTimer)}
                            </span>
                          </div>

                          {isUpiExpired ? (
                            /* Expired State */
                            <div style={{ textAlign: 'center', padding: '24px 0' }}>
                              <p className="text-danger mb-4" style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>
                                ⏰ 4-Minute Session Expired! Please refresh the QR code to proceed.
                              </p>
                              <button type="button" className="btn btn-secondary btn-sm" onClick={resetUpiTimer}>
                                <RefreshCw size={16} /> REFRESH UPI QR CODE
                              </button>
                            </div>
                          ) : (
                            /* Live QR Code & Copy VPA */
                            <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: '24px', alignItems: 'center' }}>
                              {/* QR Code Container */}
                              <div style={{ textAlign: 'center' }}>
                                <div
                                  style={{
                                    padding: '8px',
                                    background: 'var(--accent-primary)',
                                    borderRadius: '12px',
                                    display: 'inline-block',
                                    boxShadow: 'var(--shadow-glow)',
                                  }}
                                >
                                  <img src={qrImageUrl} alt="UPI Payment QR Code" style={{ width: '160px', height: '160px', borderRadius: '6px' }} />
                                </div>
                                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '6px' }}>Scan with any UPI App</div>
                              </div>

                              {/* VPA Details & Auto Verification */}
                              <div>
                                <div className="text-muted mb-1" style={{ fontSize: '0.8rem' }}>Payable UPI Amount:</div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--accent-primary)', fontFamily: 'var(--font-heading)' }}>
                                  ₹{grandTotal.toLocaleString('en-IN')}
                                </div>

                                <div className="mt-3 mb-2" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                  Merchant VPA ID:
                                </div>
                                <div className="flex items-center gap-2 mb-3">
                                  <code style={{ fontSize: '0.9rem', padding: '4px 10px', background: 'var(--bg-primary)' }}>{STORE_UPI_ID}</code>
                                  <button
                                    type="button"
                                    onClick={handleCopyVpa}
                                    style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', cursor: 'pointer' }}
                                    title="Copy VPA"
                                  >
                                    {copiedVpa ? <Check size={18} color="var(--success)" /> : <Copy size={18} />}
                                  </button>
                                </div>

                                {/* Screenshot Upload block */}
                                <div style={{ marginTop: '16px' }}>
                                  <label className="form-label" style={{ display: 'block', marginBottom: '8px', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase' }}>
                                    📸 Upload Payment Screenshot *
                                  </label>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
                                      {paymentScreenshot ? 'Change Screenshot' : 'Choose File'}
                                      <input
                                        type="file"
                                        accept="image/*"
                                        style={{ display: 'none' }}
                                        onChange={async (e) => {
                                          const file = e.target.files[0];
                                          if (file) {
                                            const compressed = await compressImage(file);
                                            setPaymentScreenshot(compressed);
                                            showToast('Payment screenshot attached! 📸', 'success');
                                          }
                                        }}
                                      />
                                    </label>
                                    {paymentScreenshot ? (
                                       <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                         <div style={{ position: 'relative', width: '50px', height: '50px', borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--accent-primary)' }}>
                                           <img src={paymentScreenshot} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                         </div>
                                         <span style={{ color: 'var(--success)', fontSize: '0.8rem', fontWeight: 'bold' }}>✓ Screenshot Attached</span>
                                       </div>
                                     ) : (
                                       <span style={{ color: 'var(--accent-secondary)', fontSize: '0.8rem', fontWeight: 'bold' }}>⚠️ Screenshot required to enable checkout</span>
                                     )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Card Option */}
                    <div
                      style={{
                        padding: '16px',
                        borderRadius: '8px',
                        border: paymentMethod === 'card' ? '2px solid var(--accent-primary)' : '1px solid var(--border)',
                        cursor: 'pointer',
                        background: paymentMethod === 'card' ? 'rgba(205, 255, 0, 0.03)' : 'transparent',
                      }}
                      onClick={() => setPaymentMethod('card')}
                    >
                      <div className="flex items-center gap-3">
                        <CreditCard size={24} color="var(--accent-primary)" />
                        <div>
                          <strong>Credit / Debit Card Transfer</strong>
                          <div className="text-muted" style={{ fontSize: '0.8rem' }}>Visa, Mastercard, RuPay, Maestro · Debited Proof Required</div>
                        </div>
                      </div>

                      {paymentMethod === 'card' && (
                        <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border)' }} onClick={(e) => e.stopPropagation()}>
                          <div className="text-muted mb-1" style={{ fontSize: '0.8rem' }}>Payable Amount:</div>
                          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--accent-primary)', fontFamily: 'var(--font-heading)', marginBottom: '12px' }}>
                            ₹{grandTotal.toLocaleString('en-IN')}
                          </div>

                          <div className="text-muted mb-3" style={{ fontSize: '0.82rem', lineHeight: '1.5' }}>
                            💳 Transfer amount via your card/netbanking to your account and upload the <strong>Debited Money Screenshot</strong> below to complete your checkout.
                          </div>

                          {/* Screenshot Upload block for Card */}
                          <div>
                            <label className="form-label" style={{ display: 'block', marginBottom: '8px', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase' }}>
                              📸 Upload Debited Money Screenshot *
                            </label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
                                {paymentScreenshot ? 'Change Screenshot' : 'Choose File'}
                                <input
                                  type="file"
                                  accept="image/*"
                                  style={{ display: 'none' }}
                                  onChange={async (e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                      const compressed = await compressImage(file);
                                      setPaymentScreenshot(compressed);
                                      showToast('Debited money screenshot attached! 📸', 'success');
                                    }
                                  }}
                                />
                              </label>
                              {paymentScreenshot ? (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <div style={{ position: 'relative', width: '50px', height: '50px', borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--accent-primary)' }}>
                                    <img src={paymentScreenshot} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                  </div>
                                  <span style={{ color: 'var(--success)', fontSize: '0.8rem', fontWeight: 'bold' }}>✓ Debit Proof Attached</span>
                                </div>
                              ) : (
                                <span style={{ color: 'var(--accent-secondary)', fontSize: '0.8rem', fontWeight: 'bold' }}>⚠️ Screenshot required to enable checkout</span>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button className="btn btn-ghost" onClick={() => setStep(2)}>Back</button>
                    <button
                      className="btn btn-primary"
                      style={{
                        flex: 1,
                        opacity: (!paymentScreenshot || (paymentMethod === 'upi' && isUpiExpired)) ? 0.5 : 1,
                        cursor: (!paymentScreenshot || (paymentMethod === 'upi' && isUpiExpired)) ? 'not-allowed' : 'pointer'
                      }}
                      onClick={handlePlaceOrder}
                      disabled={isVerifyingUpi || (paymentMethod === 'upi' && isUpiExpired) || !paymentScreenshot}
                    >
                      {isVerifyingUpi
                        ? 'VERIFYING PAYMENT...'
                        : !paymentScreenshot
                        ? '📸 UPLOAD DEBIT/PAYMENT SCREENSHOT TO PLACE ORDER'
                        : `VERIFY & COMPLETE PAYMENT — ₹${grandTotal.toLocaleString('en-IN')}`}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar Summary */}
            <div style={{ background: 'var(--bg-card)', padding: '24px', borderRadius: '12px', border: '1px solid var(--border)', height: 'fit-content' }}>
              <h4 style={{ marginBottom: '16px', fontSize: '1rem' }}>ORDER SUMMARY ({totals.totalItems})</h4>
              <div className="flex flex-col gap-2 mb-4">
                {cartItems.map((item, i) => (
                  <div key={i} className="flex justify-between text-muted" style={{ fontSize: '0.85rem' }}>
                    <span>{item.name} ({item.size}) × {item.quantity}</span>
                    <span>₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>

              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '12px', fontSize: '0.85rem' }}>
                <div className="flex justify-between mb-1"><span>Subtotal:</span><span>₹{totals.subtotal.toLocaleString('en-IN')}</span></div>
                {totals.discountAmount > 0 && <div className="flex justify-between mb-1" style={{ color: 'var(--success)' }}><span>Discount:</span><span>-₹{totals.discountAmount.toLocaleString('en-IN')}</span></div>}
                


                <div className="flex justify-between mb-1">
                  <span>Shipping:</span>
                  <span>{finalShipping === 0 ? <strong style={{ color: 'var(--success)' }}>FREE</strong> : `₹${finalShipping}`}</span>
                </div>

                {totals.isOutsideGujarat && (
                  <div className="flex justify-between mb-1" style={{ color: 'var(--warning)', fontSize: '0.78rem' }}>
                    <span>└ Out-of-State Delivery Fee:</span>
                    <span>+₹99</span>
                  </div>
                )}

                <div className="flex justify-between mt-2 pt-2" style={{ borderTop: '1px solid var(--border)', fontSize: '1.1rem', fontWeight: 'bold' }}>
                  <span>Total Payable:</span>
                  <span className="text-accent">₹{grandTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
