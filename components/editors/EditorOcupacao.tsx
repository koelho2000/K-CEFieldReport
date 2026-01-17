
import React from 'react';
import { ReportState } from '../../types';
import EditorPerfis from './EditorPerfis';
import { Users, CalendarDays, TrendingUp, Info, BarChart3 } from 'lucide-react';

interface Props {
  report: ReportState;
  onUpdate: (updates: Partial<ReportState>) => void;
}

const EditorOcupacao: React.FC<Props> = ({ report, onUpdate }) => {
  const { ocupacao } = report.profiles;
  const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

  const handleMonthlyChange = (index: number, value: number) => {
    const clampedVal = Math.min(1, Math.max(0, value / 100));
    const newMonthly = [...ocupacao.monthly];
    newMonthly[index] = clampedVal;
    onUpdate({ profiles: { ...report.profiles, ocupacao: { ...ocupacao, monthly: newMonthly } } });
  };

  // Cálculos do Fator de Ocupação Composto
  const dailyFactor = ocupacao.daily.reduce((a, b) => a + b, 0) / 24;
  const weeklyFactor = ocupacao.weekly.reduce((a, b) => a + b, 0) / 7;
  const monthlyFactor = ocupacao.monthly.reduce((a, b) => a + b, 0) / 12;
  
  const annualFactor = dailyFactor * weeklyFactor * monthlyFactor * 100;

  return (
    <div className="space-y-8">
      {/* Top Banner - Resumo */}
      <div className="bg-white border rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-center justify-between border-orange-100 gap-6">
        <div className="flex items-center gap-3">
          <div className="p-4 bg-orange-600 text-white rounded-2xl shadow-xl shadow-orange-100">
            <Users size={28} />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">Análise de Ocupação</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Modelagem Temporal Multi-Fator (RECS)</p>
          </div>
        </div>
        
        <div className="flex gap-4">
            <div className="bg-slate-50 border border-slate-200 px-6 py-3 rounded-2xl text-center hidden lg:block">
                <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Carga Horária x Semanal</div>
                <div className="text-lg font-black text-slate-700">{(dailyFactor * weeklyFactor * 100).toFixed(1)}%</div>
            </div>
            <div className="bg-slate-900 text-white px-8 py-4 rounded-3xl shadow-2xl flex items-center gap-4 border-b-4 border-orange-600">
              <TrendingUp size={24} className="text-orange-500" />
              <div>
                <div className="text-[10px] font-black uppercase tracking-widest opacity-60">Fator Ocupação Anual Final</div>
                <div className="text-3xl font-black text-white">{annualFactor.toFixed(1)}%</div>
              </div>
            </div>
        </div>
      </div>

      {/* Editor de Perfis Horários e Semanais */}
      <EditorPerfis 
        title="1. Distribuição de Carga Horária e Semanal" 
        profile={ocupacao} 
        onChange={(v) => onUpdate({ profiles: { ...report.profiles, ocupacao: { ...ocupacao, ...v } } })} 
      />

      {/* Inputs Mensais */}
      <div className="bg-white border rounded-3xl p-8 shadow-sm space-y-10 border-slate-100">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 className="text-sm font-black text-slate-600 uppercase tracking-widest flex items-center gap-3">
              <CalendarDays className="text-orange-500" size={20} /> 2. Sazonalidade Mensal da Atividade
            </h3>
            <div className="flex items-center gap-2">
               <span className="text-[9px] font-black text-slate-400 uppercase">Média:</span>
               <span className="text-xs bg-orange-50 text-orange-700 font-black px-4 py-1 rounded-full border border-orange-100 italic">{(monthlyFactor * 100).toFixed(1)}%</span>
            </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {months.map((month, i) => (
            <div key={month} className="space-y-3 bg-slate-50/50 p-4 rounded-2xl border border-slate-100 transition-all hover:bg-white hover:shadow-xl hover:border-orange-200 group">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-orange-600">{month}</span>
                <span className="text-xs font-black text-slate-700">{Math.round(ocupacao.monthly[i] * 100)}%</span>
              </div>
              <input 
                type="range" 
                min="0"
                max="100"
                step="5"
                value={Math.round(ocupacao.monthly[i] * 100)}
                onChange={(e) => handleMonthlyChange(i, parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
              />
            </div>
          ))}
        </div>

        {/* GRÁFICO FINAL - TODA A LARGURA NO RODAPÉ */}
        <div className="pt-10 border-t border-slate-100 space-y-6">
          <div className="flex items-center justify-center gap-3">
             <div className="h-px bg-slate-100 flex-1" />
             <div className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">
               <BarChart3 size={16} className="text-orange-500" /> Variação Anual Consolidada
             </div>
             <div className="h-px bg-slate-100 flex-1" />
          </div>

          <div className="bg-slate-50 border border-slate-200 p-8 rounded-[2rem] h-64 flex items-end gap-3 md:gap-6 relative group overflow-hidden">
            {/* Grid Lines */}
            <div className="absolute inset-x-8 inset-y-8 flex flex-col justify-between pointer-events-none opacity-20">
               <div className="h-px bg-slate-300 w-full" />
               <div className="h-px bg-slate-300 w-full" />
               <div className="h-px bg-slate-300 w-full" />
               <div className="h-px bg-slate-300 w-full" />
            </div>

            {/* Scale Labels */}
            <div className="absolute left-3 top-8 bottom-8 flex flex-col justify-between text-[8px] font-black text-slate-300 uppercase tracking-tighter">
              <span>100%</span>
              <span>75%</span>
              <span>50%</span>
              <span>25%</span>
              <span>0%</span>
            </div>

            {ocupacao.monthly.map((val, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-3 h-full justify-end group/bar z-10">
                <div 
                  className="w-full bg-gradient-to-t from-orange-600 to-orange-400 rounded-t-xl transition-all duration-700 relative shadow-lg group-hover/bar:from-orange-700 group-hover/bar:to-orange-500 group-hover/bar:shadow-orange-200"
                  style={{ height: `${val * 100}%` }}
                >
                   <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-black px-2 py-1 rounded-lg opacity-0 group-hover/bar:opacity-100 transition-all transform group-hover/bar:-translate-y-1 shadow-xl whitespace-nowrap">
                     {Math.round(val * 100)}% de Carga
                   </div>
                </div>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">{months[i]}</span>
              </div>
            ))}
          </div>

          <div className="bg-blue-50/50 p-6 rounded-3xl flex gap-5 items-start border border-blue-100 max-w-4xl mx-auto">
            <Info className="text-blue-500 shrink-0 mt-0.5" size={24} />
            <div className="space-y-2">
              <p className="text-xs text-blue-900 font-black uppercase tracking-widest">Metodologia de Auditoria SCE</p>
              <p className="text-[11px] text-blue-800 leading-relaxed italic">
                O gráfico acima visualiza o produto das probabilidades de utilização. Este rigor permite ao Perito Qualificado ajustar os perfis teóricos do edifício à <strong>realidade operacional</strong> observada em campo, influenciando diretamente a classe energética final no certificado.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorOcupacao;
