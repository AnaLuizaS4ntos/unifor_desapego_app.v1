import { Heart, MapPin, Eye, MessageCircle, Gift, UserCheck } from 'lucide-react';

export const ItemCard = ({
  item,
  isFavorite,
  onToggleFavorite,
  onQuickView,
  onContactWhatsApp
}) => {
  return (
    <div className="bg-white rounded-2xl border border-[#AE8FBA]/25 overflow-hidden card-hover-effect flex flex-col justify-between group relative">
      
      {/* Image container with badges */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#F2E7D2]/30 cursor-pointer" onClick={() => onQuickView(item)}>
        <img
          src={item.images[0] || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80'}
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Gradient overlay for top badges readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 opacity-80 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-10 pointer-events-none">
          {/* Price or donation badge */}
          {item.isDonation ? (
            <span className="bg-[#10B981] text-white text-xs font-black px-2.5 py-1 rounded-full shadow-md flex items-center space-x-1 uppercase tracking-wider animate-pulse">
              <Gift className="w-3.5 h-3.5" />
              <span>Doação Grátis</span>
            </span>
          ) : (
            <span className="bg-[#473469] text-[#F2E7D2] text-xs font-black px-3 py-1 rounded-full shadow-md border border-[#AE8FBA]/30">
              R$ {item.price.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
            </span>
          )}

          {/* Condition badge */}
          <span className="bg-white/90 backdrop-blur-md text-[#473469] text-[11px] font-semibold px-2.5 py-0.5 rounded-full shadow-xs">
            {item.condition}
          </span>
        </div>

        {/* Favorite heart button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(item.id);
          }}
          className={`absolute bottom-2.5 right-2.5 z-10 p-2 rounded-full transition-all shadow-md transform active:scale-90 ${
            isFavorite
              ? 'bg-[#F79EB1] text-[#473469]'
              : 'bg-white/80 hover:bg-white text-[#473469] hover:text-[#E25B78]'
          }`}
          title={isFavorite ? 'Remover dos salvos' : 'Salvar item'}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-[#473469]' : ''}`} />
        </button>

        {/* Campus location tag */}
        <div className="absolute bottom-2.5 left-2.5 z-10 flex items-center space-x-1 text-[11px] font-medium bg-[#473469]/80 backdrop-blur-sm text-white px-2.5 py-0.5 rounded-full">
          <MapPin className="w-3 h-3 text-[#F79EB1]" />
          <span className="truncate max-w-[140px]">{item.location}</span>
        </div>
      </div>

      {/* Card content body */}
      <div className="p-3.5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category and date */}
          <div className="flex items-center justify-between text-[11px] text-[#AE8FBA] font-medium mb-1">
            <span className="text-[#4C5E91] font-semibold">{item.category}</span>
            <span>{item.createdAt}</span>
          </div>

          {/* Item title */}
          <h3 
            onClick={() => onQuickView(item)}
            className="font-bold text-[#473469] text-sm sm:text-base line-clamp-2 hover:text-[#4C5E91] cursor-pointer transition mb-1.5 leading-snug"
          >
            {item.title}
          </h3>

          {/* Short description */}
          <p className="text-xs text-gray-600 line-clamp-2 mb-3 leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Seller info and action footer */}
        <div className="pt-2.5 border-t border-gray-100 mt-auto">
          <div className="flex items-center justify-between gap-2 mb-2.5">
            <div className="flex items-center space-x-2 min-w-0">
              <img
                src={item.seller.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${item.seller.name}`}
                alt={item.seller.name}
                className="w-6 h-6 rounded-full object-cover border border-[#AE8FBA]/40"
              />
              <div className="min-w-0">
                <p className="text-xs font-semibold text-[#473469] truncate flex items-center gap-1">
                  {item.seller.name}
                  {item.seller.verifiedStudent && (
                    <UserCheck className="w-3 h-3 text-[#10B981] inline-block" title="Aluno UNIFOR verificado" />
                  )}
                </p>
                <p className="text-[10px] text-gray-500 truncate">{item.seller.course}</p>
              </div>
            </div>
          </div>

          {/* Quick action buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onQuickView(item)}
              className="w-full flex items-center justify-center space-x-1 py-1.5 px-2 bg-[#F8F7FA] hover:bg-[#F2E7D2] text-[#473469] text-xs font-semibold rounded-xl transition border border-[#AE8FBA]/30"
            >
              <Eye className="w-3.5 h-3.5 text-[#4C5E91]" />
              <span>Ver Detalhes</span>
            </button>

            <button
              onClick={() => onContactWhatsApp(item)}
              className="w-full flex items-center justify-center space-x-1 py-1.5 px-2 bg-[#10B981] hover:bg-[#059669] text-white text-xs font-bold rounded-xl shadow-xs transition transform active:scale-95"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};