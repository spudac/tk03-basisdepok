import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import ProfileSettings from '../components/ProfileSettings';
import ClaimMissingMilesMember from '../components/ClaimMissingMilesMember';
import ClaimMissingMilesStaf from '../components/ClaimMissingMilesStaf';
import TransferMiles from '../components/TransferMiles';

// Types 

interface UserData {
  email: string;
  first_mid_name: string;
  last_name: string;
  role: 'member' | 'staf';
  nomor_member?: string;
  id_staf?: string;
}

type Page = 'profil' | 'klaim' | 'kelola-klaim' | 'transfer';

// Main Page 

export default function Main() {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserData | null>(null);
  const [currentPage, setCurrentPage] = useState<Page>('profil');

  // Ambil data user dari sessionStorage (disimpan saat login)
  useEffect(() => {
    const stored = sessionStorage.getItem('aeromiles_user');
    if (stored) {
      setUser(JSON.parse(stored));
    } else {
      // Belum login → redirect ke login
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem('aeromiles_user');
    setUser(null);
    navigate('/login', { replace: true });
  };

  const navButtonStyle = (active: boolean): React.CSSProperties => ({
    padding: '8px 16px',
    borderRadius: '4px',
    border: 'none',
    cursor: 'pointer',
    backgroundColor: active ? 'var(--yellow-600)' : 'white',
    color: '#111',
    fontWeight: active ? 700 : 400,
  });

  if (!user) return null; // redirect

  return (
    <div>
      {/* Navbar */}
      <div style={{
        backgroundColor: 'var(--primary-800)',
        padding: '12px 20px',
        display: 'flex',
        gap: '8px',
        alignItems: 'center',
        flexWrap: 'wrap',
      }}>
        <span style={{ color: 'white', fontWeight: 800, fontSize: 16, marginRight: 16, letterSpacing: -0.3 }}>
          ✈ AeroMiles
        </span>

        <button onClick={() => setCurrentPage('profil')} style={navButtonStyle(currentPage === 'profil')}>
          Pengaturan Profil
        </button>

        {user.role === 'member' && (
          <>
            <button onClick={() => setCurrentPage('klaim')} style={navButtonStyle(currentPage === 'klaim')}>
              Klaim Missing Miles
            </button>
            <button onClick={() => setCurrentPage('transfer')} style={navButtonStyle(currentPage === 'transfer')}>
              Transfer Miles
            </button>
          </>
        )}

        {user.role === 'staf' && (
          <button onClick={() => setCurrentPage('kelola-klaim')} style={navButtonStyle(currentPage === 'kelola-klaim')}>
            Kelola Klaim
          </button>
        )}

        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>
            {user.first_mid_name} {user.last_name}
            <span style={{ color: 'rgba(255,255,255,0.4)', marginLeft: 6 }}>({user.role})</span>
          </span>
          <button onClick={handleLogout} style={{
            padding: '6px 14px', borderRadius: 6,
            border: '1px solid rgba(255,255,255,0.3)',
            background: 'transparent', color: 'white',
            fontSize: 13, cursor: 'pointer',
          }}>
            Logout
          </button>
        </div>
      </div>

      {/* Pages */}
      {currentPage === 'profil'       && <ProfileSettings role={user.role} email={user.email} />}
      {currentPage === 'klaim'        && user.role === 'member' && <ClaimMissingMilesMember emailMember={user.email} />}
      {currentPage === 'transfer'     && user.role === 'member' && <TransferMiles emailMember={user.email} />}
      {currentPage === 'kelola-klaim' && user.role === 'staf'   && <ClaimMissingMilesStaf emailStaf={user.email} />}
    </div>
  );
}