import { X, Palette, Gift, Heart } from 'lucide-react';

export const PaletteShowcaseModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const COLOR_PALETTE = [
    {
      hex: '#F2E7D2',
      name: 'Creme Suave',
      role: 'Superfícies, cards leves e fundos orgânicos',
      textDark: true,
      usage: 'Fundo do app e contrastes de leitura agradável'
    },
    {
      hex: '#F79EB1',
      name: 'Rosa Pastel',
      role: 'Destaques, botões de favorito e selos afetuosos',
      textDark: true,
      usage: 'Ícones de coração, badges especiais e hover accents'
    },
    {
      hex: '#AE8FBA',
      name: 'Lilás Elegante',
      role: 'Bordas finas, chips de categoria e divisores',
      textDark: false,
      usage: 'Estruturação de cartões e filtros horizontais'
    },
    {
      hex: '#4C5E91',
      name: 'Azul Pátina',
      role: 'Elementos interativos, botões secundários e links',
      textDark: false,
      usage: 'Botões de ver detalhes, estados de hover e focações'
    },
    {
      hex: '#473469',
      name: 'Índigo Profundo',
      role: 'Header principal, tipografia forte e identidade',
      textDark: false,
      usage: 'Barra superior fixa, títulos H1/H2 e foco primário'
    },
    {
      hex: '#10B981',
      name: 'Verde Esmeralda (Sugestão)',
      role: 'Selo de Doação Grátis, Status Ativo e WhatsApp',
      textDark: false,
      usage: 'Destaque instantâneo para doações do campus e contato direto'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div 
        className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#AE8FBA]/30 relative my-6 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-gray-100 hover:bg-gray-200 text-[#473469] p-2 rounded-full transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2.5 rounded-2xl bg-[#473469] text-[#F79EB1]">
            <Palette className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#473469]">Paleta de Cores & Design Specs</h2>
            <p className="text-xs text-[#AE8FBA]">Harmonização visual para a plataforma UniDesapego UNIFOR</p>
          </div>
        </div>

        <p className="text-xs text-gray-600 mb-5 leading-relaxed bg-[#F8F7FA] p-3.5 rounded-2xl border border-[#AE8FBA]/20">
          Baseado na imagem enviada, combinamos o <strong>Creme, Rosa, Lilás, Azul Pátina e Índigo Profundo</strong> com um toque de <strong>Verde Esmeralda (#10B981)</strong> para indicar instantaneamente itens de <strong>Doação Grátis</strong> e conexões diretas via WhatsApp!
        </p>

        {/* Color Palette List */}
        <div className="space-y-2.5 mb-6">
          {COLOR_PALETTE.map((color) => (
            <div 
              key={color.hex}
              className="flex items-center justify-between p-3 rounded-2xl border border-gray-100 hover:shadow-xs transition bg-white"
            >
              <div className="flex items-center space-x-3">
                <div 
                  className="w-12 h-12 rounded-xl shadow-inner border border-black/10 flex items-center justify-center font-mono text-[10px] font-bold"
                  style={{ backgroundColor: color.hex, color: color.textDark ? '#2D233F' : '#FFFFFF' }}
                >
                  {color.hex}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-sm text-[#473469]">{color.name}</span>
                    <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-mono">
                      {color.hex}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">{color.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Examples of usage in components */}
        <div className="bg-[#473469] p-4 rounded-2xl text-white">
          <p className="text-xs font-bold text-[#F79EB1] uppercase tracking-wider mb-2">
            Exemplo Prático na Interface
          </p>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="bg-[#10B981] text-white px-3 py-1 rounded-full font-extrabold flex items-center gap-1">
              <Gift className="w-3.5 h-3.5" /> Doação Grátis (#10B981)
            </span>
            <span className="bg-[#F79EB1] text-[#473469] px-3 py-1 rounded-full font-bold flex items-center gap-1">
              <Heart className="w-3.5 h-3.5 fill-[#473469]" /> Item Salvo (#F79EB1)
            </span>
            <span className="bg-[#4C5E91] text-white px-3 py-1 rounded-full font-semibold">
              Ver Detalhes (#4C5E91)
            </span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-5 w-full py-2.5 bg-[#473469] hover:bg-[#352552] text-[#F2E7D2] text-xs font-bold rounded-xl transition"
        >
          Entendi, voltar para os desapegos
        </button>

      </div>
    </div>
  );
};