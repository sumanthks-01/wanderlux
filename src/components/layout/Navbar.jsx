// ============================================================
// Navbar.jsx — Fixed top navigation with glassmorphic design,
// scroll-aware opacity, and mobile hamburger menu.
// ============================================================

import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, Map, Calendar, MessageCircle, Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { to: '/',           label: 'Explore',   icon: Compass },
  { to: '/itinerary',  label: 'Plan Trip', icon: Calendar },
];

const Navbar = ({ onChatOpen }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => setMobileOpen(false), [location.pathname]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'glass border-b border-white/8 py-3' : 'bg-transparent py-5'
        }`}
        role="banner"
      >
        <nav
          className="section-container flex items-center justify-between"
          aria-label="Main navigation"
        >
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 group"
            aria-label="WanderLux - Go to homepage"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-glow group-hover:scale-105 transition-transform duration-200">
              <Compass className="w-5 h-5 text-dark-900" aria-hidden="true" />
            </div>
            <span className="font-display text-xl font-bold text-white tracking-tight">
              Wander<span className="text-gradient">Lux</span>
            </span>
          </Link>

          {/* Desktop nav links */}
          <ul className="hidden md:flex items-center gap-1" role="list">
            {NAV_LINKS.map(({ to, label, icon: Icon }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={to === '/'}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-primary-500/15 text-primary-300 border border-primary-500/25'
                        : 'text-slate-400 hover:text-white hover:bg-white/8'
                    }`
                  }
                  aria-current={location.pathname === to ? 'page' : undefined}
                >
                  <Icon className="w-4 h-4" aria-hidden="true" />
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={onChatOpen}
              className="btn btn-ghost btn-sm gap-2"
              aria-label="Open AI travel assistant"
            >
              <MessageCircle className="w-4 h-4" aria-hidden="true" />
              AI Assistant
            </button>
            <Link to="/itinerary" className="btn btn-primary btn-sm">
              <Map className="w-4 h-4" aria-hidden="true" />
              Plan My Trip
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-xl glass-light text-slate-300 hover:text-white transition-colors"
            onClick={() => setMobileOpen(o => !o)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
          >
            <AnimatePresence mode="wait">
              {mobileOpen
                ? <motion.span key="x"   initial={{ rotate: -90 }} animate={{ rotate: 0 }} exit={{ rotate: 90 }} transition={{ duration: 0.15 }}>
                    <X className="w-5 h-5" aria-hidden="true" />
                  </motion.span>
                : <motion.span key="hamburger" initial={{ rotate: 90 }} animate={{ rotate: 0 }} exit={{ rotate: -90 }} transition={{ duration: 0.15 }}>
                    <Menu className="w-5 h-5" aria-hidden="true" />
                  </motion.span>
              }
            </AnimatePresence>
          </button>
        </nav>
      </header>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed top-16 left-4 right-4 z-40 glass rounded-2xl p-4 shadow-card"
            role="dialog"
            aria-label="Mobile navigation menu"
          >
            <ul className="space-y-1" role="list">
              {NAV_LINKS.map(({ to, label, icon: Icon }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    end={to === '/'}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-primary-500/15 text-primary-300'
                          : 'text-slate-300 hover:text-white hover:bg-white/8'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4" aria-hidden="true" />
                    {label}
                  </NavLink>
                </li>
              ))}
              <li>
                <button
                  onClick={() => { onChatOpen(); setMobileOpen(false); }}
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-white/8 transition-colors"
                  aria-label="Open AI travel assistant"
                >
                  <MessageCircle className="w-4 h-4" aria-hidden="true" />
                  AI Assistant
                </button>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
