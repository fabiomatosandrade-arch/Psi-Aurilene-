import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { User, DailyEntry, Mood } from '../types';

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const [entries, setEntries] = useState<DailyEntry[]>([]);

  useEffect(() => {
    const allEntries: DailyEntry[] = JSON.parse(localStorage.getItem('psicolog_entries') || '[]');
    const userEntries = allEntries.filter(e => e.userId === user.id)
      .sort((a, b) => b.timestamp - a.timestamp);
    setEntries(userEntries);
  }, [user.id]);

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
        <button onClick={onLogout} className="w-10 h-10 flex items-center justify-center text-blue-900 bg-slate-50 hover:bg-red-50 hover:text-red-500 rounded-full transition-all">
          <i className="fas fa-sign-out-alt"></i>
        </button>
      }
    >
      <div className="space-y-6">
        <div className="brand-gradient rounded-[2rem] p-8 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 gold-gradient opacity-10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
          <h2 className="text-3xl font-black mb-1">Olá, {user.fullName.split(' ')[0]}!</h2>
          <p className="text-blue-100 text-sm opacity-90 font-medium">Sua jornada de autocuidado continua.</p>
          <div className="mt-6 flex gap-3">
            <a href="#new-entry" className="gold-gradient text-blue-900 px-6 py-3 rounded-2xl text-xs font-black shadow-lg uppercase tracking-widest active:scale-95 transition-transform text-center flex-1">
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
            <p className="text-[9px] text-blue-900 font-black uppercase tracking-widest mb-2">Total de Notas</p>
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
            <a href="#reports" className="text-[9px] font-bold text-amber-600 uppercase underline">Ver Relatórios</a>
          </div>
          
          <div className="space-y-4">
            {entries.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-[2rem] border-2 border-dashed border-slate-100">
                <i className="fas fa-notes-medical text-5xl text-slate-100 mb-4"></i>
                <p className="text-slate-400 text-sm font-medium">Inicie seu primeiro registro hoje.</p>
              </div>
            ) : (
              entries.slice(0, 3).map((entry) => (
                <div key={entry.id} className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm hover:border-amber-200 transition-all group">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] font-black text-blue-900 bg-blue-50 px-3 py-1.5 rounded-full uppercase tracking-wider">
                      {new Date(entry.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                    </span>
                    <span className="text-2xl group-hover:scale-125 transition-transform duration-500">{getMoodEmoji(entry.mood)}</span>
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