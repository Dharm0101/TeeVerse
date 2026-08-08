import React, { createContext, useContext, useState, useEffect } from 'react';
import { products as initialProducts } from '../data/mockData';
import { API_BASE_URL } from '../services/emailService';

const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  // Navigation / Routing State
  const [currentPage, setCurrentPage] = useState('home'); // home | shop | product | checkout | profile | tracking | admin-login | admin
  const [selectedProductId, setSelectedProductId] = useState(1);
  const [trackingOrderId, setTrackingOrderId] = useState('');

  // Catalog State
  const [productsList, setProductsList] = useState(initialProducts);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/products`);
        const json = await res.json();
        if (json.success && json.data && json.data.length > 0) {
          setProductsList(json.data);
        }
      } catch (err) {
        console.warn('Could not fetch products from backend, using mock data:', err);
      }
    };
    fetchProducts();
  }, []);

  const addProduct = (newProduct) => {
    const id = Date.now();
    const formatted = {
      id,
      ...newProduct,
      price: Number(newProduct.price),
      mrp: Number(newProduct.price),
      discount: 0,
      slug: newProduct.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      rating: 4.8,
      reviewCount: 1,
      inStock: newProduct.inStock !== undefined ? newProduct.inStock : true,
      colors: newProduct.colors || [{ name: 'Charcoal Black', hex: '#1a1a1a' }],
      sizes: newProduct.sizes || ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'],
      tags: newProduct.tags || ['trending'],
    };
    setProductsList((prev) => [formatted, ...prev]);
    showToast(`Product "${formatted.name}" added to catalog! 🛍️`, 'success');
  };

  const updateProduct = (id, updatedFields) => {
    setProductsList((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              ...updatedFields,
              price: Number(updatedFields.price || p.price),
              mrp: Number(updatedFields.price || p.price),
            }
          : p
      )
    );
    showToast(`Product #${id} updated successfully! ✏️`, 'success');
  };

  const deleteProduct = (id) => {
    setProductsList((prev) => prev.filter((p) => p.id !== id));
    showToast(`Product #${id} removed from catalog! 🗑️`, 'info');
  };

  // Cart State (Persisted)
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('teeverse_cart');
    return saved ? JSON.parse(saved) : [];
  });

  // Wishlist State (Persisted)
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('teeverse_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  // Customer Auth State
  const [customerUser, setCustomerUser] = useState(() => {
    const saved = localStorage.getItem('teeverse_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Admin Auth State (Only Store Owner)
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    const saved = localStorage.getItem('teeverse_admin_session');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.loggedIn && Date.now() - parsed.timestamp < 24 * 60 * 60 * 1000;
      } catch (e) {
        return false;
      }
    }
    return false;
  });

  // Orders State (Persisted)
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('teeverse_orders');
    return saved ? JSON.parse(saved) : [];
  });

  // Contact Queries State (Persisted)
  const [contactQueries, setContactQueries] = useState(() => {
    const saved = localStorage.getItem('teeverse_contact_queries');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [
      {
        id: 'q-101',
        date: new Date().toISOString(),
        name: 'Aarav Patel',
        email: 'aarav.patel@gmail.com',
        phone: '9558613440',
        subject: 'Size & Fit Assistance',
        message: 'Looking for advice on 240 GSM drop shoulder oversized tees sizing.',
        status: 'unread',
      },
    ];
  });

  useEffect(() => {
    localStorage.setItem('teeverse_contact_queries', JSON.stringify(contactQueries));
  }, [contactQueries]);

  useEffect(() => {
    const fetchBackendOrders = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/orders`);
        const json = await res.json();
        if (json.success && json.data) {
          setOrders(json.data);
        }
      } catch (err) {
        console.warn('Could not fetch orders from backend:', err);
      }
    };
    fetchBackendOrders();
  }, [isAdminLoggedIn]);

  useEffect(() => {
    const fetchBackendQueries = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/contact`);
        const json = await res.json();
        if (json.success && json.data) {
          setContactQueries(json.data);
        }
      } catch (err) {
        console.warn('Could not fetch queries from backend:', err);
      }
    };
    fetchBackendQueries();
  }, [isAdminLoggedIn]);

  const addContactQuery = (queryData) => {
    const newQuery = {
      id: 'q-' + Date.now(),
      date: new Date().toISOString(),
      ...queryData,
      status: 'unread',
    };
    setContactQueries((prev) => [newQuery, ...prev]);
  };

  const updateQueryStatus = async (id, newStatus) => {
    setContactQueries((prev) =>
      prev.map((q) => (q.id === id ? { ...q, status: newStatus } : q))
    );
    try {
      await fetch(`${API_BASE_URL}/contact/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (err) {
      console.warn('SQLite Sync Note:', err.message);
    }
  };

  const deleteContactQuery = async (id) => {
    setContactQueries((prev) => prev.filter((q) => q.id !== id));
    try {
      await fetch(`${API_BASE_URL}/contact/${id}`, {
        method: 'DELETE',
      });
      showToast('Contact query removed', 'info');
    } catch (err) {
      console.warn('SQLite Sync Note:', err.message);
    }
  };

  // Saved Addresses State (Amazon Style - Persisted)
  const [savedAddresses, setSavedAddresses] = useState(() => {
    const saved = localStorage.getItem('teeverse_addresses');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('teeverse_addresses', JSON.stringify(savedAddresses));
  }, [savedAddresses]);

  const addSavedAddress = (newAddr) => {
    const id = 'addr-' + Date.now();
    const formatted = { ...newAddr, id, isDefault: savedAddresses.length === 0 };
    setSavedAddresses((prev) => [formatted, ...prev]);
    showToast('New delivery address saved! 📍', 'success');
    return formatted;
  };

  const removeSavedAddress = (id) => {
    setSavedAddresses((prev) => prev.filter((a) => a.id !== id));
    showToast('Address removed', 'info');
  };

  const setDefaultAddress = (id) => {
    setSavedAddresses((prev) =>
      prev.map((a) => ({ ...a, isDefault: a.id === id }))
    );
    showToast('Default delivery address updated! 📌', 'success');
  };

  // UI Overlays & Modals
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');

  // Filters State
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 2500]);
  const [minRating, setMinRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState([]);
  const [sortBy, setSortBy] = useState('popularity');

  // Toast System
  const [toasts, setToasts] = useState([]);

  // Persistence Effects
  useEffect(() => {
    try {
      localStorage.setItem('teeverse_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.warn('LocalStorage cart save error:', e);
    }
  }, [cartItems]);

  useEffect(() => {
    try {
      localStorage.setItem('teeverse_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.warn('LocalStorage wishlist save error:', e);
    }
  }, [wishlist]);

  useEffect(() => {
    if (customerUser) {
      try {
        localStorage.setItem('teeverse_user', JSON.stringify(customerUser));
      } catch (e) {
        console.warn('LocalStorage user save error:', e);
      }
    } else {
      localStorage.removeItem('teeverse_user');
    }
  }, [customerUser]);

  useEffect(() => {
    try {
      localStorage.setItem('teeverse_orders', JSON.stringify(orders));
    } catch (e) {
      console.warn('LocalStorage orders save error:', e);
    }
  }, [orders]);

  // Toast Function
  const showToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Cart Functions
  const addToCart = (productId, size, color, quantity = 1) => {
    if (!size || !color) {
      showToast('Please select both Size and Color first!', 'error');
      return false;
    }
    const product = productsList.find((p) => p.id === productId);
    if (!product) return false;

    setCartItems((prev) => {
      const existingIdx = prev.findIndex(
        (item) => item.productId === productId && item.size === size && item.color === color
      );
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += quantity;
        return updated;
      } else {
        return [
          ...prev,
          {
            productId,
            name: product.name,
            price: product.price,
            size,
            color,
            quantity,
            addedAt: new Date().toISOString(),
          },
        ];
      }
    });

    showToast('Added to cart! 🔥', 'success');
    return true;
  };

  const removeFromCart = (index) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
    showToast('Item removed from cart', 'info');
  };

  const updateCartQuantity = (index, newQty) => {
    if (newQty < 1) return;
    setCartItems((prev) => {
      const updated = [...prev];
      updated[index].quantity = Math.min(10, newQty);
      return updated;
    });
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('teeverse_cart');
  };

  const getCartTotals = (shippingState = 'Gujarat') => {
    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discountAmount = 0;
    const taxableAmount = Math.max(0, subtotal - discountAmount);
    const isOutsideGujarat = Boolean(shippingState && shippingState.trim().toLowerCase() !== 'gujarat');

    // GST Calculations
    let cgst = 0;
    let sgst = 0;
    let igst = 0;
    let totalTax = 0;

    if (isOutsideGujarat) {
      // Outside Gujarat -> IGST 5%
      igst = Math.round(taxableAmount * 0.05);
      totalTax = igst;
    } else {
      // Same State Gujarat -> CGST 2.5% + SGST 2.5%
      cgst = Math.round(taxableAmount * 0.025);
      sgst = Math.round(taxableAmount * 0.025);
      totalTax = cgst + sgst;
    }

    const baseShipping = subtotal >= 799 || subtotal === 0 ? 0 : 69;
    const outOfStateFee = isOutsideGujarat ? 99 : 0;
    const shipping = baseShipping + outOfStateFee;

    const total = Math.max(0, taxableAmount + totalTax + shipping);
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    return {
      subtotal,
      discountAmount,
      taxableAmount,
      cgst,
      sgst,
      igst,
      totalTax,
      shipping,
      baseShipping,
      outOfStateFee,
      isOutsideGujarat,
      total,
      totalItems,
    };
  };

  // Wishlist Functions
  const toggleWishlist = (productId) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Removed from wishlist', 'info');
        return prev.filter((id) => id !== productId);
      } else {
        showToast('Added to wishlist! ❤️', 'success');
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId) => wishlist.includes(productId);

  // Router Helpers
  const navigateTo = (page, param = null) => {
    setCurrentPage(page);
    if (page === 'product' && param) {
      setSelectedProductId(param);
    }
    if (page === 'tracking' && param) {
      setTrackingOrderId(param);
    }
    setIsMobileNavOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Admin Auth
  const adminLogin = (usernameOrEmail, password) => {
    const validIdentifiers = ['teenesttt@gmail.com', 'admin@teeverse.in', 'admin'];
    if (validIdentifiers.includes(usernameOrEmail.toLowerCase().trim()) && password === 'TeeVerse@2026') {
      setIsAdminLoggedIn(true);
      localStorage.setItem(
        'teeverse_admin_session',
        JSON.stringify({ loggedIn: true, timestamp: Date.now() })
      );
      showToast('Welcome back, Owner! 👑 Admin Access Granted.', 'success');
      navigateTo('admin');
      return true;
    } else {
      showToast('Access Denied: Only store owner can login as admin.', 'error');
      return false;
    }
  };

  const adminLogout = () => {
    setIsAdminLoggedIn(false);
    localStorage.removeItem('teeverse_admin_session');
    showToast('Admin logged out', 'info');
    navigateTo('home');
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.orderId === orderId ? { ...o, status: newStatus } : o))
    );
    try {
      await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      showToast(`Order ${orderId} status updated to ${newStatus}`, 'success');
    } catch (err) {
      console.warn('SQLite Sync Note:', err.message);
    }
  };

  // Customer Auth
  const customerLogin = (email, password) => {
    const user = { name: email.split('@')[0] || 'User', email, phone: '9876543210' };
    setCustomerUser(user);
    showToast(`Welcome back, ${user.name}! 🔥`, 'success');
    setIsAuthModalOpen(false);
  };

  const customerLogout = () => {
    setCustomerUser(null);
    showToast('Logged out successfully', 'info');
    navigateTo('home');
  };

  return (
    <StoreContext.Provider
      value={{
        currentPage,
        navigateTo,
        selectedProductId,
        setSelectedProductId,
        trackingOrderId,
        setTrackingOrderId,
        productsList,
        cartItems,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        getCartTotals,
        wishlist,
        toggleWishlist,
        isInWishlist,
        customerUser,
        customerLogin,
        customerLogout,
        isAdminLoggedIn,
        adminLogin,
        adminLogout,
        orders,
        setOrders,
        updateOrderStatus,
        isCartOpen,
        setIsCartOpen,
        isWishlistOpen,
        setIsWishlistOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isSizeGuideOpen,
        setIsSizeGuideOpen,
        isSearchOpen,
        setIsSearchOpen,
        isMobileNavOpen,
        setIsMobileNavOpen,
        searchQuery,
        setSearchQuery,
        activeCategory,
        setActiveCategory,
        selectedSizes,
        setSelectedSizes,
        selectedColors,
        setSelectedColors,
        priceRange,
        setPriceRange,
        minRating,
        setMinRating,
        selectedTags,
        setSelectedTags,
        sortBy,
        setSortBy,
        toasts,
        showToast,
        removeToast,
        savedAddresses,
        addSavedAddress,
        removeSavedAddress,
        setDefaultAddress,
        addProduct,
        updateProduct,
        deleteProduct,
        clearCart,
        contactQueries,
        addContactQuery,
        updateQueryStatus,
        deleteContactQuery,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);
