import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import Hero from '../components/home/Hero';
import KeyFeatures from '../components/home/KeyFeatures';
import HowItWorks from '../components/home/HowItWorks';
import WhoIsItFor from '../components/home/WhoIsItFor';
import SecurityTrust from '../components/home/SecurityTrust';
import PricingSection from '../components/home/PricingSection';
import Testimonials from '../components/home/Testimonials';
import FAQ from '../components/home/FAQ';
import FinalCTA from '../components/home/FinalCTA';

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      // Fade-up effect for sections
      const sections = gsap.utils.toArray('.fade-up-section');
      sections.forEach((section) => {
        gsap.fromTo(
          section,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="home-page">
      <Hero />
      <div className="fade-up-section"><KeyFeatures /></div>
      <div className="fade-up-section"><HowItWorks /></div>
      <div className="fade-up-section"><WhoIsItFor /></div>
      <div className="fade-up-section"><SecurityTrust /></div>
      <div className="fade-up-section"><PricingSection /></div>
      <div className="fade-up-section"><Testimonials /></div>
      <div className="fade-up-section"><FAQ /></div>
      <div className="fade-up-section"><FinalCTA /></div>
    </div>
  );
};

export default Home;
