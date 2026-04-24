import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUser, useClerk } from '@clerk/clerk-react';
import { useFallbackAuth } from './FallbackAuth';

const UnifiedAuthContext = createContext();

export const useUnifiedAuth = () => {
  const context = useContext(UnifiedAuthContext);
  if (!context) {
    throw new Error('useUnifiedAuth must be used within a UnifiedAuthProvider');
  }
  return context;
};

export const UnifiedAuthProvider = ({ children }) => {
  // Try to use Clerk first
  const clerkUser = useUser();
  const { signOut: clerkSignOut } = useClerk();
  let fallbackAuth = null;
  
  try {
    fallbackAuth = useFallbackAuth();
  } catch (error) {
    // Fallback context not available, will use Clerk only
    console.log('Fallback auth not available, using Clerk only');
  }
  
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [useClerkSystem, setUseClerkSystem] = useState(false);

  useEffect(() => {
    // Check if Clerk is available (regardless of user state)
    const isClerkAvailable = clerkUser.isLoaded;
    
    if (isClerkAvailable && clerkUser.user) {
      // Clerk is available and user is logged in - PRIORITIZE CLERK
      setUser(clerkUser.user);
      setIsAuthenticated(true);
      setUseClerkSystem(true);
      setIsLoading(false);
    } else if (isClerkAvailable && !clerkUser.user) {
      // Clerk is available but no user logged in - PRIORITIZE CLERK SYSTEM
      setUser(null);
      setIsAuthenticated(false);
      setUseClerkSystem(true); // Always use Clerk system when available
      setIsLoading(false);
    } else if (!clerkUser.isLoaded) {
      // Clerk is still loading
      setIsLoading(true);
    } else {
      // Clerk not available, use fallback if available
      if (fallbackAuth && fallbackAuth.isAuthenticated) {
        setUser(fallbackAuth.user);
        setIsAuthenticated(true);
        setUseClerkSystem(false);
        setIsLoading(false);
      } else {
        setUser(null);
        setIsAuthenticated(false);
        setUseClerkSystem(false);
        setIsLoading(false);
      }
    }
  }, [clerkUser.isLoaded, clerkUser.user, fallbackAuth?.isAuthenticated, fallbackAuth?.user]);

  const openSignIn = () => {
    if (useClerkSystem) {
      // Clerk sign-in will be handled by Clerk components
      return;
    } else {
      // Navigate to simple login page
      window.location.href = '/simple-login';
    }
  };

  const logout = async () => {
    if (useClerkSystem) {
      // Use Clerk signOut
      try {
        await clerkSignOut();
        setUser(null);
        setIsAuthenticated(false);
        setUseClerkSystem(false);
      } catch (error) {
        console.error('Clerk signOut error:', error);
      }
    } else if (fallbackAuth?.logout) {
      // Use fallback logout
      try {
        await fallbackAuth.logout();
        setUser(null);
        setIsAuthenticated(false);
      } catch (error) {
        console.error('Fallback logout error:', error);
      }
    }
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    useClerk: useClerkSystem,
    openSignIn,
    logout,
    // Provide fallback methods when not using Clerk
    login: useClerkSystem ? undefined : (fallbackAuth?.login),
    // Provide Clerk methods when using Clerk
    clerkUser: useClerkSystem ? clerkUser : undefined
  };

  return (
    <UnifiedAuthContext.Provider value={value}>
      {children}
    </UnifiedAuthContext.Provider>
  );
};

export default UnifiedAuthProvider;
