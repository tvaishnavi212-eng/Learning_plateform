import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUnifiedAuth } from '../../components/auth/UnifiedAuthProvider';
import { useFallbackAuth } from '../../components/auth/FallbackAuth';
import assets from '../../assets/assets';

const SimpleLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { useClerk } = useUnifiedAuth();
  
  // Use fallback auth directly for SimpleLogin
  const fallbackAuth = useFallbackAuth();
  const { login, user, isAuthenticated, isLoading } = fallbackAuth;
  
  // Redirect to main login if Clerk is available
  useEffect(() => {
    if (useClerk) {
      navigate('/login', { replace: true });
    }
  }, [useClerk, navigate]);
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, user, navigate]);
  
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Get the intended destination from location state
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (isSignUp) {
      // Registration validation
      if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
        setError('Please fill in all fields');
        return;
      }
      
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }
    } else {
      // Login validation
      if (!formData.email || !formData.password) {
        setError('Please fill in all fields');
        return;
      }
    }

    try {
      console.log('Form submission:', { isSignUp, email: formData.email, name: formData.name });
      
      if (isSignUp) {
        // Registration - create account
        console.log('Attempting registration with:', formData.email, formData.name);
        const result = await login(formData.email, formData.password, { name: formData.name });
        console.log('Registration result:', result);
        
        if (result.success) {
          setSuccessMessage(`Account created successfully! Welcome, ${formData.name}!`);
          setTimeout(() => {
            navigate(from, { 
              replace: true,
              state: { 
                message: `Welcome ${formData.name}! Your student account has been created.`,
                type: 'success'
              }
            });
          }, 2000);
        } else {
          console.error('Registration failed:', result.message);
          setError(result.message || 'Registration failed');
        }
      } else {
        // Login
        console.log('Attempting login with:', formData.email);
        const result = await login(formData.email, formData.password);
        console.log('Login result:', result);
        
        if (result.success) {
          // Check if this is a new user (created within last 10 seconds)
          const isNewUser = result.user.createdAt && 
            (new Date(result.user.createdAt).getTime() > Date.now() - 10000);
          
          if (isNewUser) {
            // Show success message for new account creation
            navigate(from, { 
              replace: true,
              state: { 
                message: `Welcome! Your account has been created successfully.`,
                type: 'success'
              }
            });
          } else {
            navigate(from, { replace: true });
          }
        } else {
          console.error('Login failed:', result.message);
          setError(result.message || 'Login failed');
        }
      }
    } catch (err) {
      console.error('Authentication error:', err);
      setError(isSignUp ? 'An error occurred during registration' : 'An error occurred during login');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setError('');
    setSuccessMessage('');
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
  };

  // Check for success message from navigation state
  useEffect(() => {
    if (location.state?.message && location.state?.type === 'success') {
      setSuccessMessage(location.state.message);
      // Clear the message after 5 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
    }
  }, [location.state]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <img 
            src={assets.logo} 
            alt="Logo" 
            className="w-24 mx-auto mb-4 cursor-pointer"
            onClick={() => navigate('/')}
          />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            {isSignUp ? 'Create Student Account' : 'Welcome Back'}
          </h1>
          <p className="text-gray-600">
            {isSignUp ? 'Sign up to access your courses and dashboard' : 'Sign in to access your courses and dashboard'}
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
          <button
            onClick={() => setIsSignUp(false)}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              !isSignUp
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setIsSignUp(true)}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              isSignUp
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Login/Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {successMessage && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
              {successMessage}
            </div>
          )}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}
          
          {/* Name field - only for registration */}
          {isSignUp && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your full name"
                required
              />
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={isSignUp ? "Create a password (min 6 characters)" : "Enter your password"}
              required
            />
          </div>

          {/* Confirm password - only for registration */}
          {isSignUp && (
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Confirm your password"
                required
              />
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (isSignUp ? 'Creating Account...' : 'Signing in...') : (isSignUp ? 'Create Account' : 'Sign In')}
          </button>
        </form>

        {/* Student Account Info */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <div>
              <p className="text-sm font-medium text-blue-800">Student Registration</p>
              <p className="text-xs text-blue-600">
                {isSignUp ? 'Create your student account with name and email' : 'Sign in to access your learning dashboard'}
              </p>
            </div>
          </div>
        </div>

        {/* Help Links */}
        <div className="mt-6 text-center space-y-2">
          <button 
            onClick={() => navigate('/')}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Back to Home
          </button>
          <div className="text-xs text-gray-500">
            Need help? Contact support@example.com
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleLogin;
