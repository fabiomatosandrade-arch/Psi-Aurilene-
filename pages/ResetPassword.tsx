
import React, { useState, useEffect } from 'react';
import { User } from '../types';

const ResetPassword: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.split('?')[1]);
    setUserId(params.get('id'));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!password || !confirmPassword) {
      setError('Preencha ambos os campos.');
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas não conferem.');
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres.');
      return;
    }

    const users: User[] = JSON.parse(localStorage.getItem('psicolog_users') || '[]');
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex !== -1) {
      users[userIndex].password = password;
      localStorage.setItem('psicolog_users', JSON.stringify(users));
      setSuccess(true);
      setTimeout(() => {
        window.location.hash = '#login';
      }, 3000);
    } else {
      setError('Usuário inválido ou link expirado.');
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
        <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl p-10 border border-slate-100 text-center">
          <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-500 shadow-inner">
            <i className="fas fa-check-circle text-4xl"></i>
          </div>
          <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Senha Redefinida!</h2>
          <p className="text-slate-500 text-sm mt-4">Sua nova senha foi salva com sucesso. Você será redirecionado para o login em instantes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl p-10 border border-slate-100 text-center">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-black text-blue-900 uppercase tracking-tighter">Nova Senha</h2>
          <div className="h-1 w-12 gold-gradient mx-auto mt-2"></div>
          <p className="text-slate-400 text-[10px] uppercase tracking-widest font-bold mt-2">Crie sua nova credencial de acesso</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5 ml-1">Nova Senha</label>
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
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5 ml-1">Repetir Nova Senha</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-800 outline-none transition-all text-sm pr-12"
                placeholder="••••••••"
              />
              <button 
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-amber-600 transition-colors"
              >
                <i className={`fas ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-500 text-xs font-bold p-4 rounded-2xl border border-red-100 text-center">
              {error}
            </div>
          )}

          <button type="submit" className="w-full brand-gradient text-white font-bold py-5 rounded-2xl shadow-lg uppercase tracking-widest text-xs mt-4 active:scale-95 transition-transform">
            Atualizar Senha
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
