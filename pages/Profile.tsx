
import React, { useState, useRef } from 'react';
import Layout from '../components/Layout';
import { User, DailyEntry } from '../types';

interface ProfileProps {
  user: User;
  onUpdate: (user: User) => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onUpdate }) => {
  const [formData, setFormData] = useState({
    fullName: user.fullName,
    email: user.email,
    birthDate: user.birthDate,
    password: user.password || '',
    confirmPassword: user.password || ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleExportData = () => {
    const allUsers: User[] = JSON.parse(localStorage.getItem('psicolog_users') || '[]');
    const allEntries: DailyEntry[] = JSON.parse(localStorage.getItem('psicolog_entries') || '[]');
    
    const userEntries = allEntries.filter(e => e.userId === user.id);
    const backupData = {
      user: user,
      entries: userEntries,
      exportedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(backupData)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Backup_PsiAurilene_${user.username}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setSuccess('Backup gerado! Envie este arquivo para seu outro dispositivo.');
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (!data.user || !data.entries) throw new Error('Arquivo inválido');

        const users: User[] = JSON.parse(localStorage.getItem('psicolog_users') || '[]');
        if (!users.some(u => u.id === data.user.id)) {
          users.push(data.user);
          localStorage.setItem('psicolog_users', JSON.stringify(users));
        }

        const entries: DailyEntry[] = JSON.parse(localStorage.getItem('psicolog_entries') || '[]');
        const newEntries = data.entries.filter((ne: DailyEntry) => !entries.some(e => e.id === ne.id));
        localStorage.setItem('psicolog_entries', JSON.stringify([...entries, ...newEntries]));

        setSuccess('Dados importados com sucesso neste dispositivo!');
      } catch (err) {
        setError('Erro ao importar arquivo. Verifique se o arquivo está correto.');
      }
    };
    reader.readAsText(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const { fullName, email, birthDate, password, confirmPassword } = formData;

    if (!fullName || !email || !birthDate || !password) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas não conferem.');
      return;
    }

    const users: User[] = JSON.parse(localStorage.getItem('psicolog_users') || '[]');
    const userIndex = users.findIndex(u => u.id === user.id);

    if (userIndex !== -1) {
      const updatedUser: User = { ...user, fullName, email, birthDate, password };
      users[userIndex] = updatedUser;
      localStorage.setItem('psicolog_users', JSON.stringify(users));
      onUpdate(updatedUser);
      setSuccess('Dados atualizados com sucesso!');
    }
  };

  return (
    <Layout title="Meus Dados" onBack={() => window.location.hash = '#dashboard'}>
      <div className="space-y-6">
        <div className="bg-blue-50 p-6 rounded-[2rem] border border-blue-100 flex items-center gap-4">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm text-blue-900 overflow-hidden border-2 border-amber-400">
             <i className="fas fa-user text-3xl"></i>
          </div>
          <div>
            <h2 className="text-xl font-black text-blue-900 uppercase tracking-tighter">Perfil</h2>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Gerencie seus dados e acessos</p>
          </div>
        </div>

        <div className="bg-slate-50 border-2 border-dashed border-slate-200 p-6 rounded-[2rem] space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <i className="fas fa-sync-alt text-amber-600"></i>
            <h3 className="text-[10px] font-black text-blue-900 uppercase tracking-widest">Sincronização</h3>
          </div>
          <p className="text-[10px] text-slate-500 leading-relaxed uppercase font-bold">
            Seus dados são criptografados e salvos na nuvem. Você pode acessar de qualquer dispositivo usando seu usuário e senha.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={handleExportData}
              className="flex flex-col items-center justify-center p-4 bg-white border border-slate-200 rounded-2xl hover:border-amber-300 transition-colors group"
            >
              <i className="fas fa-file-export text-blue-900 mb-2 group-hover:scale-110 transition-transform"></i>
              <span className="text-[8px] font-black uppercase text-slate-600">Exportar Backup</span>
            </button>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center justify-center p-4 bg-white border border-slate-200 rounded-2xl hover:border-amber-300 transition-colors group"
            >
              <i className="fas fa-file-import text-blue-900 mb-2 group-hover:scale-110 transition-transform"></i>
              <span className="text-[8px] font-black uppercase text-slate-600">Importar Backup</span>
            </button>
            <input type="file" ref={fileInputRef} onChange={handleImportData} accept=".json" className="hidden" />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5 ml-1">Nome Completo</label>
            <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-800 outline-none transition-all text-sm" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5 ml-1">E-mail</label>
              <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-800 outline-none transition-all text-sm" />
            </div>
            <div className="col-span-2">
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5 ml-1">Nascimento</label>
              <input type="date" name="birthDate" value={formData.birthDate} onChange={handleInputChange} className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-800 outline-none transition-all text-sm" />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
             <h3 className="text-[10px] font-black text-blue-900 uppercase tracking-[0.2em] mb-4">Segurança</h3>
             <div className="space-y-4">
                <div>
                  <div className="relative">
                    <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleInputChange} className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-800 outline-none transition-all text-sm pr-12" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"><i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i></button>
                  </div>
                </div>
             </div>
          </div>

          {error && <div className="bg-red-50 text-red-500 text-xs font-bold p-4 rounded-2xl text-center border border-red-100">{error}</div>}
          {success && <div className="bg-emerald-50 text-emerald-600 text-xs font-bold p-4 rounded-2xl text-center border border-emerald-100">{success}</div>}

          <div className="grid grid-cols-1 gap-4 pt-4">
            <button type="submit" className="w-full brand-gradient text-white font-black py-5 rounded-2xl shadow-lg uppercase tracking-widest text-xs active:scale-95 transition-transform">Salvar Alterações</button>
            <button type="button" onClick={() => window.location.hash = '#dashboard'} className="w-full bg-slate-100 text-slate-500 font-black py-5 rounded-2xl uppercase tracking-widest text-xs active:scale-95 transition-transform">Voltar</button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default Profile;
