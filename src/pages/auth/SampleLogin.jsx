import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUnifiedAuth } from '../../components/auth/UnifiedAuthProvider';
import { useFallbackAuth } from '../../components/auth/FallbackAuth';
import assets from '../../assets/assets';

const SampleLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { useClerk } = useUnifiedAuth();
  
  // Use fallback auth directly for SampleLogin
  const fallbackAuth = useFallbackAuth();
  const { login, user, isAuthenticated, isLoading } = fallbackAuth;
  
  // Redirect to main login if Clerk is available
  useEffect(() => {
    if (useClerk) {
      navigate('/login', { replace: true });
      return;
    }
  }, [useClerk, navigate]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      navigate('/', { replace: true });
      return;
    }
  }, [isAuthenticated, user, navigate]);
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Get the intended destination from location state
  const from = location.state?.from?.pathname || '/';

  // Pre-fill sample credentials for demonstration
  const fillSampleCredentials = (type) => {
    if (type === 'student') {
      setFormData({
        email: 'student@example.com',
        password: 'student123'
      });
    } else if (type === 'educator') {
      setFormData({
        email: 'educator@example.com',
        password: 'educator123'
      });
    } else if (type === 'new') {
      setFormData({
        email: `user${Date.now()}@example.com`,
        password: 'newuser123'
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      if (!login) {
        setError('Login function not available');
        return;
      }
      
      const result = await login(formData.email, formData.password);
      if (result.success) {
        // Check if this is a new user (created within last 10 seconds)
        const isNewUser = result.user.createdAt && 
          (new Date(result.user.createdAt).getTime() > Date.now() - 10000);
        
        if (isNewUser) {
          setSuccessMessage(`Welcome! Your account has been created successfully.`);
        } else {
          setSuccessMessage(`Welcome back! Logged in as ${result.user.email}`);
        }
        
        // Redirect after a short delay to show success message
        setTimeout(() => {
          navigate(from, { replace: true });
        }, 1500);
      } else {
        setError(result.message || 'Login failed');
      }
    } catch (err) {
      setError('An error occurred during login');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

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
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Sample Login</h1>
          <p className="text-gray-600">Try our sample authentication system</p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm font-medium text-green-800">{successMessage}</p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
          </div>
        )}

        {/* Sample Credentials */}
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm font-medium text-blue-800 mb-2">Quick Login Samples:</p>
          <div className="space-y-2">
            <button
              onClick={() => fillSampleCredentials('student')}
              className="w-full text-left px-3 py-2 bg-white rounded border border-blue-200 hover:bg-blue-50 transition-colors"
            >
              <span className="text-xs font-medium text-blue-700">Student Account</span>
              <div className="text-xs text-gray-600">student@example.com / student123</div>
            </button>
            <button
              onClick={() => fillSampleCredentials('educator')}
              className="w-full text-left px-3 py-2 bg-white rounded border border-blue-200 hover:bg-blue-50 transition-colors"
            >
              <span className="text-xs font-medium text-blue-700">Educator Account</span>
              <div className="text-xs text-gray-600">educator@example.com / educator123</div>
            </button>
            <button
              onClick={() => fillSampleCredentials('new')}
              className="w-full text-left px-3 py-2 bg-white rounded border border-green-200 hover:bg-green-50 transition-colors"
            >
              <span className="text-xs font-medium text-green-700">Create New Account</span>
              <div className="text-xs text-gray-600">Generates unique email</div>
            </button>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
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
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Instructions */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-sm font-medium text-gray-800">Sample Authentication</p>
              <p className="text-xs text-gray-600">This is a demo login system. Try the sample accounts above!</p>
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
            This is a sample login for demonstration purposes
          </div>
        </div>
      </div>
    </div>
  );
};

export default SampleLogin;
