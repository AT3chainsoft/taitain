import React from 'react';

const Logo = ({ size = 'md', withText = true, className = '', textColor = 'default' }) => {
  const sizes = {
    sm: { logo: 'h-8 w-8', text: 'text-xl' },
    md: { logo: 'h-12 w-12', text: 'text-2xl' },
    lg: { logo: 'h-16 w-16', text: 'text-3xl' },
    xl: { logo: 'h-24 w-24', text: 'text-4xl' }
  };

  const textColors = {
    'default': 'text-slate-800 dark:text-white',
    'white': 'text-white',
    'primary': 'text-primary-600'
  };

  const selectedSize = sizes[size] || sizes.md;
  const textColorClass = textColors[textColor] || textColors.default;

  return (
    <div className={`flex items-center ${className}`}>
      <div className={`${selectedSize.logo} relative`}>
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-lg transform rotate-45 shadow-lg"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-primary-500 to-secondary-500 rounded-lg transform rotate-12 shadow-lg opacity-80"></div>
        <div className="absolute inset-1 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-lg transform -rotate-12 shadow-inner flex items-center justify-center">
          <span className="font-bold text-white drop-shadow-md text-lg">T</span>
        </div>
      </div>
      {withText && (
        <span className={`ml-3 font-bold ${textColorClass} ${selectedSize.text}`}>
          Taitan
          <span className="text-primary-500">Staking</span>
        </span>
      )}
    </div>
  );
};

export default Logo;
