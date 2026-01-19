
import React, { useState } from 'react';
import { ReportState, MaintenanceData, PhotoEntry } from '../../types';
import { Wrench, UserCheck, ShieldCheck, FileText, CheckCircle2, Circle, AlertCircle, Plus, X } from 'lucide-react';
import PhotoPicker from './PhotoPicker';

interface InputProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  icon?: any;
}

const Input = ({ label, value, onChange, placeholder, icon: Icon }: InputProps) => (
  <div className="relative">
    <label className="block text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase mb-1 tracking-wider">{label}</label>
    <div className="relative group">
      {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={16} />}
      <input 
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full ${Icon ? 'pl-10' : 'pl-3'} p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold dark:text-slate-200 outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all focus:bg-white dark:focus:bg-slate-900`}
      />
    </div>
  </div>
);

interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: (val: boolean) => void;
}

const Checkbox = ({ label, checked, onChange }: CheckboxProps) => (
  <button 
    onClick={() => onChange(!checked)}
    className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all w-full text-left ${
      checked 
        ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-200 shadow-sm' 
        : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-400 hover:border-slate-200 dark:hover:border-slate-700'
    }`}
  >
    {checked ? <CheckCircle2 size={18} className="text-blue-600 shrink-0" /> : <Circle size={18} className="text-slate-200 shrink-0" />}
    <span className="text-[11px] font-black uppercase tracking-tight">{label}</span>
  </button>
);

interface PhotoEvidenceSectionProps {
  field: 'photoIdsPmp' | 'photoIdsFolhaIntervencao';
  label: string;
  photoIds: string[];
  photos: PhotoEntry[];
  onRemovePhoto: (field: 'photoIdsPmp' | 'photoIdsFolhaIntervencao', id: string) => void;
  onOpenPicker: (field: 'pmp' | 'folha') => void;
}

const PhotoEvidenceSection = ({ field, label, photoIds, photos, onRemovePhoto, onOpenPicker }: PhotoEvidenceSectionProps) => {
  const associatedPhotos = photos.filter(p => photoIds.includes(p.id));
  return (
    <div className="space-y-3">
      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">{label}</label>
      <div className="flex flex-wrap gap-3">
        {associatedPhotos.map(photo => (
          <div key={photo.id} className="relative group/thumb">
            <div className="w-20 h-20 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 overflow-hidden shadow-sm">
              <img src={photo.url} className="w-full h-full object-contain" />
              <div className="absolute top-0 left-0 bg-slate-900/80 text-white text-[7px] px-1 font-black">{photo.code}</div>
            </div>
            <button 
              onClick={() => onRemovePhoto(field, photo.id)}
              className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover/thumb:opacity-100 transition-opacity z-10 shadow-lg"
            >
              <X size={12} />
            </button>
          </div>
        ))}
        <button 
          onClick={() => onOpenPicker(field === 'photoIdsPmp' ? 'pmp' : 'folha')}
          className="w-20 h-20 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 flex flex-col items-center justify-center text-slate-400 hover:border-blue-400 hover:text-blue-500 transition-all group/add"
        >
          <Plus size={20} className="group-hover/add:scale-110 transition-transform" />
          <span className="text-[8px] font-black uppercase mt-1">Associar</span>
        </button>
      </div>
    </div>
  );
};

interface Props {
  report: ReportState;
  onUpdate: (updates: Partial<ReportState>) => void;
}

const EditorManutencao: React.FC<Props> = ({ report, onUpdate }) => {
  const { maintenance } = report;
  const [activePickerField, setActivePickerField] = useState<'pmp' | 'folha' | null>(null);

  const updateMaintenance = (field: keyof MaintenanceData, value: any) => {
    onUpdate({ maintenance: { ...maintenance, [field]: value } });
  };

  const updateTelas = (field: keyof MaintenanceData['telasFinais'], value: any) => {
    updateMaintenance('telasFinais', { ...maintenance.telasFinais, [field]: value });
  };

  const addPhotoToField = (field: 'photoIdsPmp' | 'photoIdsFolhaIntervencao', photoId: string) => {
    const currentIds = maintenance[field] || [];
    if (!currentIds.includes(photoId)) {
      updateMaintenance(field, [...currentIds, photoId]);
    }
  };

  const removePhotoFromField = (field: 'photoIdsPmp' | 'photoIdsFolhaIntervencao', photoId: string) => {
    const currentIds = maintenance[field] || [];
    updateMaintenance(field, currentIds.filter(id => id !== photoId));
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-[2rem] p-8 shadow-sm space-y-12">
        <div className="flex items-center justify-between border-b dark:border-slate-800 border-slate-100 pb-6">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-blue-600 text-white rounded-2xl shadow-xl shadow-blue-100 dark:shadow-none">
              <Wrench size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight">Manutenção e Operação</h2>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest mt-1">Gestão de Ativos e Responsabilidades Técnicas</p>
            </div>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800 px-4 py-2 rounded-xl border border-slate-100 dark:border-slate-700 flex items-center gap-2">
            <AlertCircle size={14} className="text-blue-500" />
            <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase">Capítulo 2 do Relatório</span>
          </div>
        </div>

        {/* 1. Técnicos Responsáveis */}
        <div className="space-y-6">
          <h3 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] flex items-center gap-2 border-b dark:border-slate-800 border-blue-50 pb-2">
            <UserCheck size={14} /> Responsáveis Técnicos Designados
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 bg-blue-50/20 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-[1.5rem] space-y-5 transition-hover hover:bg-blue-50/40 dark:hover:bg-blue-900/20">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-black text-blue-900 dark:text-blue-400 uppercase bg-blue-100 dark:bg-blue-900/40 px-3 py-1 rounded-full">TRM - Manutenção</span>
              </div>
              <Input label="Nome Completo" value={maintenance.trmNome} onChange={(v: string) => updateMaintenance('trmNome', v)} placeholder="Ex: Eng. João Silva" />
              <Input label="Nº Cédula Profissional" value={maintenance.trmNumero} onChange={(v: string) => updateMaintenance('trmNumero', v)} />
            </div>
            <div className="p-6 bg-orange-50/20 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/30 rounded-[1.5rem] space-y-5 transition-hover hover:bg-orange-50/40 dark:hover:bg-orange-900/20">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-black text-orange-900 dark:text-orange-400 uppercase bg-orange-100 dark:bg-orange-900/40 px-3 py-1 rounded-full">TGE - Energia</span>
              </div>
              <Input label="Nome Completo" value={maintenance.tgeNome} onChange={(v: string) => updateMaintenance('tgeNome', v)} placeholder="Ex: Maria Santos" />
              <Input label="Nº Cédula / Registo" value={maintenance.tgeNumero} onChange={(v: string) => updateMaintenance('tgeNumero', v)} />
            </div>
          </div>
        </div>

        {/* 2. Empresa de Manutenção */}
        <div className="space-y-6">
          <h3 className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] flex items-center gap-2 border-b dark:border-slate-800 border-emerald-50 pb-2">
            <ShieldCheck size={14} /> Entidade Exploradora e Periodicidade
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-8">
              <Input label="Nome da Empresa de Manutenção" value={maintenance.empresaNome} onChange={(v: string) => updateMaintenance('empresaNome', v)} placeholder="Designação Social" />
            </div>
            <div className="md:col-span-4">
              <Input label="Nº Alvará / Certificado" value={maintenance.empresaAlvara} onChange={(v: string) => updateMaintenance('empresaAlvara', v)} />
            </div>
            <div className="md:col-span-4">
               <label className="block text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase mb-1 tracking-wider">Periodicidade de Intervenção</label>
               <select 
                 value={maintenance.periodicidade}
                 onChange={(e) => updateMaintenance('periodicidade', e.target.value)}
                 className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold dark:text-slate-200 outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 transition-all"
               >
                 <option>Mensal</option>
                 <option>Bimensal</option>
                 <option>Trimestral</option>
                 <option>Semestral</option>
                 <option>Anual</option>
                 <option>Condicionada / Preditiva</option>
               </select>
            </div>
          </div>
        </div>

        {/* 3. Documentação e Planos */}
        <div className="space-y-8">
          <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-2 border-b dark:border-slate-800 border-slate-50 pb-2">
            <FileText size={14} /> Documentação Técnica de Apoio e As-Builts
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-6">
               <div className="text-[9px] font-black text-slate-800 dark:text-slate-200 uppercase mb-4 tracking-tighter flex items-center gap-2">
                 <div className="w-1 h-1 bg-slate-800 dark:bg-slate-200 rounded-full" /> Planos e Registos Ativos
               </div>
               <div className="grid grid-cols-1 gap-3">
                 <Checkbox label="Plano de Manutenção Preventiva (PMP)" checked={maintenance.temPMP} onChange={(v: boolean) => updateMaintenance('temPMP', v)} />
                 <Checkbox label="Livro de Ocorrências / Registo Local" checked={maintenance.temLivroOcorrencias} onChange={(v: boolean) => updateMaintenance('temLivroOcorrencias', v)} />
               </div>
               
               {/* Novas Evidências Fotográficas */}
               <div className="pt-6 border-t dark:border-slate-800 border-slate-50 space-y-6">
                  <PhotoEvidenceSection 
                    field="photoIdsPmp" 
                    label="Evidências do Plano de Manutenção (PMP)" 
                    photoIds={maintenance.photoIdsPmp || []} 
                    photos={report.photos}
                    onRemovePhoto={removePhotoFromField}
                    onOpenPicker={(f) => setActivePickerField(f)}
                  />
                  <PhotoEvidenceSection 
                    field="photoIdsFolhaIntervencao" 
                    label="Evidências de Folhas de Intervenção" 
                    photoIds={maintenance.photoIdsFolhaIntervencao || []} 
                    photos={report.photos}
                    onRemovePhoto={removePhotoFromField}
                    onOpenPicker={(f) => setActivePickerField(f)}
                  />
               </div>
            </div>

            <div className="space-y-4">
               <div className="text-[9px] font-black text-slate-800 dark:text-slate-200 uppercase mb-4 tracking-tighter flex items-center gap-2">
                 <div className="w-1 h-1 bg-slate-800 dark:bg-slate-200 rounded-full" /> Existência de Telas Finais (As-Built)
               </div>
               <div className="grid grid-cols-2 gap-3">
                 <Checkbox label="Arquitetura" checked={maintenance.telasFinais.arquitetura} onChange={(v: boolean) => updateTelas('arquitetura', v)} />
                 <Checkbox label="AVAC" checked={maintenance.telasFinais.avac} onChange={(v: boolean) => updateTelas('avac', v)} />
                 <Checkbox label="Eletricidade" checked={maintenance.telasFinais.eletricidade} onChange={(v: boolean) => updateTelas('eletricidade', v)} />
                 <Checkbox label="Águas e Esgotos" checked={maintenance.telasFinais.aguasEsgotos} onChange={(v: boolean) => updateTelas('aguasEsgotos', v)} />
                 <div className="col-span-2 mt-2 space-y-2">
                   <Checkbox label="Outros Projetos de Especialidade" checked={maintenance.telasFinais.outros} onChange={(v: boolean) => updateTelas('outros', v)} />
                   {maintenance.telasFinais.outros && (
                     <div className="animate-in slide-in-from-top-2 duration-300">
                        <input 
                          type="text"
                          placeholder="Especifique (ex: SCIE, Gás, Redes IT...)"
                          value={maintenance.telasFinais.outrosSpec}
                          onChange={(e) => updateTelas('outrosSpec', e.target.value)}
                          className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-blue-200 dark:border-blue-900 rounded-xl text-xs font-bold outline-none italic text-blue-700 dark:text-blue-400"
                        />
                     </div>
                   )}
                 </div>
               </div>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t dark:border-slate-800 border-slate-50">
          <label className="block text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase mb-3 tracking-wider">Notas Adicionais de Operação de Campo</label>
          <textarea 
            value={maintenance.notasManutencao}
            onChange={(e) => updateMaintenance('notasManutencao', e.target.value)}
            className="w-full p-6 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[1.5rem] text-sm font-semibold italic text-slate-600 dark:text-slate-300 outline-none focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-blue-500/5 transition-all h-32 leading-relaxed"
            placeholder="Registe anomalias recorrentes, histórico de reparações maiores ou o estado geral de conservação da documentação consultada..."
          />
        </div>
      </div>

      {activePickerField && (
        <PhotoPicker 
          photos={report.photos}
          onSelect={(id) => addPhotoToField(activePickerField === 'pmp' ? 'photoIdsPmp' : 'photoIdsFolhaIntervencao', id)}
          onClose={() => setActivePickerField(null)}
        />
      )}
    </div>
  );
};

export default EditorManutencao;
