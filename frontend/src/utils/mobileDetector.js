/**
 * Utility functions to detect mobile devices and handle mobile-specific logic
 */

// Check if the device is a mobile device
export const isMobileDevice = () => {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  
  // Mobile device detection regex
  const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  
  return mobileRegex.test(userAgent);
};

// Check if the screen size is mobile-sized
export const isMobileScreenSize = () => {
  return window.innerWidth < 768;
};

// Combined check for mobile device or screen size
export const isMobileView = () => {
  return isMobileDevice() || isMobileScreenSize();
};

export default {
  isMobileDevice,
  isMobileScreenSize,
  isMobileView
};
