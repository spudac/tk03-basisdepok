import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';

import Navbar from './components/Navbar';
import DashboardPage from './pages/DashboardPage';
import RedeemPage from './pages/RedeemPage';
import type { Role } from './types';
import PurchasePage from './pages/PurchasePage';
import InfoTierPage from './pages/InfoTierPage';
import ReportPage from './pages/ReportPage';
import {
  MOCK_MEMBER,
  MOCK_STAF,
  MOCK_DASHBOARD_STATS,
  MOCK_RECENT_TRANSACTIONS_MEMBER,
} from './data/mockData';
import './App.css';

import Login from './features/auth/Auth.tsx';
import Register from './features/register/Register.tsx';
import KelolaHadiah from './features/ManageGifts/ManageGifts.tsx';
import KelolaMitra from './features/ManagePartners/ManagePartners.tsx';
import LoggedInNavbar from './components/LoggedInNavbar.tsx';
import StaffNavbar from './components/StaffNavbar.tsx';
import ProfileSettings from './components/ProfileSettings';
import ClaimMissingMilesMember from './components/ClaimMissingMilesMember';
import TransferMiles from './components/TransferMiles';
import ClaimMissingMilesStaf from './components/ClaimMissingMilesStaf';

function PageContainer({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ 
      padding: '40px 20px', 
      background: 'linear-gradient(135deg, #c8d8f8 0%, #dde8f8 35%, #eee8dc 70%, #f5f0e8 100%)', 
      minHeight: 'calc(100vh - 80px)', 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      fontFamily: "'Inter', sans-serif"
    }}>
      {children}
    </div>
  );
}

interface MainAppProps {
  role: Role;
}

function MainApp({ role }: MainAppProps) {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const activeMember = MOCK_MEMBER;

  const renderContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage role={role} member={activeMember} staf={MOCK_STAF} stats={MOCK_DASHBOARD_STATS} recentTransactions={MOCK_RECENT_TRANSACTIONS_MEMBER} />;
      case 'redeem':
        return <RedeemPage member={activeMember} />;
      case 'purchase':
        if (role !== 'member') return null; 
        return <PurchasePage member={activeMember} />;
      case 'tier': 
        if (role !== 'member') return null;
        return <InfoTierPage member={activeMember} />;
      case 'report':
        if (role !== 'staf') return null;
        return <ReportPage />;
      default:
        return <DashboardPage role={role} member={activeMember} staf={MOCK_STAF} stats={MOCK_DASHBOARD_STATS} recentTransactions={[]} />;
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--primary-50)' }}>
      <main>
        {renderContent()}
      </main>
    </div>
  );
}

function AppContent() {
  const [role, setRole] = useState<Role>('member');
  const location = useLocation(); 
  const isGuestPage = location.pathname === '/login' || location.pathname === '/register';

  useEffect(() => {
    const path = location.pathname;

    if (path.startsWith('/staff')) {
      setRole('staf');
    } else if (
      path === '/redeem' || 
      path === '/buy-package' || 
      path === '/tier-info' || 
      path === '/dashboard' ||
      path === '/' ||
      path === '/settings' || 
      path === '/claim-miles' ||
      path === '/transfer-miles'
    ) {
      setRole('member');
    }
  }, [location.pathname]);

  const renderNavbar = () => {
    if (isGuestPage) return <Navbar />;
    if (role === 'member') return <LoggedInNavbar />;
    if (role === 'staf') return <StaffNavbar />;
    return <Navbar />;
  };

  return (
    <>
      {renderNavbar()}

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route path="/" element={<MainApp role={role} />} />

        {/* --- Rute Staf --- */}
        <Route path="/staff/transactions" element={<ReportPage />} />
        <Route path="/staff/dashboard" element={<DashboardPage role={role} member={MOCK_MEMBER} staf={MOCK_STAF} stats={MOCK_DASHBOARD_STATS} recentTransactions={[]} />} />
        
        {/* Rute Baru dari Temanmu */}
        <Route path="/staff/kelola-hadiah" element={<KelolaHadiah />} />
        <Route path="/staff/kelola-mitra" element={<KelolaMitra />} />
        
        {/* Rute Staf (Fitur Kamu) */}
        <Route path="/staff/settings" element={<PageContainer><ProfileSettings role="staf" email="staff@aero.com" /></PageContainer>} />
        <Route path="/staff/claims" element={<PageContainer><ClaimMissingMilesStaf /></PageContainer>} />
        
        {/* --- Rute Member --- */}
        <Route path="/redeem" element={<RedeemPage member={MOCK_MEMBER} />} />
        <Route path="/buy-package" element={<PurchasePage member={MOCK_MEMBER} />} />
        <Route path="/tier-info" element={<InfoTierPage member={MOCK_MEMBER} />} />
        <Route path="/dashboard" element={<DashboardPage role={role} member={MOCK_MEMBER} staf={MOCK_STAF} stats={MOCK_DASHBOARD_STATS} recentTransactions={[]} />} />

        {/* Rute Member (Fitur Kamu) */}
        <Route path="/settings" element={<PageContainer><ProfileSettings role="member" email="user@mail.com" /></PageContainer>} />
        <Route path="/claim-miles" element={<PageContainer><ClaimMissingMilesMember /></PageContainer>} />
        <Route path="/transfer-miles" element={<PageContainer><TransferMiles /></PageContainer>} />

        {/* Redirect unknown routes ke login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}