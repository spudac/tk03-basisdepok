// src/components/Navbar.tsx
import type { Role } from '../types';
import './Navbar.css';

interface NavbarProps {
  role: Role;
  currentPage: string;
  onNavigate: (page: string) => void;
}

export default function Navbar({ role, currentPage, onNavigate }: NavbarProps) {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo" onClick={() => onNavigate('dashboard')}>
          ✈ AeroMiles
        </div>

        <ul className="navbar-menu">
          {/* Menu untuk SEMUA (termasuk Guest) */}
          <li 
            className={currentPage === 'dashboard' ? 'active' : ''} 
            onClick={() => onNavigate('dashboard')}
          >
            Dashboard
          </li>

          {/* Menu Khusus MEMBER */}
          {role === 'member' && (
            <>
              <li 
                className={currentPage === 'redeem' ? 'active' : ''} 
                onClick={() => onNavigate('redeem')}
              >
                Redeem Hadiah
              </li>
              <li 
                className={currentPage === 'purchase' ? 'active' : ''} 
                onClick={() => onNavigate('purchase')}
              >
                Beli Miles
              </li>
              <li 
                className={currentPage === 'tier' ? 'active' : ''} 
                onClick={() => onNavigate('tier')}
              >
                Info Tier
              </li>
              <li>Transfer</li>
            </>
          )}

          {/* Menu Khusus STAF */}
          {role === 'staf' && (
            <>
                <li>Kelola Member</li>
                <li 
                className={currentPage === 'report' ? 'active' : ''} 
                onClick={() => onNavigate('report')}
                >
                Laporan & Riwayat
                </li>
            </>
            )}
        </ul>

        <div className="navbar-auth">
          {role === 'guest' ? (
            <button className="btn-login">Login</button>
          ) : (
            <div className="user-profile">
              <span>{role === 'staf' ? 'Staf Aero' : 'Member'}</span>
              <button className="btn-logout">Logout</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}