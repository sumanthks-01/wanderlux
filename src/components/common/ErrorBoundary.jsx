// ============================================================
// ErrorBoundary.jsx — Class-based error boundary for
// wrapping async/render-error-prone sections.
// ============================================================

import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="flex flex-col items-center justify-center p-8 rounded-2xl glass-card text-center min-h-[200px]"
          role="alert"
          aria-live="assertive"
        >
          <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
            <AlertTriangle className="w-7 h-7 text-red-400" aria-hidden="true" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">
            {this.props.title || 'Something went wrong'}
          </h3>
          <p className="text-slate-400 text-sm mb-6 max-w-xs">
            {this.props.description || 'An unexpected error occurred. Please try again.'}
          </p>
          <button
            onClick={this.handleReset}
            className="btn btn-primary btn-sm"
            aria-label="Retry loading this section"
          >
            <RefreshCw className="w-4 h-4" aria-hidden="true" />
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
