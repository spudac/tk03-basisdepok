import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './features/auth/Auth';
import Register from './features/register/Register';
import Main from './pages/Main';
import ProfileSettings from './components/ProfileSettings';
import ClaimMissingMilesMember from './components/ClaimMissingMilesMember';
import TransferMiles from './components/TransferMiles';
import ClaimMissingMilesStaf from './components/ClaimMissingMilesStaf';
import Navbar from './components/Navbar';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<><Navbar /><Login /></>} />
        <Route path="/register" element={<><Navbar /><Register /></>} />

        <Route path="/" element={<Main />}>
          <Route index element={<Navigate to="/settings" replace />} />
          <Route path="settings" element={<ProfileSettings role="member" email="user@mail.com" />} />
          <Route path="claim-miles" element={<ClaimMissingMilesMember />} />
          <Route path="transfer-miles" element={<TransferMiles />} />
          <Route path="staff/settings" element={<ProfileSettings role="staf" email="staff@aero.com" />} />
          <Route path="staff/claims" element={<ClaimMissingMilesStaf />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;