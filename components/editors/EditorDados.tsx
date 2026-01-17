
import React, { useEffect } from 'react';
import { ReportState } from '../../types';
import { Sparkles, Building2, ShieldCheck, ClipboardList } from 'lucide-react';

interface SectionProps {
  title: string;
  icon: any;
  children: React.ReactNode;
}

const Section = ({ title, icon: Icon, children }: SectionProps) => (
  <div className="space-y-4">
    <h3 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] flex items-center gap-2 border-b pb-1">
      <Icon size={12} /> {title}
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {children}
    </div>
  </div>
);

interface SelectProps {
  label: string;
  field: string;
  value: string;
  optionsArr: string[];
  onChange: (field: string, value: string) => void;
}

const Select = ({ label, field, value, optionsArr, onChange }: SelectProps) => (
  <div>
    <label className="block text-[9px] font-bold text-gray-400 uppercase mb-1">{label}</label>
    <select 
      value={value}
      onChange={(e) => onChange(field, e.target.value)}
      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-100 transition"
    >
      <option value="">Selecionar...</option>
      {optionsArr.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  </div>
);

interface Props {
  report: ReportState;
  onUpdate: (updates: Partial<ReportState>) => void;
}

const EditorDados: React.FC<Props> = ({ report, onUpdate }) => {
  const options = {
    identificacaoImovel: ["Edifício", "Fração (s/ PH e com utilização independente)", "Fração autónoma (com PH constituída)"],
    tipoFracao: ["Privado", "Administração local", "Administração central"],
    utilizacao: ["Serviços", "Misto"],
    tipoEdificio: [
      "Escritórios",
      "Ensino",
      "Saúde",
      "Hotéis e Restaurantes",
      "Comércio",
      "Desporto e Lazer",
      "Cultura (Museus, Bibliotecas, etc.)",
      "Outros"
    ],
    inercia: ["Forte", "Média", "Fraca"],
    pontoCarregamento: ["Partilhado", "Privado", "Não Aplicável"],
    motivacaoSce: ["Compra e venda, doação ou similares", "Locação", "Construção nova", "Reabilitação / Intervenção", "Avaliação Energética Periódica", "Acesso a Benefícios Fiscais", "Acesso a Instrumentos Financeiros", "Reemissão decorrente de verificação de qualidade", "Voluntário"],
    dataLicenciamento: [
      "Anterior a 4 de julho de 2006",
      "Posterior a 4 de julho de 2006 e anterior a 1 de dezembro de 2013",
      "Posterior a 1 dezembro de 2013 e anterior a 1 de janeiro de 2016",
      "Posterior a 1 de janeiro de 2016 e anterior a 1 de janeiro de 2019",
      "A partir de 1 de janeiro de 2019",
      "A partir de 1 de julho de 2021"
    ],
    contextoCertificado: ["Novo", "Grande Intervenção", "Existente"],
    anoConstrucao: ["Anterior a 1918", "1919-1945", "1946-1960", "1961-1970", "1971-1980", "1981-1990", "1991-1995", "1996-2000", "2001-2005", "Após 2006"]
  };

  const handleChange = (field: string, value: string) => {
    onUpdate({ building: { ...report.building, [field]: value } });
  };

  useEffect(() => {
    const { 
      building, location, maintenance, energy, profiles, espacosList, 
      envolventeList, sistemasList, aqsList, renovaveisList, 
      distribuicaoList, difusaoList, iluminacaoList, mures 
    } = report;
    
    // 1. Identificação Geral
    let autoDesc = `RELATÓRIO DE CAMPO - AUDITORIA TÉCNICA (RECS)\n\n`;
    autoDesc += `O imóvel "${building.nomeEdificio || '---'}", situado em ${location.concelho || '[Concelho]'} (Altitude: ${location.altitude || '---'}m), `;
    autoDesc += `com orientação solar predominante a ${location.orientation}, apresenta-se como uma ${building.identificacaoImovel || '[Tipologia]'} `;
    
    const tipoEdificioStr = building.tipoEdificio === 'Outros' 
      ? `classificado como ${building.tipoEdificioOutro || 'Outro'}` 
      : `destinado a ${building.tipoEdificio || '[Tipo RECS]'}`;
      
    autoDesc += `do setor de ${tipoEdificioStr} de cariz ${building.tipoFracao || '[Fração]'} vocacionada para ${building.utilizacao || '[Serviços]'}. `;
    autoDesc += `O edifício foi construído no período ${building.anoConstrucao || '[AnoConstrução]'}, sendo caracterizado por uma inércia térmica ${building.inercia || '[Inércia]'}.\n\n`;

    // 2. Operação e Manutenção
    if (maintenance.empresaNome || maintenance.trmNome) {
      autoDesc += `OPERAÇÃO E MANUTENÇÃO:\n`;
      autoDesc += `O edifício é assistido pela empresa ${maintenance.empresaNome || '[Empresa]'} com periodicidade ${maintenance.periodicidade.toLowerCase()}. `;
      autoDesc += `A responsabilidade técnica de manutenção está a cargo de ${maintenance.trmNome || '---'} (TRM) e a gestão de energia a cargo de ${maintenance.tgeNome || '---'} (TGE). `;
      autoDesc += `Ao nível documental, o imóvel ${maintenance.temPMP ? 'possui' : 'carece de'} Plano de Manutenção Preventiva e ${maintenance.temLivroOcorrencias ? 'dispõe' : 'não dispõe'} de Livro de Ocorrências atualizado.\n\n`;
    }

    // 3. Infraestrutura Energética
    if (energy.fontes.length > 0) {
      autoDesc += `INFRAESTRUTURA ENERGÉTICA:\n`;
      autoDesc += `As fontes de energia primária identificadas incluem: ${energy.fontes.join(', ')}. `;
      if (energy.temPT) {
        autoDesc += `O edifício dispõe de Posto de Transformação próprio (CPE: ${energy.cpeEletricidade || '---'}) com potência nominal de ${energy.ptPotencia || '---'} kVA. `;
      }
      autoDesc += `Quanto à monitorização, o imóvel ${energy.temSMM ? 'possui' : 'carece de'} Sistema de Gestão e Monitorização (SMM), `;
      autoDesc += `contando com contadores de ${energy.temContadoresEnergia ? 'energia' : ''}${energy.temContadoresEnergia && energy.temContadoresAgua ? ' e ' : ''}${energy.temContadoresAgua ? 'água' : ''}.\n\n`;
    }

    // 4. Perfis e Ocupação
    const annualFactor = (profiles.ocupacao.daily.reduce((a, b) => a + b, 0) / 24) * 
                         (profiles.ocupacao.weekly.reduce((a, b) => a + b, 0) / 7) * 
                         (profiles.ocupacao.monthly.reduce((a, b) => a + b, 0) / 12) * 100;
    autoDesc += `DINÂMICA OPERACIONAL:\n`;
    autoDesc += `O edifício apresenta um fator de ocupação anual estimado em ${annualFactor.toFixed(1)}%, `;
    autoDesc += `com perfis de funcionamento ${profiles.sistemas.allSame ? 'centralizados' : 'independentes por sistemas'}. `;
    autoDesc += `A compartimentação interna compreende ${espacosList.length} espaços funcionais principais.\n\n`;

    // 5. Envolvente
    if (envolventeList.length > 0) {
      const opacos = envolventeList.filter(e => e.type !== 'Envidraçado').map(e => e.type).filter((v, i, a) => a.indexOf(v) === i);
      const envidracados = envolventeList.filter(e => e.type === 'Envidraçado');
      autoDesc += `CARACTERIZAÇÃO DA ENVOLVENTE:\n`;
      if (opacos.length > 0) autoDesc += `A envolvente opaca utiliza soluções de ${opacos.join(', ')}. `;
      if (envidracados.length > 0) {
        autoDesc += `Os vãos envidraçados consistem maioritariamente em sistemas de caixilharia de ${envidracados[0].caixilhariaTipo} `;
        autoDesc += `com vidro ${envidracados[0].vidroTipo?.toLowerCase()}${envidracados[0].corteTermico === 'Com' ? ' e corte térmico' : ''}. `;
      }
      autoDesc += `O estado geral de conservação da envolvente é avaliado como "${envolventeList[0]?.estado || '---'}".\n\n`;
    }

    // 6. Sistemas Técnicos (Produção)
    const allSist = [...sistemasList, ...aqsList, ...renovaveisList];
    if (allSist.length > 0) {
      autoDesc += `SISTEMAS DE PRODUÇÃO TÉRMICA E AQS:\n`;
      const clim = sistemasList.map(s => s.type).join(', ');
      if (clim) autoDesc += `Para climatização (AVAC), o edifício utiliza ${clim}, operando com setpoints de referência de ${sistemasList[0]?.setpoint || '21'}ºC. `;
      
      if (aqsList.length > 0) {
        const aqsType = aqsList.filter(a => !["Duche", "Chuveiro", "Torneira Termostática", "Torneira Monobloco", "Torneira Temporizada", "Torneiras Misturadoras"].includes(a.type)).map(a => a.type);
        const aqsTerm = aqsList.filter(a => ["Duche", "Chuveiro", "Torneira Termostática", "Torneira Monobloco", "Torneira Temporizada", "Torneiras Misturadoras"].includes(a.type)).map(a => a.type);
        if (aqsType.length > 0) autoDesc += `A produção de AQS é garantida por ${aqsType.join(', ')}. `;
        if (aqsTerm.length > 0) autoDesc += `Foram identificados terminais de consumo tipo ${aqsTerm.join(', ')}. `;
      }

      if (renovaveisList.length > 0) {
        autoDesc += `A componente de energia renovável baseia-se em sistemas de ${renovaveisList.map(r => r.type).join(', ')}. `;
      }
      autoDesc += `\n\n`;
    }

    // 7. Distribuição, Difusão e Iluminação
    if (distribuicaoList.length > 0 || difusaoList.length > 0 || iluminacaoList.length > 0) {
      autoDesc += `DISTRIBUIÇÃO, DIFUSÃO E ILUMINAÇÃO:\n`;
      if (distribuicaoList.length > 0) autoDesc += `A rede de distribuição térmica compreende ${distribuicaoList.map(d => d.type).join(', ')}. `;
      if (difusaoList.length > 0) autoDesc += `A difusão e extração de ar é realizada via ${difusaoList.map(d => d.type).join(', ')}. `;
      if (iluminacaoList.length > 0) {
        const ledCount = iluminacaoList.filter(i => i.type === 'LED').length;
        autoDesc += `A iluminação interior utiliza tecnologia ${iluminacaoList.map(i => i.type).join(', ')}${ledCount > 0 ? ' (predomínio de LED)' : ''}. `;
      }
      autoDesc += `\n\n`;
    }

    // 8. MURES
    const muresAtivas = mures.filter(m => m.checked);
    if (muresAtivas.length > 0) {
      autoDesc += `OPORTUNIDADES DE MELHORIA (MURES):\n`;
      autoDesc += `Foram identificadas ${muresAtivas.length} medidas prioritárias, destacando-se: ${muresAtivas.map(m => m.label).join('; ')}.\n\n`;
    }

    autoDesc += `CONCLUSÃO:\n`;
    autoDesc += `O edifício enquadra-se no regime ${building.dataLicenciamento || '[Licenciamento]'} para um contexto de certificado ${building.contextoCertificado || '[Contexto]'}. `;
    autoDesc += `A auditoria foi concluída a ${new Date(report.auditDate).toLocaleDateString('pt-PT')} pelo PQ ${building.peritoNome} (${building.peritoNumero}).`;

    if (!report.descricaoTecnica || report.descricaoTecnica.length < 500) {
       onUpdate({ descricaoTecnica: autoDesc });
    }
  }, [
    report.building, report.location, report.maintenance, report.energy, report.profiles, 
    report.espacosList, report.envolventeList, report.sistemasList, 
    report.aqsList, report.renovaveisList, report.distribuicaoList, 
    report.difusaoList, report.iluminacaoList, report.mures
  ]);

  return (
    <div className="space-y-8 pb-20">
      <div className="bg-white border rounded-2xl p-8 shadow-sm space-y-10">
        <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
          <Building2 className="text-blue-600" size={28} /> Dados Gerais do Imóvel
        </h2>

        <Section title="Identificação Geral" icon={ClipboardList}>
          <Select label="Identificação do Imóvel" field="identificacaoImovel" value={report.building.identificacaoImovel} optionsArr={options.identificacaoImovel} onChange={handleChange} />
          <Select label="Tipo de Edifício (RECS)" field="tipoEdificio" value={report.building.tipoEdificio} optionsArr={options.tipoEdificio} onChange={handleChange} />
          {report.building.tipoEdificio === 'Outros' && (
            <div className="col-span-full animate-in slide-in-from-left-2">
              <label className="block text-[9px] font-bold text-gray-400 uppercase mb-1">Especifique o Tipo de Edifício</label>
              <input 
                type="text"
                value={report.building.tipoEdificioOutro || ''}
                onChange={(e) => handleChange('tipoEdificioOutro', e.target.value)}
                placeholder="Ex: Armazém Logístico, Indústria com Escritórios..."
                className="w-full p-2.5 bg-white border border-blue-200 rounded-lg text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-100 transition"
              />
            </div>
          )}
          <Select label="Tipo de Fração" field="tipoFracao" value={report.building.tipoFracao} optionsArr={options.tipoFracao} onChange={handleChange} />
          <Select label="Utilização" field="utilizacao" value={report.building.utilizacao} optionsArr={options.utilizacao} onChange={handleChange} />
          <Select label="Inércia Térmica" field="inercia" value={report.building.inercia} optionsArr={options.inercia} onChange={handleChange} />
        </Section>

        <Section title="Certificação e Licenciamento" icon={ShieldCheck}>
          <Select label="Motivação de Certificação" field="motivacaoSce" value={report.building.motivacaoSce} optionsArr={options.motivacaoSce} onChange={handleChange} />
          <Select label="Data de Licenciamento" field="dataLicenciamento" value={report.building.dataLicenciamento} optionsArr={options.dataLicenciamento} onChange={handleChange} />
          <Select label="Contexto de Certificado" field="contextoCertificado" value={report.building.contextoCertificado} optionsArr={options.contextoCertificado} onChange={handleChange} />
          <Select label="Intervalo de Construção" field="anoConstrucao" value={report.building.anoConstrucao} optionsArr={options.anoConstrucao} onChange={handleChange} />
          <Select label="Ponto de Carregamento" field="pontoCarregamento" value={report.building.pontoCarregamento} optionsArr={options.pontoCarregamento} onChange={handleChange} />
        </Section>

        <div className="space-y-3 pt-6 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-blue-500" />
              <h3 className="text-xs font-black text-slate-700 uppercase">Descrição Técnica Consolidada (Auto-Gerada)</h3>
            </div>
            <button 
              onClick={() => onUpdate({ descricaoTecnica: '' })}
              className="text-[10px] font-black text-blue-600 uppercase hover:underline"
            >
              Regerar Descrição
            </button>
          </div>
          <textarea 
            value={report.descricaoTecnica}
            onChange={(e) => onUpdate({ descricaoTecnica: e.target.value })}
            className="w-full p-5 border rounded-2xl bg-slate-50 text-[12px] font-mono text-gray-700 h-[600px] outline-none focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all leading-relaxed whitespace-pre-wrap"
            placeholder="A descrição será gerada automaticamente à medida que preenche os menus..."
          />
        </div>
      </div>
    </div>
  );
};

export default EditorDados;
