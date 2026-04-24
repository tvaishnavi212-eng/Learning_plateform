import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useClerk, useUser, SignIn } from '@clerk/clerk-react';
import assets from '../../assets/assets';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { openSignIn, signOut } = useClerk();
  const { user, isLoaded } = useUser();

  // Get the intended destination from location state
  const from = location.state?.from?.pathname || '/';

  // Redirect to comprehensive ClerkAuthSystem if Clerk is available
  useEffect(() => {
    if (isLoaded) {
      navigate('/clerk-auth', { replace: true, state: { from } });
    }
  }, [isLoaded, navigate, from]);

  const [isSignUp, setIsSignUp] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [accountCreated, setAccountCreated] = useState(false);

  const handleSignInSuccess = () => {
    // Redirect to the intended destination after successful sign in
    navigate(from, { replace: true });
  };

  const handleSignUpSuccess = () => {
    // Show success message for account creation
    setSuccessMessage(`Account created successfully! Welcome to our learning platform.`);
    setShowSuccessMessage(true);
    setAccountCreated(true);
    
    // Auto-redirect after showing success message
    setTimeout(() => {
      navigate(from, { replace: true });
    }, 3000);
  };

  const handleAfterSignUpSubmit = () => {
    // This is called after sign up form is submitted
    console.log('Sign up form submitted');
  };

  const handleSignInComplete = () => {
    // This is called when sign in is complete
    console.log('Sign in complete');
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
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
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h1>
          <p className="text-gray-600">
            {isSignUp ? 'Sign up to access your courses and dashboard' : 'Sign in to access your courses and dashboard'}
          </p>
        </div>

        {/* Toggle Buttons */}
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

        {/* Clerk Components */}
        <div className="space-y-4">
          {isSignUp ? (
            <SignUp 
              path="/sign-up"
              routing="path"
              signUpUrl="/sign-up"
              afterSignUpUrl={from}
              redirectUrl={from}
              onSignUpSuccess={handleSignUpSuccess}
              afterSubmit={handleAfterSignUpSubmit}
              // Clerk account creation features
              signInFallbackUrl="/login"
              forceRedirectUrl={from}
              unsafeMetadata={{
                source: 'web_app',
                accountType: 'student',
                registrationDate: new Date().toISOString()
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
                requireUppercase: true
              }}
            />
          ) : (
            <SignIn 
              path="/sign-in"
              routing="path"
              signInUrl="/sign-in"
              afterSignInUrl={from}
              redirectUrl={from}
              onSignInSuccess={handleSignInSuccess}
              onComplete={handleSignInComplete}
              // Social providers for sign in
              socialProviders={['google', 'github', 'apple']}
              // Remember me option
              rememberMe={true}
              // Redirect strategies
              fallbackRedirectUrl="/login"
            />
          )}
        </div>

        {/* Security Notice */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <div>
              <p className="text-sm font-medium text-blue-800">Advanced Clerk Authentication</p>
              <p className="text-xs text-blue-600">Secure account creation with email verification, social login, and password protection</p>
            </div>
          </div>
        </div>

        {/* Help Links */}
        <div className="mt-6 text-center space-y-2">
          <button 
            onClick={() => navigate('/')}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            ← Back to Home
          </button>
          <div className="text-xs text-gray-500">
            Need help? Contact support@example.com
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
