import React, { createContext, useContext, useState, useEffect } from 'react';

const FallbackAuthContext = createContext();

export const useFallbackAuth = () => {
  const context = useContext(FallbackAuthContext);
  if (!context) {
    throw new Error('useFallbackAuth must be used within a FallbackAuthProvider');
  }
  return context;
};

export const FallbackAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Check localStorage on mount
  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      try {
        const parsedUser = JSON.parse(currentUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('currentUser');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email, password, options = {}) => {
    setIsLoading(true);
    try {
      // Check if user already exists in localStorage
      const existingUsers = JSON.parse(localStorage.getItem('fallbackUsers') || '{}');
      
      if (email && password) {
        let mockUser;
        
        // Check if user already exists
        if (existingUsers[email]) {
          mockUser = existingUsers[email];
          // Update last login time for existing user
          mockUser.lastLogin = new Date().toISOString();
        } else {
          // Create new user
          mockUser = {
            id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            email: email,
            name: options.name || email.split('@')[0],
            imageUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(options.name || email.split('@')[0])}&background=random&color=fff`,
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString()
          };
          
          // Add to users collection
          existingUsers[email] = mockUser;
          localStorage.setItem('fallbackUsers', JSON.stringify(existingUsers));
        }
        
        // Update user in storage
        existingUsers[email] = mockUser;
        localStorage.setItem('fallbackUsers', JSON.stringify(existingUsers));
        
        // Set current user
        setUser(mockUser);
        setIsAuthenticated(true);
        localStorage.setItem('currentUser', JSON.stringify(mockUser));
        
        return { success: true, user: mockUser };
      }
      return { success: false, message: 'Invalid credentials' };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Login failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('currentUser');
  };

  const getAllUsers = () => {
    try {
      const users = JSON.parse(localStorage.getItem('fallbackUsers') || '{}');
      return Object.values(users);
    } catch (error) {
      console.error('Error getting users:', error);
      return [];
    }
  };

  const getUserByEmail = (email) => {
    try {
      const users = JSON.parse(localStorage.getItem('fallbackUsers') || '{}');
      return users[email] || null;
    } catch (error) {
      console.error('Error getting user by email:', error);
      return null;
    }
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    getAllUsers,
    getUserByEmail
  };

  return (
    <FallbackAuthContext.Provider value={value}>
      {children}
    </FallbackAuthContext.Provider>
  );
};

export default FallbackAuthProvider;
