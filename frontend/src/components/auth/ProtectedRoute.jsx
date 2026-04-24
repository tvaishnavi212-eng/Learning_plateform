import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUnifiedAuth } from './UnifiedAuthProvider';

const ProtectedRoute = ({ children, requireAuth = true, redirectTo = '/login' }) => {
  const { user, isAuthenticated, isLoading } = useUnifiedAuth();
  const location = useLocation();

  // Show loading while authentication is initializing
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If authentication is required and user is not authenticated, redirect to login
  if (requireAuth && !isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // If user is authenticated, render the protected content
  return children;
};

export default ProtectedRoute;
