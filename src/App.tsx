import { useState } from 'react';
import ProfileSettings from './components/ProfileSettings';
import ClaimMissingMilesMember from './components/ClaimMissingMilesMember';
import ClaimMissingMilesStaf from './components/ClaimMissingMilesStaf';

const MOCK_USERS = {
  member: { email: 'user1@mail.com', role: 'member' as const },
  staf:   { email: 'staff1@aero.com', role: 'staf' as const },
};

type Page = 'profil' | 'klaim' | 'kelola-klaim';

function App() {
  const [currentUserRole, setCurrentUserRole] = useState<'member' | 'staf'>('member');
  const [currentPage, setCurrentPage] = useState<Page>('profil');

  const currentUser = MOCK_USERS[currentUserRole];

  const navButtonStyle = (active: boolean): React.CSSProperties => ({
    padding: '8px 16px',
    borderRadius: '4px',
    border: 'none',
    cursor: 'pointer',
    backgroundColor: active ? 'var(--yellow-600)' : 'white',
    color: '#111',
    fontWeight: active ? 700 : 400,
  });

  return (
    <div>
      {/* Navbar buat testing */}
      <div style={{
        backgroundColor: 'var(--primary-800)',
        padding: '12px 20px',
        display: 'flex',
        gap: '8px',
        alignItems: 'center',
        flexWrap: 'wrap',
      }}>
        <span style={{ color: 'white', fontWeight: 'bold', marginRight: 12 }}>
          Testing Navbar
        </span>

        {/* Role switcher */}
        <button onClick={() => { setCurrentUserRole('member'); setCurrentPage('profil'); }}
          style={navButtonStyle(currentUserRole === 'member')}>
          Member
        </button>
        <button onClick={() => { setCurrentUserRole('staf'); setCurrentPage('profil'); }}
          style={navButtonStyle(currentUserRole === 'staf')}>
          Staf
        </button>

        <span style={{ color: 'rgba(255,255,255,0.4)', margin: '0 8px' }}>|</span>

        {/* Page switcher */}
        <button onClick={() => setCurrentPage('profil')}
          style={navButtonStyle(currentPage === 'profil')}>
          Pengaturan Profil
        </button>

        {/* Klaim hanya untuk member */}
        {currentUserRole === 'member' && (
          <button onClick={() => setCurrentPage('klaim')}
            style={navButtonStyle(currentPage === 'klaim')}>
            Klaim Missing Miles
          </button>
        )}

        {/* Kelola klaim hanya untuk staf */}
        {currentUserRole === 'staf' && (
          <button onClick={() => setCurrentPage('kelola-klaim')}
            style={navButtonStyle(currentPage === 'kelola-klaim')}>
            Kelola Klaim
          </button>
        )}

        <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginLeft: 'auto' }}>
          Login: <strong style={{ color: 'white' }}>{currentUser.email}</strong>
        </span>
      </div>

      {/* ── Render Page ── */}
      {currentPage === 'profil' && (
        <ProfileSettings role={currentUser.role} />
      )}
      {currentPage === 'klaim' && currentUser.role === 'member' && (
        <ClaimMissingMilesMember emailMember={currentUser.email} />
      )}
      {currentPage === 'kelola-klaim' && currentUser.role === 'staf' && (
        <ClaimMissingMilesStaf emailStaf={currentUser.email} />
      )}
    </div>
  );
}

export default App;
