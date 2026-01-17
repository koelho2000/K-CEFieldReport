
import React, { useState } from 'react';
import { ReportState, EnergyInfrastructure, EnergySourceInfo } from '../../types';
import { Zap, Droplets, Activity, ClipboardList, Info, Plus, X, Camera } from 'lucide-react';
import PhotoPicker from './PhotoPicker';

interface ToggleCardProps {
  label: string;
  active: boolean;
  onClick: () => void;
  icon: any;
}

const ToggleCard = ({ label, active, onClick, icon: Icon }: ToggleCardProps) => (
  <button 
    onClick={onClick}
    className={`p-4 rounded-xl border-2 transition-all flex items-center gap-3 text-left ${
      active ? 'bg-blue-600 border-blue-700 text-white shadow-lg' : 'bg-white border-slate-100 text-slate-400 hover:border-blue-200'
    }`}
  >
    <Icon size={18} className={active ? 'text-blue-200' : 'text-slate-300'} />
    <span className="text-xs font-black uppercase tracking-widest">{label}</span>
  </button>
);

interface Props {
  report: ReportState;
  onUpdate: (updates: Partial<ReportState>) => void;
}

const EditorEnergia: React.FC<Props> = ({ report, onUpdate }) => {
  const sources = ["Eletricidade", "Águas da Rede", "Gás Natural", "Gás Propano", "Gasóleo", "Biomassa", "Rede de Calor/Frio"];
  const [activePicker, setActivePicker] = useState<{ type: 'source' | 'pt', sourceName?: string } | null>(null);
  
  const updateEnergy = (field: keyof EnergyInfrastructure, value: any) => {
    onUpdate({ energy: { ...report.energy, [field]: value } });
  };

  const toggleSource = (source: string) => {
    const current = report.energy.fontes;
    const isSelected = current.includes(source);
    const next = isSelected ? current.filter(s => s !== source) : [...current, source];
    
    // Update fontesInfo list accordingly
    let nextInfo = [...(report.energy.fontesInfo || [])];
    if (isSelected) {
      nextInfo = nextInfo.filter(i => i.source !== source);
    } else {
      nextInfo.push({ source, meterRef: '', photoIds: [] });
    }
    
    onUpdate({ energy: { ...report.energy, fontes: next, fontesInfo: nextInfo } });
  };

  const updateSourceInfo = (sourceName: string, field: keyof EnergySourceInfo, value: any) => {
    const nextInfo = (report.energy.fontesInfo || []).map(i => 
      i.source === sourceName ? { ...i, [field]: value } : i
    );
    updateEnergy('fontesInfo', nextInfo);
  };

  const addPhotoToSource = (sourceName: string, photoId: string) => {
    const info = (report.energy.fontesInfo || []).find(i => i.source === sourceName);
    if (!info) return;
    const currentIds = info.photoIds || [];
    if (!currentIds.includes(photoId)) {
      updateSourceInfo(sourceName, 'photoIds', [...currentIds, photoId]);
    }
  };

  const removePhotoFromSource = (sourceName: string, photoId: string) => {
    const info = (report.energy.fontesInfo || []).find(i => i.source === sourceName);
    if (!info) return;
    const currentIds = info.photoIds || [];
    updateSourceInfo(sourceName, 'photoIds', currentIds.filter(id => id !== photoId));
  };

  const addPhotoToPT = (photoId: string) => {
    const currentIds = report.energy.ptPhotoIds || [];
    if (!currentIds.includes(photoId)) {
      updateEnergy('ptPhotoIds', [...currentIds, photoId]);
    }
  };

  const removePhotoFromPT = (photoId: string) => {
    const currentIds = report.energy.ptPhotoIds || [];
    updateEnergy('ptPhotoIds', currentIds.filter(id => id !== photoId));
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="bg-white border rounded-2xl p-8 shadow-sm space-y-10">
        <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
          <Zap className="text-blue-600" size={28} /> Infraestrutura Energética
        </h2>

        {/* Fontes de Energia */}
        <div className="space-y-6">
          <h3 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] flex items-center gap-2 border-b pb-1">
            <Activity size={12} /> Fontes de Energia e Água
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {sources.map(s => (
              <button 
                key={s}
                onClick={() => toggleSource(s)}
                className={`p-3 rounded-lg border text-xs font-bold transition-all ${
                  report.energy.fontes.includes(s) ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-sm' : 'bg-slate-50 border-slate-200 text-slate-400'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Detalhes dos Contadores das Fontes Selecionadas */}
          {report.energy.fontes.length > 0 && (
            <div className="mt-8 space-y-6">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Identificação de Contadores e Evidências</h4>
              <div className="grid grid-cols-1 gap-4">
                {(report.energy.fontesInfo || []).map(info => (
                  <div key={info.source} className="bg-slate-50/50 border border-slate-100 rounded-2xl p-5 flex flex-col md:flex-row gap-6 items-start md:items-center">
                    <div className="shrink-0 w-32">
                       <span className="text-xs font-black text-blue-900 uppercase">{info.source}</span>
                    </div>
                    <div className="flex-1 w-full space-y-2">
                       <label className="text-[9px] font-bold text-slate-400 uppercase">Referência do Contador</label>
                       <input 
                         type="text"
                         value={info.meterRef || ''}
                         onChange={(e) => updateSourceInfo(info.source, 'meterRef', e.target.value)}
                         placeholder="Nº de Série / Identificação..."
                         className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-4 focus:ring-blue-500/5 transition-all"
                       />
                    </div>
                    <div className="w-full md:w-64 space-y-2">
                       <label className="text-[9px] font-bold text-slate-400 uppercase">Foto do Contador</label>
                       <div className="flex flex-wrap gap-2">
                          {(info.photoIds || []).map(pid => {
                             const photo = report.photos.find(p => p.id === pid);
                             return photo ? (
                               <div key={pid} className="relative group">
                                  <div className="w-12 h-12 rounded-lg border bg-white overflow-hidden">
                                     <img src={photo.url} className="w-full h-full object-contain" />
                                  </div>
                                  <button onClick={() => removePhotoFromSource(info.source, pid)} className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"><X size={10}/></button>
                               </div>
                             ) : null;
                          })}
                          <button 
                            onClick={() => setActivePicker({ type: 'source', sourceName: info.source })}
                            className="w-12 h-12 rounded-lg border-2 border-dashed border-slate-200 bg-white flex items-center justify-center text-slate-300 hover:border-blue-400 hover:text-blue-500 transition-all"
                          >
                             <Camera size={18} />
                          </button>
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Posto de Transformação */}
        <div className="space-y-6">
          <h3 className="text-[10px] font-black text-orange-500 uppercase tracking-[0.2em] flex items-center gap-2 border-b pb-1">
            <ClipboardList size={12} /> Posto de Transformação (PT)
          </h3>
          <div className="flex items-center gap-4 mb-4">
             <label className="flex items-center gap-2 cursor-pointer bg-slate-50 px-4 py-2 rounded-xl border border-slate-200">
               <input 
                 type="checkbox" 
                 checked={report.energy.temPT}
                 onChange={(e) => updateEnergy('temPT', e.target.checked)}
                 className="w-5 h-5 rounded border-slate-300 text-orange-600 focus:ring-orange-500"
               />
               <span className="text-xs font-black text-slate-700 uppercase">Existe PT no local</span>
             </label>
          </div>

          {report.energy.temPT && (
            <div className="space-y-6 animate-in slide-in-from-top-2">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-orange-50/30 border border-orange-100 rounded-2xl">
                <div>
                  <label className="block text-[9px] font-bold text-orange-400 uppercase mb-1">Código do PT</label>
                  <input 
                    type="text" 
                    value={report.energy.ptCodigo}
                    onChange={(e) => updateEnergy('ptCodigo', e.target.value)}
                    placeholder="Ex: PT-1234-LX"
                    className="w-full p-2.5 bg-white border border-orange-100 rounded-lg text-xs font-bold outline-none focus:ring-2 focus:ring-orange-200"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-orange-400 uppercase mb-1">Potência Nominal (kVA)</label>
                  <input 
                    type="number" 
                    value={report.energy.ptPotencia}
                    onChange={(e) => updateEnergy('ptPotencia', e.target.value)}
                    placeholder="Ex: 630"
                    className="w-full p-2.5 bg-white border border-orange-100 rounded-lg text-xs font-bold outline-none focus:ring-2 focus:ring-orange-200"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-orange-400 uppercase mb-1">CPE Eletricidade</label>
                  <input 
                    type="text" 
                    value={report.energy.cpeEletricidade}
                    onChange={(e) => updateEnergy('cpeEletricidade', e.target.value)}
                    placeholder="CPE (Código Ponto Entrega)"
                    className="w-full p-2.5 bg-white border border-orange-100 rounded-lg text-xs font-bold outline-none focus:ring-2 focus:ring-orange-200"
                  />
                </div>
              </div>
              
              <div className="p-6 bg-slate-50 border border-slate-100 rounded-2xl space-y-4">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Fotos de Evidência do PT</label>
                 <div className="flex flex-wrap gap-4">
                    {(report.energy.ptPhotoIds || []).map(pid => {
                       const photo = report.photos.find(p => p.id === pid);
                       return photo ? (
                         <div key={pid} className="relative group">
                            <div className="w-24 h-24 rounded-xl border bg-white overflow-hidden shadow-sm">
                               <img src={photo.url} className="w-full h-full object-contain" />
                               <div className="absolute top-0 left-0 bg-slate-900/80 text-white text-[7px] px-1 font-black">{photo.code}</div>
                            </div>
                            <button onClick={() => removePhotoFromPT(pid)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"><X size={14}/></button>
                         </div>
                       ) : null;
                    })}
                    <button 
                      onClick={() => setActivePicker({ type: 'pt' })}
                      className="w-24 h-24 rounded-xl border-2 border-dashed border-slate-300 bg-white flex flex-col items-center justify-center text-slate-400 hover:border-orange-400 hover:text-orange-500 transition-all group/add"
                    >
                       <Plus size={24} className="group-hover/add:scale-110 transition-transform" />
                       <span className="text-[8px] font-black uppercase mt-1">Fotos PT</span>
                    </button>
                 </div>
              </div>
            </div>
          )}
        </div>

        {/* Monitorização e Medição */}
        <div className="space-y-4">
          <h3 className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] flex items-center gap-2 border-b pb-1">
            <Activity size={12} /> Monitorização e Medição
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <ToggleCard label="Contadores Energia" active={report.energy.temContadoresEnergia} onClick={() => updateEnergy('temContadoresEnergia', !report.energy.temContadoresEnergia)} icon={Activity} />
            <ToggleCard label="Contadores Água" active={report.energy.temContadoresAgua} onClick={() => updateEnergy('temContadoresAgua', !report.energy.temContadoresAgua)} icon={Droplets} />
            <ToggleCard label="Analisadores Energia" active={report.energy.temAnalisadores} onClick={() => updateEnergy('temAnalisadores', !report.energy.temAnalisadores)} icon={Activity} />
            <ToggleCard label="Sistemas SMM" active={report.energy.temSMM} onClick={() => updateEnergy('temSMM', !report.energy.temSMM)} icon={ClipboardList} />
          </div>
          
          <div className="mt-4">
            <label className="block text-[9px] font-bold text-gray-400 uppercase mb-1">Observações sobre Sistemas de Medição</label>
            <textarea 
               value={report.energy.notasMonitorizacao}
               onChange={(e) => updateEnergy('notasMonitorizacao', e.target.value)}
               placeholder="Descreva a localização dos contadores, marcas dos analisadores ou detalhes do software de monitorização energética..."
               className="w-full p-4 border rounded-xl bg-slate-50 text-xs italic text-gray-600 h-24 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-100 transition-all"
            />
          </div>
        </div>

        <div className="bg-blue-50/50 p-4 rounded-xl flex gap-3 border border-blue-100">
          <Info className="text-blue-500 shrink-0" size={20} />
          <p className="text-[10px] text-blue-800 leading-relaxed italic">
            Estes dados são cruciais para a definição da tarifa energética e para a verificação do cumprimento das obrigações de monitorização impostas pelo RECS em edifícios de grande dimensão.
          </p>
        </div>
      </div>

      {activePicker && (
        <PhotoPicker 
          photos={report.photos}
          onSelect={(pid) => {
            if (activePicker.type === 'source' && activePicker.sourceName) {
              addPhotoToSource(activePicker.sourceName, pid);
            } else if (activePicker.type === 'pt') {
              addPhotoToPT(pid);
            }
          }}
          onClose={() => setActivePicker(null)}
        />
      )}
    </div>
  );
};

export default EditorEnergia;
