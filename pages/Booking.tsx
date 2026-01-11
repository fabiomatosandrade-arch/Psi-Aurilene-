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
          <p className="text-sm text-slate-500 px-4">Utilize o canal oficial abaixo para marcar seu próximo horário com a Dra. Aurilene.</p>
        </div>

        <div className="space-y-4 px-2">
          <button 
            onClick={handleWhatsApp} 
            className="w-full flex items-center gap-5 bg-white p-8 rounded-[2.5rem] border-2 border-green-50 shadow-sm hover:shadow-md hover:border-green-200 active:scale-95 transition-all group"
          >
            <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center group-hover:bg-green-500 group-hover:text-white transition-colors">
              <i className="fab fa-whatsapp text-4xl text-green-500 group-hover:text-white"></i>
            </div>
            <div className="text-left">
              <p className="font-black text-slate-800 text-lg uppercase tracking-wide flex items-center gap-2">
                WhatsApp 
              </p>
              <p className="text-xs text-green-600 font-bold uppercase tracking-widest">Agendamento Imediato</p>
            </div>
            <i className="fas fa-external-link-alt ml-auto text-slate-300"></i>
          </button>
        </div>

        <div className="pt-10">
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Atendimento Profissional</p>
        </div>
      </div>
    </Layout>
  );
};

export default Booking;