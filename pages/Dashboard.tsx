
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { User, DailyEntry, Mood } from '../types';
import { SyncService } from '../utils/syncService';

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const [entries, setEntries] = useState<DailyEntry[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);

  const loadEntries = async () => {
    const allEntries: DailyEntry[] = JSON.parse(localStorage.getItem('psicolog_entries') || '[]');
    const userEntries = allEntries.filter(e => e.userId === user.id)
      .sort((a, b) => b.timestamp - a.timestamp);
    setEntries(userEntries);
  };

  const handleManualSync = async () => {
    setIsSyncing(true);
    await SyncService.pushToCloud(user);
    setTimeout(() => setIsSyncing(false), 1000);
  };

  useEffect(() => {
    loadEntries();
  }, [user.id]);

  const handleDeleteEntry = async (id: string) => {
    if (window.confirm('Tem certeza que deseja apagar este registro?')) {
      const allEntries: DailyEntry[] = JSON.parse(localStorage.getItem('psicolog_entries') || '[]');
      const updatedEntries = allEntries.filter(e => e.id !== id);
      localStorage.setItem('psicolog_entries', JSON.stringify(updatedEntries));
      await loadEntries();
      await SyncService.pushToCloud(user);
    }
  };

  const getMoodEmoji = (mood: Mood) => {
    switch (mood) {
      case Mood.VERY_BAD: return '😞';
      case Mood.BAD: return '🙁';
      case Mood.NEUTRAL: return '😐';
      case Mood.GOOD: return '🙂';
      case Mood.EXCELLENT: return '😄';
      default: return '😶';
    }
  };

  return (
    <Layout 
      title="Portal do Paciente" 
      actions={
        <div className="flex gap-2">
          <button 
            onClick={handleManualSync}
            className={`w-10 h-10 flex items-center justify-center rounded-full transition-all ${isSyncing ? 'bg-amber-100 text-amber-600' : 'bg-slate-50 text-blue-900'}`}
            title="Sincronizar com a Nuvem"
          >
            <i className={`fas fa-sync-alt ${isSyncing ? 'animate-sync' : ''}`}></i>
          </button>
          <button 
            onClick={() => window.location.hash = '#profile'} 
            className="w-10 h-10 flex items-center justify-center text-blue-900 bg-slate-50 hover:bg-blue-100 rounded-full transition-all"
            title="Meus Dados"
          >
            <i className="fas fa-user-cog"></i>
          </button>
          <button 
            onClick={onLogout} 
            className="w-10 h-10 flex items-center justify-center text-blue-900 bg-slate-50 hover:bg-red-50 hover:text-red-500 rounded-full transition-all"
            title="Sair"
          >
            <i className="fas fa-sign-out-alt"></i>
          </button>
        </div>
      }
    >
      <div className="space-y-6">
        <div className="brand-gradient rounded-[2rem] p-8 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 gold-gradient opacity-10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
          <div className="flex justify-between items-start mb-1">
             <h2 className="text-3xl font-black">Olá, {user.fullName.split(' ')[0]}!</h2>
             <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full border border-white/20">
                <div className={`w-2 h-2 rounded-full ${isSyncing ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'}`}></div>
                <span className="text-[8px] font-black uppercase tracking-widest">{isSyncing ? 'Sincronizando' : 'Nuvem OK'}</span>
             </div>
          </div>
          <p className="text-blue-100 text-sm opacity-90 font-medium">Sua jornada sincronizada em tempo real.</p>
          <div className="mt-6 flex flex-col gap-3">
            <a href="#new-entry" className="gold-gradient text-blue-900 px-6 py-4 rounded-2xl text-xs font-black shadow-lg uppercase tracking-widest active:scale-95 transition-transform text-center w-full">
              Fazer Registro Diário
            </a>
          </div>
        </div>

        <div className="bg-white border-2 border-slate-100 p-5 rounded-[2rem] flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 brand-gradient rounded-2xl flex items-center justify-center text-amber-400 shadow-inner">
              <i className="fas fa-calendar-check"></i>
            </div>
            <div>
              <p className="text-[10px] font-black text-blue-900 uppercase tracking-widest">Sua Terapia</p>
              <p className="text-xs text-slate-500">Agende sua próxima sessão</p>
            </div>
          </div>
          <a href="#booking" className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-blue-900 hover:bg-amber-50 hover:text-amber-600 transition-colors">
            <i className="fas fa-arrow-right"></i>
          </a>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-50 p-6 rounded-[2rem] border border-white shadow-sm">
            <p className="text-[9px] text-blue-900 font-black uppercase tracking-widest mb-2">Registros Salvos</p>
            <p className="text-3xl font-black text-slate-800">{entries.length}</p>
          </div>
          <div className="bg-amber-50 p-6 rounded-[2rem] border border-white shadow-sm">
            <p className="text-[9px] text-amber-700 font-black uppercase tracking-widest mb-2">Último Humor</p>
            <p className="text-3xl font-black">{entries.length > 0 ? getMoodEmoji(entries[0].mood) : '--'}</p>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-6 px-1">
            <h3 className="text-xs font-black text-blue-900 uppercase tracking-[0.2em]">Registros Recentes</h3>
            <a href="#reports" className="text-[9px] font-bold text-amber-600 uppercase underline">Relatórios PDF</a>
          </div>
          
          <div className="space-y-4">
            {entries.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-[2rem] border-2 border-dashed border-slate-100">
                <i className="fas fa-cloud-upload-alt text-5xl text-slate-100 mb-4"></i>
                <p className="text-slate-400 text-sm font-medium">Seus dados aparecerão aqui em todos os seus aparelhos.</p>
              </div>
            ) : (
              entries.slice(0, 3).map((entry) => (
                <div key={entry.id} className="relative bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm hover:border-amber-200 transition-all group">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] font-black text-blue-900 bg-blue-50 px-3 py-1.5 rounded-full uppercase tracking-wider">
                      {new Date(entry.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                    </span>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleDeleteEntry(entry.id)}
                        className="opacity-0 group-hover:opacity-100 w-8 h-8 flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                      >
                        <i className="fas fa-trash-alt text-[10px]"></i>
                      </button>
                      <span className="text-2xl">{getMoodEmoji(entry.mood)}</span>
                    </div>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed line-clamp-2 italic">
                    "{entry.notes}"
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
