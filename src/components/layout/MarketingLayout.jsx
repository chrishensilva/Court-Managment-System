import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import '../home/Home.css';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const MarketingLayout = () => {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <main className="main-content" style={{minHeight: 'calc(100vh - 80px)'}}>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default MarketingLayout;
