
import React from 'react';
import Layout from '../components/Layout';
import { User } from '../types';

interface BookingProps {
  user: User;
}

const Booking: React.FC<BookingProps> = ({ user }) => {
  const WHATSAPP_NUMBER = "5511999999999"; // Substitua pelo seu número
  const EMAIL_ADDRESS = "clinicaasantiago@gmail.com";

  const handleWhatsApp = () => {
    const text = encodeURIComponent(`Olá Dra. Aurilene, sou ${user.fullName} e gostaria de agendar uma consulta.`);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, '_blank');
  };

  return (
    <Layout title="Agendar" onBack={() => window.location.hash = '#dashboard'}>
      <div className="space-y-6 text-center py-4">
        <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto border border-amber-100">
          <i className="fas fa-calendar-check text-3xl gold-text"></i>
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800">Agende sua Sessão</h2>
          <p className="text-sm text-slate-500 px-4">Escolha como prefere entrar em contato para marcar seu próximo horário.</p>
        </div>

        <div className="space-y-3 px-2">
          <button onClick={handleWhatsApp} className="w-full flex items-center gap-4 bg-green-50 p-5 rounded-3xl border border-green-100 active:scale-95 transition-transform">
            <i className="fab fa-whatsapp text-3xl text-green-500"></i>
            <div className="text-left">
              <p className="font-bold text-green-700 text-sm">WhatsApp</p>
              <p className="text-[10px] text-green-600">Agendamento rápido</p>
            </div>
          </button>

          <button onClick={() => window.location.href=`mailto:${EMAIL_ADDRESS}`} className="w-full flex items-center gap-4 bg-blue-50 p-5 rounded-3xl border border-blue-100 active:scale-95 transition-transform">
            <i className="fas fa-envelope text-3xl text-blue-500"></i>
            <div className="text-left">
              <p className="font-bold text-blue-700 text-sm">E-mail</p>
              <p className="text-[10px] text-blue-600">{EMAIL_ADDRESS}</p>
            </div>
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default Booking;
