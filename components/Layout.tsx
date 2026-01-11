
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
  onBack?: () => void;
  actions?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children, title, onBack, actions }) => {
  return (
    <div className="max-w-md mx-auto min-h-screen flex flex-col bg-white shadow-xl relative">
      {/* Header */}
      <header className="p-4 flex items-center justify-between border-b sticky top-0 bg-white z-10">
        <div className="flex items-center gap-3">
          {onBack && (
            <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <i className="fas fa-chevron-left text-slate-600"></i>
            </button>
          )}
          <h1 className="text-xl font-bold gold-text uppercase tracking-tight">{title}</h1>
        </div>
        <div className="flex items-center gap-2">
          {actions}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 pb-24">
        {children}
        
        {/* Footer Link */}
        <div className="mt-12 pt-6 border-t border-slate-50 text-center">
          <a 
            href="https://www.psicologiaasantiago.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[10px] font-black gold-text uppercase tracking-[0.2em] hover:opacity-70 transition-opacity"
          >
            <i className="fas fa-globe"></i>
            www.psicologiaasantiago.com
          </a>
        </div>
      </main>

      {/* Navigation Bar (Mobile Style) */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t flex justify-around p-3 z-10 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
        <a href="#dashboard" className="flex flex-col items-center gap-1 text-slate-400 hover:text-amber-600 transition-colors">
          <i className="fas fa-home text-lg"></i>
          <span className="text-[10px] font-medium">Início</span>
        </a>
        <a href="#new-entry" className="flex flex-col items-center gap-1">
          <i className="fas fa-plus text-lg text-slate-400 hover:text-amber-600"></i>
          <span className="text-[10px] font-medium">Registro</span>
        </a>
        <a href="#reports" className="flex flex-col items-center gap-1 text-slate-400 hover:text-amber-600 transition-colors">
          <i className="fas fa-file-alt text-lg"></i>
          <span className="text-[10px] font-medium">Relatórios</span>
        </a>
        <a href="#booking" className="flex flex-col items-center gap-1 text-slate-400 hover:text-amber-600 transition-colors">
          <i className="fas fa-calendar-check text-lg"></i>
          <span className="text-[10px] font-medium">Agendar</span>
        </a>
      </nav>
    </div>
  );
};

export default Layout;
