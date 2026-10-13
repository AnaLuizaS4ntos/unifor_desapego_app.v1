import { useState } from 'react';
import { X, Gift, Check } from 'lucide-react';


const PRESET_SAMPLE_PHOTOS = [
  { label: 'Arduino / Kit', url: 'https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&w=800&q=80' },
  { label: 'Livro / Stewart', url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80' },
  { label: 'Jaleco / Saúde', url: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80' },
  { label: 'Monitor / Tech', url: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80' },
  { label: 'Cadeira / Móvel', url: 'https://images.unsplash.com/photo-1580481072645-022f9a6d1270?auto=format&fit=crop&w=800&q=80' },
];

export const NewItemModal = ({
  isOpen,
  onClose,
  onAddItem
}) => {
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [isDonation, setIsDonation] = useState(false);
  const [category, setCategory] = useState('Eletrônicos & Hardware');
  const [condition, setCondition] = useState('Seminovo');
  const [location, setLocation] = useState('Bloco N (CCT)');
  const [imageUrl, setImageUrl] = useState('');
  const [sellerName, setSellerName] = useState('Estudante UNIFOR');
  const [sellerCourse, setSellerCourse] = useState('Ciência da Computação');
  const [sellerWhatsapp, setSellerWhatsapp] = useState('5585999887766');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const finalPrice = isDonation ? 0 : parseFloat(price) || 0;
    const finalImage = imageUrl.trim() || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80';

    const newItem = {
      id: `unifor-item-${Date.now()}`,
      title,
      description,
      price: finalPrice,
      isDonation: isDonation || finalPrice === 0,
      category: isDonation ? 'Doação' : category,
      condition: isDonation ? 'Doação' : condition,
      location,
      images: [finalImage],
      seller: {
        name: sellerName,
        course: sellerCourse,
        semester: 'Ativo',
        whatsapp: sellerWhatsapp.replace(/\D/g, '') || '5585999887766',
        verifiedStudent: true
      },
      createdAt: 'Agora mesmo',
      views: 1,
      favoritesCount: 0,
      tags: [category.toLowerCase(), location.toLowerCase()]
    };

    onAddItem(newItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div 
        className="bg-white rounded-3xl max-w-xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-[#AE8FBA]/30 relative my-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#473469] text-white p-5 rounded-t-3xl flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-[#F79EB1] text-[#473469] flex items-center justify-center font-black text-lg">
              +
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#F2E7D2]">Desapegar de um Item</h2>
              <p className="text-xs text-[#AE8FBA]">Anuncie para milhares de alunos da UNIFOR</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">

          {/* Donation toggle banner */}
          <div 
            onClick={() => {
              setIsDonation(!isDonation);
              if (!isDonation) setCategory('Doação');
            }}
            className={`cursor-pointer p-3.5 rounded-2xl border transition flex items-center justify-between ${
              isDonation
                ? 'bg-[#ECFDF5] border-[#10B981] text-[#047857]'
                : 'bg-[#F8F7FA] border-[#AE8FBA]/30 text-[#473469] hover:bg-[#F2E7D2]/50'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-xl ${isDonation ? 'bg-[#10B981] text-white' : 'bg-[#AE8FBA]/20 text-[#473469]'}`}>
                <Gift className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold">Marcar como Doação Grátis 🎁</p>
                <p className="text-xs opacity-80">Ganha destaque com selo verde e engajamento rápido</p>
              </div>
            </div>
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${isDonation ? 'border-[#10B981] bg-[#10B981]' : 'border-gray-300'}`}>
              {isDonation && <Check className="w-4 h-4 text-white" />}
            </div>
          </div>

          {/* Item title */}
          <div>
            <label className="block text-xs font-bold text-[#473469] uppercase mb-1">
              Título do Anúncio *
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Kit Arduino Uno + Sensores ou Livro Cálculo Stewart"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#473469]"
            />
          </div>

          {/* Category and condition */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#473469] uppercase mb-1">
                Categoria
              </label>
              <select
                value={category}
                disabled={isDonation}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#473469] disabled:opacity-60"
              >
                <option value="Eletrônicos & Hardware">Eletrônicos & Hardware</option>
                <option value="Livros & Apostilas">Livros & Apostilas</option>
                <option value="Saúde & Jalecos">Saúde & Jalecos</option>
                <option value="Móveis">Móveis</option>
                <option value="Jogos & Lazer">Jogos & Lazer</option>
                <option value="Outros">Outros</option>
                <option value="Doação">Doação</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#473469] uppercase mb-1">
                Estado de Conservação
              </label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#473469]"
              >
                <option value="Novo">Novo</option>
                <option value="Seminovo">Seminovo</option>
                <option value="Usado - Bom Estado">Usado - Bom Estado</option>
                <option value="Doação">Doação</option>
              </select>
            </div>
          </div>

          {/* Price and bloco UNIFOR */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#473469] uppercase mb-1">
                Preço (R$)
              </label>
              <input
                type="number"
                disabled={isDonation}
                placeholder={isDonation ? 'R$ 0,00 (Doação)' : 'Ex: 45'}
                value={isDonation ? '0' : price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#473469] disabled:opacity-60 font-semibold text-[#10B981]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#473469] uppercase mb-1">
                Bloco de Entrega UNIFOR
              </label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#473469]"
              >
                <option value="Bloco N (CCT)">Bloco N (CCT)</option>
                <option value="Bloco M (CCT)">Bloco M (CCT)</option>
                <option value="Bloco D (CCG)">Bloco D (CCG)</option>
                <option value="Bloco T (CCS)">Bloco T (CCS)</option>
                <option value="Bloco Z (CCJ)">Bloco Z (CCJ)</option>
                <option value="Biblioteca Central">Biblioteca Central</option>
                <option value="Praça de Convivência">Praça de Convivência</option>
                <option value="Centro de Convivência">Centro de Convivência</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-[#473469] uppercase mb-1">
              Descrição do Item
            </label>
            <textarea
              rows={3}
              placeholder="Descreva detalhes como estado, o que acompanha, ano do livro, motivo da venda..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#473469]"
            />
          </div>

          {/* Image URL, presets and upload */}
          <div>
            <label className="block text-xs font-bold text-[#473469] uppercase mb-1">
              URL da Imagem ou Escolha um Exemplo
            </label>
            <input
              type="text"
              placeholder="Cole o link da foto (https://...)"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#473469] mb-2"
            />
            <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-1 mb-2">
              <span className="text-[10px] text-gray-500 font-semibold whitespace-nowrap">Modelos rápidos:</span>
              {PRESET_SAMPLE_PHOTOS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setImageUrl(preset.url)}
                  className="text-[10px] bg-[#F2E7D2] hover:bg-[#AE8FBA] hover:text-white text-[#473469] px-2 py-0.5 rounded-md font-medium whitespace-nowrap transition"
                >
                  {preset.label}
                </button>
              ))}
            </div>  
          </div>

          {/* Seller details */}
          <div className="pt-2 border-t border-gray-100">
            <p className="text-xs font-bold text-[#4C5E91] uppercase mb-2">Dados do Vendedor (Sua Identidade)</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input
                type="text"
                placeholder="Seu Nome"
                value={sellerName}
                onChange={(e) => setSellerName(e.target.value)}
                className="px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs"
              />
              <input
                type="text"
                placeholder="Seu Curso (ex: Ciência da Computação)"
                value={sellerCourse}
                onChange={(e) => setSellerCourse(e.target.value)}
                className="px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs"
              />
              <input
                type="text"
                placeholder="WhatsApp (ex: 85999887766)"
                value={sellerWhatsapp}
                onChange={(e) => setSellerWhatsapp(e.target.value)}
                className="px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs font-semibold text-[#10B981]"
              />
            </div>
          </div>

          {/* Submit button */}
          <div className="pt-3">
            <button
              type="submit"
              className="w-full py-3 px-4 bg-[#473469] hover:bg-[#352552] text-[#F2E7D2] font-extrabold text-sm rounded-2xl shadow-md transition transform active:scale-98"
            >
              Publicar no UniDesapego
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};