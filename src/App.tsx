import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { MarketplaceItem } from './types';
import { Header } from './components/Header';
import { CategoryBar } from './components/CategoryBar';
import { FilterBar } from './components/FilterBar';
import { HeroBanner } from './components/HeroBanner';
import { ActiveFilters } from './components/ActiveFilters';
import { ItemsView } from './components/ItemsView';
import { ItemDetailModal } from './components/ItemDetailModal';
import { NewItemModal } from './components/NewItemModal';
import { PaletteShowcaseModal } from './components/PaletteShowcaseModal';
import { MobileBottomNav } from './components/MobileBottomNav';
import { Footer } from './components/Footer';
import { Toast } from './components/Toast';
import { AuthModal } from './components/AuthModal';
import { useFavorites } from './hooks/useFavorites';
import { useMarketplaceFilters } from './hooks/useMarketplaceFilters';
import { useMarketplaceItems } from './hooks/useMarketplaceItems';
import { useToast } from './hooks/useToast';
import { buildWhatsAppUrl } from './lib/whatsapp';
import {
  AuthUser,
  clearStoredAuth,
  createItemApi,
  fetchItemsApi,
  fetchMeApi,
  incrementItemViewApi,
  toggleFavoriteApi,
} from './services/api';

type ViewMode = 'grid' | 'list';

export default function App() {
  const { items: localItems, addItem } = useMarketplaceItems();
  const { favoriteSet, toggleFavorite } = useFavorites();
  const { toastMessage, showToast } = useToast();

  // Itens em exibição (sincronizados da API ou com fallback local)
  const [items, setItems] = useState<MarketplaceItem[]>(localItems);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const { filters, updateFilters, resetFilters, filteredItems, categoryCounts } =
    useMarketplaceFilters(items, favoriteSet);

  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [quickViewId, setQuickViewId] = useState<string | null>(null);
  const [isNewItemModalOpen, setIsNewItemModalOpen] = useState(false);
  const [isPaletteModalOpen, setIsPaletteModalOpen] = useState(false);

  // Carrega usuário atual ao iniciar
  useEffect(() => {
    fetchMeApi().then((user) => {
      if (user) setCurrentUser(user);
    });
  }, []);

  // Tenta carregar os itens atualizados do PostgreSQL via API
  useEffect(() => {
    fetchItemsApi({
      searchQuery: filters.searchQuery,
      category: filters.category,
      bloco: filters.bloco,
      condition: filters.condition,
      sortBy: filters.sortBy,
      onlyFavorites: filters.onlyFavorites,
    }).then((apiRes) => {
      if (apiRes && apiRes.items.length > 0) {
        setItems(apiRes.items);
      } else {
        // Se a API estiver offline, mantém os dados locais
        setItems(localItems);
      }
    });
  }, [filters, localItems]);

  const donationCount = categoryCounts['Doação'];
  const onlyDonations = filters.category === 'Doação';

  const favoritesCount = useMemo(
    () => items.filter((item) => favoriteSet.has(item.id)).length,
    [items, favoriteSet],
  );

  const quickViewItem = useMemo(
    () => (quickViewId ? (items.find((item) => item.id === quickViewId) ?? null) : null),
    [items, quickViewId],
  );

  const openNewItemModal = useCallback(() => setIsNewItemModalOpen(true), []);
  const closeNewItemModal = useCallback(() => setIsNewItemModalOpen(false), []);
  const openPaletteModal = useCallback(() => setIsPaletteModalOpen(true), []);
  const closePaletteModal = useCallback(() => setIsPaletteModalOpen(false), []);
  const closeQuickView = useCallback(() => setQuickViewId(null), []);

  // Contador de visualizações real: incrementa no banco e reflete na UI!
  const openQuickView = useCallback((item: MarketplaceItem) => {
    setQuickViewId(item.id);

    // Incremento atômico de visualizações no backend
    incrementItemViewApi(item.id).then((updatedViews) => {
      if (typeof updatedViews === 'number') {
        setItems((prev) =>
          prev.map((i) => (i.id === item.id ? { ...i, views: updatedViews } : i))
        );
      } else {
        // Incremento local se API offline
        setItems((prev) =>
          prev.map((i) => (i.id === item.id ? { ...i, views: (i.views || 0) + 1 } : i))
        );
      }
    });
  }, []);

  const handleToggleFavorite = async (id: string) => {
    const isNowFavorite = toggleFavorite(id);
    showToast(isNowFavorite ? 'Item salvo com sucesso! ❤️' : 'Item removido dos salvos');

    // Sincroniza com o banco se o usuário estiver logado
    if (currentUser) {
      await toggleFavoriteApi(id);
    }
  };

  const handleAddItem = async (item: MarketplaceItem) => {
    addItem(item);
    setItems((prev) => [item, ...prev]);

    // Tenta salvar no PostgreSQL
    createItemApi(item);

    resetFilters();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast('✨ Anúncio publicado com sucesso no UniDesapego!');
  };

  const handleContactWhatsApp = (item: MarketplaceItem) => {
    const url = buildWhatsAppUrl(item);
    if (!url) {
      showToast('Este anúncio tem um número de WhatsApp inválido.');
      return;
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleLogout = () => {
    clearStoredAuth();
    setCurrentUser(null);
    showToast('Você saiu da sua conta.');
  };

  const handleToggleDonations = () => {
    updateFilters({ category: onlyDonations ? 'Todos' : 'Doação' });
  };

  const handleMobileTabChange = (tab: 'all' | 'donations' | 'favorites') => {
    if (tab === 'donations') updateFilters({ category: 'Doação', onlyFavorites: false });
    else if (tab === 'favorites') updateFilters({ category: 'Todos', onlyFavorites: true });
    else updateFilters({ category: 'Todos', onlyFavorites: false });
  };

  const mobileActiveTab = filters.onlyFavorites ? 'favorites' : onlyDonations ? 'donations' : 'all';

  return (
    <div className="min-h-screen bg-[#F8F7FA] text-[#2D233F] pb-24 md:pb-12 font-sans selection:bg-[#F79EB1] selection:text-[#473469]">
      <Toast message={toastMessage} />

      {/* Header + categorias grudam juntos no topo */}
      <div className="sticky top-0 z-40">
        <Header
          searchQuery={filters.searchQuery}
          onSearchChange={(searchQuery) => updateFilters({ searchQuery })}
          onlyDonations={onlyDonations}
          onToggleDonations={handleToggleDonations}
          onlyFavorites={filters.onlyFavorites}
          onToggleFavorites={() => updateFilters({ onlyFavorites: !filters.onlyFavorites })}
          favoritesCount={favoritesCount}
          donationCount={donationCount}
          onOpenNewItemModal={openNewItemModal}
          onOpenPaletteModal={openPaletteModal}
          currentUser={currentUser}
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
          onLogout={handleLogout}
        />

        <CategoryBar
          selectedCategory={filters.category}
          onSelectCategory={(category) => updateFilters({ category })}
          categoryCounts={categoryCounts}
        />
      </div>

      <HeroBanner
        donationCount={donationCount}
        onShowDonations={() => updateFilters({ category: 'Doação', onlyFavorites: false })}
        onOpenNewItemModal={openNewItemModal}
      />

      <div className="mt-5">
        <FilterBar
          sortBy={filters.sortBy}
          setSortBy={(sortBy) => updateFilters({ sortBy })}
          selectedBloco={filters.bloco}
          setSelectedBloco={(bloco) => updateFilters({ bloco })}
          selectedCondition={filters.condition}
          setSelectedCondition={(condition) => updateFilters({ condition })}
          viewMode={viewMode}
          setViewMode={setViewMode}
          totalFilteredCount={filteredItems.length}
          onResetFilters={resetFilters}
        />
      </div>

      <ActiveFilters
        filters={filters}
        favoritesCount={favoritesCount}
        onChange={updateFilters}
        onReset={resetFilters}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <ItemsView
          items={filteredItems}
          viewMode={viewMode}
          favoriteIds={favoriteSet}
          onToggleFavorite={handleToggleFavorite}
          onQuickView={openQuickView}
          onContactWhatsApp={handleContactWhatsApp}
          onResetFilters={resetFilters}
          onOpenNewItemModal={openNewItemModal}
        />
      </main>

      {/* Modais */}
      {quickViewItem && (
        <ItemDetailModal
          key={quickViewItem.id}
          item={quickViewItem}
          onClose={closeQuickView}
          isFavorite={favoriteSet.has(quickViewItem.id)}
          onToggleFavorite={handleToggleFavorite}
          onContactWhatsApp={handleContactWhatsApp}
        />
      )}

      {isNewItemModalOpen && (
        <NewItemModal
          onClose={closeNewItemModal}
          onAddItem={handleAddItem}
        />
      )}

      {isPaletteModalOpen && <PaletteShowcaseModal onClose={closePaletteModal} />}

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={(user) => {
          setCurrentUser(user);
          showToast(`Bem-vindo(a), ${user.name.split(' ')[0]}! 🎉`);
        }}
      />

      <MobileBottomNav
        activeTab={mobileActiveTab}
        setActiveTab={handleMobileTabChange}
        favoritesCount={favoritesCount}
        donationCount={donationCount}
        onOpenNewItemModal={openNewItemModal}
        onOpenPaletteModal={openPaletteModal}
      />

      <Footer
        onOpenPaletteModal={openPaletteModal}
        onResetFilters={resetFilters}
        onOpenNewItemModal={openNewItemModal}
      />
    </div>
  );
}
