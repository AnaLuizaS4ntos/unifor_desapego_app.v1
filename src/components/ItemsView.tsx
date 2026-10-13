import React from 'react';
import { MarketplaceItem } from '../types';
import { ItemCard } from './ItemCard';
import { ItemListItem } from './ItemListItem';

interface ItemsViewProps {
  items: MarketplaceItem[];
  viewMode: 'grid' | 'list';
  favoriteIds: ReadonlySet<string>;
  onToggleFavorite: (id: string) => void;
  onQuickView: (item: MarketplaceItem) => void;
  onContactWhatsApp: (item: MarketplaceItem) => void;
  onResetFilters: () => void;
  onOpenNewItemModal: () => void;
}

/** Lista de anúncios (grade ou lista) ou o estado vazio. */
export const ItemsView: React.FC<ItemsViewProps> = ({
  items,
  viewMode,
  favoriteIds,
  onToggleFavorite,
  onQuickView,
  onContactWhatsApp,
  onResetFilters,
  onOpenNewItemModal,
}) => {
  if (items.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-10 text-center border border-[#AE8FBA]/20 shadow-xs max-w-lg mx-auto my-12">
        <div className="w-16 h-16 bg-[#F2E7D2] text-[#473469] rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl font-black">
          🔍
        </div>
        <h3 className="text-lg font-bold text-[#473469] mb-1">Nenhum item encontrado</h3>
        <p className="text-xs text-gray-500 mb-6 leading-relaxed">
          Não encontramos nenhum desapego com os filtros atuais no campus da UNIFOR. Experimente limpar a busca ou publicar o seu!
        </p>
        <div className="flex items-center justify-center space-x-3">
          <button
            onClick={onResetFilters}
            className="px-4 py-2.5 bg-[#473469] text-white text-xs font-bold rounded-xl hover:bg-[#352552] transition"
          >
            Limpar Filtros
          </button>
          <button
            onClick={onOpenNewItemModal}
            className="px-4 py-2.5 bg-[#10B981] text-white text-xs font-bold rounded-xl hover:bg-[#059669] transition"
          >
            Publicar Primeiro Item
          </button>
        </div>
      </div>
    );
  }

  const Row = viewMode === 'grid' ? ItemCard : ItemListItem;
  const containerClass =
    viewMode === 'grid'
      ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'
      : 'space-y-3';

  return (
    <div className={containerClass}>
      {items.map((item) => (
        <Row
          key={item.id}
          item={item}
          isFavorite={favoriteIds.has(item.id)}
          onToggleFavorite={onToggleFavorite}
          onQuickView={onQuickView}
          onContactWhatsApp={onContactWhatsApp}
        />
      ))}
    </div>
  );
};

