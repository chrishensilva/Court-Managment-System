import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import './marketing.css';

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
            <main className="marketing-main">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default MarketingLayout;
