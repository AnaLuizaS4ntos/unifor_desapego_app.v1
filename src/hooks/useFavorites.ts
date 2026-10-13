import { useCallback, useEffect, useMemo, useState } from 'react';
import { loadFavorites, saveFavorites } from '../lib/itemStorage';

/** Favoritos persistidos. `toggleFavorite` devolve true se o item passou a ser favorito. */
export function useFavorites() {
  const [favoriteIds, setFavoriteIds] = useState<string[]>(loadFavorites);

  useEffect(() => {
    saveFavorites(favoriteIds);
  }, [favoriteIds]);

  const favoriteSet = useMemo(() => new Set(favoriteIds), [favoriteIds]);

  const toggleFavorite = useCallback(
    (id: string): boolean => {
      const willBeFavorite = !favoriteSet.has(id);
      setFavoriteIds((prev) =>
        prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id],
      );
      return willBeFavorite;
    },
    [favoriteSet],
  );

  return { favoriteSet, toggleFavorite };
}

