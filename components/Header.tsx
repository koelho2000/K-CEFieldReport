
import React from 'react';
import { Eye, Share2, Sun, Moon } from 'lucide-react';

interface HeaderProps {
  title: string;
  onPreview: () => void;
  theme: 'light' | 'dark';
  onThemeToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, onPreview, theme, onThemeToggle }) => {
  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b dark:border-slate-800 flex items-center justify-between px-8 shrink-0 transition-colors">
      <h1 className="text-xl font-bold text-gray-800 dark:text-slate-100">{title}</h1>
      <div className="flex items-center gap-3">
        <button 
          onClick={onThemeToggle}
          className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all border dark:border-slate-700"
          title={theme === 'light' ? 'Ativar Modo Escuro' : 'Ativar Modo Claro'}
        >
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
        
        <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1" />

        <button 
          onClick={onPreview}
          className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition font-semibold"
        >
          <Eye size={18} /> Pré-visualizar Relatório
        </button>
        <button className="p-2 text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200 transition-colors">
          <Share2 size={20} />
        </button>
      </div>
    </header>
  );
};

export default Header;
