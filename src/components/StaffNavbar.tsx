import React from 'react';
import { useNavigate } from 'react-router-dom';
import aeroMilesLogo from '../assets/AeroMiles Logo.svg';
import dashboardIcon from '../assets/Dashboard.svg';
import profileIcon from '../assets/Profile.svg';
import claimMilesIcon from '../assets/ClaimMiles.svg';
import transferIcon from '../assets/TransferTransaksi.svg';
import hadiahIcon from '../assets/Hadiah.svg';
import mitraIcon from '../assets/Mitra.svg';
import settingsIcon from '../assets/Settings.svg';
import logoutIcon from '../assets/Logout.svg';
import './StaffNavbar.css';

interface StaffNavbarProps {
  userName?: string;
}

const StaffNavbar: React.FC<StaffNavbarProps> = ({ userName = '[Name]' }) => {
  const navigate = useNavigate();

  return (
    <nav className="staff-navbar">
      <div 
        className="staff-navbar-brand" 
        onClick={() => navigate('/')} 
        style={{ cursor: 'pointer' }}
      >
        <img src={aeroMilesLogo} alt="AeroMiles Logo" className="staff-navbar-logo" />
        <div className="staff-welcome">Welcome, {userName}</div>
      </div>

      <div className="staff-navbar-menu">
        <div className="nav-item-active" onClick={() => navigate('/staff/dashboard')}>
          <img src={dashboardIcon} alt="Dashboard" />
          <span>Dashboard</span>
        </div>
        
        <div className="nav-item" onClick={() => navigate('/staff/members')}>
          <img src={profileIcon} alt="Kelola Member" />
          <span>Kelola Member</span>
        </div>
        
        <div className="nav-item" onClick={() => navigate('/staff/claims')}>
          <img src={claimMilesIcon} alt="Kelola Klaim" />
          <span>Kelola Klaim</span>
        </div>
        
        <div className="nav-item" onClick={() => navigate('/staff/transactions')}>
          <img src={transferIcon} alt="Laporan Transaksi" />
          <span>Laporan Transaksi</span>
        </div>
        
        <div className="nav-item" onClick={() => navigate('/staff/kelola-hadiah')}>
          <img src={hadiahIcon} alt="Kelola Hadiah" />
          <span>Kelola Hadiah</span>
        </div>
        
        <div className="nav-item" onClick={() => navigate('/staff/kelola-mitra')}>
          <img src={mitraIcon} alt="Kelola Mitra" />
          <span>Kelola Mitra</span>
        </div>
        
        <div className="nav-item-settings" onClick={() => navigate('/staff/settings')}>
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

export default StaffNavbar;
