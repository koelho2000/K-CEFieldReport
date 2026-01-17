
import React from 'react';
import { ReportState } from '../../types';
import { Layers, Thermometer, PlusCircle } from 'lucide-react';

interface Props {
  report: ReportState;
  onUpdate: (updates: Partial<ReportState>) => void;
}

const EditorDescricao: React.FC<Props> = ({ report, onUpdate }) => {
  const sections = {
    "ENERGIA": ["Eletricidade", "Gás Natural", "Gás Propano", "Gasoleo"],
    "ARREFECIMENTO": ["Chiller Só Frio", "Chiller com Rec.", "Bomba de Calor", "Split", "VRV", "Multisplit"],
    "AQUECIMENTO": ["Caldeira", "Chiller com Rec.", "Bomba de Calor", "Split", "VRV", "Multisplit"],
    "AQS": ["Caldeira", "Chiller com Rec.", "Bomba de Calor", "Termoacumulador", "Esquentador", "Resistência", "Painel Solar"],
    "SETPOINT AMBIENTE (°C)": ["UTAN", "VCs", "Ambiente"],
    "SETPOINT EQUIP. (°C)": ["Caldeira", "Chiller", "Bomba de Calor", "Termoacumulador", "Esquentador", "Resistência", "Painel Solar", "Torre", "Drycooler"]
  };

  const currentChecklist = report.descricaoChecklist || {};
  const temps = report.descricaoTemperaturas || {};
  const outros = report.descricaoOutros || {};

  const toggleOption = (section: string, option: string) => {
    const opts = currentChecklist[section] || [];
    const newOpts = opts.includes(option) ? opts.filter(o => o !== option) : [...opts, option];
    onUpdate({ descricaoChecklist: { ...currentChecklist, [section]: newOpts } });
  };

  const updateTemp = (option: string, val: string) => {
    onUpdate({ descricaoTemperaturas: { ...temps, [option]: val } });
  };

  const updateOutro = (section: string, val: string) => {
    onUpdate({ descricaoOutros: { ...outros, [section]: val } });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border rounded-xl p-8 shadow-sm">
        <h2 className="text-xl font-bold text-gray-800 mb-8 border-b pb-4 flex items-center gap-2">
          <Layers className="text-blue-600" /> Checklist Técnica & Setpoints
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Object.entries(sections).map(([title, opts]) => (
            <div key={title} className="space-y-4">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 p-2 rounded">{title}</h3>
              <div className="space-y-2">
                {opts.map(opt => (
                  <div key={opt} className="space-y-1">
                    <button 
                      onClick={() => toggleOption(title, opt)}
                      className={`w-full flex items-center gap-2 text-xs text-left p-2 rounded transition ${currentChecklist[title]?.includes(opt) ? 'bg-blue-50 text-blue-700 font-bold border border-blue-100' : 'hover:bg-gray-50 text-gray-600 border border-transparent'}`}
                    >
                      <div className={`w-3 h-3 border rounded-sm ${currentChecklist[title]?.includes(opt) ? 'bg-blue-500 border-blue-500' : 'border-gray-300'}`} />
                      {opt}
                    </button>
                    {title.includes("(°C)") && currentChecklist[title]?.includes(opt) && (
                      <div className="flex items-center gap-2 pl-6 mt-1">
                        <Thermometer size={14} className="text-orange-500" />
                        <input 
                          type="number" 
                          placeholder="Valor °C"
                          value={temps[opt] || ''}
                          onChange={(e) => updateTemp(opt, e.target.value)}
                          className="w-full text-xs p-1 border rounded bg-orange-50 outline-none"
                        />
                      </div>
                    )}
                  </div>
                ))}
                {/* Campo OUTRO */}
                <div className="mt-2 pl-2 border-l-2 border-slate-100">
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold mb-1"><PlusCircle size={10}/> OUTRO</div>
                  <input 
                    type="text"
                    placeholder="Especifique..."
                    value={outros[title] || ''}
                    onChange={(e) => updateOutro(title, e.target.value)}
                    className="w-full text-xs p-2 border rounded-lg bg-slate-50 focus:bg-white transition"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EditorDescricao;
