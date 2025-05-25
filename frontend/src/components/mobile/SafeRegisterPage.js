import React from 'react';
import { AuthProvider, useAuth } from '../../context/AuthContext';
import RegisterPage from '../../pages/RegisterPage';

/**
 * This component safely wraps the RegisterPage 
 * to prevent undefined destructuring errors in mobile context
 */
const RegisterWrapper = () => {
  // Pre-check auth to prevent destructuring errors
  const auth = useAuth();
  
  // Only render RegisterPage if auth is properly initialized
  if (!auth || !auth.register) {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-gray-600">Initializing registration...</p>
      </div>
    );
  }
  
  // If auth is ready, render the normal RegisterPage
  return <RegisterPage />;
};

// We must wrap this component with its own AuthProvider to ensure auth context is fresh
const SafeRegisterPage = () => (
  <AuthProvider>
    <RegisterWrapper />
  </AuthProvider>
);

export default SafeRegisterPage;
