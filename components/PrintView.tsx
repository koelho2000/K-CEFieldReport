
import React from 'react';
import { ReportState, TechnicalElement, PhotoEntry, SpaceElement, SectionType, HourlyProfile } from '../types';

interface Props {
  report: ReportState;
}

const ChapterPage: React.FC<{ 
  children: React.ReactNode; 
  title: string; 
  chapterNumber: number;
  footerAnalysis: string;
  buildingName: string;
  auditDate: string;
}> = ({ children, title, chapterNumber, footerAnalysis, buildingName, auditDate }) => (
  <div className="a4-page page-break relative flex flex-col p-[15mm]">
    {/* Header */}
    <div className="flex justify-between items-end border-b-2 border-slate-900 pb-2 mb-8">
      <div>
        <div className="text-[10px] font-black text-blue-900 uppercase tracking-widest">Capítulo {chapterNumber}</div>
        <div className="text-xl font-black text-slate-800 uppercase tracking-tight">{title}</div>
      </div>
      <div className="text-[9px] font-bold text-slate-400 italic">K-CE Field Report v2.5</div>
    </div>

    {/* Content */}
    <div className="flex-1 overflow-hidden">
      {children}
    </div>

    {/* Footer Analysis Area */}
    <div className="mt-8 pt-4 border-t border-slate-200">
      <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
        <h4 className="text-[9px] font-black text-blue-900 uppercase mb-2 flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" /> 
          Análise Técnica e Notas de Auditoria
        </h4>
        <p className="text-[10px] text-slate-600 leading-relaxed italic">
          {footerAnalysis || "Não foram registadas observações críticas adicionais para este capítulo durante a visita ao local. Os elementos encontram-se em conformidade com o reportado nas tabelas técnicas acima."}
        </p>
      </div>
      <div className="mt-4 flex justify-between items-center text-[7px] font-black text-slate-400 uppercase tracking-[0.2em]">
        <div className="flex gap-4 items-center">
          <span className="text-slate-600">{buildingName || 'EDIFÍCIO NÃO IDENTIFICADO'}</span>
          <span className="text-slate-200">|</span>
          <span>{auditDate}</span>
        </div>
        <div className="flex gap-4 items-center">
          <span>© SCE - PORTUGAL</span>
          <span className="w-1 h-1 bg-slate-300 rounded-full" />
          <span className="text-blue-900">PÁGINA {chapterNumber + 2}</span>
        </div>
      </div>
    </div>
  </div>
);

const DataRow: React.FC<{ label: string; value: string | undefined; highlight?: boolean }> = ({ label, value, highlight }) => (
  <div className="flex justify-between border-b border-slate-100 py-1.5 text-[10px]">
    <span className="text-slate-400 font-bold uppercase shrink-0 mr-4">{label}:</span>
    <span className={`text-right font-black ${highlight ? 'text-blue-700' : 'text-slate-800'}`}>{value || '---'}</span>
  </div>
);

const ProfileAnalysisBlock: React.FC<{ 
  title: string; 
  activeHours: number; 
  weeklyDays: number;
  description: string;
  colorClass: string;
}> = ({ title, activeHours, weeklyDays, description, colorClass }) => (
  <div className="mt-2 p-3 bg-slate-50 border border-slate-100 rounded-lg">
    <div className="flex justify-between items-center mb-2 border-b border-slate-200 pb-1">
      <span className={`text-[9px] font-black uppercase ${colorClass}`}>{title}</span>
      <div className="flex gap-3 text-[8px] font-bold text-slate-500 uppercase">
        <span>Carga: {activeHours}h/dia</span>
        <span>Freq: {weeklyDays} dias/sem</span>
      </div>
    </div>
    <p className="text-[9px] text-slate-600 italic leading-relaxed">
      {description}
    </p>
  </div>
);

const MiniProfileChart: React.FC<{ profile: HourlyProfile, label: string, color: string }> = ({ profile, label, color }) => {
  const activeHours = profile.daily.filter(v => v === 1).length;
  return (
    <div className="bg-white border p-3 rounded-xl shadow-sm">
      <div className="flex justify-between items-center mb-2">
        <span className="text-[8px] font-black uppercase text-slate-400">{label}</span>
        <span className="text-[9px] font-bold text-slate-700">{activeHours}h Ativas</span>
      </div>
      <div className="h-10 flex items-end gap-0.5 bg-slate-50 px-1 py-0.5 border rounded">
        {profile.daily.map((v, i) => (
          <div key={i} className={`flex-1 transition-all ${v === 1 ? color : 'bg-slate-100 h-[1px]'}`} style={{ height: v === 1 ? '100%' : '1px' }} />
        ))}
      </div>
    </div>
  );
};

const TechnicalTable: React.FC<{ 
  list: TechnicalElement[], 
  title: string, 
  isEnvolvente?: boolean,
  allPhotos: PhotoEntry[]
}> = ({ list, title, isEnvolvente, allPhotos }) => (
  list.length > 0 ? (
    <div className="mb-6">
      <h3 className="text-[9px] font-black bg-slate-100 text-slate-600 p-1 px-2 mb-2 uppercase tracking-widest border-l-4 border-blue-900">{title}</h3>
      <table className="w-full text-[9px] border-collapse">
        <thead className="bg-slate-50">
          <tr>
            <th className="border p-1 text-left">Elemento/Tipo</th>
            <th className="border p-1 text-center w-16">Local./Estado</th>
            <th className="border p-1 text-left">Especificações Técnicas e Evidências</th>
          </tr>
        </thead>
        <tbody>
          {list.map(el => {
            const isEnvidracado = el.type === 'Envidraçado';
            let specs = el.description || '';
            const associatedPhotos = allPhotos.filter(p => el.photoIds?.includes(p.id));
            
            if (isEnvolvente && isEnvidracado) {
              specs = `Vidro: ${el.vidroTipo}; Caix.: ${el.caixilhariaTipo} (${el.corteTermico} CT); Prot.: ${el.protecao}${el.protecao === 'Com' ? ` (${el.protecaoTipo})` : ''}. ${specs}`;
            }

            return (
              <tr key={el.id}>
                <td className="border p-1 font-bold uppercase">{el.type === 'Outro' ? el.customType : el.type}</td>
                <td className="border p-1 text-center">
                  <div className="font-black text-blue-900">{el.posicao || '---'}</div>
                  <div className="text-[8px] text-slate-400">{el.estado}</div>
                </td>
                <td className="border p-1">
                  <div className="text-slate-500 italic mb-2">{specs || '---'}</div>
                  {associatedPhotos.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {associatedPhotos.map(p => (
                        <div key={p.id} className="w-14 h-14 border rounded bg-white overflow-hidden relative">
                          <img src={p.url} className="w-full h-full object-contain" />
                          <div className="absolute top-0 left-0 bg-black/60 text-white text-[5px] px-0.5 font-bold">{p.code}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  ) : null
);

const PrintView: React.FC<Props> = ({ report }) => {
  const { building, location, maintenance, energy, profiles, photos, floorPlans, mures } = report;

  const activeChapters = [
    { id: 'identificacao', title: "Identificação e Enquadramento Legal", active: true },
    { id: 'plantas', title: "Plantas Gerais do Edifício", active: (floorPlans || []).length > 0 },
    { id: 'manutencao', title: "Manutenção e Operação do Edifício", active: maintenance.empresaNome || maintenance.trmNome },
    { id: 'energia', title: "Infraestrutura de Energia e Monitorização", active: energy.fontes.length > 0 || energy.temPT },
    { id: 'perfis', title: "Perfis de Funcionamento e Ocupação", active: true },
    { id: 'envolvente', title: "Caracterização da Envolvente Técnica", active: report.envolventeList.length > 0 },
    { id: 'climatizacao', title: "Sistemas de Climatização (AVAC)", active: report.sistemasList.length > 0 },
    { id: 'aqs', title: "Produção de Águas Quentes Sanitárias (AQS)", active: report.aqsList.length > 0 },
    { id: 'renovaveis', title: "Sistemas de Energia Renovável", active: report.renovaveisList.length > 0 },
    { id: 'distribuicao', title: "Redes de Distribuição Térmica", active: report.distribuicaoList.length > 0 },
    { id: 'difusao', title: "Sistemas de Difusão e Ventilação", active: report.difusaoList.length > 0 },
    { id: 'iluminacao', title: "Sistemas de Iluminação e Gestão", active: report.iluminacaoList.length > 0 },
    { id: 'elevacao', title: "Sistemas de Elevação e Transporte", active: report.elevadoresList.length > 0 },
    { id: 'cozinhas', title: "Cozinhas e Lavandarias Industriais", active: report.cozinhasList.length > 0 || report.lavandariaList.length > 0 },
    { id: 'outros', title: "Piscinas e Outros Sistemas Técnicos", active: report.piscinaList.length > 0 || report.outrosSistemasList.length > 0 },
    { id: 'mures', title: "Medidas de Melhoria (MURES)", active: mures.some(m => m.checked) },
    { id: 'fotos', title: "Anexo I - Registo Fotográfico de Campo", active: photos.length > 0 }
  ].filter(c => c.active);

  const getChapterNumber = (id: string) => activeChapters.findIndex(c => c.id === id) + 1;
  const formattedAuditDate = new Date(report.auditDate).toLocaleDateString('pt-PT');
  const buildingNameShort = building.nomeEdificio || 'Edifício sem nome';

  const dailyFactor = profiles.ocupacao.daily.reduce((a, b) => a + b, 0) / 24;
  const weeklyFactor = profiles.ocupacao.weekly.reduce((a, b) => a + b, 0) / 7;
  const monthlyFactor = profiles.ocupacao.monthly.reduce((a, b) => a + b, 0) / 12;
  const annualFactor = dailyFactor * weeklyFactor * monthlyFactor * 100;

  const getDailyAnalysis = (p: number[]) => {
    const hours = p.filter(v => v === 1).length;
    if (hours > 12) return "Perfil de funcionamento intensivo, com operação alargada além do horário comercial padrão, indicando elevada carga térmica latente.";
    if (hours > 8) return "Funcionamento em horário comercial standard. A carga térmica concentra-se no período diurno, com standby noturno verificado.";
    return "Utilização intermitente ou reduzida. O edifício apresenta períodos de inatividade significativos durante o dia.";
  };

  const getSystemAnalysis = (label: string, p: number[]) => {
    const hours = p.filter(v => v === 1).length;
    return `O sistema de ${label} apresenta uma utilização de ${hours}h/dia. ${hours > 0 ? 'A carga nominal é coincidente com o perfil de ocupação principal.' : 'Sistema identificado como redundante ou de utilização pontual.'}`;
  };

  return (
    <div className="font-sans text-slate-900 leading-tight bg-slate-200 py-10 print:py-0 print:bg-white">
      
      {/* 1. CAPA */}
      <div className="a4-page page-break flex flex-col justify-between border-[15mm] border-blue-900 p-0 relative overflow-hidden bg-white">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-900 origin-bottom-left rotate-45 translate-x-16 -translate-y-16" />
        
        <div className="p-[20mm] pt-[30mm] text-center">
          <div className="text-[12px] font-black text-blue-900 tracking-[0.5em] mb-6 uppercase">Sistema de Certificação Energética</div>
          <div className="h-1 w-20 bg-blue-900 mx-auto mb-10" />
          <h1 className="text-5xl font-black text-slate-800 mb-4 leading-tight uppercase tracking-tighter">Relatório de Campo</h1>
          <h2 className="text-xl font-bold text-slate-500 uppercase tracking-widest mb-16 italic">Auditoria Técnica de Edifícios de Serviços</h2>
          
          <div className="w-full aspect-video border-[8px] border-slate-900 shadow-2xl mx-auto mb-16 flex items-center justify-center bg-slate-100 overflow-hidden relative group">
            {report.coverImage ? (
              <img src={report.coverImage} className="w-full h-full object-cover" alt="Capa" />
            ) : (
              <div className="text-slate-300 italic font-black text-2xl uppercase">Imagem Principal do Imóvel</div>
            )}
            <div className="absolute bottom-4 right-4 bg-blue-900 text-white px-4 py-2 font-black text-[10px] uppercase">Visita Realizada em {formattedAuditDate}</div>
          </div>

          <div className="text-3xl font-black text-blue-900 uppercase mb-2 tracking-tight">
            {building.nomeEdificio || '--- Nome do Edifício ---'}
          </div>
          <div className="text-md font-bold text-slate-600 uppercase italic">
            {building.morada || '--- Localização não especificada ---'}
          </div>
        </div>
        
        <div className="bg-slate-900 text-white p-[15mm] grid grid-cols-2 gap-10">
          <div>
            <div className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-2">Preparado por:</div>
            <div className="text-lg font-black uppercase">{building.peritoNome}</div>
            <div className="text-xs font-bold text-slate-400 uppercase">Perito Qualificado RECS - {building.peritoNumero}</div>
          </div>
          <div className="text-right">
            <div className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-2">Cliente:</div>
            <div className="text-lg font-black uppercase truncate">{building.nomeCliente || '---'}</div>
            <div className="text-xs font-bold text-slate-400 uppercase">ID Imóvel: {building.artigoMatricial || '---'}</div>
          </div>
        </div>
      </div>

      {/* 2. ÍNDICE DINÂMICO */}
      <div className="a4-page page-break bg-white p-[20mm] flex flex-col">
        <h2 className="text-3xl font-black text-blue-900 uppercase border-b-4 border-blue-900 pb-4 mb-10">Índice Geral</h2>
        <div className="flex-1 space-y-3">
          {activeChapters.map((item, index) => (
            <div key={item.id} className="flex items-end gap-4 group">
              <span className="text-blue-900 font-black text-xs w-8">{index + 1}.</span>
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-tight flex-1 border-b border-dotted border-slate-300 pb-0.5">{item.title}</span>
              <span className="text-blue-900 font-black text-xs">{(index + 3).toString().padStart(2, '0')}</span>
            </div>
          ))}
        </div>
        <div className="mt-10 p-6 border-2 border-dashed border-slate-100 rounded-3xl text-center">
          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em]">Documento técnico de apoio à emissão de Certificado Energético (RECS)</p>
        </div>
      </div>

      {/* Identificação e Enquadramento Legal */}
      <ChapterPage 
        chapterNumber={getChapterNumber('identificacao')} 
        title="Identificação e Enquadramento Legal" 
        footerAnalysis={report.descricaoTecnica}
        buildingName={buildingNameShort}
        auditDate={formattedAuditDate}
      >
        <div className="space-y-8">
          
          {/* 1.1 Identificação do Edifício (De Capa) */}
          <section>
            <h3 className="text-xs font-black text-blue-900 uppercase border-b-2 border-blue-900 pb-1 mb-3">1.1 Identificação e Registos</h3>
            <div className="grid grid-cols-2 gap-x-12 gap-y-1">
              <DataRow label="Nome do Edifício" value={building.nomeEdificio} highlight />
              <DataRow label="Morada" value={building.morada} />
              <DataRow label="Ano de Construção" value={building.anoConstrucao} />
              <DataRow label="Data da Auditoria" value={formattedAuditDate} />
              <DataRow label="Artigo Matricial" value={building.artigoMatricial} />
              <DataRow label="Conservatória" value={building.registoConservatoria} />
              <DataRow label="TIM III (Nº Registo)" value={building.timIII} />
              <DataRow label="CPE Eletricidade" value={building.cpe} />
            </div>
          </section>

          {/* 1.2 Dados do Proprietário e Perito (De Capa) */}
          <section>
            <h3 className="text-xs font-black text-blue-900 uppercase border-b-2 border-blue-900 pb-1 mb-3">1.2 Intervenientes Técnicos e Administrativos</h3>
            <div className="grid grid-cols-2 gap-x-12 gap-y-1">
              <DataRow label="Proprietário / Cliente" value={building.nomeCliente} highlight />
              <DataRow label="Morada Fiscal" value={building.clienteMorada} />
              <DataRow label="Contacto Telefónico" value={building.telefone} />
              <DataRow label="E-mail de Contacto" value={building.email} />
              <DataRow label="Perito Qualificado" value={building.peritoNome} />
              <DataRow label="Nº Perito (PQ)" value={building.peritoNumero} />
              <DataRow label="Empresa Resp. AVAC" value={building.empresaAVAC} />
            </div>
          </section>

          {/* 1.3 Caracterização RECS (De Dados Gerais) */}
          <section>
            <h3 className="text-xs font-black text-blue-900 uppercase border-b-2 border-blue-900 pb-1 mb-3">1.3 Caracterização Técnica e Legal (RECS)</h3>
            <div className="grid grid-cols-2 gap-x-12 gap-y-1">
              <DataRow label="Identificação Imóvel" value={building.identificacaoImovel} />
              <DataRow label="Tipo de Edifício (RECS)" value={building.tipoEdificio === 'Outros' ? building.tipoEdificioOutro : building.tipoEdificio} highlight />
              <DataRow label="Tipo de Fração" value={building.tipoFracao} />
              <DataRow label="Utilização Predominante" value={building.utilizacao} />
              <DataRow label="Inércia Térmica" value={building.inercia} />
              <DataRow label="Motivação do SCE" value={building.motivacaoSce} />
              <DataRow label="Regime Licenciamento" value={building.dataLicenciamento} />
              <DataRow label="Contexto Certificado" value={building.contextoCertificado} />
              <DataRow label="Ponto de Carregamento" value={building.pontoCarregamento} />
              <DataRow label="Altitude (m)" value={location.altitude} />
              <DataRow label="Concelho" value={location.concelho} />
              <DataRow label="Coordenadas GPS" value={location.coords} />
            </div>
          </section>

          {/* 1.4 Implantação Geográfica */}
          <div className="mt-4 border-2 border-slate-100 rounded-2xl overflow-hidden aspect-video relative shadow-sm">
            {location.googleEarthImage ? (
              <img src={location.googleEarthImage} className="w-full h-full object-cover" alt="Earth" />
            ) : (
              <div className="w-full h-full bg-slate-50 flex items-center justify-center text-[10px] text-slate-300 italic uppercase font-black">Implantação no Terreno (Google Earth) não carregada</div>
            )}
            <div className="absolute top-4 left-4 bg-blue-900/80 text-white px-3 py-1 text-[8px] font-black uppercase rounded shadow-lg backdrop-blur-sm">Orientação Solar: {location.orientation}</div>
          </div>
        </div>
      </ChapterPage>

      {/* Plantas Gerais */}
      {activeChapters.some(c => c.id === 'plantas') && (
        <ChapterPage 
          chapterNumber={getChapterNumber('plantas')} 
          title="Plantas Gerais do Edifício" 
          footerAnalysis={`Foram consultadas ${(floorPlans || []).length} plantas do edifício para apoio ao levantamento métrico e identificação de zonas térmicas.`}
          buildingName={buildingNameShort}
          auditDate={formattedAuditDate}
        >
          <div className="space-y-12">
            {(floorPlans || []).map((plan, idx) => (
              <div key={plan.id} className="space-y-3">
                <div className="text-[10px] font-black text-slate-800 uppercase tracking-widest border-l-4 border-indigo-600 pl-2">
                  Planta {idx + 1}: {plan.caption}
                </div>
                <div className="border border-slate-200 rounded-xl bg-slate-50 overflow-hidden flex items-center justify-center min-h-[100mm] max-h-[150mm]">
                  {plan.type === 'pdf' ? (
                    <div className="text-center p-20 text-slate-400">
                      <div className="text-indigo-600 font-black mb-2">DOCUMENTO PDF</div>
                      <div className="text-[9px] uppercase">{plan.name}</div>
                    </div>
                  ) : (
                    <img src={plan.url} className="max-w-full max-h-full object-contain" alt={plan.caption} />
                  )}
                </div>
              </div>
            ))}
          </div>
        </ChapterPage>
      )}

      {/* Manutenção */}
      {activeChapters.some(c => c.id === 'manutencao') && (
        <ChapterPage 
          chapterNumber={getChapterNumber('manutencao')} 
          title="Manutenção e Operação do Edifício" 
          footerAnalysis={`Verificada a conformidade dos registos de manutenção. Empresa: ${maintenance.empresaNome || '---'}. Técnicos: TRM ${maintenance.trmNome || '---'} / TGE ${maintenance.tgeNome || '---'}.`}
          buildingName={buildingNameShort}
          auditDate={formattedAuditDate}
        >
          <div className="grid grid-cols-2 gap-8">
            <section className="space-y-4">
              <h3 className="text-xs font-black text-blue-900 uppercase border-b pb-1">Responsáveis Técnicos</h3>
              <div className="space-y-2 text-[10px]">
                <div className="flex justify-between border-b border-slate-50 pb-1">
                  <span className="text-slate-400 font-bold uppercase">TRM:</span>
                  <span className="font-black text-slate-800">{maintenance.trmNome || '---'} ({maintenance.trmNumero || '---'})</span>
                </div>
                <div className="flex justify-between border-b border-slate-50 pb-1">
                  <span className="text-slate-400 font-bold uppercase">TGE:</span>
                  <span className="font-black text-slate-800">{maintenance.tgeNome || '---'} ({maintenance.tgeNumero || '---'})</span>
                </div>
                <div className="flex justify-between border-b border-slate-50 pb-1">
                  <span className="text-slate-400 font-bold uppercase">Empresa:</span>
                  <span className="font-black text-slate-800">{maintenance.empresaNome || '---'} (Alv. {maintenance.empresaAlvara || '---'})</span>
                </div>
              </div>
            </section>
            <section className="space-y-4">
              <h3 className="text-xs font-black text-blue-900 uppercase border-b pb-1">Planos e Auditoria</h3>
              <div className="space-y-2 text-[10px]">
                <div className="flex justify-between border-b border-slate-50 pb-1">
                  <span className="text-slate-400 font-bold uppercase">Plano Manut. (PMP):</span>
                  <span className={`font-black ${maintenance.temPMP ? 'text-emerald-600' : 'text-red-500'}`}>{maintenance.temPMP ? 'SIM (CONSULTADO)' : 'NÃO DISPONÍVEL'}</span>
                </div>
                <div className="flex justify-between border-b border-slate-50 pb-1">
                  <span className="text-slate-400 font-bold uppercase">Livro Ocorrências:</span>
                  <span className={`font-black ${maintenance.temLivroOcorrencias ? 'text-emerald-600' : 'text-red-500'}`}>{maintenance.temLivroOcorrencias ? 'SIM (ATUALIZADO)' : 'NÃO IDENTIFICADO'}</span>
                </div>
                <div className="flex justify-between border-b border-slate-50 pb-1">
                  <span className="text-slate-400 font-bold uppercase">Periodicidade:</span>
                  <span className="font-black text-slate-800 uppercase">{maintenance.periodicidade}</span>
                </div>
              </div>
            </section>
            
            {/* Novas Evidências Fotográficas de Manutenção */}
            {(maintenance.photoIdsPmp?.length || 0) + (maintenance.photoIdsFolhaIntervencao?.length || 0) > 0 && (
              <section className="col-span-2 space-y-4 pt-4 border-t border-slate-100">
                <h3 className="text-xs font-black text-blue-900 uppercase border-b pb-1">Evidências de Auditoria de Manutenção</h3>
                <div className="grid grid-cols-2 gap-4">
                  {maintenance.photoIdsPmp && maintenance.photoIdsPmp.length > 0 && (
                    <div className="space-y-2">
                       <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Registos de PMP</span>
                       <div className="flex flex-wrap gap-2">
                          {photos.filter(p => maintenance.photoIdsPmp?.includes(p.id)).map(p => (
                            <div key={p.id} className="w-20 h-20 border rounded bg-white overflow-hidden relative shadow-sm">
                               <img src={p.url} className="w-full h-full object-contain" />
                               <div className="absolute top-0 left-0 bg-blue-900/80 text-white text-[6px] px-1 font-black">{p.code}</div>
                            </div>
                          ))}
                       </div>
                    </div>
                  )}
                  {maintenance.photoIdsFolhaIntervencao && maintenance.photoIdsFolhaIntervencao.length > 0 && (
                    <div className="space-y-2">
                       <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Folhas de Intervenção</span>
                       <div className="flex flex-wrap gap-2">
                          {photos.filter(p => maintenance.photoIdsFolhaIntervencao?.includes(p.id)).map(p => (
                            <div key={p.id} className="w-20 h-20 border rounded bg-white overflow-hidden relative shadow-sm">
                               <img src={p.url} className="w-full h-full object-contain" />
                               <div className="absolute top-0 left-0 bg-blue-900/80 text-white text-[6px] px-1 font-black">{p.code}</div>
                            </div>
                          ))}
                       </div>
                    </div>
                  )}
                </div>
              </section>
            )}

            <section className="col-span-2 space-y-4">
              <h3 className="text-xs font-black text-blue-900 uppercase border-b pb-1">Telas Finais de Projeto (As-Built)</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { label: 'Arquitetura', check: maintenance.telasFinais.arquitetura },
                  { label: 'AVAC / Climatização', check: maintenance.telasFinais.avac },
                  { label: 'Eletricidade e IT', check: maintenance.telasFinais.eletricidade },
                  { label: 'Águas e Esgotos', check: maintenance.telasFinais.aguasEsgotos }
                ].map(t => (
                  <div key={t.label} className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-lg border border-slate-100">
                    <div className={`w-2.5 h-2.5 rounded-sm border ${t.check ? 'bg-blue-600 border-blue-700 shadow-sm' : 'bg-white border-slate-200'}`} />
                    <span className={`text-[9px] font-bold uppercase ${t.check ? 'text-slate-800' : 'text-slate-300'}`}>{t.label}</span>
                  </div>
                ))}
                {maintenance.telasFinais.outros && (
                  <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-lg border border-blue-100">
                    <div className="w-2.5 h-2.5 rounded-sm border bg-blue-600 border-blue-700 shadow-sm" />
                    <span className="text-[9px] font-black uppercase text-blue-800">{maintenance.telasFinais.outrosSpec || 'Outros Projetos'}</span>
                  </div>
                )}
              </div>
            </section>
          </div>
          <div className="mt-8 bg-slate-50 p-5 rounded-xl border border-slate-100">
            <h4 className="text-[9px] font-black text-slate-800 uppercase mb-3 flex items-center gap-2">
               <div className="w-1.5 h-1.5 bg-blue-600" /> Notas Operacionais e Registos de Campo
            </h4>
            <p className="text-[10px] text-slate-600 leading-relaxed italic">{maintenance.notasManutencao || "Sem anomalias críticas ou notas de manutenção adicionais registadas no ato da auditoria."}</p>
          </div>
        </ChapterPage>
      )}

      {/* Energia */}
      {activeChapters.some(c => c.id === 'energia') && (
        <ChapterPage 
          chapterNumber={getChapterNumber('energia')} 
          title="Energia e Monitorização" 
          footerAnalysis="Infraestrutura de energia elétrica e sistemas de monitorização auditados."
          buildingName={buildingNameShort}
          auditDate={formattedAuditDate}
        >
          <div className="space-y-8">
            {/* Fontes e Contadores */}
            <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
              <h4 className="text-[10px] font-black text-blue-900 uppercase mb-4">Fontes de Energia Primária e Contadores</h4>
              <div className="grid grid-cols-1 gap-4">
                {(energy.fontesInfo || []).map(info => (
                  <div key={info.source} className="bg-white p-4 rounded-xl border border-blue-100 flex gap-6 items-start">
                    <div className="shrink-0 w-24">
                       <span className="text-[9px] font-black text-blue-700 uppercase bg-blue-50 px-2 py-1 rounded">{info.source}</span>
                    </div>
                    <div className="flex-1">
                       <div className="text-[10px] font-black text-slate-800 mb-2">Contador Ref: <span className="text-blue-600">{info.meterRef || 'N/A'}</span></div>
                       <div className="flex flex-wrap gap-2">
                          {(info.photoIds || []).map(pid => {
                             const photo = photos.find(p => p.id === pid);
                             return photo ? (
                               <div key={pid} className="w-20 h-20 border rounded bg-slate-50 overflow-hidden relative shadow-sm">
                                  <img src={photo.url} className="w-full h-full object-contain" />
                                  <div className="absolute top-0 left-0 bg-blue-900/80 text-white text-[6px] px-1 font-black">{photo.code}</div>
                               </div>
                             ) : null;
                          })}
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Posto de Transformação */}
            {energy.temPT && (
              <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100">
                <h4 className="text-[10px] font-black text-orange-900 uppercase mb-4">Posto de Transformação (PT)</h4>
                <div className="grid grid-cols-3 gap-4 mb-4 text-[10px]">
                   <div className="space-y-1"><span className="text-orange-400 font-bold uppercase">Código:</span> <div className="font-black">{energy.ptCodigo || '---'}</div></div>
                   <div className="space-y-1"><span className="text-orange-400 font-bold uppercase">Potência:</span> <div className="font-black">{energy.ptPotencia || '---'} kVA</div></div>
                   <div className="space-y-1"><span className="text-orange-400 font-bold uppercase">CPE:</span> <div className="font-black">{energy.cpeEletricidade || '---'}</div></div>
                </div>
                <div className="flex flex-wrap gap-3">
                   {(energy.ptPhotoIds || []).map(pid => {
                      const photo = photos.find(p => p.id === pid);
                      return photo ? (
                        <div key={pid} className="w-28 h-28 border rounded-lg bg-white overflow-hidden relative shadow-md">
                           <img src={photo.url} className="w-full h-full object-contain" />
                           <div className="absolute top-0 left-0 bg-orange-900/80 text-white text-[6px] px-1 font-black">{photo.code}</div>
                        </div>
                      ) : null;
                   })}
                </div>
              </div>
            )}

            {/* Monitorização */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <h4 className="text-[10px] font-black text-emerald-900 uppercase">Sistemas de Monitorização</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-2 bg-slate-50 p-2 rounded border border-slate-100">
                    <div className={`w-2 h-2 rounded-full ${energy.temContadoresEnergia ? 'bg-green-500' : 'bg-slate-300'}`} />
                    <span className="font-bold text-slate-600 text-[8px] uppercase">C. Energia</span>
                  </div>
                  <div className="flex items-center gap-2 bg-slate-50 p-2 rounded border border-slate-100">
                    <div className={`w-2 h-2 rounded-full ${energy.temSMM ? 'bg-green-500' : 'bg-slate-300'}`} />
                    <span className="font-bold text-slate-600 text-[8px] uppercase">SMM / Gestão</span>
                  </div>
                </div>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                 <h4 className="text-[8px] font-black text-slate-400 uppercase mb-2 italic">Notas de Monitorização</h4>
                 <p className="text-[9px] text-slate-600 leading-tight">{energy.notasMonitorizacao || "Sem notas adicionais."}</p>
              </div>
            </div>
          </div>
        </ChapterPage>
      )}

      {/* Perfis */}
      <ChapterPage 
        chapterNumber={getChapterNumber('perfis')} 
        title="Perfis de Funcionamento e Ocupação" 
        footerAnalysis={`A análise técnico-estatística consolidada indica um Fator de Ocupação Anual Final de ${annualFactor.toFixed(1)}%. Este rigor permite ao PQ ajustar as necessidades energéticas nominais à realidade operacional identificada.`}
        buildingName={buildingNameShort}
        auditDate={formattedAuditDate}
      >
        <div className="space-y-6">
          <div className="bg-slate-900 text-white p-6 rounded-2xl flex justify-between items-center border-l-8 border-orange-500 shadow-xl">
            <div>
              <div className="text-[9px] font-black uppercase text-orange-400 tracking-[0.2em] mb-1">Cálculo Consolidado (FOD x FOS x FOM)</div>
              <div className="text-2xl font-black uppercase tracking-tighter">Fator de Ocupação Anual Final</div>
            </div>
            <div className="text-4xl font-black">{annualFactor.toFixed(1)}%</div>
          </div>

          {/* 1. Perfil Geral */}
          <section className="space-y-2">
            <MiniProfileChart profile={profiles.geral} label="Perfil de Funcionamento Geral (24h)" color="bg-blue-600" />
            <ProfileAnalysisBlock 
              title="Análise Estatística: Perfil Geral"
              activeHours={profiles.geral.daily.filter(v=>v===1).length}
              weeklyDays={profiles.geral.weekly.filter(v=>v===1).length}
              colorClass="text-blue-600"
              description={getDailyAnalysis(profiles.geral.daily)}
            />
          </section>
          
          {/* 2. Perfis por Sistema */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <MiniProfileChart profile={profiles.sistemas.avac} label="Perfil AVAC" color="bg-orange-500" />
              <ProfileAnalysisBlock 
                title="Climatização"
                activeHours={profiles.sistemas.avac.daily.filter(v=>v===1).length}
                weeklyDays={profiles.sistemas.avac.weekly.filter(v=>v===1).length}
                colorClass="text-orange-600"
                description={getSystemAnalysis("AVAC", profiles.sistemas.avac.daily)}
              />
            </div>
            <div className="space-y-2">
              <MiniProfileChart profile={profiles.sistemas.iluminacao} label="Perfil Iluminação" color="bg-yellow-400" />
              <ProfileAnalysisBlock 
                title="Iluminação"
                activeHours={profiles.sistemas.iluminacao.daily.filter(v=>v===1).length}
                weeklyDays={profiles.sistemas.iluminacao.weekly.filter(v=>v===1).length}
                colorClass="text-yellow-600"
                description={getSystemAnalysis("Iluminação", profiles.sistemas.iluminacao.daily)}
              />
            </div>
          </div>

          {/* 3. Perfil de Ocupação Mensal */}
          <section className="space-y-2">
            <div className="bg-white border p-3 rounded-xl shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <span className="text-[8px] font-black uppercase text-slate-400">Perfil de Ocupação Mensal (Sazonalidade)</span>
                <span className="text-[9px] font-bold text-slate-700">Média: {(monthlyFactor * 100).toFixed(1)}%</span>
              </div>
              <div className="h-16 flex items-end gap-1 bg-slate-50 px-2 py-1 border rounded">
                {profiles.ocupacao.monthly.map((v, i) => (
                  <div key={i} className="flex-1 bg-blue-900/10 relative group" style={{ height: '100%' }}>
                    <div className="absolute bottom-0 inset-x-0 bg-blue-600 rounded-t-sm" style={{ height: `${v * 100}%` }} />
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-[7px] font-bold text-slate-400 mt-1 uppercase"><span>Jan</span><span>Jun</span><span>Dez</span></div>
            </div>
            <ProfileAnalysisBlock 
              title="Análise de Sazonalidade"
              activeHours={Math.round(monthlyFactor * 100)}
              weeklyDays={profiles.ocupacao.weekly.filter(v=>v===1).length}
              colorClass="text-slate-800"
              description={`A variação mensal apresenta uma amplitude de ${Math.round((Math.max(...profiles.ocupacao.monthly) - Math.min(...profiles.ocupacao.monthly)) * 100)}%. O valor médio de ${(monthlyFactor * 100).toFixed(1)}% reflete o impacto sazonal na atividade do imóvel.`}
            />
          </section>
        </div>
      </ChapterPage>

      {/* Envolvente */}
      {activeChapters.some(c => c.id === 'envolvente') && (
        <ChapterPage 
          chapterNumber={getChapterNumber('envolvente')} 
          title="Caracterização da Envolvente Técnica" 
          footerAnalysis="Levantamento detalhado da envolvente opaca e envidraçada."
          buildingName={buildingNameShort}
          auditDate={formattedAuditDate}
        >
          <TechnicalTable title="Levantamento da Envolvente" list={report.envolventeList} isEnvolvente allPhotos={photos} />
        </ChapterPage>
      )}

      {/* Outros capítulos */}
      {activeChapters.filter(c => !['identificacao', 'plantas', 'manutencao', 'energia', 'perfis', 'envolvente', 'fotos'].includes(c.id)).map(chapter => (
        <ChapterPage 
          key={chapter.id}
          chapterNumber={getChapterNumber(chapter.id)} 
          title={chapter.title} 
          footerAnalysis={`Auditados os elementos do sistema ${chapter.title}. Verificada a conformidade técnica em campo.`}
          buildingName={buildingNameShort}
          auditDate={formattedAuditDate}
        >
          {chapter.id === 'climatizacao' && <TechnicalTable title="Produção AVAC" list={report.sistemasList} allPhotos={photos} />}
          {chapter.id === 'aqs' && <TechnicalTable title="Produção AQS" list={report.aqsList} allPhotos={photos} />}
          {chapter.id === 'renovaveis' && <TechnicalTable title="Sistemas Renováveis" list={report.renovaveisList} allPhotos={photos} />}
          {chapter.id === 'distribuicao' && <TechnicalTable title="Bombas e Redes" list={report.distribuicaoList} allPhotos={photos} />}
          {chapter.id === 'difusao' && <TechnicalTable title="Ventilação e Difusão" list={report.difusaoList} allPhotos={photos} />}
          {chapter.id === 'iluminacao' && <TechnicalTable title="Luminárias e Gestão" list={report.iluminacaoList} allPhotos={photos} />}
          {chapter.id === 'elevacao' && <TechnicalTable title="Sistemas de Elevação" list={report.elevadoresList} allPhotos={photos} />}
          {chapter.id === 'cozinhas' && (
            <>
              <TechnicalTable title="Equipamentos Cozinha" list={report.cozinhasList} allPhotos={photos} />
              <TechnicalTable title="Equipamentos Lavandaria" list={report.lavandariaList} allPhotos={photos} />
            </>
          )}
          {chapter.id === 'outros' && <TechnicalTable title="Equipamentos Diversos" list={[...report.piscinaList, ...report.outrosSistemasList]} allPhotos={photos} />}
          {chapter.id === 'mures' && (
             <div className="space-y-6">
               {mures.filter(m => m.checked).map(m => {
                 const murePhotos = photos.filter(p => m.photoIds?.includes(p.id));
                 return (
                   <div key={m.id} className="bg-emerald-50 border-l-4 border-emerald-500 p-6 rounded-r-2xl shadow-sm space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="text-[11px] font-black text-emerald-900 uppercase mb-1 tracking-tight">{m.label}</div>
                          <div className="text-[10px] text-emerald-700 italic leading-relaxed">{m.note || "Sem observações específicas registadas."}</div>
                        </div>
                      </div>
                      
                      {murePhotos.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-2 border-t border-emerald-100/50">
                          {murePhotos.map(p => (
                            <div key={p.id} className="w-20 h-20 bg-white border border-emerald-200 rounded-lg overflow-hidden relative shadow-sm">
                              <img src={p.url} className="w-full h-full object-contain" />
                              <div className="absolute top-0 left-0 bg-emerald-900/80 text-white text-[6px] px-1 font-black uppercase">{p.code}</div>
                            </div>
                          ))}
                        </div>
                      )}
                   </div>
                 );
               })}
             </div>
          )}
        </ChapterPage>
      ))}

      {/* Anexo Fotográfico */}
      {activeChapters.some(c => c.id === 'fotos') && (
        <div className="a4-page page-break bg-white p-[15mm] flex flex-col">
           <h2 className="text-2xl font-black text-blue-900 uppercase border-b-2 border-blue-900 pb-2 mb-6">Anexo I - Galeria Fotográfica de Campo</h2>
           <div className="grid grid-cols-3 gap-4 flex-1">
              {photos.map(p => (
                <div key={p.id} className="border p-2 rounded-lg space-y-2 bg-slate-50">
                  <div className="aspect-square rounded overflow-hidden bg-white">
                    <img src={p.url} className="w-full h-full object-contain" alt={p.code} />
                  </div>
                  <div className="text-[8px] font-black text-blue-900 uppercase">{p.code} - {p.category}</div>
                  <div className="text-[8px] text-slate-500 italic line-clamp-2 h-5 leading-tight">{p.caption}</div>
                </div>
              ))}
           </div>
           
           <div className="mt-8 pt-4 border-t border-slate-200 flex justify-between items-center text-[7px] font-black text-slate-400 uppercase tracking-[0.2em]">
             <div className="flex gap-4 items-center">
               <span className="text-slate-600">{buildingNameShort}</span>
               <span className="text-slate-200">|</span>
               <span>{formattedAuditDate}</span>
             </div>
             <div className="flex gap-4 items-center">
               <span>© SCE - PORTUGAL</span>
               <span className="w-1 h-1 bg-slate-300 rounded-full" />
               <span className="text-blue-900">PÁGINA {activeChapters.length + 2}</span>
             </div>
           </div>
        </div>
      )}

      {/* CONTRACAPA */}
      <div className="a4-page bg-blue-900 text-white flex flex-col items-center justify-center p-[20mm] text-center">
        <h3 className="text-3xl font-black uppercase tracking-widest mb-4">Relatório Concluído</h3>
        <p className="text-sm font-bold text-blue-300 max-w-md uppercase tracking-widest mb-20 leading-relaxed">
          Documento gerado automaticamente para fins de certificação energética (RECS).
        </p>
        <div className="text-sm font-black">{building.peritoNome}</div>
        <div className="text-xs text-blue-400">{building.email || "---"}</div>
        
        <div className="absolute bottom-10 text-[7px] font-black opacity-30 uppercase tracking-[0.5em]">
          {buildingNameShort} | {formattedAuditDate}
        </div>
      </div>

    </div>
  );
};

export default PrintView;
