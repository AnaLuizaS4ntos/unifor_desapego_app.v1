import { useCallback, useMemo, useState } from 'react';
import { countByCategory, DEFAULT_FILTERS, filterAndSortItems } from '../lib/items';
import { FilterState, MarketplaceItem } from '../types';

/**
 * Estado dos filtros em um único objeto.
 * "Doação" é só um valor de `category` (não existe mais um booleano `onlyDonations` separado),
 * então botão do header, chip de categoria, banner e menu mobile nunca ficam dessincronizados.
 */
export function useMarketplaceFilters(items: MarketplaceItem[], favoriteIds: ReadonlySet<string>) {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

  const updateFilters = useCallback((patch: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...patch }));
  }, []);

  const resetFilters = useCallback(() => setFilters(DEFAULT_FILTERS), []);

  const filteredItems = useMemo(
    () => filterAndSortItems(items, filters, favoriteIds),
    [items, filters, favoriteIds],
  );

  const categoryCounts = useMemo(() => countByCategory(items), [items]);

  return { filters, updateFilters, resetFilters, filteredItems, categoryCounts };
}

