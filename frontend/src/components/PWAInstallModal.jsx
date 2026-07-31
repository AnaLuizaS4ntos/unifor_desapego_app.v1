import { useState, useEffect } from 'react';
import { Share, PlusSquare, X } from 'lucide-react';

export const PWAInstallModal = () => {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // 1. Detecta se é um iPhone, iPad ou iPod
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(userAgent);
    
    
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;

   
    const hasDismissed = localStorage.getItem('pwa-dismissed');

    // Se for iOS, não estiver instalado e não tiver sido fechado antes, mostra o pop-up
    if (isIOS && !isStandalone && !hasDismissed) {
      // Pequeno delay para não aparecer no exato milissegundo que a página abre
      setTimeout(() => setShowModal(true), 1500);
    }
  }, []);

  const handleClose = () => {
    setShowModal(false);
    // Salva no navegador que o usuário fechou, para não mostrar nas próximas visitas
    localStorage.setItem('pwa-dismissed', 'true');
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl relative animate-slideUp">
        
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-[#473469] bg-gray-100 p-1.5 rounded-full transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center">
          {/* Logo simulada */}
          <div className="w-16 h-16 bg-[#473469] rounded-2xl flex items-center justify-center mb-4 shadow-lg text-white font-black text-3xl">
            U
          </div>

          <h3 className="text-lg font-extrabold text-[#473469] mb-2">
            Adicione o UniDesapego à tela inicial
          </h3>
          
          <p className="text-sm text-gray-600 mb-6 font-medium">
            Instale o nosso app na sua tela inicial para acessar os anúncios da UNIFOR mais rápido!
          </p>

          <div className="bg-[#F8F7FA] border border-[#AE8FBA]/30 rounded-2xl p-4 w-full text-left space-y-4">
            <div className="flex items-center gap-3">
              <span className="bg-white p-2 rounded-xl shadow-sm text-[#007AFF]">
                <Share className="w-5 h-5" />
              </span>
              <p className="text-xs text-gray-700 font-semibold">
                1. Toque no botão de <strong className="text-[#473469]">Compartilhar</strong> na barra do Safari.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="bg-white p-2 rounded-xl shadow-sm text-gray-700">
                <PlusSquare className="w-5 h-5" />
              </span>
              <p className="text-xs text-gray-700 font-semibold">
                2. Role para baixo e escolha <strong className="text-[#473469]">Adicionar à Tela de Início</strong>.
              </p>
            </div>
          </div>

          <button 
            onClick={handleClose}
            className="mt-6 w-full py-3 bg-[#F2E7D2] hover:bg-[#F79EB1] text-[#473469] font-bold text-sm rounded-2xl transition shadow-sm"
          >
            Entendi, fechar
          </button>
        </div>
      </div>
    </div>
  );
};