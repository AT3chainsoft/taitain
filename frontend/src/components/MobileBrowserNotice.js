import React, { useState, useEffect } from 'react';

const MobileBrowserNotice = () => {
  const [show, setShow] = useState(false);
  
  useEffect(() => {
    // Check if this is a mobile device
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    // Check if this is likely NOT a wallet browser
    const isNotWalletBrowser = !navigator.userAgent.includes('Trust') && 
                               !navigator.userAgent.includes('MetaMask') &&
                               !window.ethereum;
    
    // Only show notice on mobile non-wallet browsers
    setShow(isMobile && isNotWalletBrowser);
  }, []);

  if (!show) return null;

  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4 rounded-md">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-yellow-800">Wallet Browser Recommended</h3>
          <div className="mt-2 text-sm text-yellow-700">
            <p>
              For the best experience with this dApp, please access it using the built-in browser from your wallet app like TrustWallet or MetaMask.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileBrowserNotice;
