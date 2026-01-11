
import React, { useState, useEffect } from 'react';
import { AuthState, User } from './types';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import NewEntry from './pages/NewEntry';
import Reports from './pages/Reports';
import Booking from './pages/Booking';
import LogoGen from './pages/LogoGen';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Profile from './pages/Profile';
import { SyncService } from './utils/syncService';

const App: React.FC = () => {
  const [auth, setAuth] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
  });
  const [isSyncing, setIsSyncing] = useState(false);
  const [route, setRoute] = useState<string>(window.location.hash.split('?')[0] || '#login');

  useEffect(() => {
    const handleHashChange = () => setRoute(window.location.hash.split('?')[0]);
    window.addEventListener('hashchange', handleHashChange);

    const storedUser = localStorage.getItem('psicolog_session');
    if (storedUser) {
      try {
        setAuth({ user: JSON.parse(storedUser), isAuthenticated: true });
      } catch (e) {
        localStorage.removeItem('psicolog_session');
      }
    }

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    const publicRoutes = ['#register', '#login', '#forgot-password', '#reset-password'];
    if (!auth.isAuthenticated && !publicRoutes.includes(route)) {
      window.location.hash = '#login';
    }
    if (auth.isAuthenticated && (route === '#login' || route === '#register' || route === '#forgot-password')) {
      window.location.hash = '#dashboard';
    }
  }, [auth.isAuthenticated, route]);

  const handleLogin = async (user: User) => {
    setIsSyncing(true);
    // Tenta sincronizar os dados mais recentes da nuvem antes de entrar
    await SyncService.pushToCloud(user); 
    setAuth({ user, isAuthenticated: true });
    localStorage.setItem('psicolog_session', JSON.stringify(user));
    setIsSyncing(false);
    window.location.hash = '#dashboard';
  };

  const handleLogout = () => {
    setAuth({ user: null, isAuthenticated: false });
    localStorage.removeItem('psicolog_session');
    window.location.hash = '#login';
  };

  const handleUpdateUser = async (updatedUser: User) => {
    setAuth({ user: updatedUser, isAuthenticated: true });
    localStorage.setItem('psicolog_session', JSON.stringify(updatedUser));
    await SyncService.pushToCloud(updatedUser);
  };

  const renderRoute = () => {
    switch (route) {
      case '#register':
        return <Register onRegisterSuccess={() => window.location.hash = '#login'} />;
      case '#forgot-password':
        return <ForgotPassword />;
      case '#reset-password':
        return <ResetPassword />;
      case '#dashboard':
        return auth.user ? <Dashboard user={auth.user} onLogout={handleLogout} /> : <Login onLogin={handleLogin} />;
      case '#profile':
        return auth.user ? <Profile user={auth.user} onUpdate={handleUpdateUser} /> : <Login onLogin={handleLogin} />;
      case '#new-entry':
        return auth.user ? <NewEntry user={auth.user} /> : <Login onLogin={handleLogin} />;
      case '#reports':
        return auth.user ? <Reports user={auth.user} /> : <Login onLogin={handleLogin} />;
      case '#booking':
        return auth.user ? <Booking user={auth.user} /> : <Login onLogin={handleLogin} />;
      case '#logo-gen':
        return auth.user ? <LogoGen /> : <Login onLogin={handleLogin} />;
      case '#login':
      default:
        return <Login onLogin={handleLogin} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {isSyncing && (
        <div className="fixed inset-0 bg-blue-900/10 backdrop-blur-sm z-[9999] flex items-center justify-center">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl text-center space-y-4 max-w-xs">
            <i className="fas fa-cloud-download-alt text-4xl text-blue-900 animate-sync"></i>
            <p className="text-xs font-black text-blue-900 uppercase tracking-widest">Sincronizando com a Nuvem...</p>
            <p className="text-[9px] text-slate-400 font-bold uppercase">Garantindo que seus dados estejam atualizados em todos os seus aparelhos.</p>
          </div>
        </div>
      )}
      {renderRoute()}
    </div>
  );
};

export default App;
