
import React, { useState } from 'react';
import { ReportState, TechnicalElement } from '../../types';
import { Plus, Trash2, Power, PowerOff, Image as ImageIcon, Search, Thermometer, X, Globe, Shield } from 'lucide-react';
import PhotoPicker from './PhotoPicker';

interface Props {
  title: string;
  report: ReportState;
  onUpdate: (updates: any) => void;
  targetPath: keyof ReportState;
  options: string[];
  showSetpoint?: boolean;
}

const EditorStructured: React.FC<Props> = ({ title, report, onUpdate, targetPath, options, showSetpoint = false }) => {
  const [activePickerId, setActivePickerId] = useState<string | null>(null);
  const currentList = (report[targetPath] as TechnicalElement[]) || [];
  const isEnvolvente = targetPath === 'envolventeList';

  const addElement = () => {
    const newItem: TechnicalElement = {
      id: Math.random().toString(36).substring(7),
      type: options[0],
      description: '',
      estado: 'Bom',
      isActive: true,
      setpoint: showSetpoint ? '21' : undefined,
      photoIds: [],
      posicao: isEnvolvente ? 'Exterior' : undefined,
      vidroTipo: 'Duplo',
      protecao: 'Sem',
      caixilhariaTipo: 'Alumínio',
      corteTermico: 'Com'
    };
    onUpdate({ [targetPath]: [...currentList, newItem] });
  };

  const updateElement = (id: string, field: keyof TechnicalElement, value: any) => {
    onUpdate({ [targetPath]: currentList.map(e => e.id === id ? { ...e, [field]: value } : e) });
  };

  const removeElement = (id: string) => {
    onUpdate({ [targetPath]: currentList.filter(e => e.id !== id) });
  };

  const addPhotoToElement = (elementId: string, photoId: string) => {
    const element = currentList.find(e => e.id === elementId);
    if (!element) return;
    const currentIds = element.photoIds || [];
    if (!currentIds.includes(photoId)) {
      updateElement(elementId, 'photoIds', [...currentIds, photoId]);
    }
  };

  const removePhotoFromElement = (elementId: string, photoId: string) => {
    const element = currentList.find(e => e.id === elementId);
    if (!element) return;
    const currentIds = element.photoIds || [];
    updateElement(elementId, 'photoIds', currentIds.filter(id => id !== photoId));
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-between items-center bg-white p-6 rounded-xl border shadow-sm">
        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
        <button onClick={addElement} className="bg-blue-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 font-bold hover:bg-blue-700 shadow-md transition-all active:scale-95">
          <Plus size={20}/> Adicionar Item
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {currentList.map((element) => {
          const associatedPhotos = report.photos.filter(p => element.photoIds?.includes(p.id));
          const isEnvidracado = element.type === 'Envidraçado';

          return (
            <div key={element.id} className="bg-white border-2 rounded-2xl p-6 shadow-sm relative group hover:border-blue-200 transition-colors">
              <button onClick={() => removeElement(element.id)} className="absolute top-4 right-4 p-2 text-gray-300 hover:text-red-600 transition">
                <Trash2 size={20}/>
              </button>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">Tipo de Elemento</label>
                    <select 
                      value={element.type}
                      onChange={(e) => updateElement(element.id, 'type', e.target.value)}
                      className="w-full p-3 bg-slate-50 border-none rounded-xl font-bold text-blue-700 focus:ring-2 focus:ring-blue-300 outline-none"
                    >
                      {options.map(o => <option key={o} value={o}>{o}</option>)}
                      <option value="Outro">Outro (Especificar...)</option>
                    </select>
                    {element.type === 'Outro' && (
                      <input 
                        type="text" 
                        placeholder="Indique o tipo..."
                        value={element.customType || ''}
                        onChange={(e) => updateElement(element.id, 'customType', e.target.value)}
                        className="w-full mt-2 p-3 border-2 border-blue-100 rounded-xl text-sm outline-none"
                      />
                    )}
                  </div>

                  {/* Campos de Localização para Envolvente */}
                  {isEnvolvente && (
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">Localização</label>
                      <div className="flex gap-2">
                        {['Interior', 'Exterior'].map(pos => (
                          <button
                            key={pos}
                            onClick={() => updateElement(element.id, 'posicao', pos)}
                            className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase transition ${element.posicao === pos ? 'bg-slate-800 text-white shadow-lg' : 'bg-slate-100 text-slate-400'}`}
                          >
                            {pos}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">Estado</label>
                      <select 
                        value={element.estado}
                        onChange={(e) => updateElement(element.id, 'estado', e.target.value)}
                        className="w-full p-2 bg-slate-50 rounded-lg text-xs font-bold outline-none"
                      >
                        <option>Novo</option>
                        <option>Bom</option>
                        <option>Médio</option>
                        <option>Degradado</option>
                        <option>Crítico</option>
                      </select>
                    </div>
                    {!isEnvolvente && (
                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block">Status</label>
                        <button 
                          onClick={() => updateElement(element.id, 'isActive', !element.isActive)}
                          className={`p-2 rounded-lg flex items-center gap-2 text-[10px] font-bold transition ${element.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                        >
                          {element.isActive ? <Power size={14}/> : <PowerOff size={14}/>}
                          {element.isActive ? 'ATIVO' : 'INATIVO'}
                        </button>
                      </div>
                    )}
                  </div>

                  {showSetpoint && (
                    <div className="pt-2">
                       <label className="text-[10px] font-black text-orange-400 uppercase mb-2 flex items-center gap-2">
                         <Thermometer size={12} /> Setpoint de Operação (°C)
                       </label>
                       <input 
                         type="number" 
                         value={element.setpoint || ''}
                         onChange={(e) => updateElement(element.id, 'setpoint', e.target.value)}
                         placeholder="ºC"
                         className="w-full p-2.5 bg-orange-50/50 border border-orange-100 rounded-lg text-xs font-black text-orange-700 outline-none focus:ring-2 focus:ring-orange-200 transition-all"
                       />
                    </div>
                  )}
                </div>

                <div className="md:col-span-2 space-y-6">
                  {/* Bloco de Detalhes de Vãos Envidraçados */}
                  {isEnvidracado && (
                    <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100 grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in slide-in-from-right-2">
                      <div className="col-span-full flex items-center gap-2 mb-2 text-blue-800">
                        <Globe size={16} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Especificações do Vão Envidraçado</span>
                      </div>
                      
                      <div>
                        <label className="text-[9px] font-black text-blue-400 uppercase mb-1 block">Tipo de Vidro</label>
                        <select 
                          value={element.vidroTipo}
                          onChange={(e) => updateElement(element.id, 'vidroTipo', e.target.value)}
                          className="w-full p-2 bg-white rounded-lg text-xs font-bold border border-blue-100 outline-none"
                        >
                          <option>Simples</option>
                          <option>Duplo</option>
                          <option>Triplo</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[9px] font-black text-blue-400 uppercase mb-1 block">Caixilharia</label>
                        <select 
                          value={element.caixilhariaTipo}
                          onChange={(e) => updateElement(element.id, 'caixilhariaTipo', e.target.value)}
                          className="w-full p-2 bg-white rounded-lg text-xs font-bold border border-blue-100 outline-none"
                        >
                          <option>Alumínio</option>
                          <option>PVC</option>
                          <option>Ferro</option>
                          <option>Madeira</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[9px] font-black text-blue-400 uppercase mb-1 block">Corte Térmico</label>
                        <div className="flex gap-2">
                          {['Com', 'Sem'].map(opt => (
                            <button
                              key={opt}
                              onClick={() => updateElement(element.id, 'corteTermico', opt)}
                              className={`flex-1 py-1.5 rounded-lg text-[9px] font-black uppercase border transition ${element.corteTermico === opt ? 'bg-blue-600 text-white border-blue-700' : 'bg-white text-blue-400 border-blue-100'}`}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="text-[9px] font-black text-blue-400 uppercase mb-1 block">Proteção Solar</label>
                        <div className="flex gap-2">
                          {['Com', 'Sem'].map(opt => (
                            <button
                              key={opt}
                              onClick={() => updateElement(element.id, 'protecao', opt)}
                              className={`flex-1 py-1.5 rounded-lg text-[9px] font-black uppercase border transition ${element.protecao === opt ? 'bg-blue-600 text-white border-blue-700' : 'bg-white text-blue-400 border-blue-100'}`}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>

                      {element.protecao === 'Com' && (
                        <div className="col-span-full">
                          <label className="text-[9px] font-black text-blue-400 uppercase mb-1 block">Tipo de Proteção</label>
                          <input 
                            type="text"
                            placeholder="Ex: Estore exterior, lâminas, película..."
                            value={element.protecaoTipo || ''}
                            onChange={(e) => updateElement(element.id, 'protecaoTipo', e.target.value)}
                            className="w-full p-2 bg-white rounded-lg text-xs font-bold border border-blue-100 outline-none"
                          />
                        </div>
                      )}
                    </div>
                  )}

                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase block">Observações Técnicas</label>
                    <textarea 
                      className="w-full p-4 border rounded-2xl bg-slate-50 h-24 text-sm focus:bg-white transition outline-none"
                      value={element.description}
                      onChange={(e) => updateElement(element.id, 'description', e.target.value)}
                      placeholder="Descreva marca, modelo, capacidade e anomalias detetadas..."
                    />
                    
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase block">Fotos de Evidência ({element.photoIds?.length || 0})</label>
                      <div className="flex flex-wrap gap-4">
                        {associatedPhotos.map(photo => (
                          <div key={photo.id} className="relative group/thumb">
                            <div className="w-24 h-24 rounded-xl border-2 border-slate-200 bg-slate-50 shadow-sm overflow-hidden transform transition-transform group-hover/thumb:scale-105">
                              <img src={photo.url} className="w-full h-full object-contain" alt={photo.code} />
                              <div className="absolute top-0 left-0 bg-slate-900/80 text-white text-[8px] px-1 font-black">{photo.code}</div>
                            </div>
                            <button 
                              onClick={() => removePhotoFromElement(element.id, photo.id)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 shadow-lg opacity-0 group-hover/thumb:opacity-100 transition-opacity z-10"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                        
                        <button 
                          onClick={() => setActivePickerId(element.id)}
                          className="w-24 h-24 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center text-slate-400 hover:border-blue-400 hover:text-blue-500 transition-all group/add"
                        >
                          <Plus size={24} className="group-hover/add:scale-110 transition-transform" />
                          <span className="text-[8px] font-black uppercase mt-1">Associar</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {activePickerId === element.id && (
                <PhotoPicker 
                  photos={report.photos}
                  onSelect={(photoId) => addPhotoToElement(element.id, photoId)}
                  onClose={() => setActivePickerId(null)}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EditorStructured;
