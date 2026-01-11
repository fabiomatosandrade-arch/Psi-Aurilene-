
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
  onBack?: () => void;
  actions?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children, title, onBack, actions }) => {
  return (
    <div className="max-w-md mx-auto min-h-screen flex flex-col bg-white shadow-2xl relative">
      {/* Header */}
      <header className="p-5 flex items-center justify-between border-b sticky top-0 bg-white z-20">
        <div className="flex items-center gap-3">
          {onBack && (
            <button onClick={onBack} className="w-10 h-10 flex items-center justify-center bg-slate-50 hover:bg-slate-100 rounded-full transition-colors">
              <i className="fas fa-chevron-left text-blue-900"></i>
            </button>
          )}
          <h1 className="text-lg font-black text-blue-900 uppercase tracking-tighter">{title}</h1>
        </div>
        <div className="flex items-center gap-2">
          {actions}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6 pb-40">
        {children}
        
        {/* Footer com Destaque solicitado */}
        <div className="mt-20 p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 text-center relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-24 h-24 gold-gradient opacity-10 rounded-full blur-2xl"></div>
          
          <h4 className="text-lg font-black text-blue-900 uppercase tracking-tight mb-1">
            Psi. Aurilene Santiago
          </h4>
          <div className="h-0.5 w-12 gold-gradient mx-auto mb-4 rounded-full"></div>
          
          <a 
            href="https://www.psicologiaasantiago.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-[11px] font-bold text-amber-600 uppercase tracking-[0.15em] shadow-sm hover:shadow-md hover:border-amber-300 transition-all"
          >
            psicologiaasantiago.com
          </a>
          
          <p className="mt-6 text-[8px] text-slate-400 font-medium uppercase tracking-[0.2em] opacity-60">
            Acompanhamento Terapêutico Profissional
          </p>
        </div>
      </main>

      {/* Navigation Bar */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[95%] max-w-[400px] brand-gradient rounded-3xl flex justify-around items-center p-4 z-30 shadow-2xl border border-white/20">
        <a href="#dashboard" className="flex flex-col items-center gap-1 text-white/70 hover:text-amber-400 transition-colors">
          <i className="fas fa-home text-lg"></i>
          <span className="text-[9px] font-bold uppercase tracking-wider">Início</span>
        </a>
        <a href="#new-entry" className="flex flex-col items-center gap-1 text-white/70 hover:text-amber-400 transition-colors">
          <i className="fas fa-plus-circle text-lg"></i>
          <span className="text-[9px] font-bold uppercase tracking-wider">Registro</span>
        </a>
        <a href="#reports" className="flex flex-col items-center gap-1 text-white/70 hover:text-amber-400 transition-colors">
          <i className="fas fa-file-medical-alt text-lg"></i>
          <span className="text-[9px] font-bold uppercase tracking-wider">Relatórios</span>
        </a>
        <a href="#profile" className="flex flex-col items-center gap-1 text-white/70 hover:text-amber-400 transition-colors">
          <i className="fas fa-user-circle text-lg"></i>
          <span className="text-[9px] font-bold uppercase tracking-wider">Perfil</span>
        </a>
      </nav>
    </div>
  );
};

export default Layout;
