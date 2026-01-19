
import React, { useState } from 'react';
import { ReportState, SpaceElement } from '../../types';
import { Plus, Layout, Home, Coffee, Trash2, Image as ImageIcon, Search, X } from 'lucide-react';
import PhotoPicker from './PhotoPicker';

interface Props {
  report: ReportState;
  onUpdate: (updates: Partial<ReportState>) => void;
}

const EditorEspacos: React.FC<Props> = ({ report, onUpdate }) => {
  const [activePickerId, setActivePickerId] = useState<string | null>(null);
  const currentList = report.espacosList || [];
  
  const spaceTypes = {
    "Edifício": ["Sala", "Quarto", "Corredor", "Gabinete", "Receção", "Zona Comum", "Sanitários", "Outro"],
    "Complementar": ["Lavandaria", "Piscina", "Cozinha", "Estacionamento", "Datacenter", "Arrecadação", "Outro"]
  };

  const addSpace = (category: 'Edifício' | 'Complementar') => {
    const newItem: SpaceElement = {
      id: Math.random().toString(36).substring(7),
      name: '',
      type: spaceTypes[category][0],
      category,
      photoIds: []
    };
    onUpdate({ espacosList: [...currentList, newItem] });
  };

  const updateSpace = (id: string, field: keyof SpaceElement, value: any) => {
    onUpdate({ espacosList: currentList.map(e => e.id === id ? { ...e, [field]: value } : e) });
  };

  const addPhotoToSpace = (spaceId: string, photoId: string) => {
    const space = currentList.find(s => s.id === spaceId);
    if (!space) return;
    const currentIds = space.photoIds || [];
    if (!currentIds.includes(photoId)) {
      updateSpace(spaceId, 'photoIds', [...currentIds, photoId]);
    }
  };

  const removePhotoFromSpace = (spaceId: string, photoId: string) => {
    const space = currentList.find(s => s.id === spaceId);
    if (!space) return;
    const currentIds = space.photoIds || [];
    updateSpace(spaceId, 'photoIds', currentIds.filter(id => id !== photoId));
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex gap-4">
        <button onClick={() => addSpace('Edifício')} className="flex-1 bg-white dark:bg-slate-900 border-2 border-blue-100 dark:border-blue-900/30 p-6 rounded-2xl hover:border-blue-500 transition group text-center shadow-sm">
          <Home className="mx-auto mb-2 text-blue-400 group-hover:text-blue-600" />
          <div className="font-black text-slate-700 dark:text-slate-200">Novo Espaço Edifício</div>
          <div className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-bold">Salas, Gabinetes, etc</div>
        </button>
        <button onClick={() => addSpace('Complementar')} className="flex-1 bg-white dark:bg-slate-900 border-2 border-orange-100 dark:border-orange-900/30 p-6 rounded-2xl hover:border-orange-500 transition group text-center shadow-sm">
          <Coffee className="mx-auto mb-2 text-orange-400 group-hover:text-orange-600" />
          <div className="font-black text-slate-700 dark:text-slate-200">Novo Espaço Complementar</div>
          <div className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-bold">Cozinha, Piscina, etc</div>
        </button>
      </div>

      <div className="space-y-4">
        {currentList.map(space => {
          const associatedPhotos = report.photos.filter(p => space.photoIds?.includes(p.id));
          const isOther = space.type === 'Outro';
          
          return (
            <div key={space.id} className={`bg-white dark:bg-slate-900 border-2 p-6 rounded-3xl flex flex-col items-start gap-6 shadow-sm transition-colors ${space.category === 'Edifício' ? 'border-blue-50 dark:border-blue-900/10' : 'border-orange-50 dark:border-orange-900/10'}`}>
              <div className="flex w-full items-start md:items-center gap-6">
                <div className={`p-4 rounded-2xl shrink-0 ${space.category === 'Edifício' ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400' : 'bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400'}`}>
                  <Layout size={24} />
                </div>
                
                <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-6 items-start w-full">
                  <div className="md:col-span-3">
                    <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase mb-1 block">Tipo de Espaço</label>
                    <select 
                      value={space.type}
                      onChange={(e) => updateSpace(space.id, 'type', e.target.value)}
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl font-black text-blue-800 dark:text-blue-400 text-xs outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/50"
                    >
                      {spaceTypes[space.category].map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    {isOther && (
                      <div className="mt-2 animate-in slide-in-from-top-1 duration-200">
                        <input 
                          type="text"
                          placeholder="Especifique o tipo..."
                          value={space.customType || ''}
                          onChange={(e) => updateSpace(space.id, 'customType', e.target.value)}
                          className="w-full p-2 border-b-2 border-blue-200 dark:border-blue-800 bg-transparent text-xs font-bold text-blue-600 dark:text-blue-400 outline-none placeholder:text-blue-200 dark:placeholder:text-blue-900"
                        />
                      </div>
                    )}
                  </div>
                  
                  <div className="md:col-span-4">
                    <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase mb-1 block">Designação do Local</label>
                    <input 
                      placeholder="Ex: Sala de Reuniões 02"
                      value={space.name}
                      onChange={(e) => updateSpace(space.id, 'name', e.target.value)}
                      className="w-full p-2 bg-transparent border-b-2 border-slate-100 dark:border-slate-800 rounded-lg text-sm font-bold dark:text-slate-200 outline-none focus:border-blue-400 dark:focus:border-blue-500 transition-colors"
                    />
                  </div>

                  <div className="md:col-span-5 space-y-2">
                    <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase block">Fotos Associadas ({space.photoIds?.length || 0})</label>
                    <div className="flex flex-wrap gap-3">
                      {associatedPhotos.map(photo => (
                        <div key={photo.id} className="relative group/thumb">
                           <div className="w-20 h-20 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 overflow-hidden shadow-sm">
                             <img src={photo.url} className="w-full h-full object-contain" />
                             <div className="absolute top-0 left-0 bg-slate-900/80 text-white text-[7px] px-1 font-black">{photo.code}</div>
                           </div>
                           <button 
                             onClick={() => removePhotoFromSpace(space.id, photo.id)}
                             className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover/thumb:opacity-100 transition-opacity z-10 shadow-lg"
                           >
                             <X size={12} />
                           </button>
                        </div>
                      ))}
                      <button 
                        onClick={() => setActivePickerId(space.id)}
                        className="w-20 h-20 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-600 hover:border-blue-400 hover:text-blue-500 transition-all group/add"
                      >
                        <Plus size={20} className="group-hover/add:scale-110 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => onUpdate({ espacosList: currentList.filter(e => e.id !== space.id) })} 
                  className="p-3 text-slate-300 dark:text-slate-600 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-all shrink-0 self-start md:self-center"
                >
                  <Trash2 size={20} />
                </button>
              </div>

              {activePickerId === space.id && (
                <PhotoPicker 
                  photos={report.photos}
                  onSelect={(id) => addPhotoToSpace(space.id, id)}
                  onClose={() => setActivePickerId(null)}
                />
              )}
            </div>
          );
        })}
      </div>

      {currentList.length === 0 && (
        <div className="py-24 text-center border-4 border-dashed border-slate-100 dark:border-slate-800 rounded-[3rem] space-y-6">
          <Layout size={64} className="mx-auto text-slate-200 dark:text-slate-800" />
          <div>
            <p className="text-xl font-black text-slate-300 dark:text-slate-700 uppercase tracking-widest">Nenhum espaço registado</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 font-bold mt-2">Utilize os botões superiores para iniciar o levantamento dos compartimentos</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditorEspacos;
