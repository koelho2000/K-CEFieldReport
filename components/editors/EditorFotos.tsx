
import React, { useState } from 'react';
import { ReportState, PhotoEntry } from '../../types';
import { analyzeFieldPhoto } from '../../geminiService';
import { Upload, Trash2, Sparkles, Loader2, EyeOff, CheckSquare, Square, Euro, Key, Info } from 'lucide-react';

interface Props {
  report: ReportState;
  onUpdate: (updates: Partial<ReportState>) => void;
}

const EditorFotos: React.FC<Props> = ({ report, onUpdate }) => {
  const [isAiEnabled, setIsAiEnabled] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 });
  const [analyzingIds, setAnalyzingIds] = useState<string[]>([]);

  const checkAndRequestKey = async () => {
    // Acessa window.aistudio injetado pelo ambiente
    const aistudio = (window as any).aistudio;
    if (aistudio) {
      const hasKey = await aistudio.hasSelectedApiKey();
      if (!hasKey) {
        await aistudio.openSelectKey();
        return true; // Assume sucesso após abrir diálogo
      }
      return true;
    }
    return true; // Fallback se não estiver no ambiente AI Studio
  };

  const handleAiToggle = async () => {
    if (!isAiEnabled) {
      await checkAndRequestKey();
      setIsAiEnabled(true);
    } else {
      setIsAiEnabled(false);
    }
  };

  const processWithIA = async (id: string, base64: string) => {
    setAnalyzingIds(prev => [...prev, id]);
    try {
      const result = await analyzeFieldPhoto(base64);
      onUpdate({
        photos: report.photos.map(p => 
          p.id === id ? { 
            ...p, 
            caption: result.caption, 
            category: result.suggestedCategory,
            estimatedCost: result.estimatedCost 
          } : p
        )
      });
    } finally { 
      setAnalyzingIds(prev => prev.filter(aid => aid !== id)); 
    }
  };

  const handleManualIA = async () => {
    if (selectedIds.length === 0) {
      alert("Selecione pelo menos uma foto para processar com IA.");
      return;
    }
    await checkAndRequestKey();
    for (const id of selectedIds) {
      const photo = report.photos.find(p => p.id === id);
      if (photo) {
        await processWithIA(id, photo.url);
      }
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    const totalFiles = files.length;
    setUploadProgress({ current: 0, total: totalFiles });
    
    let currentPhotos = [...report.photos];

    for (let i = 0; i < totalFiles; i++) {
      const file = files[i];
      const reader = new FileReader();
      await new Promise<void>((resolve) => {
        reader.onload = async (e) => {
          const base64 = e.target?.result as string;
          const tempId = Math.random().toString(36).substring(7);
          const photoCode = `F${String(currentPhotos.length + 1).padStart(3, '0')}`;

          const newPhoto: PhotoEntry = { 
            id: tempId, 
            code: photoCode,
            url: base64, 
            caption: isAiEnabled ? 'A analisar...' : 'Registo fotográfico de campo', 
            category: 'Geral',
            includeInReport: true
          };
          
          currentPhotos = [...currentPhotos, newPhoto];
          onUpdate({ photos: currentPhotos });
          setUploadProgress(prev => ({ ...prev, current: i + 1 }));
          
          if (isAiEnabled) {
            await processWithIA(tempId, base64);
          }
          resolve();
        };
        reader.readAsDataURL(file);
      });
    }
    setTimeout(() => setUploadProgress({ current: 0, total: 0 }), 3000);
  };

  const removePhoto = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (confirm('Tem a certeza que deseja eliminar esta fotografia?')) {
      onUpdate({ photos: report.photos.filter(p => p.id !== id) });
    }
  };

  const toggleSelect = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header FOTOS */}
      <div className="bg-white border rounded-2xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4 sticky top-0 z-10 border-blue-100">
        <div className="flex items-center gap-4">
          <div className="bg-blue-600 p-3 rounded-xl text-white shadow-lg shadow-blue-100">
             <Upload size={24} />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-800">Galeria de Fotos ({report.photos.length})</h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Gestão Visual de Ativos e Evidências</p>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          {/* Botão de Chave API */}
          <button 
            onClick={() => (window as any).aistudio?.openSelectKey()}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition font-bold text-xs border"
            title="Configurar Chave API do Google"
          >
            <Key size={14} /> Chave API
          </button>

          {/* Botão de IA Processamento Lote */}
          <button 
            onClick={handleManualIA}
            disabled={selectedIds.length === 0}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl font-black text-xs transition-all uppercase shadow-lg ${
              selectedIds.length > 0 
                ? 'bg-indigo-600 text-white shadow-indigo-200 hover:bg-indigo-700' 
                : 'bg-slate-50 text-slate-300 cursor-not-allowed border'
            }`}
          >
            <Sparkles size={16} /> Gerar Descrição IA
          </button>

          <label className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition font-black text-xs uppercase shadow-lg shadow-blue-200">
            <Upload size={18} /> Carregar Imagens
            <input type="file" multiple accept="image/*" onChange={handleFileUpload} className="hidden" disabled={uploadProgress.total > 0} />
          </label>
        </div>
      </div>

      {/* Info Box IA */}
      <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded-r-xl flex gap-3">
        <Info className="text-indigo-600 shrink-0" size={20} />
        <div>
           <p className="text-[10px] text-indigo-900 font-black uppercase tracking-widest mb-1">Processamento com Inteligência Artificial</p>
           <p className="text-[10px] text-indigo-700 leading-relaxed italic">
             A IA irá identificar o equipamento, gerar uma legenda técnica e <strong>estimar o custo de mercado em Euros (€)</strong> para reparação ou substituição do componente.
           </p>
        </div>
      </div>

      {/* Barra de Progresso */}
      {uploadProgress.total > 0 && (
        <div className="bg-white border p-4 rounded-xl shadow-sm animate-pulse">
           <div className="flex justify-between text-[10px] font-black uppercase text-slate-400 mb-2">
             <span>A carregar e analisar imagens...</span>
             <span>{Math.round((uploadProgress.current/uploadProgress.total)*100)}%</span>
           </div>
           <div className="w-full bg-slate-100 rounded-full h-2">
             <div className="bg-blue-600 h-2 rounded-full transition-all duration-500" style={{ width: `${(uploadProgress.current/uploadProgress.total)*100}%` }}></div>
           </div>
        </div>
      )}

      {/* Galeria */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {report.photos.map(photo => {
          const isAnalyzing = analyzingIds.includes(photo.id);
          const isSelected = selectedIds.includes(photo.id);

          return (
            <div 
              key={photo.id} 
              onClick={(e) => toggleSelect(photo.id, e)} 
              className={`bg-white border-2 rounded-2xl overflow-hidden cursor-pointer relative transition-all group ${isSelected ? 'border-blue-500 ring-4 ring-blue-50 shadow-xl' : 'border-slate-100 hover:border-blue-200'}`}
            >
              <div className="aspect-[4/5] bg-slate-50 relative">
                <img src={photo.url} className="w-full h-full object-cover" alt={photo.code} />
                
                {/* ID Badge */}
                <div className="absolute top-3 left-3 bg-slate-900/90 text-white text-[10px] font-black px-2 py-1 rounded-lg shadow-xl backdrop-blur-md">
                  {photo.code}
                </div>

                {/* Selection indicator */}
                <div className="absolute top-3 right-3 transition-transform group-hover:scale-110">
                  {isSelected ? (
                    <div className="bg-blue-600 text-white p-1 rounded-lg shadow-lg">
                      <CheckSquare size={18} />
                    </div>
                  ) : (
                    <div className="bg-white/40 backdrop-blur-md text-white/80 p-1 rounded-lg shadow-sm border border-white/20">
                      <Square size={18} />
                    </div>
                  )}
                </div>

                {/* Status IA */}
                {isAnalyzing && (
                  <div className="absolute inset-0 bg-indigo-900/60 backdrop-blur-[2px] flex flex-col items-center justify-center text-white p-4 text-center">
                    <Loader2 className="animate-spin mb-2" size={32}/>
                    <span className="text-[10px] font-black uppercase tracking-tighter">Estimando custos...</span>
                  </div>
                )}

                {/* Custo Badge */}
                {photo.estimatedCost && photo.estimatedCost !== 'N/A' && !isAnalyzing && (
                   <div className="absolute bottom-3 left-3 right-3 bg-emerald-600 text-white px-3 py-1.5 rounded-xl font-black text-[10px] flex items-center justify-center gap-2 shadow-lg backdrop-blur-sm border border-emerald-500/50">
                      <Euro size={12} /> {photo.estimatedCost}
                   </div>
                )}

                {/* Delete Overlay */}
                {!isAnalyzing && (
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                    <button 
                      onClick={(e) => removePhoto(photo.id, e)}
                      className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-full shadow-2xl transition-all scale-75 group-hover:scale-100 pointer-events-auto"
                      title="Eliminar permanentemente"
                    >
                      <Trash2 size={24} />
                    </button>
                  </div>
                )}
              </div>
              
              <div className="p-4 space-y-1.5 bg-white">
                 <div className="text-[9px] font-black text-blue-600 uppercase tracking-widest truncate">{photo.category}</div>
                 <div className="text-[11px] font-bold text-slate-700 line-clamp-2 h-8 leading-tight italic">
                   {photo.caption}
                 </div>
              </div>
            </div>
          );
        })}
      </div>

      {report.photos.length === 0 && (
        <div className="py-32 text-center border-4 border-dashed border-slate-100 rounded-[3rem]">
           <Upload size={64} className="mx-auto text-slate-200 mb-6" />
           <p className="text-xl font-black text-slate-300 uppercase tracking-widest">Nenhuma foto carregada</p>
           <p className="text-xs text-slate-400 font-bold mt-2">Arraste ficheiros ou use o botão superior para começar</p>
        </div>
      )}
    </div>
  );
};

export default EditorFotos;
