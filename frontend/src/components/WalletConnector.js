import React, { useState } from 'react';
import { toast } from 'react-toastify';

const WALLET_TYPES = {
  METAMASK: 'metamask',
  WALLET_CONNECT: 'walletconnect',
  COINBASE: 'coinbase',
  // Add more wallet types as needed
};

const WalletConnector = ({ onConnect, onError, includeAdditionalWallets = false }) => {
  const [isConnecting, setIsConnecting] = useState(false);
  
  const connectMetamask = async () => {
    setIsConnecting(true);
    
    try {
      if (typeof window.ethereum !== 'undefined') {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
          const walletAddress = accounts[0];
          
          toast.info('MetaMask connected!');
          onConnect(walletAddress, WALLET_TYPES.METAMASK);
        } catch (error) {
          console.error('MetaMask connection error:', error);
          onError(error.message || 'Failed to connect MetaMask');
          toast.error(error.message || 'Failed to connect MetaMask');
        }
      } else {
        const errorMsg = 'MetaMask is not installed. Please install the MetaMask extension.';
        onError(errorMsg);
        toast.error(errorMsg);
      }
    } finally {
      setIsConnecting(false);
    }
  };

  // Function to be implemented for WalletConnect
  const connectWalletConnect = async () => {
    setIsConnecting(true);
    try {
      // Implement WalletConnect integration
      toast.info('WalletConnect integration coming soon');
      onError('WalletConnect integration coming soon');
    } finally {
      setIsConnecting(false);
    }
  };

  // Function to be implemented for Coinbase Wallet
  const connectCoinbase = async () => {
    setIsConnecting(true);
    try {
      // Implement Coinbase Wallet integration
      toast.info('Coinbase Wallet integration coming soon');
      onError('Coinbase Wallet integration coming soon');
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="space-y-4">
      <button
        onClick={connectMetamask}
        disabled={isConnecting}
        className="w-full flex justify-between items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 transition-colors duration-200"
      >
        <div className="flex items-center">
          <svg className="w-6 h-6 mr-3" viewBox="0 0 404 420" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M382.32 53.63L217.57 0.32C215.53 -0.24 213.36 -0.03 211.46 0.93C209.56 1.89 208.1 3.5 207.41 5.48L168.91 126.44C167.33 131 170.27 135.97 174.94 136.74L225.34 145.75C230.35 146.57 235.01 142.21 234.37 137.17L220.68 50.93C220.26 47.32 223.46 44.33 227.01 45.08L335.99 69.15C338.23 69.63 339.5 71.89 338.94 74.11L299.31 252.61C298.73 254.92 296.34 256.23 294.05 255.73L207.54 238.6C206.15 238.31 204.69 238.69 203.62 239.64L136.87 298.27C129.98 304.26 118.9 298.99 118.9 290.06V175.12C118.9 171 115.74 167.58 111.63 167.26L20.46 160.66C15.43 160.26 11.28 155.2 12.71 150.36L54.13 5.66C55.01 2.73 57.67 0.57 60.75 0.22L196.55 0C201.89 0 205.99 4.81 204.99 10.06L201.72 30.15C200.95 34.18 204.1 37.87 208.21 37.6L369.37 27.2C374.89 26.83 379.74 31.03 379.97 36.56L385.33 116.14C386.11 125.26 377.28 132.36 368.47 129.83C361.42 127.8 354.08 132.35 353.16 139.68L333.05 282.28C331.79 292.53 323.08 300.37 312.75 300.51L218.54 301.23C215.72 301.25 213.07 302.49 211.23 304.65L129.04 402.21C122.91 409.5 110.73 406.23 109.38 397.16L79.09 130.27C78.66 126.92 75.54 124.5 72.16 124.84L26.52 127.87C21.23 128.41 16.45 124.34 16.32 119.03L16.01 106.84C15.87 101.16 21.22 96.82 26.74 97.86L58.38 103.43C63.16 104.34 67.57 100.19 66.96 95.35L49.85 9.97" fill="currentColor"/>
          </svg>
          <span>Connect with MetaMask</span>
        </div>
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
        </svg>
      </button>

      {includeAdditionalWallets && (
        <>
          <button
            onClick={connectWalletConnect}
            disabled={isConnecting}
            className="w-full flex justify-between items-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 transition-colors duration-200"
          >
            <div className="flex items-center">
              <svg className="w-6 h-6 mr-3 text-blue-500" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                <path d="M169.4 170.2c47.8-47.8 125.2-47.8 173 0l9.7 9.7 9.7-9.7c47.8-47.8 125.2-47.8 173 0 47.8 47.8 47.8 125.2 0 173l-164.6 164.6c-10 10-26.2 10-36.2 0L169.4 343.2c-47.8-47.8-47.8-125.2 0-173z" fill="currentColor"/>
              </svg>
              <span>WalletConnect</span>
            </div>
            <span className="text-xs bg-gray-200 text-gray-600 py-1 px-2 rounded">Coming Soon</span>
          </button>
          
          <button
            onClick={connectCoinbase}
            disabled={isConnecting}
            className="w-full flex justify-between items-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 transition-colors duration-200"
          >
            <div className="flex items-center">
              <svg className="w-6 h-6 mr-3 text-blue-600" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
                <circle cx="512" cy="512" r="512" fill="currentColor"/>
                <path d="M516.9 262.8C378.2 262.8 266 375 266 513.7c0 138.8 112.3 250.9 250.9 250.9 138.8 0 250.9-112.1 250.9-250.9 0-138.7-112.3-250.9-250.9-250.9zm0 417c-91.6 0-166.1-74.5-166.1-166.1 0-91.6 74.5-166.1 166.1-166.1 91.6 0 166.1 74.5 166.1 166.1 0 91.6-74.5 166.1-166.1 166.1z" fill="white"/>
              </svg>
              <span>Coinbase Wallet</span>
            </div>
            <span className="text-xs bg-gray-200 text-gray-600 py-1 px-2 rounded">Coming Soon</span>
          </button>
        </>
      )}
      
      {includeAdditionalWallets && (
        <div className="text-center mt-2">
          <button 
            className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            onClick={() => toast.info('More wallet options will be available soon!')}
          >
            Show more options
          </button>
        </div>
      )}
    </div>
  );
};

export default WalletConnector;
