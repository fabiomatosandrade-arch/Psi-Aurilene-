
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { User, DailyEntry, Mood } from '../types';
import { generateReportPDF } from '../utils/pdfGenerator';

interface ReportsProps {
  user: User;
}

type FilterPeriod = 'all' | 'week' | 'month' | 'year';

const ITEMS_PER_PAGE = 10;

const Reports: React.FC<ReportsProps> = ({ user }) => {
  const [allUserEntries, setAllUserEntries] = useState<DailyEntry[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<DailyEntry[]>([]);
  const [filter, setFilter] = useState<FilterPeriod>('all');
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [isGenerating, setIsGenerating] = useState(false);
  const [validationMsg, setValidationMsg] = useState<string | null>(null);

  useEffect(() => {
    const allEntries: DailyEntry[] = JSON.parse(localStorage.getItem('psicolog_entries') || '[]');
    const userEntries = allEntries.filter(e => e.userId === user.id)
      .sort((a, b) => b.timestamp - a.timestamp);
    setAllUserEntries(userEntries);
  }, [user.id]);

  useEffect(() => {
    const now = Date.now();
    const periods = {
      week: 7 * 24 * 60 * 60 * 1000,
      month: 30 * 24 * 60 * 60 * 1000,
      year: 365 * 24 * 60 * 60 * 1000,
    };

    setValidationMsg(null);
    let filtered = [...allUserEntries];

    if (filter !== 'all') {
      const threshold = now - periods[filter];
      const result = allUserEntries.filter(e => e.timestamp >= threshold);
      
      if (result.length === 0 && allUserEntries.length > 0) {
        const labels = { week: 'última semana', month: 'último mês', year: 'último ano' };
        setValidationMsg(`Atenção: Não há registros para a ${labels[filter]}. Mostrando todo o histórico.`);
        filtered = allUserEntries;
      } else {
        filtered = result;
      }
    }

    setFilteredEntries(filtered);
    setVisibleCount(ITEMS_PER_PAGE);
  }, [allUserEntries, filter]);

  const getMoodDetails = (mood: Mood) => {
    switch (mood) {
      case Mood.VERY_BAD: return { emoji: '😞', label: 'Muito Mal', color: 'text-red-500' };
      case Mood.BAD: return { emoji: '🙁', label: 'Mal', color: 'text-orange-500' };
      case Mood.NEUTRAL: return { emoji: '😐', label: 'Neutro', color: 'text-slate-500' };
      case Mood.GOOD: return { emoji: '🙂', label: 'Bem', color: 'text-blue-500' };
      case Mood.EXCELLENT: return { emoji: '😄', label: 'Muito Bem', color: 'text-emerald-500' };
      default: return { emoji: '😶', label: 'Indefinido', color: 'text-slate-300' };
    }
  };

  const handleDownloadPDF = () => {
    if (filteredEntries.length === 0) return;
    setIsGenerating(true);
    setTimeout(() => {
      try {
        const doc = generateReportPDF(user, filteredEntries);
        doc.save(`Relatorio_${user.fullName.replace(/\s/g, '_')}.pdf`);
      } catch (e) {
        alert('Erro ao gerar PDF');
      } finally {
        setIsGenerating(false);
      }
    }, 800);
  };

  const hasMore = filteredEntries.length > visibleCount;

  return (
    <Layout title="Relatórios" onBack={() => window.location.hash = '#dashboard'}>
      <div className="space-y-6 pb-20">
        <div className="flex bg-slate-100 p-1 rounded-2xl">
          {['all', 'week', 'month', 'year'].map((p) => (
            <button
              key={p}
              onClick={() => setFilter(p as FilterPeriod)}
              className={`flex-1 py-2 text-[10px] font-bold uppercase rounded-xl transition-all ${
                filter === p ? 'bg-white text-amber-600 shadow-sm' : 'text-slate-500'
              }`}
            >
              {p === 'all' ? 'Tudo' : p === 'week' ? 'Semana' : p === 'month' ? 'Mês' : 'Ano'}
            </button>
          ))}
        </div>

        {validationMsg && (
          <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-[11px] text-amber-800 animate-pulse">
            <i className="fas fa-info-circle mr-2"></i>{validationMsg}
          </div>
        )}

        <button
          onClick={handleDownloadPDF}
          disabled={isGenerating || filteredEntries.length === 0}
          className="w-full gold-gradient text-white flex items-center justify-center gap-3 p-4 rounded-2xl shadow-lg disabled:opacity-50 font-bold text-xs active:scale-95 transition-transform"
        >
          {isGenerating ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-file-pdf"></i>}
          {isGenerating ? 'GERANDO...' : 'BAIXAR RELATÓRIO PDF'}
        </button>

        <div className="space-y-4">
          <h3 className="text-[10px] font-black text-blue-900 uppercase tracking-[0.2em] px-1">Registros no Período</h3>
          {filteredEntries.slice(0, visibleCount).map((entry) => {
            const mood = getMoodDetails(entry.mood);
            return (
              <div key={entry.id} className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm hover:border-amber-100 transition-colors">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-black text-slate-800">
                    {new Date(entry.date).toLocaleDateString('pt-BR')}
                  </span>
                  <span className="text-slate-300">•</span>
                  <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1 rounded-full">
                    <span className="text-lg">{mood.emoji}</span>
                    <span className={`text-[9px] font-black uppercase tracking-wider ${mood.color}`}>
                      {mood.label}
                    </span>
                  </div>
                </div>
                <p className="text-slate-600 text-xs italic leading-relaxed">
                  "{entry.notes}"
                </p>
              </div>
            );
          })}
          
          {filteredEntries.length === 0 && (
            <div className="text-center py-20 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200">
              <i className="fas fa-folder-open text-4xl text-slate-200 mb-4"></i>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Nenhum registro encontrado</p>
            </div>
          )}

          {hasMore && (
            <button 
              onClick={() => setVisibleCount(v => v + 10)} 
              className="w-full py-6 text-[10px] font-black text-blue-900 uppercase tracking-[0.3em] hover:text-amber-600 transition-colors"
            >
              Carregar mais registros
            </button>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Reports;
