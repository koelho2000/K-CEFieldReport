
import React from 'react';
import { PhotoEntry } from '../../types';
import { X, CheckCircle2, Image as ImageIcon } from 'lucide-react';

interface PhotoPickerProps {
  photos: PhotoEntry[];
  selectedId?: string;
  onSelect: (id: string) => void;
  onClose: () => void;
}

const PhotoPicker: React.FC<PhotoPickerProps> = ({ photos, selectedId, onSelect, onClose }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 w-full max-w-7xl rounded-[2.5rem] shadow-[0_0_50px_rgba(0,0,0,0.3)] flex flex-col max-h-[90vh] overflow-hidden border border-slate-200 dark:border-slate-800">
        <div className="p-8 border-b dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950">
          <div>
            <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-xl text-white">
                <ImageIcon size={24} /> 
              </div>
              Seleção Visual de Fotos
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-[0.2em] mt-2">
              Clique para associar • Passe o rato para ampliar e verificar detalhes
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-3 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-2xl transition-all text-slate-400 hover:text-red-500"
          >
            <X size={28} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 bg-slate-50/30 dark:bg-slate-900/30">
          {photos.length === 0 ? (
            <div className="col-span-full py-32 text-center text-slate-400 dark:text-slate-600">
              <ImageIcon size={64} className="mx-auto mb-6 opacity-20" />
              <p className="text-xl font-black uppercase tracking-widest">Galeria Vazia</p>
              <p className="text-sm font-bold mt-2">Vá ao menu "Fotos" para carregar as evidências do local.</p>
            </div>
          ) : (
            photos.map((photo) => (
              <div 
                key={photo.id}
                onClick={() => { onSelect(photo.id); onClose(); }}
                className={`group relative aspect-[4/5] rounded-[1.5rem] cursor-pointer border-4 transition-all duration-300 hover:scale-[1.6] hover:z-50 hover:shadow-[0_20px_50px_rgba(0,0,0,0.4)] bg-white dark:bg-slate-800 ${
                  selectedId === photo.id 
                    ? 'border-blue-600 ring-8 ring-blue-500/10' 
                    : 'border-white dark:border-slate-800 hover:border-blue-400 shadow-md'
                }`}
              >
                <img src={photo.url} className="w-full h-full object-contain p-2" alt={photo.code} />
                
                {/* Overlay com detalhes que aparece no hover */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end h-1/2 rounded-b-[1.2rem]">
                  <span className="text-[10px] text-blue-400 font-black uppercase tracking-widest mb-1">{photo.category}</span>
                  <span className="text-[10px] text-white font-bold leading-tight line-clamp-3 italic">
                    {photo.caption}
                  </span>
                </div>

                {/* Código da Foto */}
                <div className="absolute top-3 left-3 bg-slate-900/90 text-white text-[10px] font-black px-2 py-1 rounded-lg shadow-xl backdrop-blur-md border border-white/10">
                  {photo.code}
                </div>

                {/* Indicador de Seleção */}
                {selectedId === photo.id && (
                  <div className="absolute inset-0 bg-blue-600/10 flex items-center justify-center rounded-[1.2rem]">
                    <div className="bg-blue-600 text-white p-2 rounded-full shadow-xl">
                      <CheckCircle2 size={32} />
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
        
        <div className="p-6 bg-white dark:bg-slate-950 border-t dark:border-slate-800 text-center">
          <button 
            onClick={onClose}
            className="px-12 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95"
          >
            Fechar Galeria
          </button>
        </div>
      </div>
    </div>
  );
};

export default PhotoPicker;
