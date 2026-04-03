import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
// Import Navbar and Footer directly from the marketing website's source
import Navbar from './marketing/components/layout/Navbar';
import Footer from './marketing/components/layout/Footer';
import './marketing.css';

// Scroll to top on every route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const MarketingLayout = () => {
  return (
    <div className="marketing-app">
      <ScrollToTop />
      <Navbar />
      <div className="marketing-main">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default MarketingLayout;
