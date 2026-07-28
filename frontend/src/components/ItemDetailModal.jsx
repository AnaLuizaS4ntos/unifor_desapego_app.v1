import { useState } from 'react';

import { 
  X, 
  MapPin, 
  Heart, 
  MessageCircle, 
  Gift, 
  Share2, 
  UserCheck, 
  Check, 
  ShieldCheck, 
  Building2 
} from 'lucide-react';

export const ItemDetailModal = ({
  item,
  onClose,
  isFavorite,
  onToggleFavorite,
  onContactWhatsApp
}) => {
  if (!item) return null;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#AE8FBA]/30 relative animate-scaleUp my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 bg-white/90 hover:bg-white text-[#473469] p-2 rounded-full shadow-md transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Main Image Banner */}
        <div className="relative aspect-[16/10] bg-[#473469] w-full overflow-hidden rounded-t-3xl">
          <img
            src={item.images[activeImageIndex] || item.images[0]}
            alt={item.title}
            className="w-full h-full object-cover"
          />

          {/* Badges on Image */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            {item.isDonation ? (
              <span className="bg-[#10B981] text-white text-xs font-black px-3 py-1 rounded-full shadow-md flex items-center space-x-1">
                <Gift className="w-4 h-4" />
                <span>DOAÇÃO GRÁTIS</span>
              </span>
            ) : (
              <span className="bg-[#473469] text-[#F2E7D2] text-sm font-black px-3.5 py-1 rounded-full shadow-md border border-[#AE8FBA]/40">
                R$ {item.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            )}

            <span className="bg-white/90 backdrop-blur-md text-[#473469] text-xs font-bold px-3 py-1 rounded-full">
              {item.condition}
            </span>
          </div>

          {/* Multiple Image Thumbnails */}
          {item.images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-2 bg-black/40 p-1.5 rounded-full backdrop-blur-md">
              {item.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-10 h-10 rounded-lg overflow-hidden border-2 transition ${
                    activeImageIndex === idx ? 'border-[#F79EB1] scale-105' : 'border-transparent opacity-70'
                  }`}
                >
                  <img src={img} alt="thumb" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="p-6">
          
          {/* Header & Title */}
          <div className="flex items-start justify-between gap-4 mb-3">
            <div>
              <div className="flex items-center space-x-2 text-xs font-semibold text-[#4C5E91] mb-1">
                <span className="bg-[#F2E7D2] text-[#473469] px-2.5 py-0.5 rounded-full">
                  {item.category}
                </span>
                <span>• {item.createdAt}</span>
                <span>• {item.views} visualizações</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#473469]">
                {item.title}
              </h2>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleShare}
                className="p-2.5 rounded-full bg-[#F8F7FA] hover:bg-[#F2E7D2] text-[#473469] border border-[#AE8FBA]/30 transition"
                title="Compartilhar"
              >
                {copiedLink ? <Check className="w-5 h-5 text-[#10B981]" /> : <Share2 className="w-5 h-5" />}
              </button>

              <button
                onClick={() => onToggleFavorite(item.id)}
                className={`p-2.5 rounded-full transition border ${
                  isFavorite
                    ? 'bg-[#F79EB1] text-[#473469] border-[#F79EB1]'
                    : 'bg-[#F8F7FA] text-[#473469] border-[#AE8FBA]/30 hover:bg-[#F79EB1]/20'
                }`}
                title="Salvar nos favoritos"
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-[#473469]' : ''}`} />
              </button>
            </div>
          </div>

          {/* Location Banner in UNIFOR */}
          <div className="bg-[#F8F7FA] border border-[#AE8FBA]/30 rounded-2xl p-3.5 mb-5 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-[#4C5E91]/15 text-[#473469] flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Local de Entrega Recomendado no Campus</p>
                <p className="text-sm font-bold text-[#473469] flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-[#F79EB1]" />
                  {item.location}
                </p>
              </div>
            </div>
            <span className="text-[11px] text-[#10B981] font-semibold bg-[#ECFDF5] px-2.5 py-1 rounded-full border border-[#10B981]/20 hidden sm:inline-block">
              Ponto Seguro UNIFOR
            </span>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-xs font-bold text-[#4C5E91] uppercase tracking-wider mb-2">
              Descrição do Item
            </h3>
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line bg-gray-50 p-4 rounded-2xl border border-gray-100">
              {item.description}
            </p>
          </div>

          {/* Tags */}
          {item.tags && item.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-6">
              {item.tags.map((tag, idx) => (
                <span key={idx} className="text-xs bg-[#F2E7D2]/80 text-[#473469] px-2.5 py-0.5 rounded-full font-medium">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Seller Card */}
          <div className="bg-[#473469] text-white p-4 rounded-2xl mb-6 shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img
                  src={item.seller.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${item.seller.name}`}
                  alt={item.seller.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-[#F79EB1]"
                />
                <div>
                  <div className="flex items-center space-x-1.5">
                    <p className="font-bold text-base text-[#F2E7D2]">{item.seller.name}</p>
                    {item.seller.verifiedStudent && (
                      <span className="bg-[#10B981] text-white text-[10px] font-extrabold px-2 py-0.2 rounded-full flex items-center gap-0.5">
                        <UserCheck className="w-3 h-3" /> UNIFOR
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#AE8FBA]">
                    {item.seller.course} • {item.seller.semester}
                  </p>
                </div>
              </div>

              <div className="text-right hidden sm:block">
                <span className="text-[11px] text-[#AE8FBA] flex items-center gap-1 justify-end">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" /> Negociação Direta
                </span>
                <span className="text-xs text-[#F2E7D2] font-medium">Sem intermediários</span>
              </div>
            </div>
          </div>

          {/* Action CTA Button */}
          <button
            onClick={() => onContactWhatsApp(item)}
            className="w-full flex items-center justify-center space-x-2 py-3.5 px-6 bg-[#10B981] hover:bg-[#059669] text-white font-extrabold text-base rounded-2xl shadow-lg transition transform active:scale-98"
          >
            <MessageCircle className="w-5 h-5 fill-white/20" />
            <span>Chamar no WhatsApp para Combinar Entrega</span>
          </button>
          
          <p className="text-[11px] text-center text-gray-500 mt-2">
            O botão abrirá o WhatsApp com uma mensagem personalizada sobre este item.
          </p>

        </div>
      </div>
    </div>
  );
};