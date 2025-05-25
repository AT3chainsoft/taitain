import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { 
  DevicePhoneMobileIcon,
  AtSymbolIcon,
  UserIcon
} from '@heroicons/react/24/outline';

const MobileRegisterPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get auth context safely - don't destructure immediately
  const auth = useAuth() || {};
  const registerFn = auth.register; // Access register function safely
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [registrationMethod, setRegistrationMethod] = useState('email');
  
  // Extract referral code from URL if present
  const searchParams = new URLSearchParams(location.search);
  const referralCode = searchParams.get('ref');
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (registrationMethod !== 'email') {
      return; // For non-email methods, we'd handle this differently
    }
    
    // Validate form
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    
    setLoading(true);
    setError('');
    
    // Add referral code to form data if present
    const registrationData = {
      ...formData,
      ...(referralCode && { referralCode })
    };
    
    // Check if register function exists
    if (!registerFn) {
      setError('Registration service is currently unavailable');
      setLoading(false);
      console.error('Register function is missing from auth context');
      return;
    }
    
    try {
      const result = await registerFn(registrationData);
      
      if (result && result.success) {
        toast.success('Registration successful!');
        navigate('/dashboard');
      } else {
        setError((result && result.message) || 'Registration failed');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };
  
  const handleGoogleSignUp = () => {
    toast.info('Google signup would be triggered here');
  };
  
  const handleAppleSignUp = () => {
    toast.info('Apple signup would be triggered here');
  };
  
  const handleWalletConnect = () => {
    navigate('/connect-wallet');
  };
  
  return (
    <div className="mobile-page-transition px-4 py-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Create your account
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Start your staking journey today
        </p>
      </div>
      
      {/* Registration Method Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setRegistrationMethod('email')}
          className={`flex-1 py-2 px-1 text-center ${
            registrationMethod === 'email'
              ? 'border-b-2 border-primary-500 text-primary-600 font-medium'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Email
        </button>
        <button
          onClick={() => setRegistrationMethod('social')}
          className={`flex-1 py-2 px-1 text-center ${
            registrationMethod === 'social'
              ? 'border-b-2 border-primary-500 text-primary-600 font-medium'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Social
        </button>
        <button
          onClick={() => setRegistrationMethod('wallet')}
          className={`flex-1 py-2 px-1 text-center ${
            registrationMethod === 'wallet'
              ? 'border-b-2 border-primary-500 text-primary-600 font-medium'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Wallet
        </button>
      </div>
      
      {error && (
        <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      {registrationMethod === 'email' && (
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                First Name
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                autoComplete="given-name"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                placeholder="John"
                value={formData.firstName}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                Last Name
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                autoComplete="family-name"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                placeholder="Doe"
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>
          
          {referralCode && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Referral Code
              </label>
              <input
                type="text"
                readOnly
                value={referralCode}
                className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm sm:text-sm"
              />
            </div>
          )}
          
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </div>
        </form>
      )}
      
      {registrationMethod === 'social' && (
        <div className="space-y-4">
          <button
            type="button"
            onClick={handleGoogleSignUp}
            className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <AtSymbolIcon className="h-5 w-5 text-red-500 mr-2" />
            Sign up with Google
          </button>
          
          <button
            type="button"
            onClick={handleAppleSignUp}
            className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <DevicePhoneMobileIcon className="h-5 w-5 text-black mr-2" />
            Sign up with Apple
          </button>
          
          <div className="text-sm text-center text-gray-500 mt-6">
            By continuing with social login, you agree to our{' '}
            <Link to="/terms-of-service" className="font-medium text-primary-600 hover:text-primary-500">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link to="/privacy-policy" className="font-medium text-primary-600 hover:text-primary-500">
              Privacy Policy
            </Link>
          </div>
        </div>
      )}
      
      {registrationMethod === 'wallet' && (
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-md mb-6">
            <p className="text-sm text-blue-700">
              Connect your crypto wallet to create an account. You'll be able to use your wallet for deposits and withdrawals.
            </p>
          </div>
          
          <button
            type="button"
            onClick={handleWalletConnect}
            className="w-full flex justify-center items-center px-4 py-3 shadow-sm text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
          >
            <UserIcon className="h-5 w-5 mr-2" />
            Connect Wallet
          </button>
          
          <div className="mt-4 text-center text-sm text-gray-500">
            Supported wallets: MetaMask, TrustWallet, WalletConnect
          </div>
        </div>
      )}
      
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default MobileRegisterPage;
