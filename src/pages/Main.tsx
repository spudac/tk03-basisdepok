import { useEffect, useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import LoggedInNavbar from '../components/LoggedInNavbar';
import StaffNavbar from '../components/StaffNavbar';

export default function Main() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem('aeromiles_user');
    if (stored) {
      setUser(JSON.parse(stored));
    } else {
      setUser({
        email: "putri@mail.com",
        first_mid_name: "Putri",
        last_name: "Hamidah",
        role: "member",
        nomor_member: "M0001"
      });
    }
  }, [navigate]);

  if (!user) return null;
  const isStaffPath = location.pathname.startsWith('/staff');
  return (
    <div style={{ backgroundColor: '#f8f9fc', minHeight: '100vh' }}>
      {isStaffPath ? (
        <StaffNavbar userName={user.first_mid_name} />
      ) : (
        <LoggedInNavbar userName={user.first_mid_name} />
      )}
      
      <div style={{ padding: '32px' }}>
        <Outlet context={{ user }} />
      </div>
    </div>
  );
}