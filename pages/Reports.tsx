
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
  const [moodStats, setMoodStats] = useState<{ mood: Mood; count: number; label: string; emoji: string; color: string }[]>([]);
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

    let filtered = [...allUserEntries];
    setValidationMsg(null);

    if (filter !== 'all') {
      const threshold = now - periods[filter];
      filtered = allUserEntries.filter(e => e.timestamp >= threshold);
      
      // Validação: Se não houver dados no período selecionado mas existirem dados gerais
      if (filtered.length === 0 && allUserEntries.length > 0) {
        const periodLabels = { week: 'última semana', month: 'último mês', year: 'último ano' };
        setValidationMsg(`Não encontramos registros na ${periodLabels[filter as keyof typeof periodLabels]}. Exibindo histórico completo.`);
        filtered = [...allUserEntries];
        setFilter('all');
      }
    }

    setFilteredEntries(filtered);
    setVisibleCount(ITEMS_PER_PAGE);

    const stats = [
      { mood: Mood.EXCELLENT, count: 0, label: 'Muito Bem', emoji: '😄', color: 'bg-emerald-500' },
      { mood: Mood.GOOD, count: 0, label: 'Bem', emoji: '🙂', color: 'bg-blue-400' },
      { mood: Mood.NEUTRAL, count: 0, label: 'Neutro', emoji: '😐', color: 'bg-slate-300' },
      { mood: Mood.BAD, count: 0, label: 'Mal', emoji: '🙁', color: 'bg-orange-400' },
      { mood: Mood.VERY_BAD, count: 0, label: 'Muito Mal', emoji: '😞', color: 'bg-red-500' },
    ];

    filtered.forEach(entry => {
      const stat = stats.find(s => s.mood === entry.mood);
      if (stat) stat.count++;
    });

    setMoodStats(stats);
  }, [allUserEntries, filter]);

  const handleDownloadPDF = () => {
    if (filteredEntries.length === 0) {
      alert('Não há registros para gerar relatório.');
      return;
    }
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

  const maxCount = Math.max(...moodStats.map(s => s.count), 1);
  // Fix: Added missing hasMore definition
  const hasMore = filteredEntries.length > visibleCount;

  return (
    <Layout title="Relatórios" onBack={() => window.location.hash = '#dashboard'}>
      <div className="space-y-6 pb-20">
        
        {/* Seletor de Período */}
        <div className="flex bg-slate-100 p-1 rounded-2xl">
          {['all', 'week', 'month', 'year'].map((p) => (
            <button
              key={p}
              onClick={() => setFilter(p as FilterPeriod)}
              className={`flex-1 py-2 px-1 text-[10px] font-bold uppercase rounded-xl transition-all ${
                filter === p ? 'bg-white text-amber-600 shadow-sm' : 'text-slate-500'
              }`}
            >
              {p === 'all' ? 'Tudo' : p === 'week' ? 'Semana' : p === 'month' ? 'Mês' : 'Ano'}
            </button>
          ))}
        </div>

        {/* Mensagem de Validação */}
        {validationMsg && (
          <div className="bg-amber-50 border border-amber-100 p-3 rounded-xl flex items-start gap-3 animate-in fade-in zoom-in duration-300">
            <i className="fas fa-info-circle text-amber-500 mt-0.5"></i>
            <p className="text-[11px] text-amber-800 leading-tight font-medium">{validationMsg}</p>
          </div>
        )}

        {/* Botão PDF */}
        <button
          onClick={handleDownloadPDF}
          disabled={isGenerating || filteredEntries.length === 0}
          className="w-full gold-gradient text-white flex items-center justify-center gap-3 p-4 rounded-2xl shadow-lg disabled:opacity-50 font-bold text-xs tracking-widest"
        >
          {isGenerating ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-file-pdf"></i>}
          {isGenerating ? 'GERANDO...' : 'BAIXAR RELATÓRIO PDF'}
        </button>

        {/* Resumo Visual */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Frequência de Humor</h3>
          <div className="space-y-4">
            {moodStats.map((stat) => (
              <div key={stat.mood} className="space-y-1">
                <div className="flex justify-between items-center text-[10px] font-bold uppercase text-slate-500">
                  <span className="flex items-center gap-2"><span>{stat.emoji}</span> {stat.label}</span>
                  <span>{stat.count}</span>
                </div>
                <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
                  <div className={`h-full ${stat.color}`} style={{ width: `${(stat.count / maxCount) * 100}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Lista de Registros */}
        <div className="space-y-3">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Registros Detalhados</h3>
          {filteredEntries.slice(0, visibleCount).map((entry) => (
            <div key={entry.id} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm relative overflow-hidden">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-bold text-slate-700">{new Date(entry.date).toLocaleDateString('pt-BR')}</span>
                <div className="relative group/tooltip">
                  <span className="text-xl cursor-help">{moodStats.find(s => s.mood === entry.mood)?.emoji}</span>
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-slate-800 text-white text-[9px] rounded opacity-0 group-hover/tooltip:opacity-100 transition-opacity whitespace-nowrap z-10 font-bold">
                    {moodStats.find(s => s.mood === entry.mood)?.label}
                  </div>
                </div>
              </div>
              <p className="text-slate-600 text-xs italic line-clamp-2">"{entry.notes}"</p>
              <div className="flex gap-2 mt-3 pt-3 border-t border-slate-50">
                <button onClick={() => setSelectedEntry(entry)} className="text-[9px] font-bold text-amber-600 uppercase tracking-widest">
                  Compartilhar <i className="fas fa-share ml-1"></i>
                </button>
              </div>
            </div>
          ))}
          {hasMore && (
            <button onClick={() => setVisibleCount(v => v + 10)} className="w-full py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Ver mais registros
            </button>
          )}
        </div>
      </div>

      {/* Modal Simples de Compartilhamento */}
      {selectedEntry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-xs rounded-3xl p-6 shadow-2xl">
            <h4 className="font-bold text-slate-800 text-sm uppercase mb-4 text-center">Enviar para o Terapeuta</h4>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(selectedEntry.notes)}`)} className="p-4 bg-green-50 text-green-600 rounded-2xl flex flex-col items-center gap-2">
                <i className="fab fa-whatsapp text-xl"></i>
                <span className="text-[9px] font-bold uppercase">WhatsApp</span>
              </button>
              <button onClick={() => window.location.href=`mailto:?subject=Registro&body=${selectedEntry.notes}`} className="p-4 bg-blue-50 text-blue-600 rounded-2xl flex flex-col items-center gap-2">
                <i className="fas fa-envelope text-xl"></i>
                <span className="text-[9px] font-bold uppercase">E-mail</span>
              </button>
            </div>
            <button onClick={() => setSelectedEntry(null)} className="w-full mt-4 py-2 text-[10px] font-bold text-slate-400 uppercase">Fechar</button>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Reports;
