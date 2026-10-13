import React from 'react';
import { MapPin } from 'lucide-react';
import { hasActiveFilters } from '../lib/items';
import { FilterState } from '../types';

interface ActiveFiltersProps {
  filters: FilterState;
  favoritesCount: number;
  onChange: (patch: Partial<FilterState>) => void;
  onReset: () => void;
}

/** Faixa com os "chips" dos filtros ativos. Só aparece se houver algum filtro. */
export const ActiveFilters: React.FC<ActiveFiltersProps> = ({
  filters,
  favoritesCount,
  onChange,
  onReset,
}) => {
  if (!hasActiveFilters(filters)) return null;

  const { category, onlyFavorites, bloco, condition, searchQuery } = filters;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="text-gray-500 font-semibold">Filtros Ativos:</span>

        {category === 'Doação' && (
          <span className="bg-[#ECFDF5] text-[#047857] border border-[#10B981]/30 px-3 py-1 rounded-full font-bold flex items-center gap-1">
            🎁 Somente Doações Grátis
            <button
              onClick={() => onChange({ category: 'Todos' })}
              className="ml-1 text-gray-400 hover:text-black"
              aria-label="Remover filtro de doações"
            >
              ✕
            </button>
          </span>
        )}

        {category !== 'Todos' && category !== 'Doação' && (
          <span className="bg-[#473469] text-white px-3 py-1 rounded-full font-semibold flex items-center gap-1">
            {category}
            <button
              onClick={() => onChange({ category: 'Todos' })}
              className="ml-1 text-white/80 hover:text-white"
              aria-label="Remover filtro de categoria"
            >
              ✕
            </button>
          </span>
        )}

        {onlyFavorites && (
          <span className="bg-[#F79EB1] text-[#473469] px-3 py-1 rounded-full font-bold flex items-center gap-1">
            ❤️ Salvos ({favoritesCount})
            <button
              onClick={() => onChange({ onlyFavorites: false })}
              className="ml-1 text-[#473469]"
              aria-label="Remover filtro de salvos"
            >
              ✕
            </button>
          </span>
        )}

        {bloco !== 'Todos' && (
          <span className="bg-white text-[#473469] border border-[#AE8FBA]/40 px-3 py-1 rounded-full font-semibold flex items-center gap-1">
            <MapPin className="w-3 h-3 text-[#F79EB1]" /> {bloco}
            <button
              onClick={() => onChange({ bloco: 'Todos' })}
              className="ml-1 text-gray-500"
              aria-label="Remover filtro de bloco"
            >
              ✕
            </button>
          </span>
        )}

        {condition !== 'Todos' && (
          <span className="bg-white text-[#473469] border border-[#AE8FBA]/40 px-3 py-1 rounded-full font-semibold flex items-center gap-1">
            {condition}
            <button
              onClick={() => onChange({ condition: 'Todos' })}
              className="ml-1 text-gray-500"
              aria-label="Remover filtro de estado"
            >
              ✕
            </button>
          </span>
        )}

        {searchQuery.trim() && (
          <span className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full font-medium flex items-center gap-1">
            "{searchQuery}"
            <button
              onClick={() => onChange({ searchQuery: '' })}
              className="ml-1"
              aria-label="Limpar busca"
            >
              ✕
            </button>
          </span>
        )}

        <button onClick={onReset} className="text-[#E25B78] hover:underline font-bold text-xs ml-2">
          Limpar Todos
        </button>
      </div>
    </div>
  );
};

