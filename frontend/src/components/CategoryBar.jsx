import { 
  Sparkles, 
  Gift, 
  Cpu, 
  BookOpen, 
  Stethoscope, 
  Armchair, 
  Gamepad2, 
  Package 
} from 'lucide-react';

const CATEGORIES = [
  { name: 'Todos', label: 'Todos os Itens', icon: Sparkles },
  { name: 'Doação', label: 'Doações Grátis', icon: Gift },
  { name: 'Eletrônicos & Hardware', label: 'Eletrônicos & Hardware', icon: Cpu },
  { name: 'Livros & Apostilas', label: 'Livros & Apostilas', icon: BookOpen },
  { name: 'Saúde & Jalecos', label: 'Saúde & Jalecos', icon: Stethoscope },
  { name: 'Móveis & Kitnet', label: 'Móveis & Kitnet', icon: Armchair },
  { name: 'Jogos & Lazer', label: 'Jogos & Lazer', icon: Gamepad2 },
  { name: 'Outros', label: 'Outros Desapegos', icon: Package },
];

export const CategoryBar = ({
  selectedCategory,
  onSelectCategory,
  categoryCounts
}) => {
  return (
    <div className="bg-white border-b border-[#AE8FBA]/20 py-3 px-4 shadow-xs sticky top-[100px] sm:top-[75px] z-30">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-1">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.name;
            const count = categoryCounts[cat.name] || 0;
            const isDonationCat = cat.name === 'Doação';

            return (
              <button
                key={cat.name}
                onClick={() => onSelectCategory(cat.name)}
                className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 border flex-shrink-0 ${
                  isSelected
                    ? isDonationCat
                      ? 'bg-[#10B981] text-white border-[#10B981] shadow-sm font-semibold'
                      : 'bg-[#473469] text-white border-[#473469] shadow-sm font-semibold'
                    : isDonationCat
                    ? 'bg-[#ECFDF5] text-[#047857] border-[#10B981]/30 hover:bg-[#D1FAE5]'
                    : 'bg-[#F8F7FA] text-[#473469] border-[#AE8FBA]/30 hover:bg-[#F2E7D2]/60 hover:border-[#4C5E91]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : isDonationCat ? 'text-[#10B981]' : 'text-[#4C5E91]'}`} />
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isSelected
                      ? 'bg-white/20 text-white'
                      : isDonationCat
                      ? 'bg-[#10B981]/20 text-[#047857]'
                      : 'bg-[#AE8FBA]/20 text-[#473469]'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};