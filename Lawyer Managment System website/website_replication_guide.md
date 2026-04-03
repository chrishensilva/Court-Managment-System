# Lawyer Management System Website - Replication Guide

To recreate this exact website from scratch with 100% identical design, content, and structure, follow this comprehensive guide. The site is built with **React 19, Vite, React Router v7, and GSAP for animations**, utilizing a custom CSS-variable powered design system.

## 1. Project Initialization

First, create the Vite React project and install the exact matching dependencies.

```bash
# Initialize the project
npm create vite@latest lawyer-management-site -- --template react

# Navigate into the project
cd lawyer-management-site

# Install matching core dependencies
npm install @gsap/react@^2.1.2 gsap@^3.14.2 lucide-react@^1.7.0 react-calendar@^6.0.0 react-router-dom@^7.13.2 recharts@^3.8.1

# Install matching dev dependencies
npm install -D @eslint/js@^9.39.4 @types/react@^19.2.14 @types/react-dom@^19.2.3 @vitejs/plugin-react@^6.0.1 eslint@^9.39.4 eslint-plugin-react-hooks@^7.0.1 eslint-plugin-react-refresh@^0.5.2 globals@^17.4.0 vite@^8.0.1
```

## 2. Directory Structure Setup

Delete the default source files and set up the specific folder architecture:

```bash
# Clear default Vite files (Windows PowerShell)
Remove-Item -Recurse -Force src/*

# Create directories
New-Item -ItemType Directory -Force src/assets
New-Item -ItemType Directory -Force src/components/home
New-Item -ItemType Directory -Force src/components/layout
New-Item -ItemType Directory -Force src/pages
```

## 3. Global Configuration & Routing

Create the entry points and main application router.

### `src/main.jsx`
```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

### `src/App.jsx`
```jsx
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Pages
import Home from './pages/Home';
import Features from './pages/Features';
import Pricing from './pages/Pricing';
import Security from './pages/Security';
import Login from './pages/Login';
import Register from './pages/Register';
import Contact from './pages/Contact';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App = () => {
  return (
    <Router>
      <ScrollToTop />
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/features" element={<Features />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/security" element={<Security />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
};

export default App;
```

## 4. The Design System (CSS)

The entire aesthetic is powered by this global CSS file.

### `src/index.css`
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

:root {
  --color-primary: #0a0a0a;
  --color-secondary: #171717;
  --color-accent: #2563eb;
  --color-accent-hover: #1d4ed8;
  --color-white: #ffffff;
  --color-gray-50: #fafafa;
  --color-gray-100: #f4f4f5;
  --color-gray-200: #e4e4e7;
  --color-gray-300: #d4d4d8;
  --color-gray-400: #a1a1aa;
  --color-gray-500: #71717a;
  --color-gray-800: #27272a;
  --color-gray-900: #18181b;

  --font-heading: 'Inter', sans-serif;
  --font-body: 'Inter', sans-serif;

  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.025);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02);
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: var(--font-body);
  background-color: var(--color-gray-50);
  color: var(--color-gray-900);
  line-height: 1.6;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-heading);
  margin-bottom: 1rem;
  color: var(--color-primary);
  font-weight: 700;
  letter-spacing: -0.025em;
}

a {
  text-decoration: none;
  color: inherit;
  transition: all 0.3s ease;
}

img {
  max-width: 100%;
  height: auto;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  font-weight: 500;
  font-size: 0.95rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
  border: 1px solid transparent;
  letter-spacing: -0.01em;
}

.btn-primary {
  background-color: var(--color-accent);
  color: var(--color-white);
  box-shadow: var(--shadow-sm);
}

.btn-primary:hover {
  background-color: var(--color-accent-hover);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.btn-white {
  background-color: var(--color-white);
  color: var(--color-primary);
  box-shadow: var(--shadow-sm);
  font-weight: 600;
}

.btn-white:hover {
  background-color: var(--color-gray-100);
  transform: translateY(-1px);
}

.btn-secondary, .btn-outline {
  background-color: var(--color-white);
  color: var(--color-primary);
  border: 1px solid var(--color-gray-200);
}

.btn-outline {
  background-color: transparent;
}

.btn-secondary:hover, .btn-outline:hover {
  background-color: var(--color-gray-50);
  border-color: var(--color-gray-300);
  transform: translateY(-1px);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

section {
  padding: 5rem 0;
}

.section-title {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.section-subtitle {
  text-align: center;
  font-size: 1.125rem;
  color: var(--color-gray-800);
  max-width: 700px;
  margin: 0 auto 3rem;
}
```

## 5. Main Page Structure (GSAP Animations)

The main homepage uses GSAP's ScrollTrigger to animate sections into view.

### `src/pages/Home.jsx`
```jsx
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
```

## 6. Building the Component Architecture

To proceed and finish the site to be 100% identical, you will need to implement the following sub-components inside `src/components/home/`:

1.  **`Hero.jsx`**: A dark-themed section with text left and a CSS-only dashboard mockup right. Uses GSAP `gsap.from` animations on mount.
2.  **`KeyFeatures.jsx`**: A grid layout (`.features-grid`) of cards (`.feature-card`) with `lucide-react` icons highlighting benefits.
3.  **`HowItWorks.jsx`**: Numbered steps displaying the system workflow using `.steps-container` and `.step-card`.
4.  **`SecurityTrust.jsx`**: A dark background section using `.security-grid` and `.security-card` displaying security features like 2FA and encryption.
5.  **`PricingSection.jsx`**: Three tiers (Basic, Pro, Enterprise) inside `.pricing-grid`.
6.  **`Testimonials.jsx`**: Client quotes rendered in `.testimonial-card` components.
7.  **`FAQ.jsx`**: An accordion-style list using `.faq-item` and standard React state for open/close toggles.
8.  **`FinalCTA.jsx`**: A final call to action block to drive signups.
9.  **`Home.css`**: The specific CSS file imported by these components that handles the dashboard mockup, grid layouts, and padding.

*(Note: Create standard placeholder components for `Features`, `Pricing`, `Security`, `Login`, `Register`, and `Contact` inside the `src/pages/` directory so routing does not break).*

## Final Step: Start the App

Once you've scaffolded these components, you can run the site:

```bash
npm run dev
```

The site will now map identically to the structural, aesthetic, and functional state of the current Lawyer Management System website.
