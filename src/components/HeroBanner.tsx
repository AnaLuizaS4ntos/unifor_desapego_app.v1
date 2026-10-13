import React from 'react';
import { Gift, PlusCircle } from 'lucide-react';

interface HeroBannerProps {
  donationCount: number;
  onShowDonations: () => void;
  onOpenNewItemModal: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  donationCount,
  onShowDonations,
  onOpenNewItemModal,
}) => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-5">
    <div className="bg-gradient-to-r from-[#473469] via-[#3E2D5E] to-[#4C5E91] text-white p-5 sm:p-7 rounded-3xl shadow-xl border border-[#AE8FBA]/30 relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute -right-10 -bottom-10 w-60 h-60 rounded-full bg-[#AE8FBA]/10 blur-2xl pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-32 h-32 rounded-full bg-[#F79EB1]/10 blur-xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <span className="bg-[#10B981] text-white text-[11px] font-black px-3 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
              <Gift className="w-3.5 h-3.5" /> Doação &amp; Marketplace
            </span>
            <span className="bg-[#AE8FBA]/30 text-[#F2E7D2] text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
              UNIFOR Campus
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#F2E7D2] tracking-tight leading-tight">
            Desapegue do que não usa mais no campus 🎓
          </h2>
          <p className="text-xs sm:text-sm text-[#AE8FBA] mt-1.5 max-w-2xl leading-relaxed">
            De Arduinos de computação e jalecos de medicina a livros de cálculo e monitores para kitnet. Passe adiante ou encontre o que precisa com entrega rápida nos blocos da UNIFOR.
          </p>
        </div>

        {/* Quick CTA inside Banner */}
        <div className="flex items-center space-x-2.5 w-full md:w-auto">
          <button
            onClick={onShowDonations}
            className="flex-1 md:flex-initial bg-[#10B981] hover:bg-[#059669] text-white text-xs sm:text-sm font-extrabold px-4 py-2.5 rounded-2xl shadow-md transition flex items-center justify-center space-x-1.5"
          >
            <Gift className="w-4 h-4" />
            <span>Ver Doações ({donationCount})</span>
          </button>

          <button
            onClick={onOpenNewItemModal}
            className="flex-1 md:flex-initial bg-[#F2E7D2] hover:bg-white text-[#473469] text-xs sm:text-sm font-extrabold px-4 py-2.5 rounded-2xl shadow-md transition flex items-center justify-center space-x-1.5"
          >
            <PlusCircle className="w-4 h-4 text-[#473469]" />
            <span>Desapegar +</span>
          </button>
        </div>
      </div>
    </div>
  </div>
);

