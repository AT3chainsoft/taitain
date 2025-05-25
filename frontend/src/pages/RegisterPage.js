import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import axios from '../utils/axios';
import MobileBrowserNotice from '../components/MobileBrowserNotice';

// Wallet icons as base64 or reliable URLs
const WALLET_ICONS = {
  metamask: "https://cdn.iconscout.com/icon/free/png-256/metamask-2728406-2261817.png",
  coinbase: "https://play-lh.googleusercontent.com/PjoJoG27miSglVBXoXrxBSLveV6e3EeBPpNY55aiUUBM9Q1RCETKCOqdOkX2ZydqVf0=w240-h480-rw",
  trust: "https://trustwallet.com/assets/images/media/assets/TWT.png",
  brave: "https://brave.com/static-assets/images/brave-logo-dark.svg",
  walletconnect: "https://1000logos.net/wp-content/uploads/2022/05/WalletConnect-Logo.png"
};

// More compact wallet option component
const WalletOption = ({ name, icon, onClick, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`flex items-center justify-between w-full p-2 sm:p-3 mb-2 border rounded-lg transition-all ${
      disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary-500 cursor-pointer hover:shadow-sm'
    }`}
  >
    <div className="flex items-center">
      <div className="w-6 h-6 sm:w-8 sm:h-8 mr-2 sm:mr-3 flex items-center justify-center">
        <img src={icon} alt={name} className="max-w-full max-h-full object-contain" 
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://placehold.co/200x200/png?text=" + name;
          }}
        />
      </div>
      <span className="font-medium text-sm sm:text-base">{name}</span>
    </div>
    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
    </svg>
  </button>
);

const RegisterPage = () => {
  // Authentication method states
  const [authMethod, setAuthMethod] = useState('wallet');
  
  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [selectedProvider, setSelectedProvider] = useState(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  // Get all needed auth functions properly from the useAuth hook
  const auth = useAuth();
  const { 
    register, 
    walletLogin, 
    isAuthenticated, 
    googleLogin, 
    setReferralCode: setContextReferralCode, 
    referralCode: contextReferralCode 
  } = auth;
  
  const navigate = useNavigate();
  const location = useLocation();

  // Extract referral code from URL if present
  const queryParams = new URLSearchParams(location.search);
  const referralCodeFromUrl = queryParams.get('ref');

  useEffect(() => {
    // Check URL for referral code
    const params = new URLSearchParams(location.search);
    const refCode = params.get('ref');
    if (refCode) {
      setReferralCode(refCode);
      setContextReferralCode(refCode); // Also store in context for other auth methods
    } else if (contextReferralCode) {
      // Use code from context if available
      setReferralCode(contextReferralCode);
    }
  }, [location, contextReferralCode, setContextReferralCode]);

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleEmailSignup = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    let success;
    if (referralCodeFromUrl) {
      success = await register(email, password, referralCodeFromUrl);
    } else {
      success = await register(email, password);
    }
    
    if (!success) {
      setIsSubmitting(false);
    }
  };

  // Add state for email collection when needed
  const [needsEmail, setNeedsEmail] = useState(false);
  const [walletEmail, setWalletEmail] = useState('');
  
  const handleWalletConnect = async (provider) => {
    setError('');
    setIsSubmitting(true);
    setSelectedProvider(provider);

    try {
      // Use walletLogin directly from the destructured hook values
      if (!walletLogin) {
        setError('Authentication service is currently unavailable');
        setIsSubmitting(false);
        return;
      }
      
      // If we need email and have it, complete the login with email
      if (needsEmail && walletEmail) {
        const result = await walletLogin(walletEmail);
        if (!result.success) {
          setError(result.error || 'Registration failed');
          setIsSubmitting(false);
        }
        return;
      }
      
      // Otherwise start fresh wallet connection
      const result = await walletLogin();
      
      if (!result.success) {
        // If we need to collect email
        if (result.needsEmail) {
          setWalletAddress(result.walletAddress);
          setNeedsEmail(true);
          setIsSubmitting(false);
          return;
        }
        
        setError(result.error || 'Failed to connect wallet');
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('Error during wallet registration:', error);
      setError(error.message || `Failed to register with ${provider}`);
      toast.error(error.message || `Failed to register with ${provider}`);
      setIsSubmitting(false);
    }
  };
  
  // Handle email form submission
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!walletEmail) {
      setError('Email is required');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const result = await walletLogin(walletEmail);
      if (!result.success) {
        setError(result.error || 'Registration failed');
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('Wallet registration error:', error);
      setError(error.message || 'Failed to register');
      setIsSubmitting(false);
    }
  };
  
  const handleGoogleSignup = async () => {
    // Store referral code in context before redirecting
    if (referralCode) {
      setContextReferralCode(referralCode);
    }
    googleLogin();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 py-4 sm:py-8 px-3 sm:px-6">
      <div className="max-w-md w-full space-y-3 sm:space-y-6">
        {/* Smaller, more compact header */}
        <div>
          <h2 className="text-center text-xl sm:text-2xl font-bold text-gray-900">
            Create your Titan account
          </h2>
          <p className="mt-1 text-center text-xs sm:text-sm text-gray-600">
            Connect your wallet to start your journey{' '}
            <Link
              to="/login"
              className="font-medium text-primary-600 hover:text-primary-500 transition-colors"
            >
              or sign in
            </Link>
          </p>
        </div>

        <div className="bg-white py-5 px-4 shadow sm:rounded-lg sm:px-6 border border-gray-200">
          <MobileBrowserNotice />

          {referralCodeFromUrl && (
            <div className="mb-3 sm:mb-4 p-3 bg-green-50 text-green-800 rounded-md border border-green-200 flex items-start">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 mt-0.5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <div>
                <p className="font-medium text-sm">Referral Bonus Active!</p>
                <p className="text-xs">You were referred by someone. You'll receive benefits when you stake.</p>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-3 sm:mb-4 p-3 bg-red-50 text-red-800 rounded-md border border-red-200 flex items-start">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 mt-0.5 text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span className="text-xs sm:text-sm">{error}</span>
            </div>
          )}

          <div className="mb-4">
            {/* Referral Code Input - more compact */}
            <div className="mb-4 mt-2">
              <label htmlFor="walletReferralCode" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Referral Code (Optional)
              </label>
              <div className="relative rounded-md shadow-sm">
                <input
                  id="walletReferralCode"
                  name="referralCode"
                  type="text"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value)}
                  className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-3 pr-10 py-2 text-xs sm:text-sm border-gray-300 rounded-md"
                  placeholder="Enter referral code if you have one"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
              <p className="mt-1 text-xs text-gray-500">Enter a code to receive bonuses</p>
            </div>
            
            {/* More compact info box */}
            <div className="text-center mb-4 text-xs sm:text-sm font-medium text-gray-600">
              Select a wallet to connect
            </div>
            
            {/* Wallet Options Section - more compact */}
            <div className="space-y-2">
              <WalletOption 
                name="MetaMask" 
                icon={WALLET_ICONS.metamask}
                onClick={() => handleWalletConnect('metamask')}
                disabled={isSubmitting}
              />
              
              <WalletOption 
                name="Coinbase Wallet" 
                icon={WALLET_ICONS.coinbase}
                onClick={() => handleWalletConnect('coinbase')}
                disabled={isSubmitting}
              />
              
              <WalletOption 
                name="Trust Wallet" 
                icon={WALLET_ICONS.trust}
                onClick={() => handleWalletConnect('trust')}
                disabled={isSubmitting}
              />
              
              <WalletOption 
                name="Brave Wallet" 
                icon={WALLET_ICONS.brave}
                onClick={() => handleWalletConnect('brave')}
                disabled={isSubmitting}
              />
              
              <WalletOption 
                name="WalletConnect" 
                icon={WALLET_ICONS.walletconnect}
                onClick={() => handleWalletConnect('walletconnect')}
                disabled={isSubmitting}
              />
            </div>
            
            {isSubmitting && (
              <div className="mt-4 text-center">
                <div className="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary-600"></div>
                <p className="mt-1 text-xs sm:text-sm text-gray-600">Connecting to {selectedProvider}...</p>
              </div>
            )}
            
            {needsEmail && walletAddress ? (
              <div className="mt-4">
                <div className="mb-3 p-3 bg-green-50 text-green-800 rounded-md border border-green-200">
                  <p className="font-medium flex items-center text-sm">
                    <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    Wallet Connected!
                  </p>
                  <p className="text-xs mt-1 truncate">{walletAddress}</p>
                </div>
                
                <form onSubmit={handleEmailSubmit}>
                  <div className="mb-3">
                    <label htmlFor="walletEmail" className="block text-xs sm:text-sm font-medium text-gray-700">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-1">
                      <input
                        type="email"
                        id="walletEmail"
                        name="email"
                        value={walletEmail}
                        onChange={(e) => setWalletEmail(e.target.value)}
                        className="appearance-none block w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Required for account registration
                    </p>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting || !walletEmail}
                    className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-xs sm:text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary-500 disabled:opacity-50"
                  >
                    {isSubmitting ? 'Creating Account...' : 'Complete Registration'}
                  </button>
                </form>
              </div>
            ) : (
              <></>
            )}
          </div>

          <div className="mt-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-white text-gray-500">
                  Already have an account?
                </span>
              </div>
            </div>

            <div className="mt-3">
              <Link
                to="/login"
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-xs sm:text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
        
        <div className="text-center text-xs text-gray-500">
          By connecting, you agree to our 
          <Link to="/terms" className="text-primary-600 hover:text-primary-500 ml-1">Terms</Link> & 
          <Link to="/privacy" className="text-primary-600 hover:text-primary-500 ml-1">Privacy</Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
