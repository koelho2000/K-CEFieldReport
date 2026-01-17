
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
    "Edifício": ["Sala", "Quarto", "Corredor", "Gabinete", "Receção", "Zona Comum", "Sanitários"],
    "Complementar": ["Lavandaria", "Piscina", "Cozinha", "Estacionamento", "Datacenter", "Arrecadação"]
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
        <button onClick={() => addSpace('Edifício')} className="flex-1 bg-white border-2 border-blue-100 p-6 rounded-2xl hover:border-blue-500 transition group text-center shadow-sm">
          <Home className="mx-auto mb-2 text-blue-400 group-hover:text-blue-600" />
          <div className="font-black text-slate-700">Novo Espaço Edifício</div>
          <div className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Salas, Gabinetes, etc</div>
        </button>
        <button onClick={() => addSpace('Complementar')} className="flex-1 bg-white border-2 border-orange-100 p-6 rounded-2xl hover:border-orange-500 transition group text-center shadow-sm">
          <Coffee className="mx-auto mb-2 text-orange-400 group-hover:text-orange-600" />
          <div className="font-black text-slate-700">Novo Espaço Complementar</div>
          <div className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Cozinha, Piscina, etc</div>
        </button>
      </div>

      <div className="space-y-4">
        {currentList.map(space => {
          const associatedPhotos = report.photos.filter(p => space.photoIds?.includes(p.id));
          
          return (
            <div key={space.id} className={`bg-white border-2 p-6 rounded-3xl flex flex-col md:flex-row items-start md:items-center gap-6 shadow-sm ${space.category === 'Edifício' ? 'border-blue-50' : 'border-orange-50'}`}>
              <div className={`p-4 rounded-2xl shrink-0 ${space.category === 'Edifício' ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'}`}>
                <Layout size={24} />
              </div>
              
              <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-6 items-start w-full">
                <div className="md:col-span-3">
                  <label className="text-[9px] font-black text-slate-400 uppercase mb-1 block">Tipo</label>
                  <select 
                    value={space.type}
                    onChange={(e) => updateSpace(space.id, 'type', e.target.value)}
                    className="w-full p-2 border-none bg-slate-50 rounded-xl font-black text-blue-800 text-xs outline-none focus:ring-2 focus:ring-blue-100"
                  >
                    {spaceTypes[space.category].map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                
                <div className="md:col-span-4">
                  <label className="text-[9px] font-black text-slate-400 uppercase mb-1 block">Designação</label>
                  <input 
                    placeholder="Ex: Sala de Reuniões 02"
                    value={space.name}
                    onChange={(e) => updateSpace(space.id, 'name', e.target.value)}
                    className="w-full p-2 border-b-2 border-slate-100 rounded-lg text-sm font-bold outline-none focus:border-blue-400 transition-colors"
                  />
                </div>

                <div className="md:col-span-5 space-y-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase block">Fotos ({space.photoIds?.length || 0})</label>
                  <div className="flex flex-wrap gap-3">
                    {associatedPhotos.map(photo => (
                      <div key={photo.id} className="relative group/thumb">
                         <div className="w-20 h-20 rounded-xl border border-slate-200 bg-slate-50 overflow-hidden shadow-sm">
                           <img src={photo.url} className="w-full h-full object-contain" />
                           <div className="absolute top-0 left-0 bg-slate-900/80 text-white text-[7px] px-1 font-black">{photo.code}</div>
                         </div>
                         <button 
                           onClick={() => removePhotoFromSpace(space.id, photo.id)}
                           className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover/thumb:opacity-100 transition-opacity z-10"
                         >
                           <X size={12} />
                         </button>
                      </div>
                    ))}
                    <button 
                      onClick={() => setActivePickerId(space.id)}
                      className="w-20 h-20 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 flex items-center justify-center text-slate-400 hover:border-blue-400 hover:text-blue-500 transition-all group/add"
                    >
                      <Plus size={20} className="group-hover/add:scale-110 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => onUpdate({ espacosList: currentList.filter(e => e.id !== space.id) })} 
                className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all shrink-0"
              >
                <Trash2 size={20} />
              </button>

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
    </div>
  );
};

export default EditorEspacos;
