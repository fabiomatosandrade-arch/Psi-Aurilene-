
import React, { useState } from 'react';
import Layout from '../components/Layout';
import { User, Mood, DailyEntry } from '../types';
import { SyncService } from '../utils/syncService';

interface NewEntryProps {
  user: User;
}

const NewEntry: React.FC<NewEntryProps> = ({ user }) => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [mood, setMood] = useState<Mood | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const moods = [
    { value: Mood.VERY_BAD, emoji: '😞', label: 'Muito Mal', color: 'bg-red-50', activeColor: 'ring-red-500 text-red-600' },
    { value: Mood.BAD, emoji: '🙁', label: 'Mal', color: 'bg-orange-50', activeColor: 'ring-orange-500 text-orange-600' },
    { value: Mood.NEUTRAL, emoji: '😐', label: 'Neutro', color: 'bg-slate-50', activeColor: 'ring-slate-400 text-slate-600' },
    { value: Mood.GOOD, emoji: '🙂', label: 'Bem', color: 'bg-blue-50', activeColor: 'ring-blue-500 text-blue-600' },
    { value: Mood.EXCELLENT, emoji: '😄', label: 'Muito Bem', color: 'bg-emerald-50', activeColor: 'ring-emerald-500 text-emerald-600' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mood) {
      alert('Por favor, selecione como está seu humor hoje.');
      return;
    }

    setIsSubmitting(true);

    const newEntry: DailyEntry = {
      id: crypto.randomUUID(),
      userId: user.id,
      date,
      notes,
      mood,
      timestamp: Date.now()
    };

    const allEntries: DailyEntry[] = JSON.parse(localStorage.getItem('psicolog_entries') || '[]');
    allEntries.push(newEntry);
    localStorage.setItem('psicolog_entries', JSON.stringify(allEntries));

    // Sincronização automática com a nuvem após salvar
    await SyncService.pushToCloud(user);

    setTimeout(() => {
      alert('Registro salvo e sincronizado na nuvem!');
      window.location.hash = '#dashboard';
    }, 500);
  };

  return (
    <Layout title="Novo Registro" onBack={() => window.location.hash = '#dashboard'}>
      <form onSubmit={handleSubmit} className="space-y-8 pb-10">
        <section>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Data do Registro *</label>
          <input
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-amber-500 outline-none shadow-sm transition-all text-sm font-medium"
          />
        </section>

        <section>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Como foi seu dia? *</label>
          <textarea
            required
            rows={6}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Conte um pouco sobre o que passou hoje..."
            className="w-full px-4 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-amber-500 outline-none shadow-sm resize-none text-sm min-h-[160px]"
          ></textarea>
        </section>

        <section>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 text-center">Como está seu humor hoje?</label>
          <div className="grid grid-cols-5 gap-2 bg-slate-50/50 p-2 rounded-3xl border border-slate-100">
            {moods.map((m) => (
              <button
                key={m.value}
                type="button"
                onClick={() => setMood(m.value)}
                className={`flex flex-col items-center justify-center p-2 py-4 rounded-2xl transition-all ${
                  mood === m.value 
                    ? `${m.color} ring-2 ${m.activeColor} scale-110 shadow-lg z-10` 
                    : 'bg-white/80 opacity-60 hover:opacity-100'
                }`}
              >
                <span className="text-4xl mb-1">{m.emoji}</span>
                <span className="text-[8px] font-black uppercase text-center leading-tight">{m.label}</span>
              </button>
            ))}
          </div>
        </section>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full gold-gradient text-white font-black py-4 rounded-2xl shadow-lg hover:shadow-amber-200/50 active:scale-[0.98] disabled:opacity-50 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-xs"
        >
          {isSubmitting ? <i className="fas fa-sync-alt fa-spin"></i> : <i className="fas fa-cloud-upload-alt"></i>}
          {isSubmitting ? 'Sincronizando...' : 'Salvar e Sincronizar'}
        </button>
      </form>
    </Layout>
  );
};

export default NewEntry;
