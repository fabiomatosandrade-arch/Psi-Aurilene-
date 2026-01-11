
import React from 'react';
import Layout from '../components/Layout';
import { User } from '../types';

interface BookingProps {
  user: User;
}

const Booking: React.FC<BookingProps> = ({ user }) => {
  const WHATSAPP_LINK = "https://wa.link/wjcw4x";
  const EMAIL_ADDRESS = "clinicaasantiago@gmail.com";

  const handleEmailClick = () => {
    const subject = encodeURIComponent(`Agendamento de Consulta - ${user.fullName}`);
    const body = encodeURIComponent(`Olá, gostaria de solicitar o agendamento de uma consulta.\n\nNome: ${user.fullName}\nCPF: ${user.cpf}`);
    window.location.href = `mailto:${EMAIL_ADDRESS}?subject=${subject}&body=${body}`;
  };

  return (
    <Layout title="Agendamento" onBack={() => window.location.hash = '#dashboard'}>
      <div className="space-y-8 py-4">
        <div className="text-center space-y-2 px-4">
          <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-100">
            <i className="fas fa-calendar-check text-3xl gold-text"></i>
          </div>
          <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Agende sua Consulta</h2>
          <p className="text-slate-500 text-sm leading-relaxed">
            Escolha o canal de sua preferência para solicitar um novo horário para sua sessão de terapia.
          </p>
        </div>

        <div className="space-y-4">
          {/* WhatsApp Card */}
          <a 
            href={WHATSAPP_LINK} 
            target="_blank" 
            rel="noopener noreferrer"
            className="group block bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
          >
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center text-green-500 group-hover:bg-green-500 group-hover:text-white transition-colors">
                <i className="fab fa-whatsapp text-3xl"></i>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-slate-800 uppercase text-xs tracking-widest">WhatsApp</h3>
                <p className="text-[10px] text-slate-400 mt-1">Resposta rápida via chat</p>
              </div>
              <i className="fas fa-external-link-alt text-slate-300 text-xs"></i>
            </div>
          </a>

          {/* Email Card */}
          <button 
            onClick={handleEmailClick}
            className="w-full group block bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all text-left active:scale-[0.98]"
          >
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                <i className="fas fa-envelope text-3xl"></i>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-slate-800 uppercase text-xs tracking-widest">E-mail Profissional</h3>
                <p className="text-[10px] text-slate-400 mt-1">clinicaasantiago@gmail.com</p>
              </div>
              <i className="fas fa-paper-plane text-slate-300 text-xs"></i>
            </div>
          </button>
        </div>

        <div className="bg-slate-50 p-6 rounded-3xl border border-dashed border-slate-200">
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
            <i className="fas fa-info-circle"></i> Informações Úteis
          </h4>
          <ul className="space-y-2">
            <li className="text-[11px] text-slate-500 flex gap-2">
              <span className="text-amber-500">•</span>
              Cancelamentos devem ser feitos com 24h de antecedência.
            </li>
            <li className="text-[11px] text-slate-500 flex gap-2">
              <span className="text-amber-500">•</span>
              Verifique a disponibilidade de horários noturnos.
            </li>
            <li className="text-[11px] text-slate-500 flex gap-2">
              <span className="text-amber-500">•</span>
              Sessões online disponíveis sob consulta.
            </li>
          </ul>
        </div>
      </div>
    </Layout>
  );
};

export default Booking;
