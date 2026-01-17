
import React from 'react';
import { ReportState, HourlyProfile } from '../../types';
import EditorPerfis from './EditorPerfis';
import { Layers, Link, Link2Off } from 'lucide-react';

interface Props {
  report: ReportState;
  onUpdate: (updates: Partial<ReportState>) => void;
}

const EditorPerfisSistemas: React.FC<Props> = ({ report, onUpdate }) => {
  const { sistemas } = report.profiles;

  const handleProfileChange = (key: 'avac' | 'iluminacao' | 'outros', newProfile: HourlyProfile) => {
    let newSistemas = { ...sistemas, [key]: newProfile };
    
    if (sistemas.allSame) {
      newSistemas.avac = newProfile;
      newSistemas.iluminacao = newProfile;
      newSistemas.outros = newProfile;
    }
    
    onUpdate({ profiles: { ...report.profiles, sistemas: newSistemas } });
  };

  const toggleAllSame = () => {
    const newVal = !sistemas.allSame;
    let newSistemas = { ...sistemas, allSame: newVal };
    
    if (newVal) {
      // Synchronize all to AVAC current state
      newSistemas.iluminacao = sistemas.avac;
      newSistemas.outros = sistemas.avac;
    }
    
    onUpdate({ profiles: { ...report.profiles, sistemas: newSistemas } });
  };

  return (
    <div className="space-y-8">
      <div className="bg-white border rounded-2xl p-6 shadow-sm flex items-center justify-between border-blue-100">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Layers size={24} />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-800">Perfis Específicos por Sistemas</h3>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">AVAC, Iluminação e Equipamentos</p>
          </div>
        </div>
        
        <button 
          onClick={toggleAllSame}
          className={`flex items-center gap-3 px-6 py-3 rounded-xl font-bold transition-all shadow-sm ${
            sistemas.allSame 
              ? 'bg-blue-600 text-white shadow-blue-200' 
              : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
          }`}
        >
          {sistemas.allSame ? <Link size={18} /> : <Link2Off size={18} />}
          {sistemas.allSame ? 'Sincronização Ativa (Todos Iguais)' : 'Perfis Independentes'}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <EditorPerfis 
          title="Sistema de Climatização (AVAC)" 
          profile={sistemas.avac} 
          onChange={(v) => handleProfileChange('avac', v)} 
        />
        
        {!sistemas.allSame && (
          <>
            <EditorPerfis 
              title="Sistemas de Iluminação" 
              profile={sistemas.iluminacao} 
              onChange={(v) => handleProfileChange('iluminacao', v)} 
            />
            <EditorPerfis 
              title="Outros Sistemas (IT / Equipamentos)" 
              profile={sistemas.outros} 
              onChange={(v) => handleProfileChange('outros', v)} 
            />
          </>
        )}
      </div>
    </div>
  );
};

export default EditorPerfisSistemas;
