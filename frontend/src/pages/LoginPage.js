import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useMobile } from '../contexts/MobileContext';
import MobileBrowserNotice from '../components/MobileBrowserNotice';

// Wallet icons as base64 or reliable URLs
const WALLET_ICONS = {
  metamask: "https://cdn.iconscout.com/icon/free/png-256/metamask-2728406-2261817.png",
  coinbase: "https://play-lh.googleusercontent.com/PjoJoG27miSglVBXoXrxBSLveV6e3EeBPpNY55aiUUBM9Q1RCETKCOqdOkX2ZydqVf0=w240-h480-rw",
  trust: "https://trustwallet.com/assets/images/media/assets/TWT.png",
  brave: "https://brave.com/static-assets/images/brave-logo-dark.svg",
  walletconnect: "https://1000logos.net/wp-content/uploads/2022/05/WalletConnect-Logo.png"
};

// Wallet option component
const WalletOption = ({ name, icon, onClick, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`flex items-center justify-between w-full p-3 mb-2 border rounded-lg transition-all hover:shadow-md ${
      disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary-500 cursor-pointer'
    }`}
  >
    <div className="flex items-center">
      <div className="w-7 h-7 mr-3 flex items-center justify-center">
        <img src={icon} alt={name} className="max-w-full max-h-full object-contain" 
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://placehold.co/200x200/png?text=" + name;
          }}
        />
      </div>
      <span className="font-medium">{name}</span>
    </div>
    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
    </svg>
  </button>
);

const WalletInfoPopup = ({ onClose }) => (
  <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 max-w-md w-full">
      <h3 className="text-xl font-bold mb-4">Wallet Authentication Process</h3>
      <p className="mb-4">Wallet login is a two-step process:</p>
      <ol className="list-decimal pl-5 mb-6 space-y-2">
        <li><strong>Connect wallet</strong> - Give the website permission to see your address</li>
        <li><strong>Sign message</strong> - Verify you're the wallet owner (no gas fees, completely safe)</li>
      </ol>
      <p className="text-sm text-gray-600 mb-6">
        Signing a message is secure and doesn't allow any access to your funds. It's like providing a digital signature to verify your identity.
      </p>
      <button 
        onClick={onClose}
        className="w-full bg-primary-600 text-white py-2 rounded hover:bg-primary-700"
      >
        Got it
      </button>
    </div>
  </div>
);

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isWalletConnecting, setIsWalletConnecting] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [walletConnected, setWalletConnected] = useState(false);
  const [showWalletInfo, setShowWalletInfo] = useState(false);
  const [needsEmail, setNeedsEmail] = useState(false);
  const [email, setEmail] = useState('');
  const [selectedProvider, setSelectedProvider] = useState(null);
  
  // Get auth context with proper destructuring to access walletLogin directly
  const { isAuthenticated, walletLogin } = useAuth();
  
  const navigate = useNavigate();
  const location = useLocation();
  const { isMobile } = useMobile();
  
  // If already authenticated, redirect to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);
  
  const handleWalletLogin = async (provider) => {
    try {
      setError('');
      setIsWalletConnecting(true);
      setSelectedProvider(provider);
      
      if (!walletLogin) {
        setError('Authentication service is currently unavailable');
        return;
      }
      
      // If we already have an email and need one, complete the login
      if (needsEmail && email) {
        const result = await walletLogin(email);
        if (!result.success) {
          setError(result.error || 'Login failed');
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
          setWalletConnected(true);
          setIsWalletConnecting(false);
          return;
        }
        
        setError(result.error || 'Failed to connect wallet');
      }
    } catch (error) {
      console.error('Wallet login error:', error);
      setError(error.message || 'Failed to connect wallet');
    } finally {
      setIsWalletConnecting(false);
    }
  };

  // Close info popup and continue with wallet login
  const handleCloseWalletInfo = () => {
    setShowWalletInfo(false);
    setTimeout(() => handleWalletLogin('metamask'), 100);
  };
  
  // Handle email form submission
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Email is required');
      return;
    }
    
    setIsWalletConnecting(true);
    
    try {
      const result = await walletLogin(email);
      if (!result.success) {
        setError(result.error || 'Login failed');
      }
    } catch (error) {
      console.error('Wallet login error:', error);
      setError(error.message || 'Failed to connect wallet');
    } finally {
      setIsWalletConnecting(false);
    }
  };
  
  return (
    <div className={`min-h-screen ${isMobile ? 'pb-16' : ''} flex items-center justify-center bg-gray-50 py-4 px-4 sm:px-6 lg:px-8`}>
      <div className="max-w-md w-full space-y-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Sign in to Titan</h2>
          <p className="mt-1 text-sm text-gray-600">
            Or{' '}
            <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500">
              create a new account
            </Link>
          </p>
        </div>
        
        <div className="bg-white py-5 px-4 shadow sm:rounded-lg sm:px-6 border border-gray-200">
          <MobileBrowserNotice />
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-800 rounded-md border border-red-200 flex items-start">
              <svg className="w-5 h-5 mr-2 mt-0.5 text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span>{error}</span>
            </div>
          )}
          
        
    
          {needsEmail && walletConnected ? (
            <div>
              <div className="mb-4 p-3 bg-green-50 text-green-800 rounded-md border border-green-200">
                <p className="font-medium flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  Wallet Connected!
                </p>
                <p className="text-sm mt-1 truncate">{walletAddress}</p>
              </div>
              
              <form onSubmit={handleEmailSubmit}>
                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    We need your email to complete the registration (only required once)
                  </p>
                </div>
                
                <button
                  type="submit"
                  disabled={isWalletConnecting || !email}
                  className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 transition-colors duration-200"
                >
                  {isWalletConnecting ? 'Completing Login...' : 'Complete Login'}
                </button>
              </form>
            </div>
          ) : walletConnected ? (
            <div className="mb-4 p-3 bg-green-50 text-green-800 rounded-md border border-green-200">
              <p className="font-medium flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Wallet Connected!
              </p>
              <p className="text-sm mt-1 truncate">{walletAddress}</p>
              <p className="text-xs mt-2">Completing sign in...</p>
            </div>
          ) : (
            <div className="space-y-2 mb-4">
              {/* Multiple wallet options */}
              <WalletOption 
                name="MetaMask" 
                icon={WALLET_ICONS.metamask}
                onClick={() => handleWalletLogin('metamask')}
                disabled={isWalletConnecting}
              />
              
              <WalletOption 
                name="Coinbase Wallet" 
                icon={WALLET_ICONS.coinbase}
                onClick={() => handleWalletLogin('coinbase')}
                disabled={isWalletConnecting}
              />
              
              <WalletOption 
                name="Trust Wallet" 
                icon={WALLET_ICONS.trust}
                onClick={() => handleWalletLogin('trust')}
                disabled={isWalletConnecting}
              />
              
              <WalletOption 
                name="Brave Wallet" 
                icon={WALLET_ICONS.brave}
                onClick={() => handleWalletLogin('brave')}
                disabled={isWalletConnecting}
              />
              
              <WalletOption 
                name="WalletConnect" 
                icon={WALLET_ICONS.walletconnect}
                onClick={() => handleWalletLogin('walletconnect')}
                disabled={isWalletConnecting}
              />
              
              {isWalletConnecting && (
                <div className="mt-4 text-center">
                  <div className="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary-600"></div>
                  <p className="mt-2 text-sm text-gray-600">Connecting to {selectedProvider}...</p>
                </div>
              )}
            </div>
          )}
          
          <div className="mt-5">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  New to the platform?
                </span>
              </div>
            </div>

            <div className="mt-3">
              <Link
                to="/register"
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
              >
                Create an account
              </Link>
            </div>
          </div>
        </div>
        
    
      </div>
      
      {/* Wallet Info Popup */}
      {showWalletInfo && <WalletInfoPopup onClose={handleCloseWalletInfo} />}
    </div>
  );
};

export default LoginPage;
