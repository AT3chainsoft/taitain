// This is a debug script - import it in index.js temporarily to check route registration

export function debugRoutes() {
  console.log('🔍 DEBUG: Checking route registration');
  
  const appElement = document.getElementById('root');
  if (!appElement) {
    console.error('❌ App root element not found!');
    return;
  }
  
  console.log('✅ App root element found');
  
  // Print out all routes from react-router-dom
  try {
    setTimeout(() => {
      console.log('Routes that should be available:');
      console.log('- /forum');
      console.log('- /admin/forum');
      console.log('Try manually navigating to these URLs');
    }, 1000);
  } catch (err) {
    console.error('❌ Error inspecting routes:', err);
  }
}
