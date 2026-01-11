import React, { useState } from 'react';
import { User } from '../types';

interface RegisterProps {
  onRegisterSuccess: () => void;
}

const Register: React.FC<RegisterProps> = ({ onRegisterSuccess }) => {
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    cpf: '',
    birthDate: '',
    password: '',
    confirmPassword: ''
  });
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

    const { username, fullName, cpf, birthDate, password, confirmPassword } = formData;

    if (!username || !fullName || !cpf || !birthDate || !password || !confirmPassword) {
      setError('Todos os campos são obrigatórios.');
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas não conferem.');
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    const users: User[] = JSON.parse(localStorage.getItem('psicolog_users') || '[]');
    if (users.some(u => u.username === username)) {
      setError('Este nome de usuário já está em uso.');
      return;
    }

    const newUser: User = {
      id: crypto.randomUUID(),
      username,
      fullName,
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
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl p-10 border border-slate-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-blue-900 uppercase tracking-tighter">Criar Conta</h2>
          <div className="h-1 w-12 gold-gradient mx-auto mt-2"></div>
          <p className="text-slate-400 text-[10px] uppercase tracking-widest font-bold mt-2">Portal Terapêutico Psi. Aurilene</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5 ml-1">Nome Completo</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-800 outline-none text-sm transition-all"
              placeholder="Ex: Maria Oliveira"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5 ml-1">Usuário</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-800 outline-none text-sm transition-all"
                placeholder="usuario"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5 ml-1">CPF</label>
              <input
                type="text"
                name="cpf"
                value={formData.cpf}
                onChange={handleInputChange}
                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-800 outline-none text-sm transition-all"
                placeholder="000.000.000-00"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5 ml-1">Data de Nascimento</label>
            <input
              type="date"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleInputChange}
              className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-800 outline-none text-sm transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5 ml-1">Senha</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-800 outline-none text-sm transition-all"
                placeholder="******"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5 ml-1">Confirmar</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-800 outline-none text-sm transition-all"
                placeholder="******"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-500 text-[10px] font-bold p-3 rounded-xl text-center border border-red-100 uppercase tracking-wider">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full brand-gradient text-white font-black py-4 rounded-2xl shadow-lg uppercase tracking-widest text-[10px] mt-4 active:scale-95 transition-transform"
          >
            Finalizar Cadastro
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-xs text-slate-500 font-medium">
            Já possui uma conta? <a href="#login" className="font-black text-blue-900 border-b-2 border-amber-400">Fazer Login</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;