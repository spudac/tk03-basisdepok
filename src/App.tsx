import { useState } from 'react';
import { supabase } from './supabase';
import './App.css';

// SVG Icon for the Logo (Globe + Plane)
const LogoIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="logo-icon">
    {/* Simplified Globe and Plane SVG based on the reference */}
    <path d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" stroke="#4C6FFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3.6 9H20.4" stroke="#4C6FFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3.6 15H20.4" stroke="#4C6FFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 3C14.5013 5.73835 15.9228 8.77274 16 12C15.9228 15.2273 14.5013 18.2616 12 21C9.49872 18.2616 8.07725 15.2273 8 12C8.07725 8.77274 9.49872 5.73835 12 3Z" stroke="#4C6FFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16.5 7.5L22 2L18 1L14 5L8 4L6 6L11 11L7 15L3 14L1 16L6 18L8 23L10 21L9 17L14 13L18 19L19 15L23 11L22 7.5Z" fill="#fff" stroke="#4C6FFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

async function hashPassword(password: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex.toLowerCase();
}

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const hashedPassword = await hashPassword(password);
      
      const { data, error } = await supabase
        .rpc('login_pengguna', {
          p_email: email,
          p_password: hashedPassword
        })
        .maybeSingle();

      if (error) {
        throw error;
      }

      if (data) {
        const user = data as any;
        setMessage({ text: `Login successful! Welcome ${user.first_mid_name} ${user.last_name}`, type: 'success' });
      } else {
        setMessage({ text: 'Invalid email or password', type: 'error' });
      }
    } catch (err: any) {
      setMessage({ text: err.message || 'An error occurred during login', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Background decorations */}
      <div className="cloud-bottom">
        <div className="cloud-circle c1"></div>
        <div className="cloud-circle c2"></div>
        <div className="cloud-circle c3"></div>
        <div className="cloud-circle c4"></div>
        <div className="cloud-circle c5"></div>
      </div>

      <div className="login-content">
        <div className="logo-container">
          <LogoIcon />
          <h1 className="logo-text">
            <span className="text-aero">Aero</span><span className="text-miles">Miles</span>
          </h1>
        </div>

        <div className="login-card">
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {message.text && (
              <div className={`message ${message.type}`}>
                {message.text}
              </div>
            )}

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;
