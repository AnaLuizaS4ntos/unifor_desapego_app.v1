import { ITEM_CATEGORIES } from '../constants';
import { CategoryFilter, FilterState, MarketplaceItem, SortOption } from '../types';

/** Lógica de filtro/ordenação/contagem, separada da UI para ser testável. */

export const DEFAULT_FILTERS: FilterState = {
  searchQuery: '',
  category: 'Todos',
  onlyFavorites: false,
  bloco: 'Todos',
  condition: 'Todos',
  sortBy: 'recent',
};

/** Minúsculas e sem acentos: "Cálculo" casa com a busca "calculo". */
export function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function matchesSearch(item: MarketplaceItem, query: string): boolean {
  const q = normalizeText(query.trim());
  if (!q) return true;

  const fields = [
    item.title,
    item.description,
    item.category,
    item.location,
    item.seller.name,
    item.seller.course,
    item.isDonation ? 'doação grátis' : '',
    ...item.tags,
  ];
  return fields.some((field) => normalizeText(field).includes(q));
}

export function matchesFilters(
  item: MarketplaceItem,
  filters: FilterState,
  favoriteIds: ReadonlySet<string>,
): boolean {
  if (!matchesSearch(item, filters.searchQuery)) return false;

  if (filters.category === 'Doação') {
    if (!item.isDonation) return false;
  } else if (filters.category !== 'Todos' && item.category !== filters.category) {
    return false;
  }

  if (filters.onlyFavorites && !favoriteIds.has(item.id)) return false;
  if (filters.bloco !== 'Todos' && item.location !== filters.bloco) return false;
  if (filters.condition !== 'Todos' && item.condition !== filters.condition) return false;

  return true;
}

export function sortItems(items: MarketplaceItem[], sortBy: SortOption): MarketplaceItem[] {
  const byRecent = (a: MarketplaceItem, b: MarketplaceItem) => b.publishedAt - a.publishedAt;

  const compare = (a: MarketplaceItem, b: MarketplaceItem): number => {
    switch (sortBy) {
      case 'price-asc':
        return a.price - b.price || byRecent(a, b);
      case 'price-desc':
        return b.price - a.price || byRecent(a, b);
      case 'popular':
        return b.favoritesCount - a.favoritesCount || byRecent(a, b);
      default:
        return byRecent(a, b);
    }
  };

  return [...items].sort(compare);
}

export function filterAndSortItems(
  items: MarketplaceItem[],
  filters: FilterState,
  favoriteIds: ReadonlySet<string>,
): MarketplaceItem[] {
  return sortItems(
    items.filter((item) => matchesFilters(item, filters, favoriteIds)),
    filters.sortBy,
  );
}

/** "Doação" conta pela flag isDonation; as demais, pela categoria real. */
export function countByCategory(items: MarketplaceItem[]): Record<CategoryFilter, number> {
  const counts = { Todos: items.length, Doação: 0 } as Record<CategoryFilter, number>;
  ITEM_CATEGORIES.forEach((category) => {
    counts[category] = 0;
  });

  items.forEach((item) => {
    if (item.isDonation) counts['Doação'] += 1;
    counts[item.category] += 1;
  });

  return counts;
}

/** A ordenação não conta como "filtro ativo". */
export function hasActiveFilters(filters: FilterState): boolean {
  return (
    filters.searchQuery.trim() !== '' ||
    filters.category !== 'Todos' ||
    filters.onlyFavorites ||
    filters.bloco !== 'Todos' ||
    filters.condition !== 'Todos'
  );
}

