"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";

type Props = {
  children: ReactNode;
  fallback?: ReactNode;
};

type State = {
  hasError: boolean;
  error?: Error;
};

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("🔥 Caught by ErrorBoundary:", error, info);
    // Optionally report to error tracking service here (e.g., Sentry)
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex flex-col items-center justify-center h-full text-center p-6 text-red-600">
            <h2 className="text-2xl font-bold mb-2">Something went wrong.</h2>
            <p className="mb-4 text-sm text-muted-foreground">
              An unexpected error occurred. Please refresh the page or try again later.
            </p>
            <button
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
              onClick={() => window.location.reload()}
            >
              Reload
            </button>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
