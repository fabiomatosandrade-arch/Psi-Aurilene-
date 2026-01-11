
import React, { useState, useEffect } from 'react';
import { AuthState, User } from './types';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import NewEntry from './pages/NewEntry';
import Reports from './pages/Reports';
import Booking from './pages/Booking';

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
    if (!auth.isAuthenticated && route !== '#cadastro' && route !== '#login') {
      window.location.hash = '#login';
    }
    if (auth.isAuthenticated && (route === '#login' || route === '#cadastro')) {
      window.location.hash = '#inicio';
    }
  }, [auth.isAuthenticated, route]);

  const handleLogin = (user: User) => {
    setAuth({ user, isAuthenticated: true });
    localStorage.setItem('psicolog_session', JSON.stringify(user));
    window.location.hash = '#inicio';
  };

  const handleLogout = () => {
    setAuth({ user: null, isAuthenticated: false });
    localStorage.removeItem('psicolog_session');
    window.location.hash = '#login';
  };

  const renderRoute = () => {
    switch (route) {
      case '#cadastro':
        return <Register onRegisterSuccess={() => window.location.hash = '#login'} />;
      case '#inicio':
        return <Dashboard user={auth.user!} onLogout={handleLogout} />;
      case '#novo-registro':
        return <NewEntry user={auth.user!} />;
      case '#relatorios':
        return <Reports user={auth.user!} />;
      case '#agendamento':
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
