import React from 'react';
import { Link } from 'react-router-dom';

const LogoMobile = ({ mini = false }) => {
  return (
    <Link to="/" className={`mobile-logo ${mini ? 'mobile-logo-mini' : ''}`}>
      <div className={`mobile-logo-icon ${mini ? 'mobile-logo-icon-mini' : ''}`}>
        <div className="mobile-logo-layer mobile-logo-layer-bottom"></div>
        <div className="mobile-logo-layer mobile-logo-layer-middle"></div>
        <div className="mobile-logo-layer mobile-logo-layer-top">
          <span>T</span>
        </div>
      </div>
      {!mini && (
        <div className="mobile-logo-text">
          <span className="mobile-logo-text-main">Taitan</span>
          <span className="mobile-logo-text-sub">Staking</span>
        </div>
      )}
    </Link>
  );
};

export default LogoMobile;
