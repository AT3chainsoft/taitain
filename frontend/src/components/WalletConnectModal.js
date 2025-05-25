import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { 
  XMarkIcon, 
  ExclamationTriangleIcon, 
  CheckCircleIcon 
} from '@heroicons/react/24/outline';

const WalletConnectModal = ({ isOpen, onClose }) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { walletLogin } = useAuth() || {};
  
  // Reset state when modal is opened
  useEffect(() => {
    if (isOpen) {
      setIsConnecting(false);
      setError('');
    }
  }, [isOpen]);
  
  const connectWallet = async () => {
    if (!window.ethereum) {
      setError('Please install MetaMask or another Web3 wallet');
      return;
    }
    
    setIsConnecting(true);
    setError('');
    
    try {
      // Request account access
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const address = accounts[0];
      
      if (!address) {
        throw new Error('No accounts found');
      }
      
      // Get provider and signer for signature
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      
      // Create message to sign
      const message = `Sign this message to authenticate with Taitan Staking: ${Date.now()}`;
      
      // Get signature
      const signature = await signer.signMessage(message);
      
      console.log('Wallet connected:', address);
      console.log('Signature obtained, now logging in with backend');
      
      // Ensure walletLogin is available
      if (typeof walletLogin !== 'function') {
        throw new Error('Wallet login functionality not available');
      }
      
      // Call backend to verify signature and authenticate
      const result = await walletLogin(address, signature);
      
      if (result && result.success) {
        toast.success('Wallet connected successfully');
        
        // Double check localStorage token was set
        const token = localStorage.getItem('token');
        if (token) {
          console.log('Token stored successfully:', token.substring(0, 15) + '...');
        } else {
          console.error('Token not stored after successful login!');
        }
        
        onClose();
        
        // Navigate after a short delay to ensure auth state is updated
        setTimeout(() => {
          navigate('/dashboard');
        }, 300);
      } else {
        throw new Error(result?.message || 'Login failed');
      }
    } catch (err) {
      console.error('Wallet connection error:', err);
      setError(err.message || 'Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-md w-full mx-4 p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Connect Wallet</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 rounded">
            <div className="flex">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-500 mr-2" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}
        
        <div className="mb-6">
          <p className="text-sm text-gray-500">
            Connect your Ethereum wallet to sign in securely. 
            You'll be asked to sign a message to verify your wallet ownership.
          </p>
        </div>
        
        <div className="space-y-3">
          <button
            onClick={connectWallet}
            disabled={isConnecting}
            className="w-full py-2.5 bg-indigo-600 text-white rounded-lg font-medium flex items-center justify-center disabled:bg-indigo-400"
          >
            {isConnecting ? (
              <>
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Connecting...
              </>
            ) : (
              'Connect MetaMask'
            )}
          </button>
          
          <button
            onClick={onClose}
            className="w-full py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium"
          >
            Cancel
          </button>
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            By connecting your wallet, you agree to our{' '}
            <a href="/terms" className="text-indigo-600">Terms of Service</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default WalletConnectModal;
