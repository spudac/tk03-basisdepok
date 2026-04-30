import React from 'react';
import { useNavigate } from 'react-router-dom';
import aeroMilesLogo from '../assets/AeroMiles Logo.svg';
import profileIcon from '../assets/Profile.svg';
import claimMilesIcon from '../assets/ClaimMiles.svg';
import transferIcon from '../assets/TransferTransaksi.svg';
import hadiahIcon from '../assets/Hadiah.svg';
import cartIcon from '../assets/Cart.svg';
import tierIcon from '../assets/Tier.svg';
import settingsIcon from '../assets/Settings.svg';
import logoutIcon from '../assets/Logout.svg';
import dashboardIcon from '../assets/Dashboard.svg';
import './LoggedInNavbar.css';

interface LoggedInNavbarProps {
  userName?: string;
}

const LoggedInNavbar: React.FC<LoggedInNavbarProps> = ({ userName = '[Name]' }) => {
  const navigate = useNavigate();

  return (
    <nav className="user-navbar">
      <div 
        className="user-navbar-brand" 
        onClick={() => navigate('/')} 
        style={{ cursor: 'pointer' }}
      >
        <img src={aeroMilesLogo} alt="AeroMiles Logo" className="user-navbar-logo" />
        <div className="user-welcome">Welcome, {userName}</div>
      </div>

      <div className="user-navbar-menu">
        <div className="nav-item-active" onClick={() => navigate('/dashboard')}>
          <img src={dashboardIcon} alt="Dashboard" />
          <span>Dashboard</span>
        </div>
        
        <div className="nav-item" onClick={() => navigate('/profile')}>
          <img src={profileIcon} alt="Profile" />
          <span>Identitas Saya</span>
        </div>
        
        <div className="nav-item" onClick={() => navigate('/claim-miles')}>
          <img src={claimMilesIcon} alt="Claim Miles" />
          <span>Klaim Miles</span>
        </div>
        
        <div className="nav-item" onClick={() => navigate('/transfer-miles')}>
          <img src={transferIcon} alt="Transfer Miles" />
          <span>Transfer Miles</span>
        </div>
        
        <div className="nav-item" onClick={() => navigate('/redeem')}>
          <img src={hadiahIcon} alt="Redeem Hadiah" />
          <span>Redeem Hadiah</span>
        </div>
        
        <div className="nav-item" onClick={() => navigate('/buy-package')}>
          <img src={cartIcon} alt="Beli Package" />
          <span>Beli Package</span>
        </div>
        
        <div className="nav-item" onClick={() => navigate('/tier-info')}>
          <img src={tierIcon} alt="Info Tier" />
          <span>Info Tier</span>
        </div>

        <div className="nav-item-settings" onClick={() => navigate('/settings')}>
          <img src={settingsIcon} alt="Settings" />
        </div>

        <div className="nav-item-logout" onClick={() => {
          // Add logout logic here
          navigate('/login');
        }}>
          <span>Logout</span>
          <img src={logoutIcon} alt="Logout" />
        </div>
      </div>
    </nav>
  );
};

export default LoggedInNavbar;
