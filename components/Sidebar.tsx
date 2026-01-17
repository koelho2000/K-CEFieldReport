
import React, { useRef } from 'react';
import { SectionType, ReportState } from '../types';
import { 
  FileText, MapPin, Building, Camera, Clock, Users, 
  Box, Zap, Sun, GitBranch, Wind, Lightbulb, ArrowUpCircle, 
  Utensils, WashingMachine, Waves, Cpu, CheckCircle, Layout,
  Save, FileUp, PlusCircle, Activity, Droplets
} from 'lucide-react';

interface SidebarProps {
  currentSection: SectionType;
  onSelect: (section: SectionType) => void;
  onNew: () => void;
  onSave: () => void;
  onOpen: (data: string) => void;
  report: ReportState;
}

const Sidebar: React.FC<SidebarProps> = ({ currentSection, onSelect, onNew, onSave, onOpen, report }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getCount = (type: SectionType): number | boolean => {
    switch (type) {
      case SectionType.CAPA: return !!report.coverImage;
      case SectionType.LOCALIZACAO: return !!(report.location.coords || report.location.concelho);
      case SectionType.DADOS_EDIFICIO: return !!report.building.nomeEdificio;
      case SectionType.ENERGIA: return report.energy.fontes.length;
      case SectionType.FOTOS: return report.photos.length;
      case SectionType.ESPACOS: return report.espacosList.length;
      case SectionType.ENVOLVENTE: return report.envolventeList.length;
      case SectionType.SISTEMAS_CLIM: return report.sistemasList.length;
      case SectionType.PRODUCAO_AQS: return report.aqsList.length;
      case SectionType.RENOVAVEIS: return report.renovaveisList.length;
      case SectionType.DISTRIBUICAO: return report.distribuicaoList.length;
      case SectionType.DIFUSAO: return report.difusaoList.length;
      case SectionType.ILUMINACAO: return report.iluminacaoList.length;
      case SectionType.ELEVADORES: return report.elevadoresList.length;
      case SectionType.COZINHAS: return report.cozinhasList.length;
      case SectionType.LAVANDARIA: return report.lavandariaList.length;
      case SectionType.PISCINA: return report.piscinaList.length;
      case SectionType.OUTROS_SISTEMAS: return report.outrosSistemasList.length;
      case SectionType.MURES: return report.mures.filter(m => m.checked).length;
      default: return 0;
    }
  };

  const sections = [
    { type: SectionType.CAPA, icon: FileText, label: 'Capa' },
    { type: SectionType.LOCALIZACAO, icon: MapPin, label: 'Localização' },
    { type: SectionType.DADOS_EDIFICIO, icon: Building, label: 'Dados Gerais' },
    { type: SectionType.ENERGIA, icon: Zap, label: 'Energia' },
    { type: SectionType.FOTOS, icon: Camera, label: 'Fotos' },
    { type: SectionType.PERFIS, icon: Clock, label: 'Perfis Func.' },
    { type: SectionType.OCUPACAO_PERFIL, icon: Users, label: 'Perfil Ocupação' },
    { type: SectionType.ESPACOS, icon: Layout, label: 'Espaços' },
    { type: SectionType.ENVOLVENTE, icon: Box, label: 'Envolvente' },
    { type: SectionType.SISTEMAS_CLIM, icon: Activity, label: 'Produção AVAC' },
    { type: SectionType.PRODUCAO_AQS, icon: Droplets, label: 'Produção AQS' },
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) onOpen(ev.target.result as string);
      };
      reader.readAsText(file);
    }
  };

  return (
    <aside className="w-64 bg-slate-900 text-white h-full flex flex-col shrink-0 border-r border-slate-700 no-print">
      <div className="p-6 border-b border-slate-800">
        <div className="font-black text-xl tracking-tight text-blue-400 italic">K-CE <span className="text-white">FR</span></div>
        <div className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest font-bold">Field Report</div>
      </div>
      
      <div className="p-3 grid grid-cols-3 gap-1 border-b border-slate-800 bg-slate-950/50">
        <button onClick={onNew} title="Novo Relatório" className="flex flex-col items-center gap-1 py-2 rounded hover:bg-slate-800 transition group">
          <PlusCircle size={16} className="text-emerald-400 group-hover:scale-110 transition-transform" />
          <span className="text-[8px] font-black uppercase tracking-tighter">Novo</span>
        </button>
        <button onClick={onSave} title="Gravar JSON" className="flex flex-col items-center gap-1 py-2 rounded hover:bg-slate-800 transition group">
          <Save size={16} className="text-blue-400 group-hover:scale-110 transition-transform" />
          <span className="text-[8px] font-black uppercase tracking-tighter">Gravar</span>
        </button>
        <button onClick={() => fileInputRef.current?.click()} title="Abrir JSON" className="flex flex-col items-center gap-1 py-2 rounded hover:bg-slate-800 transition group">
          <FileUp size={16} className="text-orange-400 group-hover:scale-110 transition-transform" />
          <span className="text-[8px] font-black uppercase tracking-tighter">Abrir</span>
          <input type="file" ref={fileInputRef} className="hidden" accept=".json" onChange={handleFileChange} />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-2 scrollbar-thin scrollbar-thumb-slate-700">
        {sections.map(({ type, icon: Icon, label }) => {
          const count = getCount(type);
          const hasItems = typeof count === 'number' ? count > 0 : count;
          
          return (
            <button
              key={type}
              onClick={() => onSelect(type)}
              className={`w-full flex items-center justify-between px-6 py-2 transition-all text-[11px] ${
                currentSection === type 
                  ? 'bg-blue-600 text-white shadow-inner font-bold' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon size={14} />
                <span className="truncate">{label}</span>
              </div>
              {hasItems && (
                <div className={`text-[9px] px-1.5 py-0.5 rounded-full font-black ${currentSection === type ? 'bg-white text-blue-600' : 'bg-slate-700 text-slate-300'}`}>
                  {typeof count === 'number' ? count : 'OK'}
                </div>
              )}
            </button>
          );
        })}
      </nav>
      
      <div className="p-4 bg-slate-950 text-[9px] text-slate-500 text-center uppercase tracking-widest font-bold border-t border-slate-800">
        K-CEFieldReport v2.5
      </div>
    </aside>
  );
};

export default Sidebar;
