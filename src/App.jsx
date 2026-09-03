// ============================================================
// App.jsx — Root application with router, layout, and providers.
// ============================================================

import React, { useState, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ChatAssistantDrawer from './components/assistant/ChatAssistantDrawer';
import { WeatherLocationProvider } from './context/WeatherLocationContext';
import ErrorBoundary from './components/common/ErrorBoundary';

// Lazy-loaded pages for code splitting
const HomePage = React.lazy(() => import('./pages/HomePage'));
const DestinationDetailPage = React.lazy(() => import('./pages/DestinationDetailPage'));
const ItineraryPage = React.lazy(() => import('./pages/ItineraryPage'));

const PageFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="space-y-4 text-center">
      <div className="w-12 h-12 border-3 border-primary-400 border-t-transparent rounded-full animate-spin mx-auto" aria-hidden="true" />
      <p className="text-slate-400 text-sm" role="status" aria-live="polite">Loading...</p>
    </div>
  </div>
);

const App = () => {
  const [chatOpen, setChatOpen] = useState(false);
  const location = useLocation();

  return (
    <WeatherLocationProvider>
      {/* Skip to main content */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:btn focus:btn-primary focus:btn-sm"
      >
        Skip to main content
      </a>

      <div className="flex flex-col min-h-dvh bg-dark-900">
        <Navbar onChatOpen={() => setChatOpen(true)} />

        <ErrorBoundary title="Page error" description="This page encountered an unexpected error. Please refresh.">
          <Suspense fallback={<PageFallback />}>
            <AnimatePresence mode="wait">
              <Routes location={location} key={location.pathname}>
                <Route path="/" element={<HomePage />} />
                <Route path="/destination/:id" element={<DestinationDetailPage />} />
                <Route path="/itinerary" element={<ItineraryPage />} />
                <Route
                  path="*"
                  element={
                    <main className="flex-1 flex items-center justify-center text-center py-32" id="main-content">
                      <div>
                        <div className="text-8xl mb-4" aria-hidden="true">404</div>
                        <h1 className="text-2xl font-bold text-white mb-3">Page Not Found</h1>
                        <p className="text-slate-400 mb-6">This destination doesn't exist on our map.</p>
                        <a href="/" className="btn btn-primary">Go Home</a>
                      </div>
                    </main>
                  }
                />
              </Routes>
            </AnimatePresence>
          </Suspense>
        </ErrorBoundary>

        <Footer />

        {/* Floating AI Chat Button */}
        {!chatOpen && (
          <button
            onClick={() => setChatOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-glow animate-pulse-ring"
            aria-label="Open AI travel assistant chat"
          >
            <span className="text-2xl" aria-hidden="true">✈️</span>
          </button>
        )}

        <ChatAssistantDrawer
          isOpen={chatOpen}
          onClose={() => setChatOpen(false)}
        />
      </div>
    </WeatherLocationProvider>
  );
};

export default App;
