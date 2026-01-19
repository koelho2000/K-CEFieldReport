
export enum SectionType {
  CAPA = 'Capa',
  FOTOS = 'Fotos',
  PLANTAS = 'Plantas Gerais',
  LOCALIZACAO = 'Localização',
  DADOS_EDIFICIO = 'Dados do Edifício',
  MANUTENCAO = 'Manutenção e Operação',
  ENERGIA = 'Energia e Monitorização',
  PERFIS = 'Perfis de Funcionamento',
  OCUPACAO_PERFIL = 'Perfil de Ocupação',
  ESPACOS = 'Espaços do Edifício',
  ENVOLVENTE = 'Envolvente',
  SISTEMAS_CLIM = 'Sistemas Climatização',
  PRODUCAO_AQS = 'Produção AQS',
  RENOVAVEIS = 'Sistemas Renováveis',
  DISTRIBUICAO = 'Sistemas Distribuição',
  DIFUSAO = 'Sistemas Difusão',
  ILUMINACAO = 'Iluminação',
  ELEVADORES = 'Elevadores',
  COZINHAS = 'Cozinhas',
  LAVANDARIA = 'Lavandaria',
  PISCINA = 'Piscina',
  OUTROS_SISTEMAS = 'Outros Sistemas (IT/Equip.)',
  MURES = 'MURES'
}

export interface PhotoEntry {
  id: string;
  code: string;
  url: string;
  caption: string;
  category: string;
  includeInReport: boolean;
  estimatedCost?: string;
}

export interface FloorPlanEntry {
  id: string;
  name: string;
  url: string;
  caption: string;
  type: 'image' | 'pdf';
}

export interface TechnicalElement {
  id: string;
  type: string;
  customType?: string;
  description: string;
  photoIds?: string[];
  estado: 'Novo' | 'Bom' | 'Médio' | 'Degradado' | 'Crítico';
  isActive: boolean;
  setpoint?: string;
  // Campos Envolvente
  posicao?: 'Interior' | 'Exterior';
  vidroTipo?: 'Simples' | 'Duplo';
  protecao?: 'Com' | 'Sem';
  protecaoTipo?: string;
  caixilhariaTipo?: 'Alumínio' | 'PVC' | 'Ferro';
  corteTermico?: 'Com' | 'Sem';
}

export interface SpaceElement {
  id: string;
  name: string;
  type: string;
  customType?: string;
  category: 'Edifício' | 'Complementar';
  photoIds?: string[];
}

export interface HourlyProfile {
  daily: number[];
  weekly: number[];
}

export interface OcupacaoProfile extends HourlyProfile {
  monthly: number[]; 
}

export interface MureItem {
  id: string;
  label: string;
  checked: boolean;
  note: string;
  photoIds?: string[];
}

export interface EnergySourceInfo {
  source: string;
  meterRef?: string;
  photoIds?: string[];
}

export interface EnergyInfrastructure {
  fontes: string[];
  fontesInfo: EnergySourceInfo[];
  temPT: boolean;
  ptCodigo: string;
  ptPotencia: string;
  ptPhotoIds?: string[];
  cpeEletricidade: string;
  temContadoresEnergia: boolean;
  temContadoresAgua: boolean;
  temAnalisadores: boolean;
  temSMM: boolean;
  notasMonitorizacao: string;
}

export interface MaintenanceData {
  trmNome: string;
  trmNumero: string;
  tgeNome: string;
  tgeNumero: string;
  empresaNome: string;
  empresaAlvara: string;
  temPMP: boolean;
  temLivroOcorrencias: boolean;
  telasFinais: {
    arquitetura: boolean;
    avac: boolean;
    eletricidade: boolean;
    aguasEsgotos: boolean;
    outros: boolean;
    outrosSpec: string;
  };
  periodicidade: string;
  notasManutencao: string;
  photoIdsPmp?: string[];
  photoIdsFolhaIntervencao?: string[];
}

export interface ReportState {
  auditDate: string;
  coverImage?: string;
  building: {
    nomeEdificio: string;
    morada: string;
    anoConstrucao: string;
    nomeCliente: string;
    clienteMorada: string;
    telefone: string;
    email: string;
    artigoMatricial: string;
    registoConservatoria: string;
    timIII: string;
    empresaAVAC: string;
    cpe: string;
    pt1_kva: string;
    pt2_kva: string;
    identificacaoImovel: string;
    tipoFracao: string;
    utilizacao: string;
    tipoEdificio: string;
    tipoEdificioOutro?: string;
    inercia: string;
    pontoCarregamento: string;
    motivacaoSce: string;
    dataLicenciamento: string;
    contextoCertificado: string;
    peritoNome: string;
    peritoNumero: string;
  };
  location: {
    coords: string; altitude: string; concelho: string;
    orientation: string; googleEarthImage?: string;
  };
  maintenance: MaintenanceData;
  energy: EnergyInfrastructure;
  profiles: {
    geral: HourlyProfile;
    sistemas: {
      allSame: boolean;
      avac: HourlyProfile;
      iluminacao: HourlyProfile;
      outros: HourlyProfile;
    };
    ocupacao: OcupacaoProfile;
  };
  descricaoChecklist: Record<string, string[]>;
  descricaoTemperaturas: Record<string, string>;
  descricaoOutros: Record<string, string>;
  descricaoTecnica: string;
  espacosList: SpaceElement[];
  envolventeList: TechnicalElement[];
  sistemasList: TechnicalElement[];
  aqsList: TechnicalElement[];
  renovaveisList: TechnicalElement[];
  distribuicaoList: TechnicalElement[];
  difusaoList: TechnicalElement[];
  iluminacaoList: TechnicalElement[];
  elevadoresList: TechnicalElement[];
  cozinhasList: TechnicalElement[];
  lavandariaList: TechnicalElement[];
  piscinaList: TechnicalElement[];
  outrosSistemasList: TechnicalElement[];
  photos: PhotoEntry[];
  floorPlans: FloorPlanEntry[];
  mures: MureItem[];
  currentSection: SectionType;
}

export const INITIAL_MURES: MureItem[] = [
  "Fotovoltaico", "Solar Termico", "Variação Caudal UTAN", "Variação Caudal VE", 
  "Variação Caudal Bombas", "Substituição Válvulas Motorizadas", "Contadores Entalpia",
  "Contadores Energia", "Substituição Equipamentos Climatização", "Substituição Equipamentos Ventilação"
].map((label) => ({ id: Math.random().toString(36).substring(7), label, checked: false, note: "", photoIds: [] }));
