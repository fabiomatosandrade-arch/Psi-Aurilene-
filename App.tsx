import React, { useState, useEffect } from 'react';
import { AuthState, User } from './types.ts';
import Login from './pages/Login.tsx';
import Register from './pages/Register.tsx';
import Dashboard from './pages/Dashboard.tsx';
import NewEntry from './pages/NewEntry.tsx';
import Reports from './pages/Reports.tsx';
import Booking from './pages/Booking.tsx';

const App: React.FC = () => {
  const [auth, setAuth] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
  });
  const [route, setRoute] = useState<string>(window.location.hash || '#login');

  useEffect(() => {
    const handleHashChange = () => setRoute(window.location.hash);
    window.addEventListener('hashchange', handleHashChange);

    const storedUser = localStorage.getItem('psicolog_session');
    if (storedUser) {
      setAuth({ user: JSON.parse(storedUser), isAuthenticated: true });
    }

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    if (!auth.isAuthenticated && route !== '#register' && route !== '#login') {
      window.location.hash = '#login';
    }
    if (auth.isAuthenticated && (route === '#login' || route === '#register')) {
      window.location.hash = '#dashboard';
    }
  }, [auth.isAuthenticated, route]);

  const handleLogin = (user: User) => {
    setAuth({ user, isAuthenticated: true });
    localStorage.setItem('psicolog_session', JSON.stringify(user));
    window.location.hash = '#dashboard';
  };

  const handleLogout = () => {
    setAuth({ user: null, isAuthenticated: false });
    localStorage.removeItem('psicolog_session');
    window.location.hash = '#login';
  };

  const renderRoute = () => {
    switch (route) {
      case '#register':
        return <Register onRegisterSuccess={() => window.location.hash = '#login'} />;
      case '#dashboard':
        return <Dashboard user={auth.user!} onLogout={handleLogout} />;
      case '#new-entry':
        return <NewEntry user={auth.user!} />;
      case '#reports':
        return <Reports user={auth.user!} />;
      case '#booking':
        return <Booking user={auth.user!} />;
      case '#login':
      default:
        return <Login onLogin={handleLogin} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {renderRoute()}
    </div>
  );
};

export default App;