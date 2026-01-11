
import React from 'react';
import Layout from '../components/Layout';
import { User } from '../types';

interface BookingProps {
  user: User;
}

const Booking: React.FC<BookingProps> = ({ user }) => {
  const WHATSAPP_NUMBER = "5575988130439"; 

  const handleWhatsApp = () => {
    const text = encodeURIComponent(`Olá Dra. Aurilene, sou ${user.fullName} e gostaria de agendar uma consulta.`);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, '_blank');
  };

  return (
    <Layout title="Agendar" onBack={() => window.location.hash = '#dashboard'}>
      <div className="space-y-6 text-center py-4">
        <div className="py-6">
          <h2 className="text-2xl font-black text-blue-900 uppercase tracking-tight">Agende sua Sessão</h2>
          <div className="h-1 w-12 gold-gradient mx-auto mt-2 mb-4"></div>
          <p className="text-sm text-slate-500 px-4 leading-relaxed">
            Utilize o canal oficial abaixo para marcar seu próximo horário com a Dra. Aurilene Santiago.
          </p>
        </div>

        <div className="space-y-4 px-2">
          <button 
            onClick={handleWhatsApp} 
            className="w-full flex items-center gap-5 bg-white p-8 rounded-[2.5rem] border-2 border-green-50 shadow-sm hover:shadow-xl hover:shadow-green-100/50 hover:border-green-200 hover:-translate-y-1 active:scale-95 transition-all duration-300 group outline-none focus:ring-4 focus:ring-green-100"
          >
            <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center group-hover:bg-green-500 group-hover:text-white transition-all duration-500 group-hover:rotate-6 shadow-inner">
              <i className="fab fa-whatsapp text-4xl text-green-500 group-hover:text-white"></i>
            </div>
            
            <div className="text-left flex-1">
              <p className="font-black text-slate-800 text-lg uppercase tracking-wide flex items-center gap-2">
                WhatsApp 
              </p>
              <p className="text-[10px] text-green-600 font-black uppercase tracking-[0.15em] opacity-80 group-hover:opacity-100 transition-opacity">
                Agendamento Imediato
              </p>
            </div>
            
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-50 text-slate-300 group-hover:bg-green-50 group-hover:text-green-500 transition-all duration-300 group-hover:translate-x-1">
              <i className="fas fa-chevron-right"></i>
            </div>
          </button>
        </div>

        <div className="pt-12 px-6">
          <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100">
            <i className="fas fa-calendar-alt text-blue-900/20 text-2xl mb-3"></i>
            <p className="text-[10px] text-slate-500 leading-relaxed uppercase tracking-widest font-bold">
              Pronto para o próximo passo? O agendamento de sua sessão é realizado diretamente com a Dra. Aurilene Santiago para garantir um atendimento personalizado.
            </p>
          </div>
        </div>

        <div className="pt-10">
          <p className="text-[10px] font-black text-slate-200 uppercase tracking-[0.4em]">Atendimento Profissional Especializado</p>
        </div>
      </div>
    </Layout>
  );
};

export default Booking;
