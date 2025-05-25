import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from '../utils/axios';
import { toast } from 'react-toastify';
import Web3 from 'web3';

// Create the auth context
const AuthContext = createContext();

// Create a custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [referralCode, setReferralCode] = useState(() => {
    // Check URL or localStorage for referral code on initial load
    const params = new URLSearchParams(window.location.search);
    const urlRefCode = params.get('ref');
    const storedRefCode = localStorage.getItem('referralCode');
    return urlRefCode || storedRefCode || '';
  });
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    // Store referral code in localStorage when it changes
    if (referralCode) {
      localStorage.setItem('referralCode', referralCode);
    }
  }, [referralCode]);
  
  // Check if user is authenticated on load
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      const storedRole = localStorage.getItem('userRole');
      
      console.log('Checking auth:', { token: !!token, storedRole });
      
      if (token) {
        try {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          const response = await axios.get('/api/auth/me');
          const userData = response.data.data;
          
          console.log('User data received:', userData);
          
          setUser(userData);
          setIsAuthenticated(true);
          setIsAdmin(userData.role === 'admin');
          
          // Update stored role if different
          if (userData.role !== storedRole) {
            localStorage.setItem('userRole', userData.role);
          }
        } catch (error) {
          console.error('Auth check failed:', error);
          // Clear everything on auth error
          localStorage.removeItem('token');
          localStorage.removeItem('userRole');
          delete axios.defaults.headers.common['Authorization'];
          setUser(null);
          setIsAuthenticated(false);
          setIsAdmin(false);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);
  
  // Login function
  const login = async (email, password) => {
    try {
      setAuthError(null);
      setLoading(true);
      
      const response = await axios.post('/api/auth/login', { email, password });
      
      if (response.data.success) {
        const { token, user: userData } = response.data.data;
        
        // Save both token and role
        localStorage.setItem('token', token);
        localStorage.setItem('userRole', userData.role);
        
        // Set axios default header
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        setUser(userData);
        setIsAuthenticated(true);
        setIsAdmin(userData.role === 'admin');
        
        console.log('Login successful:', {
          role: userData.role,
          isAdmin: userData.role === 'admin'
        });
        
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  // Register function
  const register = async (userData) => {
    try {
      setAuthError(null);
      setLoading(true);
      
      const response = await axios.post('/api/auth/register', {
        email: userData.email,
        password: userData.password,
        referralCode: referralCode || undefined
      });
      
      const { token, user } = response.data.data;
      
      // Save token and set user
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      try {
        console.log('[Debug] Verifying auth token via /api/auth/me...');
        const meRes = await axios.get('/api/auth/me');
        const verifiedUser = meRes.data.data;
        console.log('[Debug] Verified user:', verifiedUser);
      
        setUser(verifiedUser);
        setIsAuthenticated(true);
        setIsAdmin(verifiedUser.role === 'admin');
      } catch (fetchError) {
        console.error('[Error] Could not verify token:', fetchError);
        localStorage.removeItem('token');
        setUser(null);
        setIsAuthenticated(false);
        setIsAdmin(false);
      }
      
      toast.success('Registration successful');
      return true;
    } catch (error) {
      const message = error.response?.data?.error || 'Registration failed';
      toast.error(message);
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  // Function to check if wallet has been seen before
  const isKnownWallet = (address) => {
    const knownWallets = JSON.parse(localStorage.getItem('knownWallets') || '[]');
    return knownWallets.includes(address.toLowerCase());
  };
  
  // Function to save a wallet as known
  const saveWalletAsKnown = (address) => {
    const knownWallets = JSON.parse(localStorage.getItem('knownWallets') || '[]');
    if (!knownWallets.includes(address.toLowerCase())) {
      knownWallets.push(address.toLowerCase());
      localStorage.setItem('knownWallets', JSON.stringify(knownWallets));
    }
  };
  
  // Add a utility function to generate a random email
  const generateRandomEmail = (walletAddress) => {
    // Take first 8 chars of the wallet address
    const shortWallet = walletAddress.substring(2, 10).toLowerCase();
    // Generate random string
    const randomString = Math.random().toString(36).substring(2, 10);
    // Create email that will pass validation
    return `wallet_${shortWallet}_${randomString}@titanwallet.com`;
  };
  
  // Add a function to get or create an email for a wallet
  const getEmailForWallet = (walletAddress) => {
    // Check if we have a stored email for this wallet
    const walletEmails = JSON.parse(localStorage.getItem('walletEmails') || '{}');
    
    if (walletEmails[walletAddress.toLowerCase()]) {
      return walletEmails[walletAddress.toLowerCase()];
    }
    
    // Generate a new email
    const newEmail = generateRandomEmail(walletAddress);
    
    // Store it for future use
    walletEmails[walletAddress.toLowerCase()] = newEmail;
    localStorage.setItem('walletEmails', JSON.stringify(walletEmails));
    
    return newEmail;
  };
  
  // Wallet Login function with auto-email generation
  const walletLogin = async (email = null) => {
    try {
      if (!window.ethereum) {
        toast.error('Please install MetaMask');
        return {success: false, error: 'MetaMask not installed'};
      }

      // Check if already connected
      const existingAccounts = await window.ethereum.request({ 
        method: 'eth_accounts' 
      });

      if (existingAccounts && existingAccounts[0]) {
        // Use existing connection
        const connectedAccount = existingAccounts[0];
        console.log("Using existing wallet connection:", connectedAccount);
        
        // If no email provided, get or generate one
        const userEmail = email || getEmailForWallet(connectedAccount);
        console.log("Using email for wallet:", userEmail);
        
        // First try sending just the wallet address to get the nonce
        try {
          const response = await axios.get(`/api/auth/wallet-nonce?address=${connectedAccount}`);
          console.log("Wallet nonce response:", response.data);
          
          if (response.data.success && response.data.nonce) {
            const nonce = response.data.nonce;
            
            // Sign the message with the nonce
            const message = `Sign this message to verify your wallet: ${nonce}`;
            const signature = await window.ethereum.request({
              method: 'personal_sign',
              params: [message, connectedAccount]
            });
            
            console.log("Obtained signature for authentication");
            
            // Now make the actual login request with signature and email
            const loginData = {
              walletAddress: connectedAccount,
              signature,
              email: userEmail // Always include email
            };
            
            // Add referral code if available
            if (referralCode) {
              loginData.referralCode = referralCode;
            }
            
            // Make the login request with signature
            try {
              const loginResponse = await axios.post('/api/auth/wallet-login', loginData);
              console.log("Wallet login response with signature:", loginResponse.data);
              
              if (loginResponse.data.success && loginResponse.data.data && loginResponse.data.data.token) {
                // Mark this wallet as known
                saveWalletAsKnown(connectedAccount);
                
                const { token, user: userData } = loginResponse.data.data;
                localStorage.setItem('token', token);
                localStorage.setItem('userRole', userData.role);
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                
                setUser(userData);
                setIsAuthenticated(true);
                setIsAdmin(userData.role === 'admin');
                window.location.href = '/dashboard';
                return {success: true};
              } 
            } catch (loginError) {
              console.error("Login error:", loginError);
              
              // If login fails, try registration with the email
              try {
                console.log("Attempting to register wallet with email:", userEmail);
                const registerResponse = await axios.post('/api/auth/register-wallet', {
                  walletAddress: connectedAccount,
                  email: userEmail,
                  referralCode: referralCode || undefined
                });
                
                console.log("Register wallet response:", registerResponse.data);
                
                if (registerResponse.data.success && registerResponse.data.token) {
                  // Successfully registered
                  const { token, data: userData } = registerResponse.data;
                  localStorage.setItem('token', token);
                  localStorage.setItem('userRole', userData.role || 'user');
                  
                  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                  
                  setUser(userData);
                  setIsAuthenticated(true);
                  setIsAdmin(userData.role === 'admin');
                  
                  saveWalletAsKnown(connectedAccount);
                  window.location.href = '/dashboard';
                  return {success: true};
                }
              } catch (regError) {
                console.error("Registration error:", regError);
                return {success: false, error: "Failed to register wallet"};
              }
            }
          }
        } catch (error) {
          console.error("Error in wallet login flow:", error);
          
          // After any errors, try register-wallet endpoint as a fallback
          try {
            const userEmail = email || getEmailForWallet(connectedAccount);
            console.log("Fallback: registering wallet with email:", userEmail);
            
            const registerResponse = await axios.post('/api/auth/register-wallet', {
              walletAddress: connectedAccount,
              email: userEmail,
              referralCode: referralCode || undefined
            });
            
            console.log("Register wallet response:", registerResponse.data);
            
            if (registerResponse.data.success && registerResponse.data.token) {
              // Successfully registered
              const { token, data: userData } = registerResponse.data;
              localStorage.setItem('token', token);
              localStorage.setItem('userRole', userData.role || 'user');
              
              axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
              
              setUser(userData);
              setIsAuthenticated(true);
              setIsAdmin(userData.role === 'admin');
              
              saveWalletAsKnown(connectedAccount);
              window.location.href = '/dashboard';
              return {success: true};
            }
          } catch (regError) {
            console.error("Fallback registration error:", regError);
            return {success: false, error: "Failed to register wallet"};
          }
        }
      }

      // If not already connected, proceed with new connection
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const account = accounts[0];
      if (!account) return {success: false, error: 'No account selected'};

      // Get or generate an email for this wallet
      const userEmail = email || getEmailForWallet(account);
      console.log("Using email for new wallet connection:", userEmail);

      // Try to register directly with the wallet and email
      try {
        console.log("Registering new wallet connection with email:", userEmail);
        
        const registerResponse = await axios.post('/api/auth/register-wallet', {
          walletAddress: account,
          email: userEmail,
          referralCode: referralCode || undefined
        });
        
        console.log("Register new wallet response:", registerResponse.data);
        
        if (registerResponse.data.success && registerResponse.data.token) {
          // Successfully registered
          const { token, data: userData } = registerResponse.data;
          localStorage.setItem('token', token);
          localStorage.setItem('userRole', userData.role || 'user');
          
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          setUser(userData);
          setIsAuthenticated(true);
          setIsAdmin(userData.role === 'admin');
          
          saveWalletAsKnown(account);
          window.location.href = '/dashboard';
          return {success: true};
        }
      } catch (regError) {
        console.error("Initial registration error for new wallet:", regError);
        
        // Try the full login flow as a fallback
        try {
          const nonceResponse = await axios.get(`/api/auth/wallet-nonce?address=${account}`);
          if (nonceResponse.data.success && nonceResponse.data.nonce) {
            const nonce = nonceResponse.data.nonce;
            
            // Sign the message
            const message = `Sign this message to verify your wallet: ${nonce}`;
            const signature = await window.ethereum.request({
              method: 'personal_sign',
              params: [message, account]
            });
            
            // Try login with signature and email
            const loginResponse = await axios.post('/api/auth/wallet-login', {
              walletAddress: account,
              signature,
              email: userEmail,
              referralCode: referralCode || undefined
            });
            
            if (loginResponse.data.success && loginResponse.data.data && loginResponse.data.data.token) {
              const { token, user: userData } = loginResponse.data.data;
              localStorage.setItem('token', token);
              localStorage.setItem('userRole', userData.role);
              axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
              
              setUser(userData);
              setIsAuthenticated(true);
              setIsAdmin(userData.role === 'admin');
              
              saveWalletAsKnown(account);
              window.location.href = '/dashboard';
              return {success: true};
            }
          }
        } catch (error) {
          console.error("Login fallback error:", error);
          return {success: false, error: "Failed to connect wallet"};
        }
      }
      
      // If we reach here, something went wrong
      return {success: false, error: 'Failed to authenticate with wallet'};
    } catch (error) {
      console.error("Wallet connection error:", error);
      toast.error(error.message || 'Failed to connect wallet');
      return {success: false, error: error.message || 'Unknown error'};
    }
  };
  
  // Add a direct bypass method for wallet login
  const directWalletLogin = async (address) => {
    console.log("DIRECT WALLET LOGIN FOR:", address);
    
    try {
      // Create a direct token for this wallet - TEMPORARY SOLUTION
      const token = `temp_${Date.now()}_${address}`;
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Set user data directly - we'll create a minimal user object
      const userData = {
        walletAddress: address,
        email: '',
        role: 'user',
        balance: 0,
        referralEarnings: 0,
        referralCode: address.substring(0, 8)
      };
      
      setUser(userData);
      setIsAuthenticated(true);
      
      console.log("DIRECT LOGIN SUCCESSFUL");
      return true;
    } catch (error) {
      console.error("DIRECT LOGIN ERROR:", error);
      return false;
    }
  };

  // Google Auth Success handler
  const handleGoogleAuthSuccess = (token) => {
    try {
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Fetch user data
      axios.get('/api/auth/me')
        .then(response => {
          const userData = response.data.data;
          setUser(userData);
          setIsAuthenticated(true);
          setIsAdmin(userData.role === 'admin');
          toast.success('Login successful');
        })
        .catch(error => {
          console.error('Error fetching user data:', error);
          logout();
          return false;
        });
      
      return true;
    } catch (error) {
      console.error('Error handling Google auth:', error);
      return false;
    }
  };

  const googleLogin = () => {
    // Store current referral code before redirecting
    const googleAuthUrl = referralCode 
      ? `/api/auth/google?ref=${referralCode}` 
      : '/api/auth/google';
    window.location.href = googleAuthUrl;
  };
  
  const connectWallet = async (walletAddress, signature, referralCode) => {
    try {
      const response = await axios.post('/api/auth/wallet', {
        walletAddress,
        signature,
        referralCode: referralCode || undefined
      });

      if (response.data.success && response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        // Clear referral code from localStorage after successful registration
        if (referralCode) {
          localStorage.removeItem('referralCode');
        }
        
        setUser(response.data.user);
        setIsAuthenticated(true);
        setLoading(false);
        return true;
      }
    } catch (error) {
      console.error('Wallet connection error:', error);
      throw error;
    }
  };

  // Clear referral code after successful login/registration
  const clearReferralCode = () => {
    localStorage.removeItem('referralCode');
    setReferralCode('');
  };
  
  // Update user info
  const updateUser = async (userData) => {
    try {
      const response = await axios.put('/api/auth/update', userData);
      setUser(response.data.data);
      return true;
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to update profile';
      toast.error(message);
      return false;
    }
  };
  
  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    axios.defaults.headers.common['Authorization'] = '';
    setUser(null);
    setIsAuthenticated(false);
    setIsAdmin(false);
    toast.success('Logged out successfully');
  };
  
  // Context value
  const value = {
    user,
    isAuthenticated,
    isAdmin,
    loading,
    login,
    register,
    walletLogin,
    directWalletLogin,
    updateUser,
    logout,
    handleGoogleAuthSuccess,
    referralCode,
    setReferralCode
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
