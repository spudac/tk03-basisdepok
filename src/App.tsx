// src/App.tsx
import { useState } from 'react';
import Navbar from './components/Navbar'; // Import navbar baru
import DashboardPage from './pages/DashboardPage';
import RedeemPage from './pages/RedeemPage'; // Import redeem page
import type { Role } from './types';
import PurchasePage from './pages/PurchasePage';
import InfoTierPage from './pages/InfoTierPage';
import ReportPage from './pages/ReportPage';
import {
  MOCK_MEMBER,
  MOCK_MEMBER_SILVER,
  MOCK_STAF,
  MOCK_DASHBOARD_STATS,
  MOCK_RECENT_TRANSACTIONS_MEMBER,
} from './data/mockData';
import './App.css';

export default function App() {
  const [role, setRole] = useState<Role>('guest');
  const [currentPage, setCurrentPage] = useState('dashboard'); // State navigasi
  const [useSilver, setUseSilver] = useState(false);

  const activeMember = useSilver ? MOCK_MEMBER_SILVER : MOCK_MEMBER;

  // Fungsi untuk merender konten berdasarkan currentPage
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
        return <DashboardPage role={role} member={activeMember} staf={MOCK_STAF} stats={MOCK_DASHBOARD_STATS} recentTransactions={[]} />;
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--primary-50)' }}>
      {/* 1. Navigasi Utama */}
      <Navbar 
        role={role} 
        currentPage={currentPage} 
        onNavigate={(page) => setCurrentPage(page)} 
      />

      {/* 2. Dev Switcher (Tetap ada buat bantu testing) */}
      <div className="dev-switcher">
        <span className="dev-switcher__label">🛠 Dev: Role</span>
        <button onClick={() => setRole('guest')} className={role === 'guest' ? 'active' : ''}>Guest</button>
        <button onClick={() => setRole('member')} className={role === 'member' ? 'active' : ''}>Member</button>
        <button onClick={() => setRole('staf')} className={role === 'staf' ? 'active' : ''}>Staf</button>
        {role === 'member' && (
          <button onClick={() => setUseSilver(!useSilver)}>
            {useSilver ? 'Switch to Blue' : 'Switch to Silver'}
          </button>
        )}
      </div>

      {/* 3. Konten Halaman */}
      <main>
        {renderContent()}
      </main>
    </div>
  );
}

