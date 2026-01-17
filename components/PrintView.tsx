
import React from 'react';
import { ReportState, TechnicalElement, PhotoEntry, SpaceElement, SectionType } from '../types';

interface Props {
  report: ReportState;
}

const ChapterPage: React.FC<{ 
  children: React.ReactNode; 
  title: string; 
  chapterNumber: number;
  footerAnalysis: string;
}> = ({ children, title, chapterNumber, footerAnalysis }) => (
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
      <div className="mt-4 flex justify-between items-center text-[8px] font-bold text-slate-400 uppercase tracking-widest">
        <span>© SCE - Portugal | Edifícios de Serviços</span>
        <span>Página {chapterNumber + 2}</span>
      </div>
    </div>
  </div>
);

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
  const { building, location, energy, profiles, photos, mures } = report;

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
            <div className="absolute bottom-4 right-4 bg-blue-900 text-white px-4 py-2 font-black text-[10px] uppercase">Visita Realizada em {new Date(report.auditDate).toLocaleDateString('pt-PT')}</div>
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

      {/* 2. ÍNDICE */}
      <div className="a4-page page-break bg-white p-[20mm] flex flex-col">
        <h2 className="text-3xl font-black text-blue-900 uppercase border-b-4 border-blue-900 pb-4 mb-10">Índice Geral</h2>
        <div className="flex-1 space-y-3">
          {[
            { n: 1, t: "Identificação e Enquadramento Legal", p: 3 },
            { n: 2, t: "Infraestrutura de Energia e Monitorização", p: 4 },
            { n: 3, t: "Perfis de Funcionamento e Ocupação", p: 5 },
            { n: 4, t: "Caracterização da Envolvente Técnica", p: 6 },
            { n: 5, t: "Sistemas de Climatização (AVAC)", p: 7 },
            { n: 6, t: "Produção de Águas Quentes Sanitárias (AQS)", p: 8 },
            { n: 7, t: "Sistemas de Energia Renovável", p: 9 },
            { n: 8, t: "Redes de Distribuição Térmica", p: 10 },
            { n: 9, t: "Sistemas de Difusão e Ventilação", p: 11 },
            { n: 10, t: "Sistemas de Iluminação e Gestão", p: 12 },
            { n: 11, t: "Sistemas de Elevação e Transporte", p: 13 },
            { n: 12, t: "Cozinhas e Lavandarias Industriais", p: 14 },
            { n: 13, t: "Piscinas e Outros Sistemas Técnicos", p: 15 },
            { n: 14, t: "Medidas de Melhoria (MURES)", p: 16 },
            { n: 15, t: "Anexo I - Registo Fotográfico de Campo", p: 17 },
          ].map(item => (
            <div key={item.n} className="flex items-end gap-4 group">
              <span className="text-blue-900 font-black text-xs w-8">{item.n}.</span>
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-tight flex-1 border-b border-dotted border-slate-300 pb-0.5">{item.t}</span>
              <span className="text-blue-900 font-black text-xs">{item.p.toString().padStart(2, '0')}</span>
            </div>
          ))}
        </div>
        <div className="mt-10 p-6 border-2 border-dashed border-slate-100 rounded-3xl text-center">
          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em]">Documento técnico de apoio à emissão de Certificado Energético (RECS)</p>
        </div>
      </div>

      {/* 3. CAPÍTULO 1: IDENTIFICAÇÃO */}
      <ChapterPage chapterNumber={1} title="Identificação e Enquadramento Legal" footerAnalysis={report.descricaoTecnica}>
        <div className="grid grid-cols-2 gap-8">
          <section className="space-y-4">
            <h3 className="text-xs font-black text-blue-900 uppercase border-b pb-1">Dados Administrativos</h3>
            <div className="space-y-2 text-[10px]">
              <div className="flex justify-between border-b border-slate-50 pb-1">
                <span className="text-slate-400 font-bold uppercase">Utilização:</span>
                <span className="font-black text-slate-800">{building.utilizacao}</span>
              </div>
              <div className="flex justify-between border-b border-slate-50 pb-1">
                <span className="text-slate-400 font-bold uppercase">Tipo de Fração:</span>
                <span className="font-black text-slate-800">{building.tipoFracao}</span>
              </div>
              <div className="flex justify-between border-b border-slate-50 pb-1">
                <span className="text-slate-400 font-bold uppercase">Construção:</span>
                <span className="font-black text-slate-800">{building.anoConstrucao}</span>
              </div>
            </div>
          </section>
          <section className="space-y-4">
            <h3 className="text-xs font-black text-blue-900 uppercase border-b pb-1">Localização e Enquadramento</h3>
            <div className="space-y-2 text-[10px]">
              <div className="flex justify-between border-b border-slate-50 pb-1">
                <span className="text-slate-400 font-bold uppercase">Concelho:</span>
                <span className="font-black text-slate-800">{location.concelho}</span>
              </div>
              <div className="flex justify-between border-b border-slate-50 pb-1">
                <span className="text-slate-400 font-bold uppercase">Orientação predominante:</span>
                <span className="font-black text-slate-800">{location.orientation}</span>
              </div>
              <div className="flex justify-between border-b border-slate-50 pb-1">
                <span className="text-slate-400 font-bold uppercase">Altitude:</span>
                <span className="font-black text-slate-800">{location.altitude} m</span>
              </div>
            </div>
          </section>
        </div>
        <div className="mt-8 border-4 border-slate-50 rounded-2xl overflow-hidden aspect-video relative">
          {location.googleEarthImage ? (
            <img src={location.googleEarthImage} className="w-full h-full object-cover" alt="Earth" />
          ) : (
            <div className="w-full h-full bg-slate-50 flex items-center justify-center text-[10px] text-slate-300 italic uppercase font-black">Implantação no Terreno (Google Earth)</div>
          )}
          <div className="absolute top-4 left-4 bg-white/90 px-3 py-1 rounded text-[8px] font-black shadow-sm uppercase">Imagem de Contexto de Auditoria</div>
        </div>
      </ChapterPage>

      {/* 4. CAPÍTULO 2: ENERGIA */}
      <ChapterPage chapterNumber={2} title="Energia e Monitorização" footerAnalysis="Foi verificado o Posto de Transformação e os sistemas de monitorização local. A existência de SMM é um requisito legal para edifícios de grande dimensão (RECS).">
        <div className="space-y-6">
          <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 grid grid-cols-2 gap-10">
            <div>
              <h4 className="text-[10px] font-black text-blue-900 uppercase mb-4">Fontes de Energia Primária</h4>
              <div className="flex flex-wrap gap-2">
                {energy.fontes.map(f => (
                  <span key={f} className="px-3 py-1 bg-white border border-blue-200 text-blue-700 font-black text-[9px] rounded-full uppercase">{f}</span>
                ))}
              </div>
            </div>
            <div className="text-[10px] space-y-2">
              <h4 className="text-[10px] font-black text-blue-900 uppercase mb-4">Monitorização Existente</h4>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${energy.temContadoresEnergia ? 'bg-green-500' : 'bg-slate-300'}`} />
                  <span className="font-bold text-slate-600">Cont. Energia</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${energy.temContadoresAgua ? 'bg-green-500' : 'bg-slate-300'}`} />
                  <span className="font-bold text-slate-600">Cont. Água</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${energy.temSMM ? 'bg-green-500' : 'bg-slate-300'}`} />
                  <span className="font-bold text-slate-600">SMM / Gestão</span>
                </div>
              </div>
            </div>
          </div>
          
          {energy.temPT && (
            <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100">
               <h4 className="text-[10px] font-black text-orange-900 uppercase mb-3">Infraestrutura Elétrica (PT)</h4>
               <div className="grid grid-cols-3 gap-4 text-[11px]">
                 <div><span className="text-orange-400 font-bold uppercase text-[8px] block">CPE Principal</span> <span className="font-black">{energy.cpeEletricidade}</span></div>
                 <div><span className="text-orange-400 font-bold uppercase text-[8px] block">Potência Nominal</span> <span className="font-black">{energy.ptPotencia} kVA</span></div>
                 <div><span className="text-orange-400 font-bold uppercase text-[8px] block">Código do Posto</span> <span className="font-black">{energy.ptCodigo}</span></div>
               </div>
            </div>
          )}
        </div>
      </ChapterPage>

      {/* 5. CAPÍTULO 3: PERFIS */}
      <ChapterPage chapterNumber={3} title="Perfis de Funcionamento e Ocupação" footerAnalysis="Os perfis horários e semanais foram validados com os responsáveis do edifício para garantir a correta simulação da carga térmica real.">
         <div className="grid grid-cols-2 gap-10">
            <div className="space-y-6">
               <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b pb-1">Carga Horária (24h)</h4>
               <div className="h-24 flex items-end gap-0.5 bg-slate-50 p-2 border rounded">
                  {profiles.geral.daily.map((v, i) => (
                    <div key={i} className={`flex-1 ${v === 1 ? 'bg-blue-600' : 'bg-slate-200 h-0.5'}`} style={{ height: v === 1 ? '100%' : '2px' }} />
                  ))}
               </div>
               <div className="flex justify-between text-[7px] font-bold text-slate-400"><span>00h</span><span>12h</span><span>23h</span></div>
            </div>
            <div className="space-y-6">
               <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b pb-1">Variação Mensal (Ocupação)</h4>
               <div className="h-24 flex items-end gap-1 bg-slate-50 p-2 border rounded">
                  {profiles.ocupacao.monthly.map((v, i) => (
                    <div key={i} className="flex-1 bg-orange-400" style={{ height: `${v * 100}%` }} />
                  ))}
               </div>
               <div className="flex justify-between text-[7px] font-bold text-slate-400"><span>JAN</span><span>JUN</span><span>DEZ</span></div>
            </div>
         </div>
      </ChapterPage>

      {/* 6. CAPÍTULO 4: ENVOLVENTE */}
      <ChapterPage chapterNumber={4} title="Caracterização da Envolvente Técnica" footerAnalysis="A envolvente opaca e envidraçada foi auditada para determinar as perdas térmicas por transmissão e infiltração.">
        <div className="space-y-6">
           <TechnicalTable title="Levantamento da Envolvente Opaca e Envidraçada" list={report.envolventeList} isEnvolvente allPhotos={photos} />
        </div>
      </ChapterPage>

      {/* 7. CAPÍTULO 5: CLIMATIZAÇÃO */}
      <ChapterPage chapterNumber={5} title="Sistemas de Climatização (AVAC)" footerAnalysis="A produção de frio e calor é garantida pelos equipamentos listados, operando segundo os setpoints de referência registados em campo.">
        <TechnicalTable title="Produção de Climatização (Aquecimento e Arrefecimento)" list={report.sistemasList} allPhotos={photos} />
      </ChapterPage>

      {/* 8. CAPÍTULO 6: AQS */}
      <ChapterPage chapterNumber={6} title="Produção de Águas Quentes Sanitárias (AQS)" footerAnalysis="Os sistemas de produção de AQS foram analisados quanto à sua eficiência de produção e conservação nos depósitos de acumulação, se existentes.">
        <TechnicalTable title="Sistemas de Produção e Terminais de Consumo" list={report.aqsList} allPhotos={photos} />
      </ChapterPage>

      {/* 9. CAPÍTULO 7: RENOVÁVEIS */}
      <ChapterPage chapterNumber={7} title="Sistemas de Energia Renovável" footerAnalysis="A contribuição de fontes de energia renovável instaladas no local foi verificada para contabilização da energia primária não renovável evitada.">
        <TechnicalTable title="Levantamento de Sistemas Fotovoltaicos, Solares Térmicos e Outros" list={report.renovaveisList} allPhotos={photos} />
      </ChapterPage>

      {/* 10. CAPÍTULO 8: DISTRIBUIÇÃO */}
      <ChapterPage chapterNumber={8} title="Redes de Distribuição Térmica" footerAnalysis="Foi auditado o estado de conservação do isolamento das redes de tubagem de fluidos térmicos para minimizar perdas por transporte.">
        <TechnicalTable title="Bombas de Circulação e Redes de Tubagem Isolada" list={report.distribuicaoList} allPhotos={photos} />
      </ChapterPage>

      {/* 11. CAPÍTULO 9: DIFUSÃO */}
      <ChapterPage chapterNumber={9} title="Sistemas de Difusão e Ventilação" footerAnalysis="A qualidade do ar interior é garantida pelos sistemas de ventilação mecânica e difusão de ar, incluindo unidades de tratamento de ar (UTAN).">
        <TechnicalTable title="Unidades de Tratamento de Ar, Ventiladores e Difusão" list={report.difusaoList} allPhotos={photos} />
      </ChapterPage>

      {/* 12. CAPÍTULO 10: ILUMINAÇÃO */}
      <ChapterPage chapterNumber={10} title="Sistemas de Iluminação e Gestão" footerAnalysis="A tipologia de iluminação predominante foi registada para cálculo da potência instalada e verificação de sistemas de controlo automático (presença/fluxo).">
        <TechnicalTable title="Levantamento de Luminárias e Gestão de Iluminação" list={report.iluminacaoList} allPhotos={photos} />
      </ChapterPage>

      {/* 13. CAPÍTULO 11: ELEVAÇÃO */}
      <ChapterPage chapterNumber={11} title="Sistemas de Elevação e Transporte" footerAnalysis="Os sistemas de elevação foram analisados quanto ao seu modo de operação e existência de tecnologia de recuperação de energia ou standby eficiente.">
        <TechnicalTable title="Levantamento de Elevadores e Escadas Rolantes" list={report.elevadoresList} allPhotos={photos} />
      </ChapterPage>

      {/* 14. CAPÍTULO 12: COZINHAS E LAVANDARIAS */}
      <ChapterPage chapterNumber={12} title="Cozinhas e Lavandarias Industriais" footerAnalysis="Equipamentos de grande consumo energético nestas áreas funcionais foram registados devido ao seu impacto no perfil de carga do edifício.">
        <TechnicalTable title="Equipamentos de Cozinha e Lavandaria Industrial" list={[...report.cozinhasList, ...report.lavandariaList]} allPhotos={photos} />
      </ChapterPage>

      {/* 15. CAPÍTULO 13: OUTROS SISTEMAS */}
      <ChapterPage chapterNumber={13} title="Piscinas e Outros Sistemas Técnicos" footerAnalysis="Outros sistemas com consumo relevante, como tratamento de águas de piscinas e centros de dados (IT), foram incluídos nesta análise complementar.">
        <TechnicalTable title="Piscina, Equipamentos de TI e Sistemas Auxiliares" list={[...report.piscinaList, ...report.outrosSistemasList]} allPhotos={photos} />
      </ChapterPage>

      {/* 16. CAPÍTULO 14: MURES */}
      <ChapterPage chapterNumber={14} title="Medidas de Melhoria (MURES)" footerAnalysis="As medidas de melhoria propostas visam a otimização do desempenho energético do edifício, com base na análise técnica de custo-benefício.">
         <div className="space-y-4">
           {mures.filter(m => m.checked).map(m => {
             const associatedPhotos = photos.filter(p => m.photoIds?.includes(p.id));
             return (
               <div key={m.id} className="bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded-r-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-[11px] font-black text-emerald-900 uppercase">{m.label}</div>
                    {associatedPhotos.length > 0 && (
                      <div className="flex gap-1">
                        {associatedPhotos.map(p => (
                          <div key={p.id} className="w-12 h-12 border border-emerald-200 rounded overflow-hidden relative">
                             <img src={p.url} className="w-full h-full object-contain" />
                             <div className="absolute top-0 left-0 bg-black/60 text-white text-[5px] px-0.5 font-bold">{p.code}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="text-[10px] text-emerald-700 italic leading-relaxed">{m.note || "Sem observações específicas."}</div>
               </div>
             );
           })}
           {mures.filter(m => m.checked).length === 0 && (
             <p className="text-[10px] text-slate-400 italic">Não foram identificadas medidas de melhoria prioritárias durante a visita.</p>
           )}
         </div>
      </ChapterPage>

      {/* 17. ANEXO FOTOGRÁFICO */}
      <div className="a4-page page-break bg-white p-[15mm]">
         <h2 className="text-2xl font-black text-blue-900 uppercase border-b-2 border-blue-900 pb-2 mb-6">Anexo I - Galeria Fotográfica de Campo</h2>
         <div className="grid grid-cols-3 gap-4">
            {photos.map(p => (
              <div key={p.id} className="border p-2 rounded-lg space-y-2 bg-slate-50">
                <div className="aspect-square rounded overflow-hidden bg-white">
                  <img src={p.url} className="w-full h-full object-contain" alt={p.code} />
                </div>
                <div className="text-[8px]">
                  <div className="font-black text-blue-900 uppercase">{p.code} - {p.category}</div>
                  <div className="text-slate-500 line-clamp-2 italic">{p.caption}</div>
                </div>
              </div>
            ))}
         </div>
         {photos.length === 0 && <div className="text-center py-40 text-slate-300 italic font-black uppercase">Nenhum registo fotográfico incluído no relatório.</div>}
      </div>

      {/* 18. CONTRACAPA */}
      <div className="a4-page bg-blue-900 text-white flex flex-col items-center justify-center p-[20mm] text-center">
        <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mb-10">
          <div className="text-4xl font-black italic">K-CE <span className="opacity-50">FR</span></div>
        </div>
        <h3 className="text-3xl font-black uppercase tracking-widest mb-4">Relatório Concluído</h3>
        <p className="text-sm font-bold text-blue-300 max-w-md uppercase tracking-widest mb-20 leading-relaxed">
          Este documento constitui o registo oficial de campo para o processo de certificação energética.
        </p>
        
        <div className="space-y-2 border-t border-white/10 pt-10 w-full max-w-sm">
           <div className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mb-4">Informação de Contacto</div>
           <div className="text-sm font-black">{building.peritoNome}</div>
           <div className="text-xs text-blue-400">{building.email || "---"}</div>
           <div className="text-xs text-blue-400">{building.telefone || "---"}</div>
        </div>
        
        <div className="absolute bottom-[20mm] text-[8px] font-black opacity-20 uppercase tracking-[0.5em]">
          Gerado Automaticamente por K-CE Field Report Pro v2.5
        </div>
      </div>

    </div>
  );
};

export default PrintView;
