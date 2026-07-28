import { Home, Gift, PlusCircle, Heart, Palette } from 'lucide-react';

export const MobileBottomNav = ({
  activeTab,
  setActiveTab,
  favoritesCount,
  donationCount,
  onOpenNewItemModal,
  onOpenPaletteModal
}) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#473469] border-t border-[#AE8FBA]/30 text-white py-2 px-3 shadow-2xl">
      <div className="flex items-center justify-around max-w-md mx-auto">
        
        {/* Explore */}
        <button
          onClick={() => setActiveTab('all')}
          className={`flex flex-col items-center justify-center p-1 rounded-xl transition ${
            activeTab === 'all' ? 'text-[#F79EB1] font-bold' : 'text-[#F2E7D2]/80 hover:text-white'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Explorar</span>
        </button>

        {/* Donations */}
        <button
          onClick={() => setActiveTab('donations')}
          className={`flex flex-col items-center justify-center p-1 rounded-xl relative transition ${
            activeTab === 'donations' ? 'text-[#10B981] font-bold' : 'text-[#F2E7D2]/80 hover:text-white'
          }`}
        >
          <Gift className="w-5 h-5 text-[#10B981]" />
          <span className="text-[10px] mt-0.5">Doações</span>
          {donationCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-[#10B981] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
              {donationCount}
            </span>
          )}
        </button>

        {/* Main Post Action */}
        <button
          onClick={onOpenNewItemModal}
          className="flex flex-col items-center justify-center -mt-5"
        >
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#10B981] to-[#059669] text-white flex items-center justify-center shadow-lg border-2 border-[#473469] transform active:scale-95">
            <PlusCircle className="w-7 h-7" />
          </div>
          <span className="text-[10px] font-extrabold text-[#10B981] mt-0.5">Desapegar</span>
        </button>

        {/* Favorites */}
        <button
          onClick={() => setActiveTab('favorites')}
          className={`flex flex-col items-center justify-center p-1 rounded-xl relative transition ${
            activeTab === 'favorites' ? 'text-[#F79EB1] font-bold' : 'text-[#F2E7D2]/80 hover:text-white'
          }`}
        >
          <Heart className={`w-5 h-5 ${activeTab === 'favorites' ? 'fill-[#F79EB1]' : ''}`} />
          <span className="text-[10px] mt-0.5">Salvos</span>
          {favoritesCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-[#F79EB1] text-[#473469] text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
              {favoritesCount}
            </span>
          )}
        </button>

        {/* Palette Info */}
        <button
          onClick={onOpenPaletteModal}
          className="flex flex-col items-center justify-center p-1 text-[#AE8FBA] hover:text-white transition"
        >
          <Palette className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Design</span>
        </button>

      </div>
    </div>
  );
};