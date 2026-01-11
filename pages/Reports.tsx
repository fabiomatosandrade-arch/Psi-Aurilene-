
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
  const [selectedEntry, setSelectedEntry] = useState<DailyEntry | null>(null);
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
          className="w-full gold-gradient text-white flex items-center justify-center gap-3 p-4 rounded-2xl shadow-lg disabled:opacity-50 font-bold text-xs"
        >
          {isGenerating ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-file-pdf"></i>}
          {isGenerating ? 'GERANDO...' : 'BAIXAR RELATÓRIO PDF'}
        </button>

        <div className="space-y-3">
          {filteredEntries.slice(0, visibleCount).map((entry) => (
            <div key={entry.id} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-slate-700">{new Date(entry.date).toLocaleDateString('pt-BR')}</span>
                <span className="text-xl">
                  {entry.mood === 5 ? '😄' : entry.mood === 4 ? '🙂' : entry.mood === 3 ? '😐' : entry.mood === 2 ? '🙁' : '😞'}
                </span>
              </div>
              <p className="text-slate-600 text-xs italic">"{entry.notes}"</p>
            </div>
          ))}
          {hasMore && (
            <button onClick={() => setVisibleCount(v => v + 10)} className="w-full py-4 text-[10px] font-black text-slate-400 uppercase">
              Carregar mais
            </button>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Reports;
