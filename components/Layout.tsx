
import React from 'react';
import { getAppLogo } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
  onBack?: () => void;
  actions?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children, title, onBack, actions }) => {
  const currentLogo = getAppLogo();

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
      <main className="flex-1 overflow-y-auto p-6 pb-32">
        {children}
        
        <div className="mt-16 pt-8 border-t border-slate-50 text-center">
          <div className="w-10 h-10 brand-gradient rounded-full mx-auto mb-3 flex items-center justify-center overflow-hidden">
             <img src={currentLogo} alt="Mini Logo" className="w-full h-full object-cover" />
          </div>
          <a 
            href="https://www.psicologiaasantiago.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[10px] font-black text-blue-900 uppercase tracking-[0.2em] hover:text-amber-600 transition-colors"
          >
            psicologiaasantiago.com
          </a>
        </div>
      </main>

      {/* Navigation Bar */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-[360px] brand-gradient rounded-3xl flex justify-around p-4 z-30 shadow-2xl border border-white/20">
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
          <span className="text-[9px] font-bold uppercase tracking-wider">Laudos</span>
        </a>
        <a href="#logo-gen" className="flex flex-col items-center gap-1 text-white/70 hover:text-amber-400 transition-colors">
          <i className="fas fa-paint-brush text-lg"></i>
          <span className="text-[9px] font-bold uppercase tracking-wider">Marca</span>
        </a>
      </nav>
    </div>
  );
};

export default Layout;
