import { Search, PlusCircle, Gift, Heart, Sparkles, User } from 'lucide-react';
import logoUnidesapego from '../assets/Group 1.png';

export const Header = ({
  searchQuery,
  setSearchQuery,
  onlyDonations,
  setOnlyDonations,
  onlyFavorites,
  setOnlyFavorites,
  favoritesCount,
  totalItemsCount,
  donationCount,
  onOpenNewItemModal,
  onOpenPaletteModal,
  selectedCategory,
  setSelectedCategory,
  currentUser,
  onOpenAuthModal
}) => {
  return (

    <header className="sticky top-0 z-40 bg-[#473469] text-white shadow-lg border-b border-[#AE8FBA]/30">
      
      <div className="bg-[#33224E] text-[#F2E7D2] text-xs py-1.5 px-4 font-medium flex items-center justify-between border-b border-[#AE8FBA]/20">
        <div className="flex items-center space-x-2 max-w-7xl mx-auto w-full justify-between">
          <div className="flex items-center space-x-2 overflow-hidden text-ellipsis whitespace-nowrap">
            <span className="inline-block w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
            <span>UNIFOR Desapego • Feito por alunos de Ciência da Computação para a comunidade campus</span>
          </div>
          <div className="hidden sm:flex items-center space-x-3 text-xs opacity-90">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" /> 100% Gratuito entre Alunos
            </span>
            <button 
              onClick={onOpenPaletteModal}
              className="text-[#F79EB1] hover:underline flex items-center gap-1 font-semibold ml-2"
            >
              <Sparkles className="w-3.5 h-3.5" /> Ver Paleta & Design Specs
            </button>
          </div>
        </div>
      </div>


      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex items-center justify-between gap-3">
          

          <div className="flex items-center space-x-3">
            <img 
              src={logoUnidesapego} 
              alt="Logo UniDesapego" 
              className="w-10 h-10 object-contain flex-shrink-0 drop-shadow-sm"
            />
            
            {/* Aqui continua o código do texto que você me mandou na print */}
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-lg sm:text-xl font-bold tracking-tight text-[#F2E7D2]">
                  Uni<span className="text-[#F79EB1]">Desapego</span>
                </h1>
                <span className="bg-[#4C5E91]/60 text-[#F2E7D2] text-[10px] font-semibold px-2 py-0.5 rounded-full border border-[#AE8FBA]/30">
                  UNIFOR
                </span>
              </div>
              <p className="text-[11px] text-[#AE8FBA] hidden sm:block">
                Marketplace universitário & doações de coisas que você não usa mais
              </p>
            </div>
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-4 relative">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#AE8FBA]" />
              <input
                type="text"
                placeholder="Buscar Arduino, Jaleco, Cálculo, Monitor, Mesa..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-9 py-2 rounded-full bg-[#352552] border border-[#AE8FBA]/40 text-sm text-[#F2E7D2] placeholder-[#AE8FBA]/70 focus:outline-none focus:ring-2 focus:ring-[#F79EB1] focus:border-transparent transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#AE8FBA] hover:text-white bg-[#473469] w-5 h-5 rounded-full flex items-center justify-center"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Donations Filter Toggle */}
            <button
              onClick={() => {
                setOnlyDonations(!onlyDonations);
                if (onlyFavorites) setOnlyFavorites(false);
              }}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition border ${
                onlyDonations
                  ? 'bg-[#10B981] text-white border-[#10B981] shadow-md'
                  : 'bg-[#352552] text-[#F2E7D2] border-[#AE8FBA]/40 hover:bg-[#4C5E91]/40'
              }`}
            >
              <Gift className={`w-3.5 h-3.5 ${onlyDonations ? 'animate-bounce' : 'text-[#10B981]'}`} />
              <span className="hidden xs:inline">Doações</span>
              <span className="bg-[#473469] text-[#F2E7D2] text-[10px] px-1.5 py-0.2 rounded-full font-bold ml-1">
                {donationCount}
              </span>
            </button>

            {/* Favorites Toggle Button */}
            <button
              onClick={() => {
                setOnlyFavorites(!onlyFavorites);
                if (onlyDonations) setOnlyDonations(false);
              }}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition border ${
                onlyFavorites
                  ? 'bg-[#F79EB1] text-[#473469] border-[#F79EB1] shadow-md font-bold'
                  : 'bg-[#352552] text-[#F2E7D2] border-[#AE8FBA]/40 hover:bg-[#4C5E91]/40'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${onlyFavorites ? 'fill-[#473469]' : 'text-[#F79EB1]'}`} />
              <span className="hidden sm:inline">Salvos</span>
              {favoritesCount > 0 && (
                <span className="bg-[#473469] text-[#F79EB1] text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                  {favoritesCount}
                </span>
              )}
            </button>

            {/* ----- ÁREA DO USUÁRIO ----- */}
          <div className="flex items-center space-x-4">
            
            {currentUser ? (
              // Mostra a foto e o nome se estiver logado
              <button 
                onClick={onOpenAuthModal} 
                className="flex items-center space-x-2 hover:opacity-80 transition bg-[#352552] py-1.5 px-3 rounded-full border border-[#AE8FBA]/30"
              >
                <img 
                  src={currentUser.avatarUrl} 
                  alt="Perfil" 
                  className="w-7 h-7 rounded-full border border-[#F79EB1] object-cover"
                />
                <span className="text-xs font-bold text-[#F2E7D2] hidden sm:block">
                  {currentUser.name.split(' ')[0]} {/* Pega só o primeiro nome */}
                </span>
              </button>
            ) : (
              // Mostra o botão de Entrar se não estiver logado
              <button 
                onClick={onOpenAuthModal} 
                className="flex items-center space-x-1.5 text-[#AE8FBA] hover:text-[#F2E7D2] transition font-bold text-xs"
              >
                <User className="w-5 h-5" />
                <span className="hidden sm:block">Entrar</span>
              </button>
            )}

            {/* O seu botão de Desapegar já existente deve estar logo abaixo daqui! */}
            <button
              onClick={onOpenNewItemModal}
              // ... classes do seu botão de desapegar ...
            >
               {/* ... */}
            </button>
            
          </div>


            {/* Desapegar / Post New Item Button */}
            <button
              onClick={onOpenNewItemModal}
              className="flex items-center space-x-2 bg-gradient-to-r from-[#10B981] to-[#059669] hover:from-[#059669] hover:to-[#047857] text-white text-xs sm:text-sm font-bold px-3.5 sm:px-4 py-2 rounded-full shadow-md hover:shadow-lg transition transform active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Desapegar +</span>
            </button>

          </div>
        </div>

        {/* Mobile Search Input (Visible on mobile) */}
        <div className="mt-3 md:hidden">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#AE8FBA]" />
            <input
              type="text"
              placeholder="Buscar em todos os blocos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-9 py-2 rounded-full bg-[#352552] border border-[#AE8FBA]/40 text-sm text-[#F2E7D2] placeholder-[#AE8FBA]/70 focus:outline-none focus:ring-2 focus:ring-[#F79EB1]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#AE8FBA] bg-[#473469] w-5 h-5 rounded-full flex items-center justify-center"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};