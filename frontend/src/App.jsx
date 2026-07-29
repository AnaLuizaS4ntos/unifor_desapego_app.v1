import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Header } from './components/Header';
import { CategoryBar } from './components/CategoryBar';
import { FilterBar } from './components/FilterBar';
import { ItemCard } from './components/ItemCard';
import { ItemListItem } from './components/ItemListItem';
import { ItemDetailModal } from './components/ItemDetailModal';
import { NewItemModal } from './components/NewItemModal';
import { PaletteShowcaseModal } from './components/PaletteShowcaseModal';
import { MobileBottomNav } from './components/MobileBottomNav';
import { Sparkles } from 'lucide-react';
import './index.css'
import './App.css';

export default function App() {
  // Estado principal dos itens
  const [items, setItems] = useState([]);

  // Favoritos salvos no navegador (Local Storage)
  const [favoriteIds, setFavoriteIds] = useState(() => {
    const saved = localStorage.getItem('unifor_marketplace_favs');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('unifor_marketplace_favs', JSON.stringify(favoriteIds));
  }, [favoriteIds]);

  // Integração com o Backend (Seu Axios)
  useEffect(() => {
    const fetchAPI = async () => {
      try {
        // Quando o backend estiver pronto, ele vai puxar daqui:
        const response = await axios.get("http://127.0.0.1:5000/products");
        setItems(response.data);
      } catch (error) {
        console.error("Backend não encontrado, carregando dados de teste visuais...", error);
        // Fallback temporário até criarmos a rota no Flask
        setItems([
          {
            id: 'item-1',
            title: 'Kit Arduino Uno R3 + Sensores',
            description: 'Usado por 1 semestre na disciplina de Hardware. Funciona perfeitamente.',
            price: 120,
            isDonation: false,
            category: 'Eletrônicos & Hardware',
            condition: 'Usado - Bom Estado',
            location: 'Bloco N (CCT)',
            images: ['https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&w=800&q=80'],
            seller: { name: 'Ana', course: 'Ciência da Computação', semester: 'Ativo', whatsapp: '5585999999999', verifiedStudent: true },
            createdAt: 'Hoje', views: 12, favoritesCount: 2, tags: ['arduino', 'cct']
          },
          {
            id: 'item-2',
            title: 'Cálculo I - Stewart (Volume 1)',
            description: 'Livro do Stewart, algumas marcações a lápis mas super conservado.',
            price: 0,
            isDonation: true,
            category: 'Livros & Apostilas',
            condition: 'Seminovo',
            location: 'Biblioteca Central',
            images: ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'],
            seller: { name: 'Lucas', course: 'Engenharia', semester: 'Ativo', whatsapp: '5585999999999', verifiedStudent: true },
            createdAt: 'Ontem', views: 45, favoritesCount: 5, tags: ['calculo', 'livro']
          }
        ]);
      }
    };
    fetchAPI();
  }, []);

  // Estados dos Filtros
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [onlyDonations, setOnlyDonations] = useState(false);
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [selectedBloco, setSelectedBloco] = useState('Todos');
  const [selectedCondition, setSelectedCondition] = useState('Todos');
  const [sortBy, setSortBy] = useState('recent');
  const [viewMode, setViewMode] = useState('grid');

  // Estados dos Modais
  const [quickViewItem, setQuickViewItem] = useState(null);
  const [isNewItemModalOpen, setIsNewItemModalOpen] = useState(false);
  const [isPaletteModalOpen, setIsPaletteModalOpen] = useState(false);

  // Notificações (Toast)
  const [toastMessage, setToastMessage] = useState(null);
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Funções de Ação
  const handleToggleFavorite = (id) => {
    setFavoriteIds(prev => {
      const exists = prev.includes(id);
      const updated = exists ? prev.filter(f => f !== id) : [...prev, id];
      showToast(exists ? 'Item removido dos salvos' : 'Item salvo com sucesso! ❤️');
      return updated;
    });
  };

  const handleAddItem = (newItem) => {
    setItems(prev => [newItem, ...prev]);
    showToast('✨ Anúncio publicado localmente (Integraremos o POST depois)!');
  };

  const handleContactWhatsApp = (item) => {
    const cleanNum = item.seller.whatsapp.replace(/\D/g, '');
    const priceText = item.isDonation ? 'Doação Grátis 🎁' : `R$ ${item.price}`;
    const text = `Olá ${item.seller.name}! Vi seu anúncio no UniDesapego UNIFOR: *${item.title}* (${priceText}). Ainda está disponível? Gostaria de combinar no ${item.location}!`;
    const url = `https://wa.me/${cleanNum}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('Todos');
    setOnlyDonations(false);
    setOnlyFavorites(false);
    setSelectedBloco('Todos');
    setSelectedCondition('Todos');
    setSortBy('recent');
  };

  // Contagem de categorias dinâmica
  const categoryCounts = useMemo(() => {
    const counts = { 'Todos': items.length, 'Doação': 0 };
    items.forEach(i => {
      if (i.isDonation) counts['Doação'] = (counts['Doação'] || 0) + 1;
      counts[i.category] = (counts[i.category] || 0) + 1;
    });
    return counts;
  }, [items]);

  // Lógica de Filtros
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesDesc = item.description.toLowerCase().includes(q);
        const matchesCat = item.category.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc && !matchesCat) return false;
      }
      if (selectedCategory !== 'Todos') {
        if (selectedCategory === 'Doação' && !item.isDonation) return false;
        if (selectedCategory !== 'Doação' && item.category !== selectedCategory) return false;
      }
      if (onlyDonations && !item.isDonation) return false;
      if (onlyFavorites && !favoriteIds.includes(item.id)) return false;
      if (selectedBloco !== 'Todos' && item.location !== selectedBloco) return false;
      if (selectedCondition !== 'Todos' && item.condition !== selectedCondition) return false;
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'popular') return b.favoritesCount - a.favoritesCount;
      return b.id.localeCompare(a.id);
    });
  }, [items, searchQuery, selectedCategory, onlyDonations, onlyFavorites, favoriteIds, selectedBloco, selectedCondition, sortBy]);

  const donationCount = useMemo(() => items.filter(i => i.isDonation).length, [items]);

  return (
    <div className="min-h-screen bg-[#F8F7FA] text-[#2D233F] pb-24 md:pb-12 font-sans selection:bg-[#F79EB1] selection:text-[#473469]">
      
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-[#473469] text-[#F2E7D2] text-xs font-bold px-4 py-3 rounded-2xl shadow-xl border border-[#F79EB1] animate-bounce flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-[#F79EB1]" />
          <span>{toastMessage}</span>
        </div>
      )}

      <Header
        searchQuery={searchQuery} setSearchQuery={setSearchQuery}
        onlyDonations={onlyDonations} setOnlyDonations={setOnlyDonations}
        onlyFavorites={onlyFavorites} setOnlyFavorites={setOnlyFavorites}
        favoritesCount={favoriteIds.length} totalItemsCount={items.length}
        donationCount={donationCount}
        onOpenNewItemModal={() => setIsNewItemModalOpen(true)}
        onOpenPaletteModal={() => setIsPaletteModalOpen(true)}
        selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory}
      />

      <CategoryBar
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          setOnlyDonations(cat === 'Doação');
        }}
        categoryCounts={categoryCounts}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-5">
        <div className="bg-gradient-to-r from-[#473469] via-[#3E2D5E] to-[#4C5E91] text-white p-5 sm:p-7 rounded-3xl shadow-xl border border-[#AE8FBA]/30 relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#F2E7D2] tracking-tight">
                Desapegue do que não usa mais no campus 🎓
              </h2>
              <p className="text-xs sm:text-sm text-[#AE8FBA] mt-1.5 max-w-2xl leading-relaxed">
                De Arduinos de computação a jalecos de medicina. Passe adiante ou encontre o que precisa com entrega rápida nos blocos da UNIFOR.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5">
        <FilterBar
          sortBy={sortBy} setSortBy={setSortBy}
          selectedBloco={selectedBloco} setSelectedBloco={setSelectedBloco}
          selectedCondition={selectedCondition} setSelectedCondition={setSelectedCondition}
          viewMode={viewMode} setViewMode={setViewMode}
          totalFilteredCount={filteredItems.length}
          onResetFilters={handleResetFilters}
        />
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {filteredItems.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center border border-[#AE8FBA]/20 shadow-xs max-w-lg mx-auto my-12">
            <h3 className="text-lg font-bold text-[#473469] mb-1">Nenhum item encontrado</h3>
            <p className="text-xs text-gray-500 mb-6">Experimente limpar a busca ou publicar o seu!</p>
            <button onClick={handleResetFilters} className="px-4 py-2.5 bg-[#473469] text-white text-xs font-bold rounded-xl">
              Limpar Filtros
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredItems.map(item => (
              <ItemCard
                key={item.id} item={item}
                isFavorite={favoriteIds.includes(item.id)}
                onToggleFavorite={handleToggleFavorite}
                onQuickView={setQuickViewItem}
                onContactWhatsApp={handleContactWhatsApp}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredItems.map(item => (
              <ItemListItem
                key={item.id} item={item}
                isFavorite={favoriteIds.includes(item.id)}
                onToggleFavorite={handleToggleFavorite}
                onQuickView={setQuickViewItem}
                onContactWhatsApp={handleContactWhatsApp}
              />
            ))}
          </div>
        )}
      </main>

      <ItemDetailModal
        item={quickViewItem} onClose={() => setQuickViewItem(null)}
        isFavorite={quickViewItem ? favoriteIds.includes(quickViewItem.id) : false}
        onToggleFavorite={handleToggleFavorite}
        onContactWhatsApp={handleContactWhatsApp}
      />

      <NewItemModal
        isOpen={isNewItemModalOpen} onClose={() => setIsNewItemModalOpen(false)}
        onAddItem={handleAddItem}
      />

      <PaletteShowcaseModal
        isOpen={isPaletteModalOpen} onClose={() => setIsPaletteModalOpen(false)}
      />

      <MobileBottomNav
        activeTab={onlyDonations ? 'donations' : onlyFavorites ? 'favorites' : 'all'}
        setActiveTab={(tab) => {
          setOnlyDonations(tab === 'donations');
          setOnlyFavorites(tab === 'favorites');
          if (tab === 'donations') setSelectedCategory('Doação');
          else setSelectedCategory('Todos');
        }}
        favoritesCount={favoriteIds.length} donationCount={donationCount}
        onOpenNewItemModal={() => setIsNewItemModalOpen(true)}
        onOpenPaletteModal={() => setIsPaletteModalOpen(true)}
      />

      <footer className="mt-16 border-t border-[#AE8FBA]/20 py-8 bg-white text-center text-xs text-[#AE8FBA]">
        <div className="max-w-7xl mx-auto px-4">
          <p className="font-bold text-[#473469] mb-1">
            UniDesapego UNIFOR — Plataforma de Economia Circular do Campus
          </p>
          <p className="text-[11px] text-gray-500 mb-3">
            Desenvolvido para alunos de todo o campus
          </p>
          <div className="flex items-center justify-center space-x-4 text-[11px] text-[#4C5E91] font-semibold">
            <button onClick={() => setIsPaletteModalOpen(true)} className="hover:underline">Paleta de Cores Hex</button>
            <span>•</span>
            <button onClick={handleResetFilters} className="hover:underline">Ver Todos os Itens</button>
            <span>•</span>
            <button onClick={() => setIsNewItemModalOpen(true)} className="hover:underline">Desapegar de um Item</button>
          </div>
        </div>
      </footer>

    </div>
  );
}