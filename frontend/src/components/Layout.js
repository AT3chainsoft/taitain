import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Header from './Header';
import Footer from './Footer';
import 'react-toastify/dist/ReactToastify.css';

const Layout = ({ children }) => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  // Content to render - either children (if passed) or Outlet
  const content = children || <Outlet />;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className={`flex-grow ${isHomePage ? 'pt-0' : 'pt-20 pb-12'}`}>
        {isHomePage ? (
          // For homepage, render content directly without additional padding
          content
        ) : (
          // For other pages, add padding and container
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {content}
          </div>
        )}
      </main>
      <Footer />
      <ToastContainer 
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
};

export default Layout;
