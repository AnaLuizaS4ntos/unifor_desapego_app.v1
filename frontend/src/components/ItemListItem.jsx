import { Heart, MapPin, MessageCircle, Gift } from 'lucide-react';

export const ItemListItem = ({
  item,
  isFavorite,
  onToggleFavorite,
  onQuickView,
  onContactWhatsApp
}) => {
  return (
    <div className="bg-white rounded-2xl border border-[#AE8FBA]/25 p-3 flex flex-col sm:flex-row items-center justify-between gap-4 card-hover-effect">
      
      <div className="flex items-center space-x-3.5 w-full sm:w-auto">
        {/* Thumbnail */}
        <div 
          onClick={() => onQuickView(item)}
          className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-[#F2E7D2]/40 flex-shrink-0 cursor-pointer"
        >
          <img
            src={item.images[0]}
            alt={item.title}
            className="w-full h-full object-cover"
          />
          {item.isDonation && (
            <span className="absolute bottom-1 left-1 bg-[#10B981] text-white text-[9px] font-black px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
              <Gift className="w-2.5 h-2.5" /> Grátis
            </span>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 text-[11px] text-[#AE8FBA] font-medium mb-0.5">
            <span className="text-[#4C5E91] font-semibold">{item.category}</span>
            <span>•</span>
            <span className="text-gray-500 font-normal">{item.createdAt}</span>
          </div>

          <h3 
            onClick={() => onQuickView(item)}
            className="font-bold text-[#473469] text-sm sm:text-base truncate hover:text-[#4C5E91] cursor-pointer"
          >
            {item.title}
          </h3>

          <div className="flex items-center space-x-2 text-xs my-1">
            <span className="flex items-center gap-1 text-gray-500 text-[11px]">
              <MapPin className="w-3 h-3 text-[#F79EB1]" /> {item.location}
            </span>
            <span className="text-gray-300">•</span>
            <span className="text-[11px] font-medium text-[#473469] bg-gray-100 px-2 py-0.2 rounded-full">
              {item.condition}
            </span>
          </div>

          <p className="text-[11px] text-gray-500 truncate max-w-md">
            Vendido por <strong className="text-[#473469]">{item.seller.name}</strong> ({item.seller.course})
          </p>
        </div>
      </div>

      {/* Right price and actions */}
      <div className="flex items-center justify-between sm:justify-end space-x-3 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
        
        {/* Price tag */}
        <div className="text-left sm:text-right">
          {item.isDonation ? (
            <span className="text-sm font-black text-[#10B981] bg-[#ECFDF5] px-3 py-1 rounded-full border border-[#10B981]/30 inline-block">
              DOAÇÃO
            </span>
          ) : (
            <span className="text-base font-black text-[#473469]">
              R$ {item.price.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
            </span>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center space-x-1.5">
          <button
            onClick={() => onToggleFavorite(item.id)}
            className={`p-2 rounded-xl transition ${
              isFavorite ? 'bg-[#F79EB1] text-[#473469]' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-[#473469]' : ''}`} />
          </button>

          <button
            onClick={() => onQuickView(item)}
            className="px-3 py-1.5 bg-[#F8F7FA] hover:bg-[#F2E7D2] text-[#473469] text-xs font-semibold rounded-xl border border-[#AE8FBA]/30 transition"
          >
            Detalhes
          </button>

          <button
            onClick={() => onContactWhatsApp(item)}
            className="flex items-center space-x-1 px-3 py-1.5 bg-[#10B981] hover:bg-[#059669] text-white text-xs font-bold rounded-xl transition"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">WhatsApp</span>
          </button>
        </div>

      </div>

    </div>
  );
};