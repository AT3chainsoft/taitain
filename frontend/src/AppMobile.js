import React from 'react';
import App from './App'; // Import the original App
import { MobileProvider } from './contexts/MobileContext';
import MobileWrapper from './components/mobile/MobileWrapper';

// Since App already contains the AuthProvider, we just need to make sure we don't disrupt it
const AppMobile = () => {
  return (
    <MobileProvider>
      <MobileWrapper>
        <App />
      </MobileWrapper>
    </MobileProvider>
  );
};

export default AppMobile;
