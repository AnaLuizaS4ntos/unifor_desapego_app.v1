import { ArrowUpDown, MapPin, Grid, List, Filter, RefreshCw } from 'lucide-react';

const BLOCOS = [
  'Todos',
  'Bloco N (CCT)',
  'Bloco M (CCT)',
  'Bloco D (CCG)',
  'Bloco T (CCS)',
  'Bloco Z (CCJ)',
  'Biblioteca Central',
  'Praça de Convivência',
  'Centro de Convivência'
];

export const FilterBar = ({
  sortBy,
  setSortBy,
  selectedBloco,
  setSelectedBloco,
  selectedCondition,
  setSelectedCondition,
  viewMode,
  setViewMode,
  totalFilteredCount,
  onResetFilters
}) => {
  return (
    <div className="bg-[#F8F7FA] border-b border-[#AE8FBA]/20 py-3 px-4">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        
        {/* Count Indicator */}
        <div className="flex items-center space-x-2 text-[#473469] font-bold">
          <span className="bg-[#473469] text-[#F2E7D2] px-2.5 py-0.5 rounded-full text-[11px]">
            {totalFilteredCount} {totalFilteredCount === 1 ? 'item encontrado' : 'itens encontrados'}
          </span>
          {(selectedBloco !== 'Todos' || selectedCondition !== 'Todos') && (
            <button
              onClick={onResetFilters}
              className="text-[#E25B78] hover:underline text-[11px] font-semibold flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" /> Limpar filtros
            </button>
          )}
        </div>

        {/* Filters Group */}
        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end">
          
          {/* Campus Bloco Selector */}
          <div className="flex items-center space-x-1.5 bg-white border border-[#AE8FBA]/30 px-2.5 py-1.5 rounded-xl shadow-2xs">
            <MapPin className="w-3.5 h-3.5 text-[#F79EB1]" />
            <select
              value={selectedBloco}
              onChange={(e) => setSelectedBloco(e.target.value)}
              className="bg-transparent text-[#473469] font-medium focus:outline-none cursor-pointer"
            >
              <option value="Todos">Todos os Blocos UNIFOR</option>
              {BLOCOS.filter(b => b !== 'Todos').map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          {/* Condition Selector */}
          <div className="flex items-center space-x-1.5 bg-white border border-[#AE8FBA]/30 px-2.5 py-1.5 rounded-xl shadow-2xs">
            <Filter className="w-3.5 h-3.5 text-[#4C5E91]" />
            <select
              value={selectedCondition}
              onChange={(e) => setSelectedCondition(e.target.value)}
              className="bg-transparent text-[#473469] font-medium focus:outline-none cursor-pointer"
            >
              <option value="Todos">Qualquer Estado</option>
              <option value="Novo">Novo</option>
              <option value="Seminovo">Seminovo</option>
              <option value="Usado - Bom Estado">Usado</option>
              <option value="Doação">Doação</option>
            </select>
          </div>

          {/* Sort By Selector */}
          <div className="flex items-center space-x-1.5 bg-white border border-[#AE8FBA]/30 px-2.5 py-1.5 rounded-xl shadow-2xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#473469]" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-[#473469] font-medium focus:outline-none cursor-pointer"
            >
              <option value="recent">Mais Recentes</option>
              <option value="popular">Mais Populares</option>
              <option value="price-asc">Menor Preço</option>
              <option value="price-desc">Maior Preço</option>
            </select>
          </div>

          {/* View Mode Toggle (Grid vs List) */}
          <div className="flex items-center bg-white border border-[#AE8FBA]/30 p-1 rounded-xl shadow-2xs">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1 rounded-lg transition ${
                viewMode === 'grid' ? 'bg-[#473469] text-white' : 'text-[#473469] hover:bg-gray-100'
              }`}
              title="Visualização em Grade"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1 rounded-lg transition ${
                viewMode === 'list' ? 'bg-[#473469] text-white' : 'text-[#473469] hover:bg-gray-100'
              }`}
              title="Visualização em Lista"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};