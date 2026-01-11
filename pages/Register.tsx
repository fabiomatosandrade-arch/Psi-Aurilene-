
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
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
        <h2 className="text-2xl font-bold gold-text mb-2 text-center">CADASTRO</h2>
        <p className="text-slate-400 text-sm mb-8 text-center">Crie sua conta para iniciar o acompanhamento</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Nome Completo</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                placeholder="Ex: João Silva"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Usuário</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                placeholder="usuario123"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">CPF</label>
              <input
                type="text"
                name="cpf"
                value={formData.cpf}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                placeholder="000.000.000-00"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Data de Nascimento</label>
              <input
                type="date"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Senha</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                placeholder="******"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Confirmar Senha</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                placeholder="******"
              />
            </div>
          </div>

          {error && (
            <p className="text-red-500 text-xs font-medium text-center bg-red-50 p-2 rounded-lg">{error}</p>
          )}

          <button
            type="submit"
            className="w-full gold-gradient text-white font-bold py-3 rounded-xl shadow-lg hover:opacity-90 transition-opacity active:scale-[0.98] mt-4"
          >
            Cadastrar
          </button>
        </form>

        <div className="mt-8 text-center space-y-4">
          <p className="text-sm text-slate-500">
            Já possui conta? <a href="#login" className="font-bold text-amber-600 hover:underline">Voltar para o Login</a>
          </p>
          <div className="pt-2">
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

export default Register;
