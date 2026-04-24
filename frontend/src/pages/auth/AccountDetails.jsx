import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useClerk, useUser, UserButton } from '@clerk/clerk-react';
import assets from '../../assets/assets';

const AccountDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut, openSignIn } = useClerk();
  const { user, isLoaded } = useUser();

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [isNewAccount, setIsNewAccount] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  // Check if this is a new account creation and load user info
  useEffect(() => {
    if (location.state?.newAccount) {
      setIsNewAccount(true);
      // Auto-hide the new account message after 5 seconds
      setTimeout(() => {
        setIsNewAccount(false);
      }, 5000);
    }

    // Load user information from localStorage or from location state
    const storedUserInfo = localStorage.getItem('userInfo');
    const locationUserInfo = location.state?.userInfo;
    
    if (locationUserInfo) {
      setUserInfo(locationUserInfo);
      localStorage.setItem('userInfo', JSON.stringify(locationUserInfo));
    } else if (storedUserInfo) {
      try {
        setUserInfo(JSON.parse(storedUserInfo));
      } catch (error) {
        console.error('Error parsing stored user info:', error);
      }
    }
  }, [location.state]);

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Handle login prompt
  const handleLoginClick = () => {
    navigate('/login');
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Not available';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // If user is not loaded, show loading
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading account details...</p>
        </div>
      </div>
    );
  }

  // If user is not signed in, show login prompt
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center">
          <div className="mb-6">
            <svg className="w-16 h-16 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Not Signed In</h2>
          <p className="text-gray-600 mb-6">Please sign in to view your account details.</p>
          <button
            onClick={handleLoginClick}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        {/* New Account Success Message */}
        {isNewAccount && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <svg className="w-6 h-6 text-green-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 className="text-sm font-semibold text-green-800 mb-2">
                  Welcome to Your Learning Journey, {user?.firstName || userInfo?.firstName || user?.fullName || userInfo?.fullName || 'Student'}!
                </h3>
                <p className="text-xs text-green-700 mb-3">
                  Your account has been created successfully. Here's what you can do next:
                </p>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <button 
                      onClick={() => navigate('/course-list')}
                      className="text-xs text-green-800 hover:text-green-900 underline font-medium"
                    >
                      Explore Available Courses
                    </button>
                  </div>
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <button 
                      onClick={() => navigate('/')}
                      className="text-xs text-green-800 hover:text-green-900 underline font-medium"
                    >
                      Browse Featured Programs
                    </button>
                  </div>
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <button 
                      onClick={() => navigate('/educator')}
                      className="text-xs text-green-800 hover:text-green-900 underline font-medium"
                    >
                      Become an Educator
                    </button>
                  </div>
                </div>
                <div className="mt-3 p-2 bg-green-100 rounded">
                  <p className="text-xs text-green-800 font-medium">
                    Pro Tip: Check your email for verification to unlock all features!
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Logo */}
        <div className="text-center mb-8">
          <img 
            src={assets.logo} 
            alt="Logo" 
            className="w-24 mx-auto mb-4 cursor-pointer"
            onClick={() => navigate('/')}
          />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Account Details</h1>
          <p className="text-gray-600">
            Welcome back, {user?.firstName || userInfo?.firstName || user?.fullName || userInfo?.fullName || 'Student'}!
          </p>
          <p className="text-sm text-gray-500">Manage your account information</p>
        </div>

        {/* User Profile Section */}
        <div className="mb-6">
          <div className="flex items-center justify-center mb-4">
            <UserButton />
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-800">
              {user.firstName && user.lastName 
                ? `${user.firstName} ${user.lastName}` 
                : user.emailAddresses[0]?.emailAddress}
            </h3>
            <p className="text-sm text-gray-600">{user.emailAddresses[0]?.emailAddress}</p>
          </div>
        </div>

        {/* Account Information */}
        <div className="space-y-4 mb-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Account Information</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">User ID:</span>
                <span className="text-gray-800 font-mono text-xs">{user.id || userInfo?.id || 'Not available'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Full Name:</span>
                <span className="text-gray-800">
                  {user?.fullName || userInfo?.fullName || 
                   (user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : 'Not provided')}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Username:</span>
                <span className="text-gray-800">{user?.username || userInfo?.username || 'Not set'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Email:</span>
                <span className="text-gray-800 text-xs">
                  {user?.emailAddresses?.[0]?.emailAddress || userInfo?.email || 'Not available'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Phone:</span>
                <span className="text-gray-800">
                  {user?.phoneNumbers?.[0]?.phoneNumber || userInfo?.phone || 'Not provided'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Account Type:</span>
                <span className="text-gray-800">{userInfo?.accountType || 'Student'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Role:</span>
                <span className="text-gray-800">{userInfo?.role || 'student'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Registration Source:</span>
                <span className="text-gray-800">{userInfo?.source || 'Unknown'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Created:</span>
                <span className="text-gray-800">{formatDate(user?.createdAt || userInfo?.createdAt)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Last Sign In:</span>
                <span className="text-gray-800">{formatDate(user?.lastSignInAt || userInfo?.lastSignInAt)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Registration Date:</span>
                <span className="text-gray-800">{formatDate(userInfo?.registrationDate)}</span>
              </div>
            </div>
          </div>

          {/* Email Verification Status */}
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-blue-800">Email Verification</h4>
                <p className="text-xs text-blue-600">
                  {user.emailAddresses[0]?.verification?.status === 'verified' 
                    ? 'Verified' 
                    : 'Pending verification'}
                </p>
              </div>
              <div className={`w-3 h-3 rounded-full ${
                user.emailAddresses[0]?.verification?.status === 'verified' 
                  ? 'bg-green-500' 
                  : 'bg-yellow-500'
              }`}></div>
            </div>
          </div>

          {/* Account Statistics */}
          <div className="bg-purple-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-purple-800 mb-2">Account Statistics</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-purple-600">Total Logins:</span>
                <span className="text-purple-800 font-medium">
                  {user.lastSignInAt ? 'Multiple' : 'First'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-purple-600">Account Age:</span>
                <span className="text-purple-800 font-medium">
                  {user.createdAt 
                    ? `${Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24))} days`
                    : 'New'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => navigate('/')}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Dashboard
          </button>
          
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Sign Out
          </button>
        </div>

        {/* Logout Confirmation Modal */}
        {showLogoutConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Sign Out?</h3>
              <p className="text-gray-600 mb-4">Are you sure you want to sign out of your account?</p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        )}

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

export default AccountDetails;
