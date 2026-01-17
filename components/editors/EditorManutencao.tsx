
import React from 'react';
import { ReportState, MaintenanceData } from '../../types';
import { Wrench, UserCheck, ShieldCheck, FileText, CheckCircle2, Circle, AlertCircle } from 'lucide-react';

interface Props {
  report: ReportState;
  onUpdate: (updates: Partial<ReportState>) => void;
}

const EditorManutencao: React.FC<Props> = ({ report, onUpdate }) => {
  const { maintenance } = report;

  const updateMaintenance = (field: keyof MaintenanceData, value: any) => {
    onUpdate({ maintenance: { ...maintenance, [field]: value } });
  };

  const updateTelas = (field: keyof MaintenanceData['telasFinais'], value: any) => {
    updateMaintenance('telasFinais', { ...maintenance.telasFinais, [field]: value });
  };

  const Input = ({ label, value, onChange, placeholder, icon: Icon }: any) => (
    <div className="relative">
      <label className="block text-[9px] font-black text-slate-400 uppercase mb-1 tracking-wider">{label}</label>
      <div className="relative group">
        {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={16} />}
        <input 
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full ${Icon ? 'pl-10' : 'pl-3'} p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all focus:bg-white`}
        />
      </div>
    </div>
  );

  const Checkbox = ({ label, checked, onChange }: any) => (
    <button 
      onClick={() => onChange(!checked)}
      className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all w-full text-left ${
        checked ? 'bg-blue-50 border-blue-200 text-blue-900 shadow-sm' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'
      }`}
    >
      {checked ? <CheckCircle2 size={18} className="text-blue-600 shrink-0" /> : <Circle size={18} className="text-slate-200 shrink-0" />}
      <span className="text-[11px] font-black uppercase tracking-tight">{label}</span>
    </button>
  );

  return (
    <div className="space-y-8 pb-20">
      <div className="bg-white border rounded-[2rem] p-8 shadow-sm space-y-12">
        <div className="flex items-center justify-between border-b border-slate-100 pb-6">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-blue-600 text-white rounded-2xl shadow-xl shadow-blue-100">
              <Wrench size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">Manutenção e Operação</h2>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Gestão de Ativos e Responsabilidades Técnicas</p>
            </div>
          </div>
          <div className="bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 flex items-center gap-2">
            <AlertCircle size={14} className="text-blue-500" />
            <span className="text-[10px] font-black text-slate-500 uppercase">Capítulo 2 do Relatório</span>
          </div>
        </div>

        {/* 1. Técnicos Responsáveis */}
        <div className="space-y-6">
          <h3 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] flex items-center gap-2 border-b border-blue-50 pb-2">
            <UserCheck size={14} /> Responsáveis Técnicos Designados
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 bg-blue-50/20 border border-blue-100 rounded-[1.5rem] space-y-5 transition-hover hover:bg-blue-50/40">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-black text-blue-900 uppercase bg-blue-100 px-3 py-1 rounded-full">TRM - Manutenção</span>
              </div>
              <Input label="Nome Completo do PQ" value={maintenance.trmNome} onChange={(v: string) => updateMaintenance('trmNome', v)} placeholder="Ex: Eng. João Silva" />
              <Input label="Nº Cédula Profissional" value={maintenance.trmNumero} onChange={(v: string) => updateMaintenance('trmNumero', v)} placeholder="PQXXXXX" />
            </div>
            <div className="p-6 bg-orange-50/20 border border-orange-100 rounded-[1.5rem] space-y-5 transition-hover hover:bg-orange-50/40">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-black text-orange-900 uppercase bg-orange-100 px-3 py-1 rounded-full">TGE - Energia</span>
              </div>
              <Input label="Nome Completo" value={maintenance.tgeNome} onChange={(v: string) => updateMaintenance('tgeNome', v)} placeholder="Ex: Maria Santos" />
              <Input label="Nº Cédula / Registo" value={maintenance.tgeNumero} onChange={(v: string) => updateMaintenance('tgeNumero', v)} />
            </div>
          </div>
        </div>

        {/* 2. Empresa de Manutenção */}
        <div className="space-y-6">
          <h3 className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] flex items-center gap-2 border-b border-emerald-50 pb-2">
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
               <label className="block text-[9px] font-black text-slate-400 uppercase mb-1 tracking-wider">Periodicidade de Intervenção</label>
               <select 
                 value={maintenance.periodicidade}
                 onChange={(e) => updateMaintenance('periodicidade', e.target.value)}
                 className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 transition-all"
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
          <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-2 border-b border-slate-50 pb-2">
            <FileText size={14} /> Documentação Técnica de Apoio e As-Builts
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-4">
               <div className="text-[9px] font-black text-slate-800 uppercase mb-4 tracking-tighter flex items-center gap-2">
                 <div className="w-1 h-1 bg-slate-800 rounded-full" /> Planos e Registos Ativos
               </div>
               <div className="grid grid-cols-1 gap-3">
                 <Checkbox label="Plano de Manutenção Preventiva (PMP)" checked={maintenance.temPMP} onChange={(v: boolean) => updateMaintenance('temPMP', v)} />
                 <Checkbox label="Livro de Ocorrências / Registo Local" checked={maintenance.temLivroOcorrencias} onChange={(v: boolean) => updateMaintenance('temLivroOcorrencias', v)} />
               </div>
            </div>

            <div className="space-y-4">
               <div className="text-[9px] font-black text-slate-800 uppercase mb-4 tracking-tighter flex items-center gap-2">
                 <div className="w-1 h-1 bg-slate-800 rounded-full" /> Existência de Telas Finais (As-Built)
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
                          className="w-full p-3 bg-slate-50 border border-blue-200 rounded-xl text-xs font-bold outline-none italic text-blue-700"
                        />
                     </div>
                   )}
                 </div>
               </div>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-50">
          <label className="block text-[9px] font-black text-slate-400 uppercase mb-3 tracking-wider">Notas Adicionais de Operação de Campo</label>
          <textarea 
            value={maintenance.notasManutencao}
            onChange={(e) => updateMaintenance('notasManutencao', e.target.value)}
            className="w-full p-6 bg-slate-50 border border-slate-200 rounded-[1.5rem] text-sm font-semibold italic text-slate-600 outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all h-32 leading-relaxed"
            placeholder="Registe anomalias recorrentes, histórico de reparações maiores ou o estado geral de conservação da documentação consultada..."
          />
        </div>
      </div>
    </div>
  );
};

export default EditorManutencao;
