
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl flex flex-col max-h-[80vh] overflow-hidden border border-slate-200">
        <div className="p-6 border-b flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
              <ImageIcon className="text-blue-600" size={24} /> 
              Seleção Visual de Fotos
            </h3>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">
              Selecione a fotografia correspondente ao elemento técnico
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400 hover:text-slate-600"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 bg-slate-50/30">
          {photos.length === 0 ? (
            <div className="col-span-full py-20 text-center text-slate-400">
              <ImageIcon size={48} className="mx-auto mb-4 opacity-20" />
              <p className="font-bold italic">Nenhuma foto disponível na galeria.</p>
              <p className="text-xs">Vá ao menu "Fotos" para carregar imagens.</p>
            </div>
          ) : (
            photos.map((photo) => (
              <div 
                key={photo.id}
                onClick={() => { onSelect(photo.id); onClose(); }}
                className={`group relative aspect-square rounded-2xl overflow-hidden cursor-pointer border-4 transition-all hover:scale-105 bg-slate-50 ${
                  selectedId === photo.id 
                    ? 'border-blue-600 ring-4 ring-blue-100' 
                    : 'border-white hover:border-blue-200 shadow-sm'
                }`}
              >
                <img src={photo.url} className="w-full h-full object-contain" alt={photo.code} />
                
                {/* Overlay with Code and Caption */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2">
                  <span className="text-[10px] text-white font-bold leading-tight line-clamp-2 italic">
                    {photo.caption}
                  </span>
                </div>

                <div className="absolute top-2 left-2 bg-slate-900 text-white text-[10px] font-black px-1.5 py-0.5 rounded-lg shadow-lg">
                  {photo.code}
                </div>

                {selectedId === photo.id && (
                  <div className="absolute inset-0 bg-blue-600/20 flex items-center justify-center">
                    <CheckCircle2 size={32} className="text-white drop-shadow-lg fill-blue-600" />
                  </div>
                )}
              </div>
            ))
          )}
        </div>
        
        <div className="p-4 bg-white border-t text-center">
          <button 
            onClick={onClose}
            className="px-8 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-bold transition-all"
          >
            Fechar Galeria
          </button>
        </div>
      </div>
    </div>
  );
};

export default PhotoPicker;
