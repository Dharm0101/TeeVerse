import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { AnnouncementBar } from './components/AnnouncementBar';
import { Navbar } from './components/Navbar';
import { MobileNav } from './components/MobileNav';
import { Footer } from './components/Footer';

import { HomeView } from './views/HomeView';
import { ShopView } from './views/ShopView';
import { ProductDetailView } from './views/ProductDetailView';
import { CheckoutView } from './views/CheckoutView';
import { ProfileView } from './views/ProfileView';
import { OrderTrackingView } from './views/OrderTrackingView';
import { AdminLoginView } from './views/AdminLoginView';
import { AdminDashboardView } from './views/AdminDashboardView';
import { ContactView } from './views/ContactView';
import { AboutView } from './views/AboutView';

import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { AuthModal } from './components/AuthModal';
import { SizeGuideModal } from './components/SizeGuideModal';
import { SearchOverlay } from './components/SearchOverlay';
import { ToastContainer } from './components/ToastContainer';

const MainContent = () => {
  const { currentPage, selectedProduct } = useStore();

  React.useEffect(() => {
    const pageTitles = {
      home: 'TEEVERSE • Heavyweight Streetwear & Graphic Tees',
      shop: 'Shop All Streetwear Tees | TEEVERSE',
      product: selectedProduct ? `${selectedProduct.name} | TEEVERSE Streetwear` : 'Product Details | TEEVERSE',
      checkout: 'Checkout & Secure Payment | TEEVERSE',
      profile: 'My Account & Orders | TEEVERSE',
      tracking: 'Track Your Order | TEEVERSE',
      'admin-login': 'Admin Owner Portal | TEEVERSE',
      admin: 'Store Admin Dashboard | TEEVERSE',
      contact: 'Contact Us | TEEVERSE',
      about: 'Our Brand & Heavyweight Fabric | TEEVERSE',
    };
    document.title = pageTitles[currentPage] || 'TEEVERSE • Heavyweight Streetwear';
  }, [currentPage, selectedProduct]);

  React.useEffect(() => {
    const handleScrollObserve = () => {
      const elements = document.querySelectorAll(
        '.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-scale'
      );
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('revealed');
            }
          });
        },
        { rootMargin: '0px 0px -30px 0px', threshold: 0.08 }
      );
      elements.forEach((el) => observer.observe(el));
    };

    const timer = setTimeout(handleScrollObserve, 120);
    return () => clearTimeout(timer);
  }, [currentPage]);

  return (
    <main style={{ paddingBottom: '80px' }}>
      {currentPage === 'home' && <HomeView />}
      {currentPage === 'shop' && <ShopView />}
      {currentPage === 'product' && <ProductDetailView />}
      {currentPage === 'checkout' && <CheckoutView />}
      {currentPage === 'profile' && <ProfileView />}
      {currentPage === 'tracking' && <OrderTrackingView />}
      {currentPage === 'admin-login' && <AdminLoginView />}
      {currentPage === 'admin' && <AdminDashboardView />}
      {currentPage === 'contact' && <ContactView />}
      {currentPage === 'about' && <AboutView />}
    </main>
  );
};

export function App() {
  return (
    <StoreProvider>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <MobileNav />

        <div style={{ flex: 1 }}>
          <MainContent />
        </div>

        <Footer />
        <AnnouncementBar />

        {/* Global Overlays */}
        <CartDrawer />
        <WishlistDrawer />
        <AuthModal />
        <SizeGuideModal />
        <SearchOverlay />
        <ToastContainer />
      </div>
    </StoreProvider>
  );
}

export default App;
