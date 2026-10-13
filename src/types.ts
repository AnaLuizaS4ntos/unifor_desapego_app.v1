import { ITEM_CATEGORIES, ITEM_CONDITIONS, OTHER_BLOCO, UNIFOR_BLOCOS } from './constants';

/** Categorias reais de um anúncio. "Doação" NÃO é categoria: é a flag `isDonation`. */
export type ItemCategory = (typeof ITEM_CATEGORIES)[number];

/** Valores aceitos pelo filtro de categoria (inclui os "filtros virtuais"). */
export type CategoryFilter = 'Todos' | 'Doação' | ItemCategory;

/** Estado de conservação real do item (doação também tem um estado real). */
export type ItemCondition = (typeof ITEM_CONDITIONS)[number];

export type UniforBloco = (typeof UNIFOR_BLOCOS)[number] | typeof OTHER_BLOCO;

export interface MarketplaceItem {
  id: string;
  title: string;
  description: string;
  price: number; // 0 means Doação Grátis
  isDonation: boolean;
  category: ItemCategory;
  condition: ItemCondition;
  location: UniforBloco;
  images: string[];
  seller: {
    name: string;
    course: string;
    semester: string;
    whatsapp: string;
    avatarUrl?: string;
    verifiedStudent: boolean;
  };
  /** Momento da publicação (epoch em ms). O texto "Há 2 horas" é calculado a partir dele. */
  publishedAt: number;
  views: number;
  favoritesCount: number;
  featured?: boolean;
  tags: string[];
}

export type SortOption = 'recent' | 'price-asc' | 'price-desc' | 'popular';

export interface FilterState {
  searchQuery: string;
  category: CategoryFilter;
  onlyFavorites: boolean;
  bloco: UniforBloco | 'Todos';
  condition: ItemCondition | 'Todos';
  sortBy: SortOption;
}
