
import React, { useState } from 'react';
import { User } from '../types';

// Logo Monograma "AS" Dourado (Placeholder de alta qualidade)
const LOGO_BASE64 = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23d4af37' d='M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,6A6,6 0 0,0 6,12A6,6 0 0,0 12,18A6,6 0 0,0 18,12A6,6 0 0,0 12,6Z' /%3E%3C/svg%3E";

// Fix: Added missing LoginProps interface
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
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 border border-slate-100">
        <div className="flex flex-col items-center mb-10">
          <div className="w-24 h-24 mb-4 rounded-full bg-amber-50 flex items-center justify-center border-2 border-amber-100 shadow-inner">
             <img src={LOGO_BASE64} alt="Psi.Aurilene Logo" className="w-16 h-16 object-contain" />
          </div>
          <h1 className="text-3xl font-black gold-text tracking-tighter">PSI.AURILENE</h1>
          <p className="text-slate-400 text-[10px] mt-1 uppercase tracking-[0.3em] font-bold">Acompanhamento Terapêutico</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5 ml-1">Nome de Usuário</label>
            <div className="relative">
              <span className="absolute left-4 top-3.5 text-slate-300">
                <i className="fas fa-user text-sm"></i>
              </span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-amber-500 outline-none transition-all placeholder:text-slate-300 text-sm"
                placeholder="Ex: joaosilva"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5 ml-1">Sua Senha</label>
            <div className="relative">
              <span className="absolute left-4 top-3.5 text-slate-300">
                <i className="fas fa-lock text-sm"></i>
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-amber-500 outline-none transition-all placeholder:text-slate-300 text-sm"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-500 text-xs font-semibold p-4 rounded-xl text-center border border-red-100 animate-pulse">
              <i className="fas fa-exclamation-circle mr-2"></i>
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full gold-gradient text-white font-bold py-4 rounded-2xl shadow-lg hover:shadow-amber-200/50 transition-all active:scale-[0.98] mt-4 uppercase tracking-widest text-xs"
          >
            Entrar no Portal
          </button>
        </form>

        <div className="mt-10 pt-6 border-t border-slate-100 text-center space-y-4">
          <p className="text-sm text-slate-500">
            Ainda não tem acesso? <br/>
            <a href="#register" className="font-bold text-amber-600 hover:text-amber-700 transition-colors inline-block mt-2 underline decoration-amber-200 underline-offset-4">
              Crie sua conta aqui
            </a>
          </p>
          
          <div className="pt-4">
            <a 
              href="https://www.psicologiaasantiago.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[10px] font-black gold-text uppercase tracking-widest hover:opacity-70 transition-opacity"
            >
              Visite nosso site profissional
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
