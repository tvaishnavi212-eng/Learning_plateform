import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useClerk, useUser } from '@clerk/clerk-react';
import { UserButton, SignIn, SignUp, SignedOut } from '@clerk/clerk-react';
import assets from '../../assets/assets';

const ClerkAuthSystem = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut, openSignIn, getToken } = useClerk();
  const { user, isLoaded } = useUser();

  // Get the intended destination from location state
  const from = location.state?.from || '/';
  const initialMode = location.state?.mode || 'signin';

  const [authMode, setAuthMode] = useState(initialMode);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Function to store user data in backend database
  const storeUserInDatabase = async (userInfo) => {
    try {
      const token = await getToken();
      
      if (!token) {
        console.log('No token available, skipping database storage');
        return;
      }

      console.log('Storing user data in database:', userInfo);

      const response = await fetch('http://localhost:5000/api/user/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          clerkId: userInfo.id,
          email: userInfo.email,
          firstName: userInfo.firstName,
          lastName: userInfo.lastName,
          fullName: userInfo.fullName,
          username: userInfo.username,
          imageUrl: userInfo.imageUrl,
          phone: userInfo.phone,
          role: userInfo.role,
          accountType: userInfo.accountType,
          registrationDate: userInfo.registrationDate,
          source: userInfo.source,
          metadata: userInfo.unsafeMetadata
        })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('User data stored successfully in database:', data);
        return data;
      } else {
        console.error('Failed to store user data in database:', response.status, response.statusText);
        return null;
      }
    } catch (error) {
      console.error('Error storing user data in database:', error);
      return null;
    }
  };

  // Auto-redirect if already authenticated
  useEffect(() => {
    if (isLoaded && user) {
      navigate(from, { replace: true });
    }
  }, [isLoaded, user, navigate, from]);

  // Set initial mode based on navigation state
  useEffect(() => {
    if (initialMode === 'signup') {
      console.log('Auto-switching to signup mode based on navigation state');
      setAuthMode('signup');
    }
  }, [initialMode]);

  const handleSignInSuccess = async () => {
    console.log('Sign in successful!');
    setIsLoading(true);
    
    try {
      // Get the current user after successful sign in
      const currentUser = user;
      
      // Store comprehensive user information
      const userInfo = {
        id: currentUser?.id,
        email: currentUser?.emailAddresses?.[0]?.emailAddress,
        firstName: currentUser?.firstName,
        lastName: currentUser?.lastName,
        fullName: currentUser?.fullName,
        username: currentUser?.username,
        imageUrl: currentUser?.imageUrl,
        phone: currentUser?.phoneNumbers?.[0]?.phoneNumber,
        createdAt: currentUser?.createdAt,
        updatedAt: currentUser?.updatedAt,
        lastSignInAt: currentUser?.lastSignInAt,
        unsafeMetadata: currentUser?.unsafeMetadata || {},
        role: currentUser?.unsafeMetadata?.role || 'student',
        accountType: currentUser?.unsafeMetadata?.accountType || 'student',
        source: 'clerk_signin',
        signInTime: new Date().toISOString()
      };
      
      // Store in localStorage for immediate access
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
      localStorage.setItem('lastSignInTime', new Date().toISOString());
      
      console.log('User information stored after sign in:', userInfo);
      
      setSuccessMessage('Successfully signed in! Redirecting...');
      setShowSuccessMessage(true);
      
      // Redirect to intended destination
      setTimeout(() => {
        navigate(from, { replace: true, state: { userInfo: userInfo } });
      }, 2000);
    } catch (error) {
      console.error('Error processing user information after sign in:', error);
      setSuccessMessage('Successfully signed in! Redirecting...');
      setShowSuccessMessage(true);
      
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 2000);
    }
  };

  const handleSignUpSuccess = async () => {
    console.log('Account creation successful!');
    setIsLoading(true);
    
    try {
      // Get the current user after successful signup
      const currentUser = user;
      
      // Store comprehensive user information
      const userInfo = {
        id: currentUser?.id,
        email: currentUser?.emailAddresses?.[0]?.emailAddress,
        firstName: currentUser?.firstName,
        lastName: currentUser?.lastName,
        fullName: currentUser?.fullName,
        username: currentUser?.username,
        imageUrl: currentUser?.imageUrl,
        phone: currentUser?.phoneNumbers?.[0]?.phoneNumber,
        createdAt: currentUser?.createdAt,
        updatedAt: currentUser?.updatedAt,
        lastSignInAt: currentUser?.lastSignInAt,
        unsafeMetadata: currentUser?.unsafeMetadata || {},
        role: 'student',
        accountType: 'student',
        registrationDate: new Date().toISOString(),
        source: 'clerk_signup'
      };
      
      // Store in localStorage for immediate access
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
      localStorage.setItem('accountCreated', 'true');
      localStorage.setItem('accountCreationTime', new Date().toISOString());
      localStorage.setItem('userRole', 'student');
      
      console.log('User information stored:', userInfo);
      
      // Store user data in backend database
      try {
        const dbResult = await storeUserInDatabase(userInfo);
        if (dbResult) {
          console.log('User successfully stored in database');
        } else {
          console.log('Database storage failed, but continuing with localStorage');
        }
      } catch (error) {
        console.error('Database storage error:', error);
      }
      
      // Create personalized success message with user name
      const userName = currentUser?.firstName || currentUser?.fullName || 'Student';
      setSuccessMessage(`Account created successfully! Welcome to our learning platform, ${userName}! Redirecting to your dashboard...`);
      setShowSuccessMessage(true);
      
      // Show success animation and redirect
      setTimeout(() => {
        navigate('/account-details', { 
          replace: true, 
          state: { 
            newAccount: true, 
            from,
            message: 'Welcome! Your account has been created successfully. You can now explore courses, enroll in programs, and start your learning journey!',
            showWelcome: true,
            timestamp: new Date().toISOString(),
            userInfo: userInfo,
            nextSteps: [
              'Explore available courses',
              'Enroll in your favorite subjects',
              'Track your learning progress',
              'Join our learning community'
            ]
          } 
        });
      }, 3000);
    } catch (error) {
      console.error('Error processing user information:', error);
      setSuccessMessage('Account created but there was an issue processing your information. Please continue to your dashboard.');
      setShowSuccessMessage(true);
      
      setTimeout(() => {
        navigate('/account-details', { 
          replace: true, 
          state: { 
            newAccount: true, 
            from,
            message: 'Welcome! Your account has been created successfully.',
            showWelcome: true,
            timestamp: new Date().toISOString()
          } 
        });
      }, 3000);
    }
  };

  const handleSignInError = (error) => {
    console.error('Sign in error:', error);
    setIsLoading(false);
  };

  const handleSignUpError = (error) => {
    console.error('Sign up error:', error);
    setIsLoading(false);
    
    // User-friendly error messages
    let errorMessage = 'Account creation failed. Please try again.';
    
    if (error.errors) {
      if (error.errors.some(e => e.code === 'form_password_pwned')) {
        errorMessage = 'This password has been compromised. Please choose a different password.';
      } else if (error.errors.some(e => e.code === 'form_identifier_exists')) {
        errorMessage = 'An account with this email already exists. Please sign in instead.';
      } else if (error.errors.some(e => e.code === 'form_password_length_too_short')) {
        errorMessage = 'Password must be at least 8 characters long.';
      } else if (error.errors.some(e => e.code === 'form_param_format_invalid')) {
        errorMessage = 'Invalid email format. Please check your email address.';
      }
    }
    
    setSuccessMessage(errorMessage);
    setShowSuccessMessage(true);
    
    // Auto-hide error message after 5 seconds
    setTimeout(() => {
      setShowSuccessMessage(false);
      setSuccessMessage('');
    }, 5000);
  };

  const switchToMode = (mode) => {
    console.log('Switching to mode:', mode);
    setAuthMode(mode);
    setShowSuccessMessage(false);
    setSuccessMessage('');
    setIsLoading(false);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  // If user is already signed in, show user info
  if (isLoaded && user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center">
          <div className="mb-6">
            <UserButton />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Welcome back, {user.firstName || user.emailAddresses[0]?.emailAddress}!
          </h2>
          <p className="text-gray-600 mb-6">You are already signed in.</p>
          <div className="space-y-3">
            <button
              onClick={() => navigate(from)}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Continue to Dashboard
            </button>
            <button
              onClick={handleSignOut}
              className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  }

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
            {authMode === 'signin' ? 'Welcome Back' : 
             authMode === 'signup' ? 'Create Account' : 'Reset Password'}
          </h1>
          <p className="text-gray-600">
            {authMode === 'signin' ? 'Sign in to access your courses and dashboard' : 
             authMode === 'signup' ? 'Join our learning platform today' : 
             'Recover your account access'}
          </p>
        </div>

        {/* Success Message */}
        {showSuccessMessage && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm font-medium text-green-800">{successMessage}</p>
            </div>
          </div>
        )}

        {/* Auth Mode Tabs */}
        <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
          <button
            onClick={() => switchToMode('signin')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              authMode === 'signin'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              console.log('Create Account button clicked - switching to signup mode');
              switchToMode('signup');
              // Add visual feedback
              alert('Create Account button clicked! The signup form should appear below.');
            }}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
              authMode === 'signup'
                ? 'bg-white text-blue-600 shadow-sm ring-2 ring-blue-500'
                : 'text-gray-600 hover:text-gray-800 bg-white hover:shadow-md'
            }`}
          >
            {authMode === 'signup' ? 'Creating Account...' : 'Create Account'}
          </button>
        </div>

        {/* Clerk Authentication Components */}
        <div className="space-y-4">
          {authMode === 'signin' && (
            <SignedOut>
              <SignIn 
                path="/sign-in"
                routing="path"
                signInUrl="/sign-in"
                afterSignInUrl={from}
                redirectUrl={from}
                onSignInSuccess={handleSignInSuccess}
                onError={handleSignInError}
                // Social providers
                socialProviders={['google', 'github', 'apple']}
                // Remember me option
                rememberMe={true}
                // Redirect strategies
                fallbackRedirectUrl="/login"
                // Additional sign-in options
                collectAdditionalInfo={false}
                // Appearance customization
                appearance={{
                  elements: {
                    rootBox: 'w-full',
                    card: 'shadow-none border-0',
                    formButtonPrimary: 'bg-blue-600 hover:bg-blue-700 text-white',
                    formFieldInput: 'border-gray-300 focus:border-blue-500 focus:ring-blue-500',
                    footerAction: 'text-blue-600 hover:text-blue-700',
                    headerTitle: 'text-2xl font-bold text-gray-900',
                    headerSubtitle: 'text-sm text-gray-600'
                  }
                }}
              />
            </SignedOut>
          )}

          {authMode === 'signup' && (
            <div>
              {/* User Guidance */}
              <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start space-x-3">
                  <svg className="w-6 h-6 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h3 className="text-sm font-semibold text-blue-800 mb-2">Create Your Account - Easy Steps!</h3>
                    <div className="space-y-1">
                      <p className="text-xs text-blue-700">1. Fill in your email and create a strong password</p>
                      <p className="text-xs text-blue-700">2. Add your first name and last name</p>
                      <p className="text-xs text-blue-700">3. Choose a username (optional)</p>
                      <p className="text-xs text-blue-700">4. Verify your email address</p>
                      <p className="text-xs text-blue-700">5. Start learning! Your account will be ready instantly</p>
                    </div>
                    <div className="mt-2 p-2 bg-blue-100 rounded">
                      <p className="text-xs text-blue-800 font-medium">Quick Tip: Use Google, GitHub, or Apple for faster signup!</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Debug info */}
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm font-medium text-green-800">Sign-up mode is active! The account creation form should appear below.</p>
                </div>
                <p className="text-xs text-green-600 mt-1">Current mode: {authMode}</p>
              </div>
              
              <SignedOut>
                <SignUp 
                  path="/sign-up"
                  routing="path"
                  signUpUrl="/sign-up"
                  afterSignUpUrl="/account-details"
                  redirectUrl="/account-details"
                  onSignUpSuccess={handleSignUpSuccess}
                  onError={handleSignUpError}
                  // Clerk account creation features
                  signInFallbackUrl="/login"
                  forceRedirectUrl="/account-details"
                  unsafeMetadata={{
                    source: 'web_app',
                    accountType: 'student',
                    registrationDate: new Date().toISOString(),
                    platform: 'institute_management',
                    userRole: 'student',
                    registrationSource: 'clerk_signup',
                    applicationVersion: '1.0.0'
                  }}
                  // Social providers
                  socialProviders={['google', 'github', 'apple']}
                  // Email verification
                  verifyEmailAfterSignUp={true}
                  // Password requirements
                  passwordRequirements={{
                    minLength: 8,
                    requireSpecialChar: true,
                    requireNumbers: true,
                    requireUppercase: true,
                    requireLowercase: true
                  }}
                  // Additional sign-up options
                  skipPasswordRequirement={false}
                  continueSignUpInitiation={false}
                  // Collect additional user information
                  collectAdditionalInfo={true}
                  // Appearance customization
                  appearance={{
                    elements: {
                      rootBox: 'w-full',
                      card: 'shadow-none border-0',
                      formButtonPrimary: 'bg-blue-600 hover:bg-blue-700 text-white',
                      formFieldInput: 'border-gray-300 focus:border-blue-500 focus:ring-blue-500',
                      footerAction: 'text-blue-600 hover:text-blue-700',
                      headerTitle: 'text-2xl font-bold text-gray-900',
                      headerSubtitle: 'text-sm text-gray-600'
                    }
                  }}
                  // Form fields configuration
                  fields={{
                    firstName: {
                      required: true,
                      label: 'First Name'
                    },
                    lastName: {
                      required: true,
                      label: 'Last Name'
                    },
                    username: {
                      required: false,
                      label: 'Username (optional)'
                    }
                  }}
                />
              </SignedOut>
              
              {/* Test button for direct account creation */}
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">If the form above doesn't appear, try this test:</p>
                <button
                  onClick={() => {
                    console.log('Test account creation triggered');
                    alert('Account creation test - Clerk SignUp should be visible above');
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Test Account Creation
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Features Information */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <div>
              <p className="text-sm font-medium text-blue-800">Create Account with Clerk</p>
              <p className="text-xs text-blue-600 mt-1">Secure authentication with email verification and social login options</p>
              <p className="text-xs text-blue-600">
                {authMode === 'signin' ? 'Sign in with email/password or social accounts' :
                 authMode === 'signup' ? 'Create account with email verification and social login' :
                 'Secure password recovery'}
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

export default ClerkAuthSystem;
