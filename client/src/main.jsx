import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { ClerkProvider } from '@clerk/clerk-react'

// Clerk Configuration
// The Publishable Key is required for frontend integration
const PUBLISHABLE_KEY = "pk_test_c3Rhci1nb3BoZXItODUuY2xlcmsuYWNjb3VudHMuZGV2JA";

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}

import { Component } from 'react';

// Error Boundary Component
// Catches JavaScript errors anywhere in the child component tree
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 20, color: 'red' }}>
          <h1>Something went wrong.</h1>
          <pre>{this.state.error.toString()}</pre>
        </div>
      );
    }

    return this.props.children;
  }
}

// React Entry Point
// Wraps the App with strict mode, error handling, and auth providers (Clerk + Custom Auth)
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <ClerkProvider
        publishableKey={PUBLISHABLE_KEY}
        afterSignOutUrl="/"
        afterSignInUrl="/"
        afterSignUpUrl="/"
        appearance={{
          variables: {
            colorBackground: '#111111',
            colorText: '#ffffff',
            colorTextSecondary: '#e4e4e7',
            colorPrimary: '#ffffff',
            colorInputBackground: '#0a0a0a',
            colorInputText: '#ffffff',
            colorNeutral: '#ffffff',
          }
        }}
      >
        <AuthProvider>
          <App />
        </AuthProvider>
      </ClerkProvider>
    </ErrorBoundary>
  </StrictMode>,
)
