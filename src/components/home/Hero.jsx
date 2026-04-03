import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import './Home.css';

const Hero = () => {
  const contentRef = useRef(null);
  const mockupRef = useRef(null);

  useEffect(() => {
    // GSAP from animations on mount
    gsap.from(contentRef.current.children, {
      y: 50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: 'power3.out',
    });

    gsap.from(mockupRef.current, {
      x: 50,
      opacity: 0,
      duration: 1,
      delay: 0.5,
      ease: 'power3.out',
    });
  }, []);

  return (
    <section className="hero-section">
      <div className="container hero-container">
        
        {/* Left Content */}
        <div className="hero-content" ref={contentRef}>
          <div className="hero-badge">
            <span role="img" aria-label="scales">⚖️</span> Trusted by legal teams. Built for clarity. Deployed in the cloud.
          </div>
          <h1 className="hero-title">Manage Every Case. Empower Every Lawyer. Miss Nothing.</h1>
          <p className="hero-subtitle">
            Court CMS is the all-in-one cloud-based platform built for law firms and legal professionals to streamline case management, automate client communication, and stay on top of every hearing — from anywhere.
          </p>
          <div className="hero-actions">
            <Link to="/register" className="btn btn-primary">Get Started Free</Link>
            <Link to="/login" className="btn btn-outline hero-btn-outline">View Live Demo</Link>
          </div>
        </div>

        {/* Right CSS Mockup */}
        <div className="hero-mockup-wrapper" ref={mockupRef}>
          <div className="css-mockup">
            <div className="mockup-header">
              <div className="mockup-dots">
                <span className="dot red"></span>
                <span className="dot yellow"></span>
                <span className="dot green"></span>
              </div>
              <div className="mockup-title">Court CMS Dashboard</div>
            </div>
            <div className="mockup-body">
              <div className="mockup-sidebar"></div>
              <div className="mockup-content">
                <div className="mockup-cards">
                  <div className="mockup-card"></div>
                  <div className="mockup-card"></div>
                  <div className="mockup-card"></div>
                </div>
                <div className="mockup-table"></div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Hero;
