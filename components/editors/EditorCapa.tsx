
import React from 'react';
import { ReportState } from '../../types';
import { Upload, Image as ImageIcon, Building2, User, Landmark, ShieldCheck } from 'lucide-react';

interface InputFieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}

const InputField = ({ label, value, onChange, placeholder, type = "text" }: InputFieldProps) => (
  <div className="space-y-1">
    <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{label}</label>
    <input 
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-semibold dark:text-slate-200 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 transition-all"
    />
  </div>
);

interface Props {
  report: ReportState;
  onUpdate: (updates: Partial<ReportState>) => void;
}

const EditorCapa: React.FC<Props> = ({ report, onUpdate }) => {
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => onUpdate({ coverImage: ev.target?.result as string });
      reader.readAsDataURL(file);
    }
  };

  const handleBuildingChange = (field: keyof typeof report.building, value: string) => {
    onUpdate({ building: { ...report.building, [field]: value } });
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6 transition-colors">
            <h3 className="text-sm font-black text-blue-600 dark:text-blue-400 uppercase flex items-center gap-2 border-b dark:border-slate-800 pb-3">
              <Building2 size={18} /> Identificação do Edifício
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <InputField label="Nome do Edifício" value={report.building.nomeEdificio} onChange={(v) => handleBuildingChange('nomeEdificio', v)} placeholder="Ex: Edifício Atlas" />
              <InputField label="Morada Completa" value={report.building.morada} onChange={(v) => handleBuildingChange('morada', v)} placeholder="Rua, Número, Freguesia..." />
              <div className="grid grid-cols-2 gap-4">
                <InputField label="Ano de Construção" value={report.building.anoConstrucao} onChange={(v) => handleBuildingChange('anoConstrucao', v)} placeholder="Ex: 1998" />
                <InputField label="Data Auditoria" value={report.auditDate} onChange={(v) => onUpdate({ auditDate: v })} type="date" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6 transition-colors">
            <h3 className="text-sm font-black text-orange-600 dark:text-orange-400 uppercase flex items-center gap-2 border-b dark:border-slate-800 pb-3">
              <User size={18} /> Dados do Cliente / Proprietário
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <InputField label="Nome Completo" value={report.building.nomeCliente} onChange={(v) => handleBuildingChange('nomeCliente', v)} />
              <InputField label="Morada Fiscal" value={report.building.clienteMorada} onChange={(v) => handleBuildingChange('clienteMorada', v)} />
              <div className="grid grid-cols-2 gap-4">
                <InputField label="Telefone" value={report.building.telefone} onChange={(v) => handleBuildingChange('telefone', v)} />
                <InputField label="E-mail" value={report.building.email} onChange={(v) => handleBuildingChange('email', v)} />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6 transition-colors">
            <h3 className="text-sm font-black text-emerald-600 dark:text-emerald-400 uppercase flex items-center gap-2 border-b dark:border-slate-800 pb-3">
              <ShieldCheck size={18} /> Dados do Perito Qualificado
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-8">
                <InputField label="Nome do Perito" value={report.building.peritoNome} onChange={(v) => handleBuildingChange('peritoNome', v)} />
              </div>
              <div className="md:col-span-4">
                <InputField label="Nº Perito (PQ)" value={report.building.peritoNumero} onChange={(v) => handleBuildingChange('peritoNumero', v)} />
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-2xl p-6 shadow-sm sticky top-6 transition-colors">
            <h3 className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase mb-4 tracking-widest">Fotografia de Capa</h3>
            <div className="aspect-[3/4] bg-slate-100 dark:bg-slate-800 rounded-2xl overflow-hidden relative flex items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-700 group transition-all hover:border-blue-400 dark:hover:border-blue-400">
              {report.coverImage ? (
                <img src={report.coverImage} className="w-full h-full object-cover" alt="Capa" />
              ) : (
                <div className="text-center p-6">
                  <ImageIcon size={48} className="mx-auto mb-4 text-slate-300 dark:text-slate-700" />
                  <p className="text-xs font-bold text-slate-400 dark:text-slate-600 uppercase">Nenhuma imagem selecionada</p>
                </div>
              )}
              <label className="absolute inset-0 cursor-pointer flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-white dark:bg-slate-700 text-slate-900 dark:text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-2xl scale-90 group-hover:scale-100 transition-transform">
                  <Upload size={20} /> Alterar Imagem
                </div>
                <input type="file" hidden accept="image/*" onChange={handleUpload} />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorCapa;
