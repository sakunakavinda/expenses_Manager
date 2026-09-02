import React from 'react';
import { Wallet } from 'lucide-react';

const Header = () => {
  return (
    <header className="app-header">
      <div className="banner-container" style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <img src="/banner.png" alt="One More - The Heart Beat of Music" className="responsive-banner" style={{ maxWidth: '100%', height: 'auto', maxHeight: '120px' }} />
      </div>
      <div className="header-content">
        <div className="logo-container">
          <div className="logo-icon">
            <Wallet size={24} color="var(--primary-color)" />
          </div>
          <h1>ExpenseTracker</h1>
        </div>
      </div>
    </header>
  );
};

export default Header;
