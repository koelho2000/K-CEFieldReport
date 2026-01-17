
import React from 'react';
import { SectionType } from './types';
import { 
  FileText, MapPin, Building, Camera, Clock, Users, 
  Box, Zap, Sun, GitBranch, Wind, Lightbulb, ArrowUpCircle, 
  Utensils, WashingMachine, Waves, Cpu, CheckCircle, Layout
} from 'lucide-react';

interface SidebarProps {
  currentSection: SectionType;
  onSelect: (section: SectionType) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentSection, onSelect }) => {
  const sections = [
    { type: SectionType.CAPA, icon: FileText, label: 'Capa' },
    { type: SectionType.LOCALIZACAO, icon: MapPin, label: 'Localização' },
    { type: SectionType.DADOS_EDIFICIO, icon: Building, label: 'Dados Gerais' },
    { type: SectionType.FOTOS, icon: Camera, label: 'Fotos' },
    { type: SectionType.PERFIS, icon: Clock, label: 'Perfis Func.' },
    { type: SectionType.OCUPACAO_PERFIL, icon: Users, label: 'Perfil Ocupação' },
    { type: SectionType.ESPACOS, icon: Layout, label: 'Espaços' },
    { type: SectionType.ENVOLVENTE, icon: Box, label: 'Envolvente' },
    { type: SectionType.SISTEMAS_CLIM, icon: Zap, label: 'Sistemas Climat.' },
    { type: SectionType.RENOVAVEIS, icon: Sun, label: 'Renováveis' },
    { type: SectionType.DISTRIBUICAO, icon: GitBranch, label: 'Distribuição' },
    { type: SectionType.DIFUSAO, icon: Wind, label: 'Difusão' },
    { type: SectionType.ILUMINACAO, icon: Lightbulb, label: 'Iluminação' },
    { type: SectionType.ELEVADORES, icon: ArrowUpCircle, label: 'Elevadores' },
    { type: SectionType.COZINHAS, icon: Utensils, label: 'Cozinhas' },
    { type: SectionType.LAVANDARIA, icon: WashingMachine, label: 'Lavandaria' },
    { type: SectionType.PISCINA, icon: Waves, label: 'Piscina' },
    { type: SectionType.OUTROS_SISTEMAS, icon: Cpu, label: 'Outros (IT)' },
    { type: SectionType.MURES, icon: CheckCircle, label: 'MURES' },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-white h-full flex flex-col shrink-0 border-r border-slate-700">
      <div className="p-6 border-b border-slate-800">
        <div className="font-black text-xl tracking-tight text-blue-400 italic">K-CE <span className="text-white">FR</span></div>
        <div className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest font-bold">Field Report</div>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-2 scrollbar-thin scrollbar-thumb-slate-700">
        {sections.map(({ type, icon: Icon, label }) => (
          <button
            key={type}
            onClick={() => onSelect(type)}
            className={`w-full flex items-center gap-3 px-6 py-2 transition-all text-xs ${
              currentSection === type 
                ? 'bg-blue-600 text-white shadow-inner font-bold' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <Icon size={14} />
            <span className="truncate">{label}</span>
          </button>
        ))}
      </nav>
      
      <div className="p-4 bg-slate-950 text-[9px] text-slate-500 text-center uppercase tracking-widest font-bold border-t border-slate-800">
        K-CEFieldReport v2.5
      </div>
    </aside>
  );
};

export default Sidebar;
