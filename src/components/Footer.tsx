import React from 'react';

interface FooterProps {
  onOpenPaletteModal: () => void;
  onResetFilters: () => void;
  onOpenNewItemModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenPaletteModal,
  onResetFilters,
  onOpenNewItemModal,
}) => (
  <footer className="mt-16 border-t border-[#AE8FBA]/20 py-8 bg-white text-center text-xs text-[#AE8FBA]">
    <div className="max-w-7xl mx-auto px-4">
      <p className="font-bold text-[#473469] mb-1">
        UniDesapego UNIFOR — Plataforma de Economia Circular do Campus
      </p>
      <p className="text-[11px] text-gray-500 mb-3">
        Desenvolvido para alunos de Ciência da Computação, Engenharia, Medicina, Direito, Administração e todos os blocos.
      </p>
      <div className="flex items-center justify-center space-x-4 text-[11px] text-[#4C5E91] font-semibold">
        <button onClick={onOpenPaletteModal} className="hover:underline">Paleta de Cores Hex</button>
        <span>•</span>
        <button onClick={onResetFilters} className="hover:underline">Ver Todos os Itens</button>
        <span>•</span>
        <button onClick={onOpenNewItemModal} className="hover:underline">Desapegar de um Item</button>
      </div>
    </div>
  </footer>
);

