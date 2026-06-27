import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface RouteErrorBoundaryProps {
  children?: ReactNode;
  routeName: string;
  onNavigateHome: () => void;
}

interface RouteErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class RouteErrorBoundary extends Component<RouteErrorBoundaryProps, RouteErrorBoundaryState> {
  constructor(props: RouteErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
    this.handleRetry = this.handleRetry.bind(this);
  }

  static getDerivedStateFromError(error: Error): RouteErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`[RouteErrorBoundary]`, error, errorInfo);
  }

  handleRetry() {
    this.setState({ hasError: false, error: null });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center h-full p-4 font-sans">
          <div className="bg-[var(--bg-card)] p-8 rounded-2xl shadow-2xl max-w-md w-full text-center border border-[var(--border-card)]">
            <div className="w-20 h-20 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-10 h-10 text-amber-600 dark:text-amber-400" />
            </div>
            <h1 className="text-xl font-bold text-[var(--text-primary)] mb-2 font-heading">
              {this.props.routeName} hit an error
            </h1>
            <p className="text-[var(--text-secondary)] mb-6 text-sm font-medium leading-relaxed">
              This section crashed, but the rest of the app is fine. You can retry or go back to Dashboard.
            </p>

            {this.state.error && (
              <div className="bg-[var(--bg-content)] p-4 rounded-lg mb-6 text-left border border-[var(--border-card)] overflow-hidden">
                <p className="text-[10px] font-semibold text-[var(--text-tertiary)] mb-1">Error details</p>
                <code className="text-xs font-mono text-red-600 dark:text-red-400 block break-words">
                  {this.state.error.message}
                </code>
              </div>
            )}

            <div className="flex flex-col gap-3">
              <button
                onClick={this.handleRetry}
                className="w-full py-3 bg-jade-600 hover:bg-jade-500 text-white font-semibold rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 active:scale-95"
              >
                <RefreshCw className="w-5 h-5" /> Retry
              </button>
              <button
                onClick={this.props.onNavigateHome}
                className="w-full py-3 bg-[var(--bg-content)] hover:bg-terra-100 dark:hover:bg-[#163D2F] text-[var(--text-primary)] font-semibold rounded-xl transition-all border border-[var(--border-card)] flex items-center justify-center gap-2 active:scale-95"
              >
                <Home className="w-5 h-5" /> Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
