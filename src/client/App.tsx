import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AuthModal } from './components/auth/AuthModal';
import { HomePage } from './pages/HomePage';
import { CreateInvitationPage } from './pages/CreateInvitationPage';
import { InvitePage } from './pages/InvitePage';
import { DashboardPage } from './pages/DashboardPage';

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/create" element={<CreateInvitationPage />} />
          <Route path="/customize" element={<CreateInvitationPage />} />
          <Route path="/builder" element={<CreateInvitationPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/invite/:slug" element={<InvitePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <AuthModal />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

