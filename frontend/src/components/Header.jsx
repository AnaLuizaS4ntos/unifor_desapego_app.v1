import { Search, PlusCircle, Gift, Heart, User, CheckCircle2 } from 'lucide-react';
import logoUnidesapego from '../assets/Group 1.png';

export const Header = ({
  searchQuery,
  setSearchQuery,
  onlyDonations,
  setOnlyDonations,
  onlyFavorites,
  setOnlyFavorites,
  favoritesCount,
  donationCount,
  onOpenNewItemModal,
  currentUser,
  onOpenAuthModal
}) => {

  return (

    <header className="sticky top-0 z-40 bg-[#473469] text-white shadow-lg border-b border-[#AE8FBA]/30">
      
      <div className="bg-[#33224E] text-[#F2E7D2] text-xs py-1.5 px-4 font-medium flex items-center justify-between border-b border-[#AE8FBA]/20">
        <div className="flex items-center space-x-2 max-w-7xl mx-auto w-full justify-between">
          <div className="flex items-center space-x-2 overflow-hidden text-ellipsis whitespace-nowrap">
            <span className="inline-block w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
            <span>UNI Desapego • Feito por alunos de Tecnologia para a comunidade campus</span>
          </div>
          <div className="hidden sm:flex items-center space-x-3 text-xs opacity-90">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" /> 100% Gratuito entre Alunos
            </span>

          </div>
        </div>
      </div>


      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        {/* flex-wrap e w-full add */}
        <div className="flex flex-wrap items-center justify-between gap-y-3 gap-x-2 w-full">
          
          <div className="flex items-center space-x-3">
            <img 
              src={logoUnidesapego} 
              alt="Logo UniDesapego" 
              className="w-10 h-10 object-contain flex-shrink-0 drop-shadow-sm"
            />

            
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

          {/* Desktop search bar */}
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

          {/* Right action buttons */}
          <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-3">
            
            {/* Donations filter toggle */}
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

            {/* Favorites toggle button */}
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
              <span>Salvos</span>
              {favoritesCount > 0 && (
                <span className="bg-[#473469] text-[#F79EB1] text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                  {favoritesCount}
                </span>
              )}
            </button>

            {/* USER AREA */}
            <div className="flex items-center space-x-4">
              {currentUser ? (
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
                    {currentUser.name.split(' ')[0]}
                  </span>
                </button>
              ) : (
                <button 
                  onClick={onOpenAuthModal} 
                  className="flex items-center space-x-1.5 text-[#AE8FBA] hover:text-[#F2E7D2] transition font-bold text-xs"
                >
                  <User className="w-5 h-5" />
                  <span>Entrar</span>
                </button>
              )}
            </div>

            {/* Desapegar/post new item Button */}
            <button
              onClick={onOpenNewItemModal}
              className="flex items-center space-x-2 bg-gradient-to-r from-[#10B981] to-[#059669] hover:from-[#059669] hover:to-[#047857] text-white text-xs sm:text-sm font-bold px-3.5 sm:px-4 py-2 rounded-full shadow-md hover:shadow-lg transition transform active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              {/* The text is invisible on mobile */}
              <span className="hidden sm:inline">Desapegar +</span>
            </button>

          </div>
        </div>

        {/* Mobile search input (Visible on mobile) */}
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