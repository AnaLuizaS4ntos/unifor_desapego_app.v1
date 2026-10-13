import React from 'react';
import { Sparkles } from 'lucide-react';

export const Toast: React.FC<{ message: string | null }> = ({ message }) => {
  if (!message) return null;

  return (
    <div
      role="status"
      className="fixed top-20 right-4 z-50 bg-[#473469] text-[#F2E7D2] text-xs font-bold px-4 py-3 rounded-2xl shadow-xl border border-[#F79EB1] animate-bounce flex items-center space-x-2"
    >
      <Sparkles className="w-4 h-4 text-[#F79EB1]" />
      <span>{message}</span>
    </div>
  );
};

