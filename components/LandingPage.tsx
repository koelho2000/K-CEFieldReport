import React from 'react';
import { FileCheck, ArrowRight, Building2, Globe, ShieldCheck } from 'lucide-react';

interface Props {
  onStart: () => void;
}

const LandingPage: React.FC<Props> = ({ onStart }) => {
  const currentYear = new Date().getFullYear();
  const currentDate = new Date().toLocaleDateString('pt-PT');

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Elementos decorativos de fundo */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px]" />
      
      <div className="max-w-4xl w-full text-center space-y-12 z-10">
        {/* Logo / Ícone Principal */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500 rounded-3xl blur-2xl opacity-20 animate-pulse" />
            <div className="bg-white/10 backdrop-blur-xl border border-white/10 p-6 rounded-[2.5rem] shadow-2xl relative">
              <FileCheck size={64} className="text-blue-400" />
            </div>
          </div>
        </div>

        {/* Texto de Boas-Vindas */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-[10px] font-black uppercase tracking-[0.3em] mb-4">
            Sistema de Certificação Energética (RECS)
          </div>
          <h1 className="text-6xl md:text-7xl font-black text-white tracking-tighter leading-tight">
            K-SCE <span className="text-blue-500 italic">Field Report</span>
          </h1>
          <p className="text-slate-400 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
            Plataforma profissional para levantamento de campo e geração de relatórios técnicos de auditoria energética em edifícios de serviços.
          </p>
        </div>

        {/* Grid de Funcionalidades Rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left max-w-3xl mx-auto">
          <div className="bg-white/5 border border-white/10 p-5 rounded-2xl space-y-2">
            <div className="text-blue-400 mb-2"><Building2 size={20} /></div>
            <h3 className="text-white font-bold text-sm">Levantamento Estruturado</h3>
            <p className="text-slate-500 text-xs leading-relaxed">Menus otimizados para todos os sistemas técnicos do RECS.</p>
          </div>
          <div className="bg-white/5 border border-white/10 p-5 rounded-2xl space-y-2">
            <div className="text-blue-400 mb-2"><ShieldCheck size={20} /></div>
            <h3 className="text-white font-bold text-sm">Conformidade Legal</h3>
            <p className="text-slate-500 text-xs leading-relaxed">Estrutura de dados alinhada com as exigências da ADENE.</p>
          </div>
          <div className="bg-white/5 border border-white/10 p-5 rounded-2xl space-y-2">
            <div className="text-blue-400 mb-2"><Globe size={20} /></div>
            <h3 className="text-white font-bold text-sm">Exportação Multi-Formato</h3>
            <p className="text-slate-500 text-xs leading-relaxed">Gere PDF, Word ou HTML prontos para integrar no processo.</p>
          </div>
        </div>

        {/* Ação Principal */}
        <div className="pt-4">
          <button 
            onClick={onStart}
            className="group bg-blue-600 hover:bg-blue-500 text-white px-10 py-5 rounded-[2rem] font-black text-lg transition-all shadow-2xl shadow-blue-900/40 flex items-center gap-4 mx-auto active:scale-95"
          >
            Seguir para a aplicação
            <ArrowRight className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Rodapé e Versão */}
        <div className="pt-10 border-t border-white/5 space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 px-4">
            <div className="text-left">
              <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Desenvolvido por</div>
              <div className="text-white font-black text-lg tracking-tight uppercase">Koelho2000</div>
              <a href="https://www.koelho2000.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 text-xs font-bold hover:underline">www.koelho2000.com</a>
            </div>
            
            <div className="flex gap-8">
              <div className="text-right md:text-left">
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Versão</div>
                <div className="text-slate-300 font-bold">v2.5 Pro</div>
              </div>
              <div className="text-right md:text-left">
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Última Atualização</div>
                <div className="text-slate-300 font-bold">{currentDate}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 text-[8px] font-black text-slate-700 uppercase tracking-[1em] opacity-30 select-none">
        Copyright © {currentYear} - Koelho2000 - Todos os direitos reservados
      </div>
    </div>
  );
};

export default LandingPage;