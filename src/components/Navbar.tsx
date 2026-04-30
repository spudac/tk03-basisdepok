import { useNavigate } from 'react-router-dom';
import aeroMilesLogo from '../assets/AeroMiles Logo.svg';
import loginIcon from '../assets/Login.svg';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div 
        className="navbar-brand" 
        onClick={() => navigate('/')} 
        style={{ cursor: 'pointer' }}
      >
        <img src={aeroMilesLogo} alt="AeroMiles Logo" className="navbar-logo" />
      </div>
      <div className="navbar-actions">
        <button className="btn-login" onClick={() => navigate('/login')}>
          Log in <img src={loginIcon} alt="Login" className="login-icon" />
        </button>
        <button className="btn-register" onClick={() => navigate('/register')}>
          Register
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
