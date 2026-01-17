
import React from 'react';
import { Eye, Share2 } from 'lucide-react';

interface HeaderProps {
  title: string;
  onPreview: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, onPreview }) => {
  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-8 shrink-0">
      <h1 className="text-xl font-bold text-gray-800">{title}</h1>
      <div className="flex items-center gap-3">
        <button 
          onClick={onPreview}
          className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition font-semibold"
        >
          <Eye size={18} /> Pré-visualizar Relatório
        </button>
        <button className="p-2 text-gray-500 hover:text-gray-700">
          <Share2 size={20} />
        </button>
      </div>
    </header>
  );
};

export default Header;
