import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import AppContextProvider from "./context/AppContext.jsx"; 
import { BrowserRouter } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";
import { FallbackAuthProvider } from "./components/auth/FallbackAuth";
import { UnifiedAuthProvider } from "./components/auth/UnifiedAuthProvider";
import React from 'react';

// Error boundary to catch React issues
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('React Error Boundary caught an error:', error, errorInfo);
    this.setState({ hasError: true, error });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h2>Something went wrong.</h2>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            <summary>Error details</summary>
            <pre>{this.state.error && this.state.error.toString()}</pre>
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

console.log("KEY:", PUBLISHABLE_KEY);

// Check if Clerk is properly configured
const useClerk = PUBLISHABLE_KEY && PUBLISHABLE_KEY !== 'your_clerk_publishable_key_here';

createRoot(document.getElementById("root")).render(
  <ErrorBoundary>
    <BrowserRouter>
      {useClerk ? (
        <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
          <FallbackAuthProvider>
            <UnifiedAuthProvider>
              <AppContextProvider>
                <App />
              </AppContextProvider>
            </UnifiedAuthProvider>
          </FallbackAuthProvider>
        </ClerkProvider>
      ) : (
        <FallbackAuthProvider>
          <UnifiedAuthProvider>
            <AppContextProvider>
              <App />
            </AppContextProvider>
          </UnifiedAuthProvider>
        </FallbackAuthProvider>
      )}
    </BrowserRouter>
  </ErrorBoundary>,
);
