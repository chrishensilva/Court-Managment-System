import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { Scale } from 'lucide-react';
import './Home.css';

const Hero = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from('.hero-badge', { opacity: 0, y: -20, duration: 0.8, delay: 0.2 });
      gsap.from('h1', { opacity: 0, y: 30, duration: 1, delay: 0.4 });
      gsap.from('p', { opacity: 0, y: 30, duration: 1, delay: 0.6 });
      gsap.from('.hero-ctas', { opacity: 0, y: 30, duration: 1, delay: 0.8 });
      // Float animation for visual mockup
      gsap.to('.hero-mockup', {
        y: -15,
        duration: 2,
        yoyo: true,
        repeat: -1,
        ease: 'power1.inOut'
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="hero-section" ref={containerRef}>
      <div className="container hero-container">
        <div className="hero-content">
          <div className="hero-badge">
            <Scale size={16} />
            <span>Trusted by legal teams. Built for clarity. Deployed in the cloud.</span>
          </div>
          <h1>Manage Every Case. Empower Every Lawyer. Miss Nothing.</h1>
          <p>
            Court CMS is the all-in-one cloud-based platform built for law firms and legal professionals to streamline case management, automate client communication, and stay on top of every hearing — from anywhere.
          </p>
          <div className="hero-ctas">
            <Link to="/register" className="btn btn-primary">Get Started Free</Link>
            <Link to="/login" className="btn btn-secondary">View Live Demo</Link>
          </div>
        </div>
        <div className="hero-visual">
          {/* We will build a CSS-only dashboard mockup instead of a placeholder image */}
          <div className="hero-mockup">
            <div className="mockup-header">
              <div className="dots"><span></span><span></span><span></span></div>
              <div className="mockup-title">Court CMS Dashboard</div>
            </div>
            <div className="mockup-body">
              <div className="mockup-sidebar">
                <div className="mockup-nav"></div>
                <div className="mockup-nav"></div>
                <div className="mockup-nav"></div>
                <div className="mockup-nav"></div>
              </div>
              <div className="mockup-main">
                <div className="mockup-cards">
                  <div className="mockup-card">
                    <h4>Total Cases</h4>
                    <h2>142</h2>
                  </div>
                  <div className="mockup-card">
                    <h4>Active Lawyers</h4>
                    <h2>12</h2>
                  </div>
                  <div className="mockup-card">
                    <h4>Upcoming Hearings</h4>
                    <h2>5</h2>
                  </div>
                </div>
                <div className="mockup-chart"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
