
import React, { useState } from 'react';
import { User } from '../types';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [recoveredUserId, setRecoveredUserId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    const users: User[] = JSON.parse(localStorage.getItem('psicolog_users') || '[]');
    const user = users.find(u => u.email === email);

    if (user) {
      setMessage({ type: 'success', text: `Um link de recuperação foi enviado para ${email}.` });
      setRecoveredUserId(user.id);
    } else {
      setMessage({ type: 'error', text: 'E-mail não encontrado em nossa base de dados.' });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl p-10 border border-slate-100 text-center">
        <div className="mb-8">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-900 shadow-inner">
            <i className="fas fa-lock-open text-2xl"></i>
          </div>
          <h2 className="text-2xl font-black text-blue-900 uppercase tracking-tighter">Recuperar Senha</h2>
          <p className="text-slate-400 text-xs mt-2">Informe seu e-mail cadastrado para receber as instruções.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 text-left">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2 ml-1">Seu E-mail Profissional</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-800 outline-none transition-all text-sm"
              placeholder="exemplo@email.com"
              required
            />
          </div>

          {message && (
            <div className={`p-4 rounded-2xl text-xs font-bold border ${
              message.type === 'success' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-500 border-red-100'
            }`}>
              {message.text}
              {message.type === 'success' && recoveredUserId && (
                <div className="mt-4 pt-4 border-t border-emerald-100">
                  <p className="text-[10px] uppercase mb-2 opacity-70">Ambiente de Teste:</p>
                  <a 
                    href={`#reset-password?id=${recoveredUserId}`}
                    className="inline-block bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition-colors"
                  >
                    Simular Clique no E-mail
                  </a>
                </div>
              )}
            </div>
          )}

          <button type="submit" className="w-full brand-gradient text-white font-bold py-5 rounded-2xl shadow-lg uppercase tracking-widest text-xs active:scale-95 transition-transform">
            Enviar Link de Recuperação
          </button>
        </form>

        <p className="mt-10 text-sm text-slate-500">
          Lembrou a senha? <a href="#login" className="font-bold text-blue-800 border-b-2 border-amber-400">Voltar para Login</a>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
