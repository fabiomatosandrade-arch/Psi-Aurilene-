
import React, { useState } from 'react';
import { User } from '../types';
import { LOGO_AS_GOLD } from '../constants';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

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
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 border border-slate-100 text-center">
        <div className="flex flex-col items-center mb-10">
          <div className="w-24 h-24 mb-4 rounded-full bg-amber-50 flex items-center justify-center border-2 border-amber-100 shadow-sm overflow-hidden p-2">
             <img src={LOGO_AS_GOLD} alt="Psi.Aurilene Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-3xl font-black gold-text tracking-tighter">PSI.AURILENE</h1>
          <p className="text-slate-400 text-[10px] mt-1 uppercase tracking-[0.3em] font-bold">Acompanhamento Terapêutico</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 text-left">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5 ml-1">Nome de Usuário</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-amber-500 outline-none transition-all text-sm"
              placeholder="Seu usuário"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5 ml-1">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-amber-500 outline-none transition-all text-sm"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-500 text-xs font-semibold p-3 rounded-xl text-center border border-red-100">
              {error}
            </div>
          )}

          <button type="submit" className="w-full gold-gradient text-white font-bold py-4 rounded-2xl shadow-lg uppercase tracking-widest text-xs mt-4">
            Entrar no Portal
          </button>
        </form>

        <p className="mt-8 text-sm text-slate-500">
          Novo por aqui? <a href="#register" className="font-bold text-amber-600">Crie sua conta</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
