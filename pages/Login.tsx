
import React, { useState } from 'react';
import { User } from '../types';
import { SyncService } from '../utils/syncService';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSearchingCloud, setIsSearchingCloud] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!username || !password) {
      setError('Por favor, preencha usuário e senha.');
      return;
    }

    const users: User[] = JSON.parse(localStorage.getItem('psicolog_users') || '[]');
    // Busca local apenas por usuário e senha
    let user = users.find(u => u.username.toLowerCase() === username.toLowerCase() && u.password === password);
    
    if (!user) {
      // Se não achar local, tenta buscar na nuvem para permitir troca de aparelho
      setIsSearchingCloud(true);
      const cloudUser = await SyncService.pullFromCloud(username, password);
      setIsSearchingCloud(false);
      
      if (cloudUser) {
        user = cloudUser;
      }
    }

    if (user) {
      onLogin(user);
    } else {
      setError('Acesso negado. Usuário ou senha incorretos.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl p-10 border border-slate-100 text-center">
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-4xl font-black text-slate-800 tracking-tighter">PSI.<span className="gold-text">AURILENE</span></h1>
          <div className="h-1.5 w-16 gold-gradient rounded-full mt-3"></div>
          <p className="text-slate-400 text-[10px] mt-4 uppercase tracking-[0.5em] font-bold">Portal Multi-Dispositivo</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2 ml-1">Usuário</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-800 outline-none transition-all text-sm"
              placeholder="Seu usuário"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2 ml-1">
              <label className="block text-[10px] font-bold text-slate-400 uppercase">Senha</label>
              <a href="#forgot-password" className="text-[9px] font-black text-amber-600 uppercase hover:underline">Esqueceu?</a>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-800 outline-none transition-all text-sm pr-12"
                placeholder="••••••••"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-amber-600 transition-colors"
              >
                <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-500 text-[10px] font-black p-4 rounded-2xl text-center border border-red-100 uppercase tracking-tighter">
              <i className="fas fa-exclamation-circle mr-2"></i> {error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={isSearchingCloud}
            className="w-full brand-gradient text-white font-bold py-5 rounded-2xl shadow-lg uppercase tracking-widest text-xs mt-4 active:scale-95 transition-transform flex items-center justify-center gap-3"
          >
            {isSearchingCloud ? <i className="fas fa-cloud-download-alt animate-sync"></i> : <i className="fas fa-sign-in-alt"></i>}
            {isSearchingCloud ? 'Conectando à Nuvem...' : 'Entrar no Portal'}
          </button>
        </form>

        <div className="mt-8 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
          <p className="text-[9px] text-emerald-700 leading-relaxed font-bold uppercase tracking-[0.1em]">
            <i className="fas fa-globe mr-2"></i>
            Acesse de qualquer lugar apenas com seu login e senha.
          </p>
        </div>

        <p className="mt-8 text-sm text-slate-500">
          Novo por aqui? <a href="#register" className="font-bold text-blue-800 border-b-2 border-amber-400">Crie sua conta</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
