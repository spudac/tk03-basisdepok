import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './features/auth/Auth.tsx';
import Register from './features/register/Register.tsx';
import KelolaHadiah from './features/ManageGifts/ManageGifts.tsx';
// import Main from './pages/Main'; // The main page you navigate to after login

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route path="/register" element={<Register />}></Route>

        <Route path="/kelola-hadiah" element={<KelolaHadiah/>}></Route>
        
        {/* Redirect unknown routes to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;