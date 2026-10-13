import { MarketplaceItem } from '../types';

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;
/** Os itens de exemplo são "publicados" num tempo relativo a agora, para o texto "Há X horas" ficar coerente. */
const ago = (ms: number) => Date.now() - ms;

export const INITIAL_MARKETPLACE_ITEMS: MarketplaceItem[] = [
  {
    id: 'unifor-item-1',
    title: 'Kit Arduino Uno R3 + Shield CNC + Módulos Sensores',
    description: 'Kit completo de robótica utilizado na cadeira de Sistemas Embarcados da Ciência da Computação UNIFOR. Acompanha Arduino Uno original, protoboard 830 furos, jumpers macho-fêmea, display LCD 16x2 com I2C e sensores ultrassônicos.',
    price: 110,
    isDonation: false,
    category: 'Eletrônicos & Hardware',
    condition: 'Seminovo',
    location: 'Bloco N (CCT)',
    images: [
      'https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80'
    ],
    seller: {
      name: 'Lucas Ferreira',
      course: 'Ciência da Computação',
      semester: '6º Semestre',
      whatsapp: '5585988776655',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      verifiedStudent: true
    },
    publishedAt: ago(2 * HOUR),
    views: 84,
    favoritesCount: 12,
    featured: true,
    tags: ['arduino', 'computacao', 'embarcados', 'cct', 'eletronica']
  },
  {
    id: 'unifor-item-2',
    title: 'Livro Cálculo de James Stewart - Vol. 1 e 2 (7ª Edição)',
    description: 'Livros fundamentais para Cálculo I, II e III no CCT da UNIFOR. Sem grifos de caneta, apenas algumas anotações a lápis resolvidas. Capa dura em excelente estado.',
    price: 0,
    isDonation: true,
    category: 'Livros & Apostilas',
    condition: 'Usado - Bom Estado',
    location: 'Biblioteca Central',
    images: [
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80'
    ],
    seller: {
      name: 'Mariana Duarte',
      course: 'Engenharia Civil',
      semester: '8º Semestre',
      whatsapp: '5585999887766',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
      verifiedStudent: true
    },
    publishedAt: ago(5 * HOUR),
    views: 142,
    favoritesCount: 29,
    featured: true,
    tags: ['calculo', 'stewart', 'livros', 'doacao', 'gratis']
  },
  {
    id: 'unifor-item-3',
    title: 'Jaleco de Algodão Manga Longa Feminino UNIFOR (Tamanho M)',
    description: 'Jaleco bordado com o brasão de saúde da UNIFOR, 100% algodão gabardine, super confortável. Usado apenas no laboratório do Bloco T. Higienizado e passado.',
    price: 55,
    isDonation: false,
    category: 'Saúde & Jalecos',
    condition: 'Seminovo',
    location: 'Bloco T (CCS)',
    images: [
      'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80'
    ],
    seller: {
      name: 'Beatriz Vasconcelos',
      course: 'Medicina',
      semester: '4º Semestre',
      whatsapp: '5585991122334',
      avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
      verifiedStudent: true
    },
    publishedAt: ago(1 * DAY),
    views: 65,
    favoritesCount: 8,
    tags: ['jaleco', 'medicina', 'ccs', 'laboratorio']
  },
  {
    id: 'unifor-item-4',
    title: 'Calculadora Científica Casio FX-991EX ClassWiz',
    description: 'A calculadora permitida em provas do CCT. Resolve matrizes, equações do 4º grau e integrais definidas diretamente. Bateria solar funcionando perfeitamente.',
    price: 130,
    isDonation: false,
    category: 'Eletrônicos & Hardware',
    condition: 'Seminovo',
    location: 'Bloco M (CCT)',
    images: [
      'https://images.unsplash.com/photo-1611125832047-1d7ad1e8e48a?auto=format&fit=crop&w=800&q=80'
    ],
    seller: {
      name: 'Gabriel Menezes',
      course: 'Engenharia de Computação',
      semester: '7º Semestre',
      whatsapp: '5585981234567',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      verifiedStudent: true
    },
    publishedAt: ago(1 * DAY + 6 * HOUR),
    views: 110,
    favoritesCount: 15,
    tags: ['calculadora', 'casio', 'exatas', 'cct']
  },
  {
    id: 'unifor-item-5',
    title: 'Monitor Dell 24" IPS Full HD - Ideal para Estudo & Código',
    description: 'Monitor Dell modelo P2419H com ajuste de altura e rotação vertical (modo pivot ótimo para programar). Entrada HDMI, DisplayPort e Hub USB. Motivo: estou me mudando da kitnet perto da UNIFOR.',
    price: 490,
    isDonation: false,
    category: 'Eletrônicos & Hardware',
    condition: 'Usado - Bom Estado',
    location: 'Praça de Convivência',
    images: [
      'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80'
    ],
    seller: {
      name: 'Rodrigo Alencar',
      course: 'Ciência da Computação',
      semester: 'Graduado',
      whatsapp: '5585987654321',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
      verifiedStudent: true
    },
    publishedAt: ago(2 * DAY),
    views: 230,
    favoritesCount: 31,
    featured: true,
    tags: ['monitor', 'dell', 'setup', 'computacao', 'kitnet']
  },
  {
    id: 'unifor-item-6',
    title: 'Apostilas de Vade Mecum & Doutrina Direito Constitucional (OAB)',
    description: 'Lote de apostilas de revisão e Vade Mecum atualizado. Ideal para alunos do CCJ que vão prestar o exame da ordem ou precisam de apoio para as cadeiras do 3º ao 6º semestre.',
    price: 0,
    isDonation: true,
    category: 'Livros & Apostilas',
    condition: 'Usado - Bom Estado',
    location: 'Bloco Z (CCJ)',
    images: [
      'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80'
    ],
    seller: {
      name: 'Larissa Rocha',
      course: 'Direito',
      semester: '9º Semestre',
      whatsapp: '5585994455667',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      verifiedStudent: true
    },
    publishedAt: ago(3 * DAY),
    views: 95,
    favoritesCount: 18,
    tags: ['direito', 'vademecum', 'doacao', 'ccj']
  },
  {
    id: 'unifor-item-7',
    title: 'Cadeira de Escritório Ergonômica com Apoio Lombar',
    description: 'Cadeira com regulagem de altura a gás e relaxamento. Perfeita para longas noites estudando ou programando na kitnet. Tecido mesh respirável na cor preta.',
    price: 180,
    isDonation: false,
    category: 'Móveis & Kitnet',
    condition: 'Usado - Bom Estado',
    location: 'Centro de Convivência',
    images: [
      'https://images.unsplash.com/photo-1580481072645-022f9a6d1270?auto=format&fit=crop&w=800&q=80'
    ],
    seller: {
      name: 'Felipe Holanda',
      course: 'Administração',
      semester: '5º Semestre',
      whatsapp: '5585988223344',
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
      verifiedStudent: true
    },
    publishedAt: ago(3 * DAY + 4 * HOUR),
    views: 178,
    favoritesCount: 22,
    tags: ['cadeira', 'moveis', 'kitnet', 'estudo']
  },
  {
    id: 'unifor-item-8',
    title: 'Teclado Mecânico Keychron K2 Wireless Red Switches',
    description: 'Teclado mecânico Bluetooth/USB-C muito macio e silencioso para usar na biblioteca. Funciona em Mac, Windows e Linux. Bateria dura semanas.',
    price: 320,
    isDonation: false,
    category: 'Eletrônicos & Hardware',
    condition: 'Seminovo',
    location: 'Bloco N (CCT)',
    images: [
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80'
    ],
    seller: {
      name: 'Igor Sampaio',
      course: 'Ciência da Computação',
      semester: '5º Semestre',
      whatsapp: '5585997788990',
      avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80',
      verifiedStudent: true
    },
    publishedAt: ago(4 * DAY),
    views: 205,
    favoritesCount: 27,
    tags: ['teclado', 'keychron', 'mecanico', 'computacao']
  }
];
