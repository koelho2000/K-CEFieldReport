
import React, { useState } from 'react';
import { ReportState, FloorPlanEntry } from '../../types';
import { Upload, Trash2, Map as MapIcon, FileText, FileImage, Plus, Info } from 'lucide-react';

interface Props {
  report: ReportState;
  onUpdate: (updates: Partial<ReportState>) => void;
}

const EditorPlantas: React.FC<Props> = ({ report, onUpdate }) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    setIsUploading(true);
    let currentPlans = [...(report.floorPlans || [])];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const isPdf = file.type === 'application/pdf';
      const reader = new FileReader();

      await new Promise<void>((resolve) => {
        reader.onload = (e) => {
          const base64 = e.target?.result as string;
          const newPlan: FloorPlanEntry = {
            id: Math.random().toString(36).substring(7),
            name: file.name,
            url: base64,
            caption: `Planta do edifício - ${file.name.split('.')[0]}`,
            type: isPdf ? 'pdf' : 'image'
          };
          currentPlans.push(newPlan);
          resolve();
        };
        reader.readAsDataURL(file);
      });
    }

    onUpdate({ floorPlans: currentPlans });
    setIsUploading(false);
  };

  const updateCaption = (id: string, caption: string) => {
    const newPlans = report.floorPlans.map(p => 
      p.id === id ? { ...p, caption } : p
    );
    onUpdate({ floorPlans: newPlans });
  };

  const removePlan = (id: string) => {
    if (confirm('Deseja remover esta planta?')) {
      onUpdate({ floorPlans: report.floorPlans.filter(p => p.id !== id) });
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="bg-white border rounded-[2rem] p-8 shadow-sm space-y-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 border-b border-slate-100 pb-6">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-indigo-600 text-white rounded-2xl shadow-xl shadow-indigo-100">
              <MapIcon size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">Plantas Gerais</h2>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Levantamento Arquitetónico e Especialidades</p>
            </div>
          </div>
          
          <label className="cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl flex items-center gap-2 transition font-black text-xs uppercase shadow-lg shadow-indigo-200 active:scale-95">
            <Upload size={18} /> Carregar Plantas (JPG/PDF)
            <input type="file" multiple accept="image/*,application/pdf" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>

        <div className="bg-indigo-50 border-l-4 border-indigo-500 p-6 rounded-r-2xl flex gap-4">
          <Info className="text-indigo-600 shrink-0" size={24} />
          <div className="space-y-1">
            <p className="text-xs text-indigo-900 font-black uppercase tracking-widest">Apoio Gráfico ao Relatório</p>
            <p className="text-xs text-indigo-700 leading-relaxed italic">
              As plantas carregadas serão integradas num capítulo dedicado. No caso de ficheiros PDF, será apresentada a primeira página como referência visual. Recomendamos o uso de ficheiros JPG/PNG para melhor qualidade de impressão.
            </p>
          </div>
        </div>

        {isUploading && (
          <div className="py-12 flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
            <p className="text-xs font-black text-indigo-600 uppercase">A processar ficheiros...</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {report.floorPlans.map((plan) => (
            <div key={plan.id} className="bg-slate-50 border-2 border-slate-100 rounded-3xl overflow-hidden group hover:border-indigo-200 transition-all shadow-sm flex flex-col">
              <div className="relative aspect-[16/10] bg-white flex items-center justify-center border-b border-slate-100 overflow-hidden">
                {plan.type === 'pdf' ? (
                  <div className="flex flex-col items-center text-slate-400 space-y-2">
                    <FileText size={48} className="text-indigo-500" />
                    <span className="text-[10px] font-black uppercase">Documento PDF</span>
                    <span className="text-[9px] font-bold text-slate-300 truncate max-w-[200px]">{plan.name}</span>
                  </div>
                ) : (
                  <img src={plan.url} className="w-full h-full object-contain p-2" alt={plan.name} />
                )}
                
                <button 
                  onClick={() => removePlan(plan.id)}
                  className="absolute top-4 right-4 bg-white/80 backdrop-blur-md text-red-500 p-2 rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white"
                >
                  <Trash2 size={18} />
                </button>
                
                <div className="absolute top-4 left-4 bg-indigo-600 text-white p-2 rounded-xl shadow-lg">
                  {plan.type === 'pdf' ? <FileText size={16} /> : <FileImage size={16} />}
                </div>
              </div>

              <div className="p-5 space-y-4 flex-1 flex flex-col">
                <div className="space-y-1 flex-1">
                  <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest">Legenda da Planta</label>
                  <textarea 
                    value={plan.caption}
                    onChange={(e) => updateCaption(plan.id, e.target.value)}
                    placeholder="Descreva esta planta (ex: Piso 0 - Implantação e Equipamentos)..."
                    className="w-full p-4 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all h-20 resize-none"
                  />
                </div>
                <div className="text-[9px] font-black text-slate-400 uppercase text-right italic truncate">
                  Ficheiro: {plan.name}
                </div>
              </div>
            </div>
          ))}
        </div>

        {report.floorPlans.length === 0 && !isUploading && (
          <div className="py-24 text-center border-4 border-dashed border-slate-100 rounded-[3rem] space-y-6">
            <MapIcon size={64} className="mx-auto text-slate-200" />
            <div>
              <p className="text-xl font-black text-slate-300 uppercase tracking-widest">Nenhuma planta associada</p>
              <p className="text-xs text-slate-400 font-bold mt-2">Arraste ficheiros ou use o botão acima para documentar o edifício</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditorPlantas;
