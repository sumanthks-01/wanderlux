// ============================================================
// Footer.jsx — Elegant site footer with links and branding.
// ============================================================

import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, GitFork, ExternalLink, Heart } from 'lucide-react';

const Footer = () => (
  <footer className="bg-dark-900 border-t border-white/5 mt-auto" role="contentinfo">
    <div className="section-container py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
        {/* Brand */}
        <div>
          <Link to="/" className="flex items-center gap-2 mb-4" aria-label="WanderLux home">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
              <Compass className="w-4 h-4 text-white" aria-hidden="true" />
            </div>
            <span className="font-display text-lg font-bold text-white">
              Wander<span className="text-gradient-cool">Lux</span>
            </span>
          </Link>
          <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
            Discover the world's most extraordinary destinations with AI-powered travel planning.
          </p>
        </div>

        {/* Explore Links */}
        <nav aria-label="Footer navigation">
          <h3 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Explore</h3>
          <ul className="space-y-2.5" role="list">
            {[
              { to: '/', label: 'Destinations' },
              { to: '/itinerary', label: 'Plan a Trip' },
            ].map(link => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className="text-slate-400 text-sm hover:text-primary-400 transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Social */}
        <div>
          <h3 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Follow</h3>
          <div className="flex gap-3">
            {[
              { icon: GitFork, label: 'GitHub', href: '#' },
              { icon: ExternalLink, label: 'Portfolio', href: '#' },
            ].map(({ icon: Icon, label, href }) => (
              <a
                key={label}
                href={href}
                className="w-9 h-9 glass-light rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/12 transition-all"
                aria-label={`Follow us on ${label}`}
              >
                <Icon className="w-4 h-4" aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="divider mb-6" role="separator" />

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
        <p>© {new Date().getFullYear()} WanderLux. All rights reserved.</p>
        <p className="flex items-center gap-1.5">
          Made with <Heart className="w-3 h-3 text-red-400 fill-current" aria-hidden="true" /> for passionate travelers
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
