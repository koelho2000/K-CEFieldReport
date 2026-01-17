
import React, { useState, useCallback, useRef } from 'react';
import { SectionType, ReportState, INITIAL_MURES, HourlyProfile } from './types';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import EditorCapa from './components/editors/EditorCapa';
import EditorDados from './components/editors/EditorDados';
import EditorManutencao from './components/editors/EditorManutencao';
import EditorEnergia from './components/editors/EditorEnergia';
import EditorLocalizacao from './components/editors/EditorLocalizacao';
import EditorMURES from './components/editors/EditorMURES';
import EditorFotos from './components/editors/EditorFotos';
import EditorPerfis from './components/editors/EditorPerfis';
import EditorPerfisSistemas from './components/editors/EditorPerfisSistemas';
import EditorOcupacao from './components/editors/EditorOcupacao';
import EditorEspacos from './components/editors/EditorEspacos';
import EditorStructured from './components/editors/EditorStructured';
import PrintView from './components/PrintView';
import { Pencil, FileText, Code, FileDown, Copy, Printer, CheckCircle } from 'lucide-react';

const emptyProfile = (): HourlyProfile => ({ daily: Array(24).fill(1), weekly: Array(7).fill(1) });

const INITIAL_STATE: ReportState = {
  auditDate: new Date().toISOString().split('T')[0],
  building: { 
    nomeEdificio: '', morada: '', anoConstrucao: '', nomeCliente: '', clienteMorada: '',
    telefone: '', email: '', artigoMatricial: '', registoConservatoria: '', timIII: '', 
    empresaAVAC: '', cpe: '', pt1_kva: '', pt2_kva: '', identificacaoImovel: '', 
    tipoFracao: '', utilizacao: '', tipoEdificio: '', tipoEdificioOutro: '', inercia: '', 
    pontoCarregamento: '', motivacaoSce: '', dataLicenciamento: '', contextoCertificado: '', 
    peritoNome: 'José Pedro Lopes Coelho', peritoNumero: 'PQ00851'
  },
  location: { coords: '', altitude: '', concelho: '', orientation: 'Norte' },
  maintenance: {
    trmNome: '', trmNumero: '', tgeNome: '', tgeNumero: '', empresaNome: '', empresaAlvara: '',
    temPMP: false, temLivroOcorrencias: false,
    telasFinais: { arquitetura: false, avac: false, eletricidade: false, aguasEsgotos: false, outros: false, outrosSpec: '' },
    periodicidade: 'Mensal', notasManutencao: ''
  },
  energy: {
    fontes: [],
    temPT: false,
    ptCodigo: '',
    ptPotencia: '',
    cpeEletricidade: '',
    temContadoresEnergia: false,
    temContadoresAgua: false,
    temAnalisadores: false,
    temSMM: false,
    notasMonitorizacao: ''
  },
  profiles: { 
    geral: emptyProfile(), 
    sistemas: {
      allSame: true, avac: emptyProfile(), iluminacao: emptyProfile(), outros: emptyProfile()
    },
    ocupacao: { ...emptyProfile(), monthly: Array(12).fill(1) } 
  },
  descricaoChecklist: {},
  descricaoTemperaturas: {},
  descricaoOutros: {},
  descricaoTecnica: '',
  espacosList: [], envolventeList: [], sistemasList: [], aqsList: [], renovaveisList: [], 
  distribuicaoList: [], difusaoList: [], iluminacaoList: [], elevadoresList: [], 
  cozinhasList: [], lavandariaList: [], piscinaList: [], outrosSistemasList: [],
  photos: [],
  mures: INITIAL_MURES,
  currentSection: SectionType.CAPA,
};

const App: React.FC = () => {
  const [report, setReport] = useState<ReportState>(INITIAL_STATE);
  const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit');
  const printRef = useRef<HTMLDivElement>(null);

  const updateReport = useCallback((updates: Partial<ReportState>) => setReport(prev => ({ ...prev, ...updates })), []);

  const handleNew = () => {
    if (confirm('Deseja iniciar um novo relatório? Todos os dados atuais não gravados serão perdidos.')) {
      setReport(INITIAL_STATE);
    }
  };

  const handleSave = () => {
    const data = JSON.stringify(report, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const fileName = `Relatorio_Campo_${report.building.nomeEdificio || 'SemNome'}_${report.auditDate}.json`.replace(/\s+/g, '_');
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleOpen = (data: string) => {
    try {
      const parsed = JSON.parse(data);
      if (parsed.building && parsed.profiles) {
        setReport(parsed);
      } else {
        alert('O ficheiro selecionado não parece ser um relatório válido do SCE PRO.');
      }
    } catch (e) {
      alert('Erro ao ler o ficheiro JSON.');
    }
  };

  const exportHTML = () => {
    if (!printRef.current) return;
    const styles = Array.from(document.querySelectorAll('style')).map(s => s.innerHTML).join('\n');
    const content = printRef.current.innerHTML;
    const fullHtml = `
      <!DOCTYPE html>
      <html lang="pt-PT">
        <head>
          <meta charset="UTF-8">
          <title>Relatório - ${report.building.nomeEdificio || 'Auditoria'}</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>${styles}</style>
        </head>
        <body class="bg-gray-100">
          ${content}
        </body>
      </html>
    `;
    const blob = new Blob([fullHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `KCE_Report_${report.building.nomeEdificio || 'Export'}.html`;
    a.click();
  };

  const exportDoc = () => {
    if (!printRef.current) return;
    const styles = Array.from(document.querySelectorAll('style')).map(s => s.innerHTML).join('\n');
    const content = printRef.current.innerHTML;
    const header = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><meta charset='utf-8'><title>Relatório Auditoria</title><style>${styles}</style></head>
      <body>${content}</body></html>`;
    const blob = new Blob(['\ufeff', header], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Relatorio_${report.building.nomeEdificio || 'Auditoria'}.doc`;
    a.click();
  };

  const copyToClipboard = async () => {
    if (!printRef.current) return;
    try {
      const type = "text/html";
      const blob = new Blob([printRef.current.innerHTML], { type });
      const data = [new ClipboardItem({ [type]: blob })];
      await navigator.clipboard.write(data);
      alert("Relatório copiado para a área de transferência! Pode colá-lo agora no Word ou e-mail.");
    } catch (err) {
      alert("Não foi possível copiar automaticamente. Selecione e copie manualmente.");
    }
  };

  const renderEditor = () => {
    switch (report.currentSection) {
      case SectionType.CAPA: return <EditorCapa report={report} onUpdate={updateReport} />;
      case SectionType.LOCALIZACAO: return <EditorLocalizacao report={report} onUpdate={updateReport} />;
      case SectionType.DADOS_EDIFICIO: return <EditorDados report={report} onUpdate={updateReport} />;
      case SectionType.MANUTENCAO: return <EditorManutencao report={report} onUpdate={updateReport} />;
      case SectionType.ENERGIA: return <EditorEnergia report={report} onUpdate={updateReport} />;
      case SectionType.FOTOS: return <EditorFotos report={report} onUpdate={updateReport} />;
      case SectionType.PERFIS: return (
        <div className="space-y-6">
          <EditorPerfis 
            title="Perfil de Funcionamento Geral" 
            profile={report.profiles.geral} 
            onChange={(v) => updateReport({ profiles: { ...report.profiles, geral: v } })} 
          />
          <EditorPerfisSistemas report={report} onUpdate={updateReport} />
        </div>
      );
      case SectionType.OCUPACAO_PERFIL: return <EditorOcupacao report={report} onUpdate={updateReport} />;
      case SectionType.ESPACOS: return <EditorEspacos report={report} onUpdate={updateReport} />;
      case SectionType.ENVOLVENTE:
        return <EditorStructured title="Envolvente Opaca e Envidraçada" report={report} onUpdate={updateReport} targetPath="envolventeList" options={["Parede", "Cobertura", "Pavimento", "Envidraçado", "Pilar", "Viga"]} />;
      case SectionType.SISTEMAS_CLIM:
        return <EditorStructured showSetpoint title="Produção de Climatização" report={report} onUpdate={updateReport} targetPath="sistemasList" options={["Chiller Só Frio", "Bomba de Calor", "Caldeira Mural", "VRV/VRF", "Multi-Split", "Split Individual", "Compacto", "Rooftop"]} />;
      case SectionType.PRODUCAO_AQS:
        return <EditorStructured showSetpoint title="Produção de AQS e Terminais" report={report} onUpdate={updateReport} targetPath="aqsList" options={["Bomba de Calor AQS", "Termoacumulador Elétrico", "Esquentador a Gás", "Caldeira Mista", "Sistema Solar Térmico", "Depósito de Acumulação", "Duche", "Chuveiro", "Torneira Termostática", "Torneira Monobloco", "Torneira Temporizada", "Torneiras Misturadoras", "Sistema Prevenção Legionella", "Rede de Tubagem Isolada"]} />;
      case SectionType.RENOVAVEIS:
        return <EditorStructured title="Sistemas de Energia Renovável" report={report} onUpdate={updateReport} targetPath="renovaveisList" options={["Fotovoltaico (Autoconsumo)", "Solar Térmico (Plano)", "Solar Térmico (Parabólico)", "Termossifão", "Bomba Calor AQS", "Mini-Eólica"]} />;
      case SectionType.DISTRIBUICAO:
        return <EditorStructured showSetpoint title="Redes de Distribuição" report={report} onUpdate={updateReport} targetPath="distribuicaoList" options={["Bombas Caudal Variável", "Bombas Caudal Constante", "Tubagem Freon Isolada", "Tubagem Água Isolada", "Permutador Ar", "Permutador Água"]} />;
      case SectionType.DIFUSAO:
        return <EditorStructured title="Sistemas de Difusão e Extração" report={report} onUpdate={updateReport} targetPath="difusaoList" options={["UTAN com Recuperação", "UTAN sem Recuperação", "Ventiladores Ar Novo", "Ventiloconvetores", "Teto Arrefecido", "Chão Radiante", "Unidades Indução", "Difusores"]} />;
      case SectionType.ILUMINACAO:
        return <EditorStructured title="Iluminação e Gestão" report={report} onUpdate={updateReport} targetPath="iluminacaoList" options={["LED", "Fluorescente Balastro Eletrónico", "Fluorescente Balastro Metálico", "Lâmpadas de Descarga", "Halogéneo", "Incandescente"]} />;
      case SectionType.ELEVADORES:
        return <EditorStructured title="Sistemas de Elevação" report={report} onUpdate={updateReport} targetPath="elevadoresList" options={["Elevador Elétrico", "Elevador Hidráulico", "Escadas Rolantes"]} />;
      case SectionType.COZINHAS:
        return <EditorStructured title="Equipamentos de Cozinha" report={report} onUpdate={updateReport} targetPath="cozinhasList" options={["Fornos", "Placas Indução", "Fritadeiras", "Frigoríficos", "Hottes Extração"]} />;
      case SectionType.LAVANDARIA:
        return <EditorStructured title="Equipamentos de Lavandaria" report={report} onUpdate={updateReport} targetPath="lavandariaList" options={["Máquina Lavar", "Secadores", "Calandras"]} />;
      case SectionType.PISCINA:
        return <EditorStructured showSetpoint title="Sistemas de Piscina" report={report} onUpdate={updateReport} targetPath="piscinaList" options={["Bombas Filtragem", "Aquecimento Piscina", "Tratamento Água"]} />;
      case SectionType.OUTROS_SISTEMAS:
        return <EditorStructured title="Equipamentos IT e Outros" report={report} onUpdate={updateReport} targetPath="outrosSistemasList" options={["Servidores", "Workstations", "Monitores", "UPS", "Central CCTV"]} />;
      case SectionType.MURES: return <EditorMURES report={report} onUpdate={updateReport} />;
      default: return <div className="p-10 text-center text-gray-400">Página em desenvolvimento...</div>;
    }
  };

  if (viewMode === 'preview') {
    return (
      <div className="bg-slate-900 min-h-screen pb-20">
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-2 bg-white/90 backdrop-blur-md p-2 rounded-2xl shadow-2xl border border-white/20 no-print">
          <button onClick={() => setViewMode('edit')} className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2.5 rounded-xl font-black text-xs transition-all uppercase">
            <Pencil size={16} /> Editar
          </button>
          <div className="w-px h-6 bg-slate-200 mx-1" />
          <button onClick={() => window.print()} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-black text-xs transition-all uppercase shadow-lg shadow-blue-200">
            <Printer size={16} /> PDF
          </button>
          <button onClick={exportHTML} className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2.5 rounded-xl font-black text-xs transition-all uppercase shadow-lg shadow-amber-200">
            <Code size={16} /> HTML
          </button>
          <button onClick={exportDoc} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl font-black text-xs transition-all uppercase shadow-lg shadow-emerald-200">
            <FileDown size={16} /> DOC
          </button>
          <button onClick={copyToClipboard} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl font-black text-xs transition-all uppercase shadow-lg shadow-indigo-200">
            <Copy size={16} /> Copiar
          </button>
        </div>
        <div ref={printRef} className="pt-20">
          <PrintView report={report} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar 
        currentSection={report.currentSection} 
        onSelect={(s) => updateReport({ currentSection: s })} 
        onNew={handleNew}
        onSave={handleSave}
        onOpen={handleOpen}
        report={report}
      />
      <main className="flex-1 flex flex-col overflow-hidden bg-slate-50">
        <Header title={report.currentSection} onPreview={() => setViewMode('preview')} />
        <div className="flex-1 overflow-y-auto p-6 md:p-10">
          <div className="max-w-6xl mx-auto">{renderEditor()}</div>
        </div>
      </main>
    </div>
  );
};

export default App;
