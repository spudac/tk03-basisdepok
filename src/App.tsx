// src/App.tsx
import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';

// --- Imports untuk Main App ---
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

// --- Imports untuk Auth ---
import Login from './features/auth/Auth.tsx';
import Register from './features/register/Register.tsx';
import KelolaHadiah from './features/ManageGifts/ManageGifts.tsx';
import KelolaMitra from './features/ManagePartners/ManagePartners.tsx';
import LoggedInNavbar from './components/LoggedInNavbar.tsx';
import StaffNavbar from './components/StaffNavbar.tsx';

// --- Interface Props untuk MainApp ---
interface MainAppProps {
  role: Role;
}

// Komponen untuk membungkus halaman utama (Route "/")
function MainApp({ role }: MainAppProps) {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const activeMember = MOCK_MEMBER;

  const renderContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <DashboardPage
            role={role}
            member={activeMember}
            staf={MOCK_STAF}
            stats={MOCK_DASHBOARD_STATS}
            recentTransactions={MOCK_RECENT_TRANSACTIONS_MEMBER}
          />
        );
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
        return (
          <DashboardPage 
            role={role} 
            member={activeMember} 
            staf={MOCK_STAF} 
            stats={MOCK_DASHBOARD_STATS} 
            recentTransactions={[]} 
          />
        );
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

// --- Komponen AppContent (Berisi Logika Routing & Navbar) ---
function AppContent() {
  const [role, setRole] = useState<Role>('member');
  
  const location = useLocation(); 
  const isGuestPage = location.pathname === '/login' || location.pathname === '/register';

  // useEffect untuk mendeteksi URL dan mengubah role otomatis
  useEffect(() => {
    const path = location.pathname;

    if (path.startsWith('/staff')) {
      setRole('staf');
    } else if (
      path === '/redeem' || 
      path === '/buy-package' || 
      path === '/tier-info' || 
      path === '/dashboard' ||
      path === '/'
    ) {
      setRole('member');
    }
  }, [location.pathname]);

  const renderNavbar = () => {
    if (isGuestPage) {
      return <Navbar />;
    }

    if (role === 'member') {
      return <LoggedInNavbar />;
    } else if (role === 'staf') {
      return <StaffNavbar />;
    } else {
      return <Navbar />;
    }
  };

  return (
    <>
      {renderNavbar()}

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route path="/" element={<MainApp role={role} />} />

        {/* Rute Staf */}
        <Route path="/staff/transactions" element={<ReportPage />} />
        <Route path="/staff/dashboard" element={<DashboardPage role={role} member={MOCK_MEMBER} staf={MOCK_STAF} stats={MOCK_DASHBOARD_STATS} recentTransactions={[]} />} />
        
        {/* Rute Member */}
        <Route path="/redeem" element={<RedeemPage member={MOCK_MEMBER} />} />
        <Route path="/buy-package" element={<PurchasePage member={MOCK_MEMBER} />} />
        <Route path="/tier-info" element={<InfoTierPage member={MOCK_MEMBER} />} />
        <Route path="/dashboard" element={<DashboardPage role={role} member={MOCK_MEMBER} staf={MOCK_STAF} stats={MOCK_DASHBOARD_STATS} recentTransactions={[]} />} />

        {/* Redirect unknown routes ke login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
}

// --- Komponen App Utama ---
export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}