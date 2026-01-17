
import React, { useState } from 'react';
import { ReportState, MureItem } from '../../types';
import { Plus, Trash2, CheckCircle, Info, Image as ImageIcon, Search, X } from 'lucide-react';
import PhotoPicker from './PhotoPicker';

interface Props {
  report: ReportState;
  onUpdate: (updates: Partial<ReportState>) => void;
}

const EditorMURES: React.FC<Props> = ({ report, onUpdate }) => {
  const [activePickerId, setActivePickerId] = useState<string | null>(null);

  const toggleMure = (id: string) => {
    const newMures = report.mures.map(m => 
      m.id === id ? { ...m, checked: !m.checked } : m
    );
    onUpdate({ mures: newMures });
  };

  const updateLabel = (id: string, label: string) => {
    const newMures = report.mures.map(m => 
      m.id === id ? { ...m, label } : m
    );
    onUpdate({ mures: newMures });
  };

  const updateNote = (id: string, note: string) => {
    const newMures = report.mures.map(m => 
      m.id === id ? { ...m, note } : m
    );
    onUpdate({ mures: newMures });
  };

  const updatePhotoIds = (id: string, photoIds: string[]) => {
    const newMures = report.mures.map(m => 
      m.id === id ? { ...m, photoIds } : m
    );
    onUpdate({ mures: newMures });
  };

  const addPhotoToMure = (mureId: string, photoId: string) => {
    const mure = report.mures.find(m => m.id === mureId);
    if (!mure) return;
    const currentIds = mure.photoIds || [];
    if (!currentIds.includes(photoId)) {
      updatePhotoIds(mureId, [...currentIds, photoId]);
    }
  };

  const removePhotoFromMure = (mureId: string, photoId: string) => {
    const mure = report.mures.find(m => m.id === mureId);
    if (!mure) return;
    const currentIds = mure.photoIds || [];
    updatePhotoIds(mureId, currentIds.filter(id => id !== photoId));
  };

  const addMure = () => {
    const newMure: MureItem = {
      id: Math.random().toString(36).substring(7),
      label: "",
      checked: true,
      note: "",
      photoIds: []
    };
    onUpdate({ mures: [...report.mures, newMure] });
  };

  const removeMure = (id: string) => {
    onUpdate({ mures: report.mures.filter(m => m.id !== id) });
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="bg-white border rounded-2xl p-6 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
            <CheckCircle className="text-emerald-500" /> Medidas de Melhoria (MURES)
          </h2>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">
            Selecione ou adicione medidas de eficiência energética identificadas
          </p>
        </div>
        <button 
          onClick={addMure}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 font-bold transition shadow-lg active:scale-95"
        >
          <Plus size={20} /> Adicionar Medida
        </button>
      </div>

      <div className="bg-white border rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest w-16 text-center">Status</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Medida (MURE)</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest w-64">Evidências Fotográficas</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Justificação / Notas</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest w-16 text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {report.mures.map(m => {
              const associatedPhotos = report.photos.filter(p => m.photoIds?.includes(p.id));
              return (
                <tr key={m.id} className={`hover:bg-slate-50 transition ${m.checked ? 'bg-emerald-50/30' : ''}`}>
                  <td className="px-6 py-4 text-center">
                    <input 
                      type="checkbox" 
                      checked={m.checked}
                      onChange={() => toggleMure(m.id)}
                      className="w-5 h-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <input 
                      type="text" 
                      placeholder="Descrição da medida..."
                      value={m.label}
                      onChange={(e) => updateLabel(m.id, e.target.value)}
                      className={`w-full bg-transparent border-b border-transparent focus:border-emerald-500 outline-none font-bold text-sm ${m.checked ? 'text-emerald-900' : 'text-slate-700'}`}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-2 items-center">
                      {associatedPhotos.map(photo => (
                        <div key={photo.id} className="relative group/thumb">
                          <div className="w-14 h-14 rounded-lg border border-slate-200 bg-slate-50 overflow-hidden shadow-sm">
                            <img src={photo.url} className="w-full h-full object-contain" />
                            <div className="absolute top-0 left-0 bg-slate-900/80 text-white text-[7px] px-1 font-black">{photo.code}</div>
                          </div>
                          <button 
                            onClick={() => removePhotoFromMure(m.id, photo.id)}
                            className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover/thumb:opacity-100 transition-opacity z-10"
                          >
                            <X size={10} />
                          </button>
                        </div>
                      ))}
                      <button 
                        onClick={() => setActivePickerId(m.id)}
                        className="w-14 h-14 rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center text-slate-400 hover:border-blue-300 hover:text-blue-500 transition-all group/add"
                        title="Adicionar Foto de Evidência"
                      >
                        <Plus size={18} className="group-hover/add:scale-110 transition-transform" />
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Info size={14} className="text-slate-300 shrink-0" />
                      <input 
                        type="text" 
                        placeholder="Indique a justificação técnica..."
                        value={m.note}
                        onChange={(e) => updateNote(m.id, e.target.value)}
                        className="w-full bg-transparent border-b border-transparent focus:border-blue-500 outline-none text-xs italic text-slate-500"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={() => removeMure(m.id)}
                      className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                      title="Remover medida"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>

                  {activePickerId === m.id && (
                    <PhotoPicker 
                      photos={report.photos}
                      onSelect={(photoId) => addPhotoToMure(m.id, photoId)}
                      onClose={() => setActivePickerId(null)}
                    />
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-xl flex gap-3">
        <Info className="text-blue-500 shrink-0" size={20} />
        <p className="text-xs text-blue-800 leading-relaxed">
          As medidas marcadas como <strong>identificadas</strong> serão incluídas automaticamente no capítulo 6 do relatório impresso, juntamente com as notas de campo e evidências fotográficas associadas.
        </p>
      </div>
    </div>
  );
};

export default EditorMURES;
