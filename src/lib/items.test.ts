import { describe, expect, it } from 'vitest';
import { INITIAL_MARKETPLACE_ITEMS } from '../data/mockItems';
import { MarketplaceItem } from '../types';
import {
  countByCategory,
  DEFAULT_FILTERS,
  filterAndSortItems,
  hasActiveFilters,
  normalizeText,
  sortItems,
} from './items';

const NO_FAVORITES: ReadonlySet<string> = new Set();

function makeItem(overrides: Partial<MarketplaceItem>): MarketplaceItem {
  return { ...INITIAL_MARKETPLACE_ITEMS[0], ...overrides };
}

describe('countByCategory', () => {
  it('conta doações pela flag, sem duplicar (bug do chip "Doação" dobrado)', () => {
    const counts = countByCategory(INITIAL_MARKETPLACE_ITEMS);
    const donations = INITIAL_MARKETPLACE_ITEMS.filter((i) => i.isDonation).length;

    expect(counts['Todos']).toBe(INITIAL_MARKETPLACE_ITEMS.length);
    expect(counts['Doação']).toBe(donations);
    expect(donations).toBeGreaterThan(0);
  });

  it('uma doação também conta na sua categoria real', () => {
    const counts = countByCategory(INITIAL_MARKETPLACE_ITEMS);
    expect(counts['Livros & Apostilas']).toBe(2); // as 2 doações de livros do exemplo
  });
});

describe('sortItems', () => {
  it('"recent" coloca o item publicado por último no topo (bug do id.localeCompare)', () => {
    const old = makeItem({ id: 'unifor-item-8', publishedAt: 1_000 });
    const brandNew = makeItem({ id: 'unifor-user-abc', publishedAt: 9_000 });
    const sorted = sortItems([old, brandNew], 'recent');
    expect(sorted[0].id).toBe('unifor-user-abc');
  });

  it('ordena por preço e desempata por mais recente', () => {
    const a = makeItem({ id: 'a', price: 10, publishedAt: 1 });
    const b = makeItem({ id: 'b', price: 10, publishedAt: 2 });
    const c = makeItem({ id: 'c', price: 5, publishedAt: 0 });
    expect(sortItems([a, b, c], 'price-asc').map((i) => i.id)).toEqual(['c', 'b', 'a']);
    expect(sortItems([a, b, c], 'price-desc').map((i) => i.id)).toEqual(['b', 'a', 'c']);
  });

  it('não altera o array original', () => {
    const list = [makeItem({ id: 'a', publishedAt: 1 }), makeItem({ id: 'b', publishedAt: 2 })];
    sortItems(list, 'recent');
    expect(list.map((i) => i.id)).toEqual(['a', 'b']);
  });
});

describe('filterAndSortItems', () => {
  it('categoria "Doação" mostra só doações', () => {
    const result = filterAndSortItems(
      INITIAL_MARKETPLACE_ITEMS,
      { ...DEFAULT_FILTERS, category: 'Doação' },
      NO_FAVORITES,
    );
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((i) => i.isDonation)).toBe(true);
  });

  it('favoritos + doações podem ser combinados', () => {
    const favorites = new Set(['unifor-item-2', 'unifor-item-1']);
    const result = filterAndSortItems(
      INITIAL_MARKETPLACE_ITEMS,
      { ...DEFAULT_FILTERS, category: 'Doação', onlyFavorites: true },
      favorites,
    );
    expect(result.map((i) => i.id)).toEqual(['unifor-item-2']);
  });

  it('busca ignora acentos e maiúsculas', () => {
    const result = filterAndSortItems(
      INITIAL_MARKETPLACE_ITEMS,
      { ...DEFAULT_FILTERS, searchQuery: 'CALCULO' },
      NO_FAVORITES,
    );
    expect(result.some((i) => i.id === 'unifor-item-2')).toBe(true);
  });

  it('filtra por bloco e estado', () => {
    const result = filterAndSortItems(
      INITIAL_MARKETPLACE_ITEMS,
      { ...DEFAULT_FILTERS, bloco: 'Bloco N (CCT)', condition: 'Seminovo' },
      NO_FAVORITES,
    );
    expect(result.every((i) => i.location === 'Bloco N (CCT)' && i.condition === 'Seminovo')).toBe(true);
  });
});

describe('hasActiveFilters / normalizeText', () => {
  it('ordenação não conta como filtro ativo', () => {
    expect(hasActiveFilters({ ...DEFAULT_FILTERS, sortBy: 'price-asc' })).toBe(false);
    expect(hasActiveFilters({ ...DEFAULT_FILTERS, searchQuery: '  ' })).toBe(false);
    expect(hasActiveFilters({ ...DEFAULT_FILTERS, onlyFavorites: true })).toBe(true);
  });

  it('remove acentos', () => {
    expect(normalizeText('Cálculo Ção')).toBe('calculo cao');
  });
});

