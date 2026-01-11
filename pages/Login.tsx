
import React, { useState } from 'react';
import { User } from '../types';
import { getAppLogo } from '../constants';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const currentLogo = getAppLogo();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!username || !password) {
      setError('Por favor, preencha todos os campos.');
      return;
    }
    const users: User[] = JSON.parse(localStorage.getItem('psicolog_users') || '[]');
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      onLogin(user);
    } else {
      setError('Usuário ou senha incorretos.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl p-10 border border-slate-100 text-center">
        <div className="flex flex-col items-center mb-12">
          <div className="w-32 h-32 mb-6 rounded-full brand-gradient flex items-center justify-center border-4 border-amber-200 shadow-xl overflow-hidden">
             <img src={currentLogo} alt="Logo" className="w-full h-full object-cover filter drop-shadow-lg" />
          </div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tighter">PSI.<span className="gold-text">AURILENE</span></h1>
          <div className="h-1 w-12 gold-gradient rounded-full mt-2"></div>
          <p className="text-slate-400 text-[10px] mt-3 uppercase tracking-[0.4em] font-bold">Acompanhamento Terapêutico</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 text-left">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2 ml-1">Nome de Usuário</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-800 outline-none transition-all text-sm"
              placeholder="Seu usuário"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2 ml-1">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-800 outline-none transition-all text-sm"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-500 text-xs font-semibold p-4 rounded-2xl text-center border border-red-100">
              {error}
            </div>
          )}

          <button type="submit" className="w-full brand-gradient text-white font-bold py-5 rounded-2xl shadow-lg uppercase tracking-widest text-xs mt-6 active:scale-95 transition-transform">
            Entrar no Portal
          </button>
        </form>

        <p className="mt-10 text-sm text-slate-500">
          Novo por aqui? <a href="#register" className="font-bold text-blue-800 border-b-2 border-amber-400">Crie sua conta</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
