import { useCallback, useEffect, useMemo, useState } from 'react';
import { INITIAL_MARKETPLACE_ITEMS } from '../data/mockItems';
import { loadUserItems, saveUserItems } from '../lib/itemStorage';
import { MarketplaceItem } from '../types';

/**
 * Lista completa = anúncios do usuário (persistidos) + itens de exemplo (vêm do código).
 * Só os anúncios do usuário vão para o localStorage: se você mudar os exemplos, todo mundo vê.
 */
export function useMarketplaceItems() {
  const [userItems, setUserItems] = useState<MarketplaceItem[]>(loadUserItems);

  useEffect(() => {
    saveUserItems(userItems);
  }, [userItems]);

  const items = useMemo(() => [...userItems, ...INITIAL_MARKETPLACE_ITEMS], [userItems]);

  const addItem = useCallback((item: MarketplaceItem) => {
    setUserItems((prev) => [item, ...prev]);
  }, []);

  return { items, addItem };
}

