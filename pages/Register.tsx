
import React, { useState } from 'react';
import { User } from '../types';

interface RegisterProps {
  onRegisterSuccess: () => void;
}

const Register: React.FC<RegisterProps> = ({ onRegisterSuccess }) => {
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    email: '',
    cpf: '',
    birthDate: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');

  const formatCPF = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'cpf' ? formatCPF(value) : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const { username, fullName, email, cpf, birthDate, password, confirmPassword } = formData;

    // Validação de e-mail e campos obrigatórios
    if (!username || !fullName || !email || !cpf || !birthDate || !password || !confirmPassword) {
      setError('Todos os campos marcados com * são obrigatórios.');
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas não conferem.');
      return;
    }

    const users: User[] = JSON.parse(localStorage.getItem('psicolog_users') || '[]');
    
    // Bloqueio de duplicidade de CPF
    if (users.some(u => u.cpf === cpf)) {
      setError('Este CPF já possui um cadastro ativo.');
      return;
    }

    if (users.some(u => u.username === username)) {
      setError('Este nome de usuário já está em uso.');
      return;
    }
    
    if (users.some(u => u.email === email)) {
      setError('Este e-mail já está cadastrado.');
      return;
    }

    const newUser: User = {
      id: crypto.randomUUID(),
      username,
      fullName,
      email,
      cpf,
      birthDate,
      password
    };

    users.push(newUser);
    localStorage.setItem('psicolog_users', JSON.stringify(users));
    
    alert('Cadastro realizado com sucesso!');
    onRegisterSuccess();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl p-8 border border-slate-100">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-black text-blue-900 uppercase tracking-tighter">Criar Conta</h2>
          <div className="h-1 w-12 gold-gradient mx-auto mt-2"></div>
          <p className="text-slate-400 text-[9px] uppercase tracking-widest font-bold mt-2">Portal Terapêutico Psi. Aurilene</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1 ml-1">Nome Completo *</label>
            <input
              type="text"
              name="fullName"
              required
              value={formData.fullName}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-800 outline-none text-sm transition-all"
              placeholder="Ex: Maria Oliveira"
            />
          </div>

          <div>
            <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1 ml-1">E-mail de Recuperação *</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-800 outline-none text-sm transition-all"
              placeholder="seu@email.com"
            />
            <p className="text-[8px] text-slate-400 mt-1 ml-1 italic">Este e-mail será usado caso você esqueça sua senha.</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1 ml-1">Usuário *</label>
              <input
                type="text"
                name="username"
                required
                value={formData.username}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-800 outline-none text-sm transition-all"
                placeholder="usuario"
              />
            </div>
            <div>
              <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1 ml-1">CPF *</label>
              <input
                type="text"
                name="cpf"
                required
                value={formData.cpf}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-800 outline-none text-sm transition-all"
                placeholder="000.000.000-00"
              />
            </div>
          </div>

          <div>
            <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1 ml-1">Data de Nascimento *</label>
            <input
              type="date"
              name="birthDate"
              required
              value={formData.birthDate}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-800 outline-none text-sm transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1 ml-1">Senha *</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-800 outline-none text-sm transition-all pr-10"
                  placeholder="******"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-amber-600 transition-colors"
                >
                  <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'} text-xs`}></i>
                </button>
              </div>
            </div>
            <div>
              <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1 ml-1">Confirmar *</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-800 outline-none text-sm transition-all pr-10"
                  placeholder="******"
                />
                <button 
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-amber-600 transition-colors"
                >
                  <i className={`fas ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'} text-xs`}></i>
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-500 text-[10px] font-bold p-3 rounded-xl text-center border border-red-100 uppercase tracking-wider">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full brand-gradient text-white font-black py-4 rounded-xl shadow-lg uppercase tracking-widest text-[10px] mt-4 active:scale-95 transition-transform"
          >
            Finalizar Cadastro
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-xs text-slate-500 font-medium">
            Já possui uma conta? <a href="#login" className="font-black text-blue-900 border-b-2 border-amber-400">Fazer Login</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
