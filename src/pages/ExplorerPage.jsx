// ============================================================
// ExplorerPage.jsx — Standalone exploration page with search.
// ============================================================

import React from 'react';
import DestinationExplorer from '../components/explorer/DestinationExplorer';
import ErrorBoundary from '../components/common/ErrorBoundary';

const ExplorerPage = () => (
  <main id="main-content" className="pt-20" aria-label="Explore Destinations">
    <ErrorBoundary title="Explorer error" description="Destinations could not be loaded.">
      <DestinationExplorer />
    </ErrorBoundary>
  </main>
);

export default ExplorerPage;
